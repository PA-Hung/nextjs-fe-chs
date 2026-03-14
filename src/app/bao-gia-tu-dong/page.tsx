"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Users, MapPin, ImageIcon, MessageCircle } from "lucide-react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Google Sheets published CSV URLs
const SHEET_NORMAL_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVdvJcxlXLLZbgoCjnZbsPq7lKrW9OEKeeK86y9nWWM5HfHtVYXK6aUusOd12ZRb4IEJl8AsaPPEp1/pub?gid=2908382&single=true&output=csv";
const SHEET_HOLIDAY_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVdvJcxlXLLZbgoCjnZbsPq7lKrW9OEKeeK86y9nWWM5HfHtVYXK6aUusOd12ZRb4IEJl8AsaPPEp1/pub?gid=1155120395&single=true&output=csv";

interface RoomData {
    id: number;
    name: string;
    maxGuests: string;
    area: string;
    link: string;
    prices: {
        saturday: { normal: number; prepaid: number };    // Đêm thứ 7
        weekend: { normal: number; prepaid: number };     // Đêm thứ 6 và CN
        weekday: { normal: number; prepaid: number };     // Đêm trong tuần
    };
}

interface PriceBreakdownItem {
    key: number;
    date: string;
    dayName: string;
    type: string;
    price: number;
    isHoliday: boolean;
}

interface PriceBreakdown {
    room: RoomData;
    checkIn: string;
    checkOut: string;
    nights: number;
    breakdown: PriceBreakdownItem[];
    total: number;
    hasHoliday: boolean;
}

// Helper: Parse price from string "1.190.000" to number
const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    return parseInt(priceStr.replace(/\./g, "").replace(/,/g, ""), 10) || 0;
};

// Helper: Parse guest count from string "2 khách" to number 2
const parseGuestCount = (guestStr: string): number => {
    const match = guestStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
};

// Helper: Parse date from format "17/02" to "2025-02-17"
const parseHolidayDate = (dateStr: string, referenceYear?: number): string | null => {
    if (!dateStr) return null;
    const match = dateStr.match(/(\d{1,2})\/(\d{1,2})/);
    if (!match) return null;
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = referenceYear || new Date().getFullYear();
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
};

// Helper: Parse CSV correctly with multiline quotes
const parseCSVLines = (csvText: string): string[] => {
    const rawLines = csvText.split('\n');
    const lines: string[] = [];
    let currentLine = '';
    let insideQuotes = false;

    for (let i = 0; i < rawLines.length; i++) {
        const line = rawLines[i].replace(/\r$/, '');
        const quoteCount = (line.match(/"/g) || []).length;
        
        if (currentLine === '') {
            currentLine = line;
        } else {
            currentLine += '\n' + line;
        }

        if (quoteCount % 2 !== 0) {
            insideQuotes = !insideQuotes;
        }

        if (!insideQuotes) {
            if (currentLine.trim()) {
                lines.push(currentLine.trim());
            }
            currentLine = '';
        }
    }
    if (currentLine.trim()) {
        lines.push(currentLine.trim());
    }
    return lines;
};

// Helper: Parse Normal CSV
const parseNormalCSV = (csvText: string): RoomData[] => {
    const lines = parseCSVLines(csvText);
    const rooms: RoomData[] = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const matches = line.match(/(\"([^\"]|\"\")*\"|[^,]*)(,|$)/g);
        if (!matches) continue;

        const cols = matches.map((m) =>
            m.replace(/,$/g, "").replace(/^\"|\"$/g, "").replace(/\"\"/g, '"').trim()
        );

        const stt = parseInt(cols[0], 10);
        if (isNaN(stt) || stt <= 0 || stt > 20) continue;
        if (cols[1] && cols[1].toLowerCase().includes("xe máy")) continue;

        const room: RoomData = {
            id: stt,
            name: cols[1] || "",
            maxGuests: cols[2] || "",
            area: cols[3] || "",
            link: cols[4] || "",
            prices: {
                // Cột 5-6: Đêm thứ 7 (Saturday night)
                saturday: {
                    normal: parsePrice(cols[5]),
                    prepaid: parsePrice(cols[6]),
                },
                // Cột 7-8: Đêm thứ 6 và CN (Friday + Sunday nights)
                weekend: {
                    normal: parsePrice(cols[7]),
                    prepaid: parsePrice(cols[8]),
                },
                // Cột 9-10: Đêm trong tuần (Mon-Thu nights)
                weekday: {
                    normal: parsePrice(cols[9]),
                    prepaid: parsePrice(cols[10]),
                },
            },
        };

        if (room.name && room.prices.weekend.normal > 0) {
            rooms.push(room);
        }
    }

    return rooms;
};

// Helper: Parse Holiday CSV
const parseHolidayCSV = (csvText: string): { holidayPrices: Record<string, Record<number, number>>; holidayDates: string[] } => {
    const lines = parseCSVLines(csvText);
    const holidayPrices: Record<string, Record<number, number>> = {};
    const holidayDates: string[] = [];

    let dateHeaderRow = -1;
    const dateColumns: { index: number; dateKey: string }[] = [];

    for (let i = 0; i < Math.min(10, lines.length); i++) {
        const line = lines[i];
        const dateMatches = line.match(/\d{1,2}\/\d{1,2}/g);
        if (line.includes("M1") || (dateMatches && dateMatches.length >= 2)) {
            dateHeaderRow = i;
            break;
        }
    }

    if (dateHeaderRow === -1) return { holidayPrices, holidayDates };

    for (let i = dateHeaderRow; i <= dateHeaderRow + 1 && i < lines.length; i++) {
        const line = lines[i];
        const matches = line.match(/(\"([^\"]|\"\")*\"|[^,]*)(,|$)/g);
        if (!matches) continue;

        const cols = matches.map((m) =>
            m.replace(/,$/g, "").replace(/^\"|\"$/g, "").replace(/\"\"/g, '"').trim()
        );

        for (let j = 5; j < cols.length; j++) {
            const dateMatch = cols[j].match(/(\d{1,2})\/(\d{1,2})/);
            if (dateMatch) {
                const month = parseInt(dateMatch[2], 10);
                const currentMonth = new Date().getMonth() + 1;
                const year = month < currentMonth ? new Date().getFullYear() + 1 : new Date().getFullYear();
                const dateKey = parseHolidayDate(cols[j], year);
                if (dateKey && !dateColumns.find((d) => d.dateKey === dateKey)) {
                    dateColumns.push({ index: j, dateKey });
                    holidayDates.push(dateKey);
                    holidayPrices[dateKey] = {};
                }
            }
        }

        if (dateColumns.length > 0) break;
    }

    for (let i = dateHeaderRow + 1; i < lines.length; i++) {
        const line = lines[i];
        const matches = line.match(/(\"([^\"]|\"\")*\"|[^,]*)(,|$)/g);
        if (!matches) continue;

        const cols = matches.map((m) =>
            m.replace(/,$/g, "").replace(/^\"|\"$/g, "").replace(/\"\"/g, '"').trim()
        );

        const stt = parseInt(cols[0], 10);
        if (isNaN(stt) || stt <= 0 || stt > 20) continue;
        if (cols[1] && cols[1].toLowerCase().includes("xe máy")) continue;

        for (const { index, dateKey } of dateColumns) {
            const price = parsePrice(cols[index]);
            if (price > 0) {
                holidayPrices[dateKey][stt] = price;
            }
        }
    }

    return { holidayPrices, holidayDates };
};

// Helper: Check if date is weekend night (Friday or Sunday)
// Đêm thứ 6 = check-in thứ 6 (day 5)
// Đêm Chủ nhật = check-in Chủ nhật (day 0)
const isWeekendNight = (date: Date): boolean => {
    const day = date.getDay();
    return day === 5 || day === 0; // Friday or Sunday
};

// Helper: Format VND currency
const formatVND = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
};

// Helper: Format date to DD/MM/YYYY
const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Helper: Format date to YYYY-MM-DD
const formatDateKey = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

// Helper: Get day name in Vietnamese
const getDayName = (date: Date): string => {
    const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    return days[date.getDay()];
};

// Background style matching home page
const beachBackgroundStyle = {
    backgroundImage:
        "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.6), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.35), transparent 40%), linear-gradient(180deg, #CCE9FF 0%, #E1F2FF 45%, #FFF7EA 100%)",
};

export default function BaoGiaTuDongPage() {
    const [roomData, setRoomData] = useState<RoomData[]>([]);
    const [holidayPrices, setHolidayPrices] = useState<Record<string, Record<number, number>>>({});
    const [holidayDates, setHolidayDates] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [guestCount, setGuestCount] = useState<number | null>(null);
    const [selectedMaxGuests, setSelectedMaxGuests] = useState<string | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
    const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
    const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
    const [calculating, setCalculating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [checkInOpen, setCheckInOpen] = useState(false);
    const [checkOutOpen, setCheckOutOpen] = useState(false);

    // Fetch room data
    const fetchRoomData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [normalRes, holidayRes] = await Promise.all([
                fetch(SHEET_NORMAL_URL),
                fetch(SHEET_HOLIDAY_URL),
            ]);

            if (!normalRes.ok) throw new Error("Không thể tải bảng giá phòng");

            const normalText = await normalRes.text();
            const rooms = parseNormalCSV(normalText);

            if (rooms.length === 0) {
                throw new Error("Không tìm thấy dữ liệu phòng");
            }

            setRoomData(rooms);

            if (holidayRes.ok) {
                const holidayText = await holidayRes.text();
                const { holidayPrices: hPrices, holidayDates: hDates } = parseHolidayCSV(holidayText);
                setHolidayPrices(hPrices);
                setHolidayDates(hDates);
            }
        } catch (err) {
            console.error("Error fetching room data:", err);
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoomData();
    }, []);

    // Get unique maxGuests options from room data, sorted by parsed number
    const availableGuestOptions = [...new Set(roomData.map(room => room.maxGuests))]
        .filter(g => g.trim() !== "")
        .sort((a, b) => parseGuestCount(a) - parseGuestCount(b));

    // Filter rooms by selected maxGuests label
    const filteredRooms = selectedMaxGuests
        ? roomData.filter(room => room.maxGuests === selectedMaxGuests)
        : (guestCount
            ? roomData.filter(room => parseGuestCount(room.maxGuests) >= guestCount)
            : []);

    // Calculate price
    const calculatePrice = () => {
        if (!selectedRoom || !checkInDate || !checkOutDate) {
            alert("Vui lòng chọn loại căn hộ và ngày check-in/check-out");
            return;
        }

        const room = roomData.find((r) => r.id === selectedRoom);
        if (!room) return;

        setCalculating(true);

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

        if (nights <= 0) {
            alert("Ngày check-out phải sau ngày check-in");
            setCalculating(false);
            return;
        }

        const breakdown: PriceBreakdownItem[] = [];
        let total = 0;
        let hasHoliday = false;

        for (let i = 0; i < nights; i++) {
            const currentDate = new Date(checkIn);
            currentDate.setDate(currentDate.getDate() + i);
            const dateKey = formatDateKey(currentDate);

            const holidayPrice = holidayPrices[dateKey]?.[room.id];

            let price: number;
            let priceType: string;
            let isHoliday = false;

            if (holidayPrice && holidayPrice > 0) {
                price = holidayPrice;
                priceType = "Lễ tết";
                isHoliday = true;
                hasHoliday = true;
            } else {
                const day = currentDate.getDay();
                const priceKey = "normal";

                // Xác định loại đêm
                if (day === 6) {
                    // Đêm thứ 7 (Saturday)
                    price = room.prices.saturday[priceKey];
                    priceType = "Cuối tuần";
                } else if (day === 5 || day === 0) {
                    // Đêm thứ 6 hoặc CN (Friday or Sunday)
                    price = room.prices.weekend[priceKey];
                    priceType = "Tối thứ 6 và CN";
                } else {
                    // Đêm trong tuần (Mon-Thu)
                    price = room.prices.weekday[priceKey];
                    priceType = "Ngày thường";
                }
            }

            breakdown.push({
                key: i,
                date: formatDate(currentDate),
                dayName: getDayName(currentDate),
                type: priceType,
                price: price,
                isHoliday: isHoliday,
            });

            total += price;
        }

        setPriceBreakdown({
            room,
            checkIn: formatDate(checkIn),
            checkOut: formatDate(checkOut),
            nights,
            breakdown,
            total,
            hasHoliday,
        });

        setCalculating(false);
    };

    // Copy quotation
    const copyQuotation = () => {
        if (!priceBreakdown) return;

        const { room, checkIn, checkOut, nights, total, hasHoliday } = priceBreakdown;

        const text = `🏨 BÁO GIÁ PHÒNG - CHÂU HOMESTAY

📍 Loại căn: ${room.name}
🏠 ${room.area}
👥 Tối đa: ${room.maxGuests}

📅 Check-in: ${checkIn}
📅 Check-out: ${checkOut}
🌙 Số đêm: ${nights} đêm
${hasHoliday ? "🎉 Có ngày lễ/tết" : ""}

💰 Tổng tiền: ${formatVND(total)}

---
📞 Zalo: 0963686963
🌐 Website: chauhomestay.com`;

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const selectedRoomData = roomData.find((r) => r.id === selectedRoom);
    const minDate = new Date().toISOString().split("T")[0];

    if (loading) {
        return (
            <div className="min-h-screen text-slate-900" style={beachBackgroundStyle}>
                <SiteHeader />
                <main className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent"></div>
                        <p className="text-lg text-slate-600">Đang tải dữ liệu giá phòng...</p>
                    </div>
                </main>
                <SiteFooter />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen text-slate-900" style={beachBackgroundStyle}>
                <SiteHeader />
                <main className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-20">
                    <div className="rounded-3xl bg-red-50 p-8 text-center shadow-xl">
                        <p className="mb-4 text-lg text-red-600">❌ {error}</p>
                        <button
                            onClick={fetchRoomData}
                            className="rounded-full bg-[#0055A4] px-6 py-3 text-white transition hover:-translate-y-0.5 hover:bg-[#0b67c6]"
                        >
                            🔄 Thử lại
                        </button>
                    </div>
                </main>
                <SiteFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen text-slate-900" style={beachBackgroundStyle}>
            <SiteHeader />

            <main className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pt-3">
                <Breadcrumb
                    items={[
                        { label: "Trang chủ", href: "/" },
                        { label: "Báo giá" }
                    ]}
                />

                <section className="space-y-6 rounded-[24px] bg-white/85 p-4 shadow-2xl shadow-slate-200/70 ring-1 ring-white/60 sm:space-y-8 sm:rounded-[48px] sm:p-6 lg:p-12">
                    {/* Hero Section */}
                    <header className="rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 p-4 text-white shadow-xl sm:rounded-3xl sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                            Tra cứu giá nhanh
                        </p>
                        <h1 className="mt-2 text-xl font-semibold sm:mt-3 sm:text-2xl md:text-3xl">
                            Báo giá tự động căn hộ The Sóng & Villa
                        </h1>
                        <p className="mt-2 text-xs text-white/85 sm:mt-3 sm:text-sm sm:max-w-2xl">
                            Chọn loại căn hộ và ngày, xem ngay giá chi tiết từng đêm. Giá được cập nhật tự động từ bảng giá chính thức.
                        </p>
                        {holidayDates.length > 0 && (
                            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold shadow-md sm:mt-4 sm:gap-2 sm:px-4 sm:py-1.5 sm:text-sm">
                                🎉 Có {holidayDates.length} ngày lễ/tết được cập nhật
                            </div>
                        )}
                    </header>

                    {/* Form Section */}
                    <Card className="rounded-2xl border-slate-100 bg-white/70 shadow-sm sm:rounded-3xl">
                        <CardContent className="space-y-4 p-4 sm:space-y-6 sm:p-6 sm:pt-6">
                            {/* Guest Count Selector */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">
                                    👥 Số khách tối đa (người lớn + em bé)
                                </Label>
                                <Select
                                    value={selectedMaxGuests || ""}
                                    onValueChange={(value) => {
                                        setSelectedMaxGuests(value || null);
                                        setGuestCount(value ? parseGuestCount(value) : null);
                                        setSelectedRoom(null);
                                        setPriceBreakdown(null);
                                    }}
                                >
                                    <SelectTrigger className="w-full rounded-2xl border-slate-200 bg-white px-4 py-3 h-12">
                                        <SelectValue placeholder="-- Chọn số khách --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableGuestOptions.map((label) => (
                                            <SelectItem key={label} value={label}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Check-in/Check-out Times & Warning */}
                            <div className="space-y-3">

                                <div className="rounded-xl bg-red-50 border border-red-100 p-3 sm:p-4">
                                    <p className="text-xs text-red-600 leading-relaxed sm:text-sm">
                                        <span className="font-semibold">Không nhận quá số khách tối đa.</span> Vui lòng chọn căn phù hợp.<br className="hidden sm:block" />
                                        <span className="hidden sm:inline">Quý khách không thông báo đúng số lượng khách ở sẽ tự chịu trách nhiệm về các vấn đề hành chính liên quan.</span>
                                    </p>
                                </div>
                            </div>

                            {/* Room Selector - Radio Cards */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">
                                    🏠 Chọn loại căn hộ
                                </Label>
                                {!selectedMaxGuests ? (
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
                                        Vui lòng chọn số khách trước
                                    </div>
                                ) : (
                                    <div className="max-h-[280px] space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 sm:max-h-[320px] sm:p-3">
                                        {filteredRooms.map((room) => (
                                            <div
                                                key={room.id}
                                                onClick={() => {
                                                    setSelectedRoom(room.id);
                                                    setPriceBreakdown(null);
                                                }}
                                                className={cn(
                                                    "cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 sm:p-4",
                                                    selectedRoom === room.id
                                                        ? "border-[#0055A4] bg-blue-50 shadow-md"
                                                        : "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50"
                                                )}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {/* Radio indicator */}
                                                    <div className={cn(
                                                        "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                                        selectedRoom === room.id
                                                            ? "border-[#0055A4] bg-[#0055A4]"
                                                            : "border-slate-300 bg-white"
                                                    )}>
                                                        {selectedRoom === room.id && (
                                                            <div className="h-2 w-2 rounded-full bg-white" />
                                                        )}
                                                    </div>
                                                    {/* Room info */}
                                                    <div className="min-w-0 flex-1">
                                                        <p className={cn(
                                                            "text-sm font-semibold leading-tight sm:text-base",
                                                            selectedRoom === room.id ? "text-[#0055A4]" : "text-slate-900"
                                                        )}>
                                                            {room.id}. {room.name}
                                                        </p>
                                                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 sm:gap-2 sm:text-sm">
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5">
                                                                <Users className="h-3 w-3" /> {room.maxGuests}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5">
                                                                <MapPin className="h-3 w-3" /> {room.area}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Selected Room Link or Contact Zalo */}
                            {selectedRoomData && (
                                <div className="flex justify-center">
                                    {/* Căn 3, 5, 7 không có hình ảnh - hiện liên hệ Zalo */}
                                    {[3, 5, 7].includes(selectedRoomData.id) ? (
                                        <a
                                            href="https://zalo.me/0963686963"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-sky-400 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                                        >
                                            <MessageCircle className="h-4 w-4" /> Liên hệ Zalo để xem hình ảnh căn này
                                        </a>
                                    ) : (
                                        <a
                                            href={selectedRoomData.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#0055A4] bg-white px-4 py-2 text-sm font-semibold text-[#0055A4] transition hover:-translate-y-0.5 hover:bg-[#0055A4] hover:text-white"
                                        >
                                            <ImageIcon className="h-4 w-4" /> Xem hình ảnh căn đã chọn
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Date Pickers */}
                            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">
                                        📅 Ngày check-in
                                    </Label>
                                    <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full h-12 justify-start text-left font-normal rounded-2xl border-slate-200 bg-white px-4",
                                                    !checkInDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {checkInDate ? format(checkInDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="center" sideOffset={4}>
                                            <Calendar
                                                mode="single"
                                                selected={checkInDate}
                                                onSelect={(date) => {
                                                    setCheckInDate(date);
                                                    setPriceBreakdown(null);
                                                    setCheckInOpen(false);
                                                }}
                                                disabled={(date) => {
                                                    const today = new Date();
                                                    today.setHours(0, 0, 0, 0);
                                                    return date < today;
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">
                                        📅 Ngày check-out
                                    </Label>
                                    <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full h-12 justify-start text-left font-normal rounded-2xl border-slate-200 bg-white px-4",
                                                    !checkOutDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {checkOutDate ? format(checkOutDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="center" sideOffset={4}>
                                            <Calendar
                                                mode="single"
                                                selected={checkOutDate}
                                                onSelect={(date) => {
                                                    setCheckOutDate(date);
                                                    setPriceBreakdown(null);
                                                    setCheckOutOpen(false);
                                                }}
                                                disabled={(date) => date < (checkInDate || new Date())}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {/* Calculate Button */}
                            <Button
                                onClick={calculatePrice}
                                disabled={calculating}
                                size="lg"
                                className="w-full rounded-xl bg-gradient-to-r from-[#0055A4] to-[#1a7fff] py-4 text-base font-bold shadow-lg shadow-[#0055A4]/30 transition hover:-translate-y-0.5 hover:shadow-xl sm:rounded-2xl sm:py-6 sm:text-lg"
                            >
                                {calculating ? "⏳ Đang tính..." : "🧮 Tính giá ngay"}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Results Section */}
                    {priceBreakdown && (
                        <div className="space-y-6">
                            {/* Room Summary Card */}
                            <div
                                className={`rounded-2xl p-4 text-white shadow-xl sm:rounded-3xl sm:p-6 md:p-8 ${priceBreakdown.hasHoliday
                                    ? "bg-gradient-to-r from-red-500 via-red-600 to-orange-500"
                                    : "bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500"
                                    }`}
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold sm:text-xl md:text-2xl">{priceBreakdown.room.name}</h2>
                                        <p className="text-sm text-white/80 sm:text-base">{priceBreakdown.room.area}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm">
                                            👥 {priceBreakdown.room.maxGuests}
                                        </span>
                                        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm">
                                            🌙 {priceBreakdown.nights} đêm
                                        </span>
                                        {priceBreakdown.hasHoliday && (
                                            <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs text-yellow-900 sm:px-3 sm:py-1 sm:text-sm">
                                                🎉 Có ngày lễ
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Price Breakdown - Card Layout for Mobile, Table for Desktop */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:rounded-3xl">
                                {/* Mobile Card Layout */}
                                <div className="divide-y divide-slate-100 sm:hidden">
                                    {priceBreakdown.breakdown.map((item) => (
                                        <div
                                            key={item.key}
                                            className={`flex items-center justify-between p-4 ${item.isHoliday ? "bg-gradient-to-r from-red-50 to-orange-50" : ""}`}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-slate-900">{item.date}</span>
                                                    <span className="text-xs text-slate-500">({item.dayName})</span>
                                                </div>
                                                <div className="mt-1.5">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${item.isHoliday
                                                            ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                                                            : item.type === "Cuối tuần"
                                                                ? "bg-gradient-to-r from-orange-400 to-amber-400 text-white"
                                                                : item.type === "Tối thứ 6 và CN"
                                                                    ? "bg-gradient-to-r from-purple-400 to-indigo-500 text-white"
                                                                    : "bg-gradient-to-r from-sky-400 to-blue-500 text-white"
                                                            }`}
                                                    >
                                                        {item.isHoliday
                                                            ? "🎉 Lễ/Tết"
                                                            : item.type === "Cuối tuần"
                                                                ? "🌅 Cuối tuần"
                                                                : item.type === "Tối thứ 6 và CN"
                                                                    ? "🌙 Tối thứ 6 và CN"
                                                                    : "📅 Ngày thường"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-lg font-bold ${item.isHoliday ? "text-red-600" : "text-slate-900"}`}>
                                                    {formatVND(item.price).replace(" ₫", "")}
                                                </p>
                                                <p className="text-xs text-slate-500">đ/đêm</p>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Mobile Total */}
                                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-300">Tổng cộng</p>
                                                <p className="text-xs text-slate-400">{priceBreakdown.nights} đêm</p>
                                            </div>
                                            <p className="text-2xl font-bold text-white">
                                                {formatVND(priceBreakdown.total)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Table Layout */}
                                <div className="hidden sm:block">
                                    <table className="w-full">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                                    Ngày
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                                    Thứ
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                                    Loại ngày
                                                </th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                                                    Giá phòng
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {priceBreakdown.breakdown.map((item) => (
                                                <tr key={item.key} className={item.isHoliday ? "bg-red-50" : "hover:bg-slate-50"}>
                                                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{item.date}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">
                                                        {item.dayName}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${item.isHoliday
                                                                ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                                                                : item.type === "Cuối tuần"
                                                                    ? "bg-gradient-to-r from-orange-400 to-amber-400 text-white"
                                                                    : item.type === "Tối thứ 6 và CN"
                                                                        ? "bg-gradient-to-r from-purple-400 to-indigo-500 text-white"
                                                                        : "bg-gradient-to-r from-sky-400 to-blue-500 text-white"
                                                                }`}
                                                        >
                                                            {item.isHoliday
                                                                ? "🎉 Lễ/Tết"
                                                                : item.type === "Cuối tuần"
                                                                    ? "🌅 Cuối tuần"
                                                                    : item.type === "Tối thứ 6 và CN"
                                                                        ? "🌙 Tối thứ 6 và CN"
                                                                        : "📅 Ngày thường"}
                                                        </span>
                                                    </td>
                                                    <td
                                                        className={`px-4 py-3 text-right text-sm font-bold ${item.isHoliday ? "text-red-600" : "text-slate-900"
                                                            }`}
                                                    >
                                                        {formatVND(item.price)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gradient-to-r from-slate-800 to-slate-700">
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="px-4 py-4 text-base font-bold text-white"
                                                >
                                                    TỔNG ({priceBreakdown.nights} đêm)
                                                </td>
                                                <td className="px-4 py-4 text-right text-xl font-bold text-white">
                                                    {formatVND(priceBreakdown.total)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Total Summary */}
                            <div
                                className={`rounded-2xl p-4 text-center sm:rounded-3xl sm:p-6 md:p-8 ${priceBreakdown.hasHoliday
                                    ? "border-2 border-red-200 bg-red-50"
                                    : "border-2 border-green-200 bg-green-50"
                                    }`}
                            >
                                <p className="text-xs font-semibold text-slate-600 sm:text-sm">Tổng tiền thanh toán</p>
                                <p
                                    className={`mt-1 text-2xl font-bold sm:mt-2 sm:text-3xl md:text-4xl ${priceBreakdown.hasHoliday ? "text-red-600" : "text-green-600"
                                        }`}
                                >
                                    {formatVND(priceBreakdown.total)}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                                <Button
                                    onClick={copyQuotation}
                                    variant="outline"
                                    size="lg"
                                    className="flex-1 rounded-xl border-2 py-4 text-sm font-semibold transition hover:-translate-y-0.5 sm:rounded-2xl sm:py-6 sm:text-base"
                                >
                                    {copied ? "✅ Đã copy!" : "📋 Copy báo giá"}
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    className="flex-1 rounded-xl bg-[#0055A4] py-4 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-[#0b67c6] sm:rounded-2xl sm:py-6 sm:text-base"
                                >
                                    <Link href="https://zalo.me/0963686963">
                                        💬 Liên hệ Zalo
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-4 text-sm font-semibold transition hover:-translate-y-0.5 hover:from-green-600 hover:to-green-700 sm:rounded-2xl sm:py-6 sm:text-base"
                                >
                                    <Link href="tel:0963686963">
                                        📞 Gọi ngay
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* CTA Section */}
                    <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-[#b88b5a]/10 to-[#b88b5a]/5 p-4 text-center ring-1 ring-[#b88b5a]/20 sm:rounded-3xl sm:p-6 md:p-8">
                        <h2 className="text-lg font-bold text-slate-900 sm:text-xl md:text-2xl">
                            Cần hỗ trợ chọn căn phù hợp?
                        </h2>
                        <p className="mt-2 text-slate-600">
                            Châu Homestay sẵn sàng tư vấn căn phù hợp với số người và ngân sách của bạn
                        </p>
                        <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                href="https://zalo.me/0963686963"
                                className="rounded-full bg-[#0055A4] px-8 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0b67c6]"
                            >
                                💬 Chat Zalo ngay
                            </Link>
                            <Link
                                href="/can-ho-the-song"
                                className="rounded-full border-2 border-[#0055A4] px-8 py-3 font-semibold text-[#0055A4] transition hover:-translate-y-0.5 hover:bg-[#0055A4] hover:text-white"
                            >
                                🏠 Xem các căn hộ
                            </Link>
                        </div>
                    </div>
                </section >
            </main >

            <SiteFooter />
        </div >
    );
}
