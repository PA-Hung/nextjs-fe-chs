"use client"

import * as React from "react"

import { BookingDateField } from "@/components/dat-phong/BookingDateField"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { buildApiUrl } from "@/lib/config"

const ZALO_CHAT_IDS = [
    "a1305d9c97dc7e8227cd", // zalo id hero
    "36397df189a160ff39b0", // zalo id chauhomestay
    "1cfba409f3461a184357", // zalo id chau
]

const BookingForm = () => {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [submitMessage, setSubmitMessage] = React.useState<string | null>(null)
    const [submitError, setSubmitError] = React.useState<string | null>(null)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setSubmitMessage(null)
        setSubmitError(null)
        setIsSubmitting(true)

        const formData = new FormData(event.currentTarget)

        const name = (formData.get("fullName") ?? "").toString().trim()
        const phone = (formData.get("phone") ?? "").toString().trim()
        const adults = (formData.get("adults") ?? "").toString().trim()
        const children = (formData.get("children") ?? "0").toString().trim()
        const checkInDate = (formData.get("checkInDate") ?? "").toString().trim()
        const checkOutDate = (formData.get("checkOutDate") ?? "").toString().trim()
        const note = (formData.get("note") ?? "").toString().trim()
        const newBooking = {
            name,
            phone,
            adults,
            children,
        }

        const messageText =
            `📋 Bạn có thông tin cần tư vấn đặt phòng từ 🌐 website \n\n` +
            `👤 Khách hàng: ${newBooking.name}\n` +
            `📞 Phone: ${newBooking.phone}\n` +
            `📅 Check-in: ${checkInDate}\n` +
            `📅 Check-out: ${checkOutDate}\n` +
            `👥 Người lớn: ${newBooking.adults}\n` +
            `👶 Trẻ em: ${newBooking.children}\n` +
            `📝 Ghi chú: ${note}`

        try {
            const responses = await Promise.all(
                ZALO_CHAT_IDS.map(async (chatId) => {
                    const payload = {
                        chat_id: chatId,
                        text: messageText,
                    }

                    const response = await fetch(buildApiUrl("/zalo-bot/send-message"), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    })

                    const rawText = await response.text()
                    const result = rawText ? JSON.parse(rawText) : null
                    console.log("zalo-bot response", chatId, response.status, result)

                    return response
                })
            )

            const hasSuccess = responses.some((response) => response.ok)

            if (hasSuccess) {
                setSubmitMessage(
                    "Cảm ơn bạn! Thông tin đã được gửi tới Châu Homestay. Đội ngũ sẽ liên hệ lại trong 5–15 phút."
                )
            } else {
                setSubmitError(
                    "Không thể gửi thông tin ngay lúc này. Bạn vui lòng thử lại sau ít phút hoặc liên hệ trực tiếp qua Zalo/Hotline nhé."
                )
            }
        } catch {
            setSubmitError(
                "Có lỗi kết nối khi gửi thông tin. Bạn vui lòng thử lại sau hoặc liên hệ trực tiếp qua Zalo/Hotline nhé."
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form
            className="mt-8 grid gap-6"
            aria-label="Form đặt phòng Châu Homestay"
            onSubmit={handleSubmit}
        >
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-slate-800"
                    >
                        Họ và tên
                        <span className="ml-1 text-red-500" aria-hidden="true">
                            *
                        </span>
                    </label>
                    <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        aria-required="true"
                        placeholder="VD: Nguyễn Minh Châu"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-slate-800"
                    >
                        Số điện thoại
                        <span className="ml-1 text-red-500" aria-hidden="true">
                            *
                        </span>
                    </label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        aria-required="true"
                        inputMode="tel"
                        placeholder="VD: 0963 686 963"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label
                        htmlFor="adults"
                        className="block text-sm font-medium text-slate-800"
                    >
                        Số người lớn (từ 10 tuổi trở lên)
                        <span className="ml-1 text-red-500" aria-hidden="true">
                            *
                        </span>
                    </label>
                    <Input
                        id="adults"
                        name="adults"
                        type="number"
                        min={1}
                        step={1}
                        required
                        aria-required="true"
                        placeholder="VD: 4"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="children"
                        className="block text-sm font-medium text-slate-800"
                    >
                        Số trẻ em (dưới 10 tuổi)
                    </label>
                    <Input
                        id="children"
                        name="children"
                        type="number"
                        min={0}
                        step={1}
                        placeholder="VD: 2"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label
                        htmlFor="checkInDate"
                        className="block text-sm font-medium text-slate-800"
                    >
                        Ngày nhận home
                        <span className="ml-1 text-red-500" aria-hidden="true">
                            *
                        </span>
                    </label>
                    <BookingDateField
                        id="checkInDate"
                        name="checkInDate"
                        isRequired
                        placeholder="Chọn ngày nhận home"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="checkOutDate"
                        className="block text-sm font-medium text-slate-800"
                    >
                        Ngày trả home
                        <span className="ml-1 text-red-500" aria-hidden="true">
                            *
                        </span>
                    </label>
                    <BookingDateField
                        id="checkOutDate"
                        name="checkOutDate"
                        isRequired
                        placeholder="Chọn ngày trả home"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="note"
                    className="block text-sm font-medium text-slate-800"
                >
                    Ghi chú thêm (tuỳ chọn)
                </label>
                <Textarea
                    id="note"
                    name="note"
                    rows={3}
                    placeholder="VD: Tôi có thể check sớm không ?..."
                />
            </div>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                    Sau khi gửi thông tin, Châu Homestay sẽ liên hệ lại trong vòng{" "}
                    <span className="font-semibold text-slate-700">5–15 phút</span>{" "}
                    trong giờ làm việc.
                </p>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-[#0055A4] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#004280] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isSubmitting ? "Đang gửi..." : "Gửi thông tin"}
                </Button>
            </div>

            {submitMessage ? (
                <p className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
                    {submitMessage}
                </p>
            ) : null}

            {submitError ? (
                <p className="mt-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs text-rose-700">
                    {submitError}
                </p>
            ) : null}
        </form>
    )
}

export default BookingForm


