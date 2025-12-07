"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCcw, Users } from "lucide-react";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVdvJcxlXLLZbgoCjnZbsPq7lKrW9OEKeeK86y9nWWM5HfHtVYXK6aUusOd12ZRb4IEJl8AsaPPEp1/pub?gid=2908382&single=true&output=csv";

const CACHE_KEY = "pricing-cache";
const CACHE_TTL_MS = 5 * 60 * 1000;

const PRICE_COLUMN_GROUPS = [
  { key: "sat", columns: [5, 6], fallbackLabel: "Đêm Thứ 7" },
  { key: "friSun", columns: [7, 8], fallbackLabel: "Đêm Thứ 6 & CN" },
  { key: "weekday", columns: [9, 10], fallbackLabel: "Trong tuần" },
];

const PRICE_GROUP_STYLES = {
  sat: {
    container:
      "bg-gradient-to-br from-rose-100 via-rose-200 to-orange-100 border-rose-200 shadow-[0_12px_35px_rgba(225,29,72,0.25)]",
    badge: "bg-rose-600/10 text-rose-700 border border-rose-200",
    value: "text-rose-700",
  },
  friSun: {
    container:
      "bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-amber-100 shadow-[0_8px_24px_rgba(251,191,36,0.15)]",
    badge: "bg-amber-100 text-amber-700",
    value: "text-amber-600",
  },
  weekday: {
    container:
      "bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50 border-emerald-100 shadow-[0_8px_24px_rgba(16,185,129,0.15)]",
    badge: "bg-emerald-100 text-emerald-700",
    value: "text-emerald-600",
  },
};

const beachBackgroundStyle = {
  backgroundImage:
    "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.6), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.4), transparent 40%), linear-gradient(180deg, #E8F6FF 0%, #F5FBFF 45%, #FFF7EA 100%)",
};

const parseCsv = (csvText) => {
  if (!csvText) {
    return [];
  }

  const rows = [];
  let currentValue = "";
  let currentRow = [];
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i += 1) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentValue += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentValue.trim());
      currentValue = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i += 1;
      }
      currentRow.push(currentValue.trim());
      rows.push(currentRow);
      currentRow = [];
      currentValue = "";
    } else {
      currentValue += char;
    }
  }

  if (currentValue.length || currentRow.length) {
    currentRow.push(currentValue.trim());
    rows.push(currentRow);
  }

  return rows.filter((row) => row.some((cell) => cell));
};

const sanitizeMaxGuest = (text) => {
  if (!text) {
    return "";
  }

  return text
    .replace(/khách/gi, "")
    .replace(/\(+b\u1eabc\)?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
};

const splitPriceLabel = (text) => {
  if (!text) {
    return [];
  }

  const parts = text
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (!parts.length) {
    return [];
  }

  if (parts.length === 1) {
    return parts;
  }

  return parts.map((part, index) =>
    index < parts.length - 1 ? `${part},` : part
  );
};

const readCache = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    if (!parsed?.table || !parsed?.timestamp) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn("Không thể đọc cache bảng giá:", error);
    return null;
  }
};

const writeCache = (data) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        table: data.table,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.warn("Không thể lưu cache bảng giá:", error);
  }
};

const formatRows = (table) => {
  if (!table?.header?.length || !table?.rows?.length) {
    return [];
  }

  return table.rows.map((row) => {
    const prices = PRICE_COLUMN_GROUPS.map((group) => {
      const groupLabel =
        table.metaRow?.[group.columns[0]] ||
        table.metaRow?.[group.columns[0] - 1] ||
        group.fallbackLabel;

      const entries = group.columns
        .map((columnIndex) => ({
          label: table.header?.[columnIndex] || "Giá",
          value: row[columnIndex]?.trim(),
        }))
        .filter((entry) => entry.value);

      if (!entries.length) {
        return null;
      }

      return {
        key: group.key,
        label: groupLabel || group.fallbackLabel,
        entries,
      };
    }).filter(Boolean);

    return {
      id: row[0]?.trim(),
      order: row[0]?.trim(),
      roomType: row[1]?.trim(),
      maxGuest: sanitizeMaxGuest(row[2]),
      description: row[3]?.trim(),
      link: row[4]?.trim(),
      prices,
    };
  });
};

const PricingPage = () => {
  const [table, setTable] = useState({ header: [], rows: [], metaRow: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPricing = useCallback(
    async (silent = false) => {
      if (loading && silent) {
        return;
      }

      setError(null);

      if (silent) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await fetch(
          `${SHEET_CSV_URL}&cacheBust=${Date.now()}`
        );

        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu");
        }

        const csvText = await response.text();
        const parsedRows = parseCsv(csvText);

        const headerIndex = parsedRows.findIndex(
          (row) => row[0]?.trim() === "#"
        );

        if (headerIndex === -1) {
          throw new Error("Không tìm thấy cấu trúc bảng giá hợp lệ");
        }

        const header = parsedRows[headerIndex];
        const metaRow = parsedRows[headerIndex - 1] || [];
        const rows = parsedRows
          .slice(headerIndex + 1)
          .filter((row) => row[0] && row[1])
          .map((row) => row.map((cell) => cell?.trim?.() ?? cell));

        if (!rows.length) {
          throw new Error("Không có dữ liệu khả dụng");
        }

        const tableData = { header, rows, metaRow };

        setTable(tableData);
        setLastUpdated(new Date());
        writeCache({ table: tableData });
      } catch (err) {
        console.error("Lỗi tải bảng giá:", err);
        setError(
          err?.message || "Không thể tải bảng giá. Vui lòng thử lại sau."
        );
      } finally {
        if (silent) {
          setIsRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [loading]
  );

  useEffect(() => {
    const cached = readCache();

    if (cached?.table) {
      setTable(cached.table);
      setLastUpdated(new Date(cached.timestamp));
      setLoading(false);
    }

    const isFresh =
      cached?.timestamp && Date.now() - cached.timestamp < CACHE_TTL_MS;

    if (!isFresh) {
      fetchPricing(false);
    }
  }, [fetchPricing]);

  const structuredRows = useMemo(() => formatRows(table), [table]);

  const checkInTimes = ["14:00"];
  const checkOutTimes = ["Trước 12:00"];

  const lastUpdatedLabel = lastUpdated
    ? lastUpdated.toLocaleString("vi-VN")
    : "Đang tải...";

  return (
    <div className="min-h-screen text-slate-900" style={beachBackgroundStyle}>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pt-3">
        <Breadcrumb
          items={[{ label: "Trang chủ", href: "/" }, { label: "Bảng giá" }]}
        />
        <div className="mt-4 space-y-6">
          <section aria-labelledby="pricing-heading" className="space-y-4">
            <div className="rounded-3xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 p-6 text-white shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                Bảng giá cập nhật
              </p>
              <h1
                id="pricing-heading"
                className="mt-3 text-2xl font-semibold sm:text-3xl"
              >
                Bảng giá căn hộ The Sóng & villa Châu Homestay
              </h1>
              <p className="mt-3 text-sm text-white/85 sm:max-w-2xl">
                Bảng giá được cập nhật thường xuyên, giúp bạn luôn xem được mức
                giá mới nhất và chính xác cho từng loại căn hộ và villa tại Châu
                Homestay Vũng Tàu.
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
              <div>
                <p className="text-xs text-slate-500">Lần cập nhật gần nhất</p>
                <p className="text-sm font-medium text-slate-900">
                  {lastUpdatedLabel}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => fetchPricing(true)}
                disabled={loading || isRefreshing}
                aria-label="Làm mới bảng giá"
                variant="outline"
                className="inline-flex items-center gap-2 rounded-full border-slate-200 px-4 py-2 text-sm font-medium hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-400"
              >
                <RefreshCcw
                  size={16}
                  className={isRefreshing ? "animate-spin" : ""}
                />
                <span>Làm mới</span>
              </Button>
            </div>
          </section>

          {(checkInTimes.length || checkOutTimes.length) && (
            <section
              aria-label="Thông tin giờ nhận và trả phòng"
              className="space-y-3 rounded-3xl border border-rose-100 bg-rose-50/70 p-4 shadow-[0_10px_25px_rgba(225,29,72,0.12)]"
            >
              <div className="flex flex-wrap gap-3">
                {checkInTimes.length > 0 && (
                  <div className="min-w-[150px] flex-1 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 px-4 py-3 text-white shadow-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                      Check-in
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {checkInTimes[0]}
                    </p>
                  </div>
                )}
                {checkOutTimes.length > 0 && (
                  <div className="min-w-[150px] flex-1 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-400 to-purple-300 px-4 py-3 text-white shadow-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                      Check-out
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {checkOutTimes[0]}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-1 rounded-2xl border border-dashed border-rose-200 bg-orange-100 px-3 py-2">
                <p className="text-xs font-semibold text-rose-900">
                  Không nhận số khách vượt quá tối đa của từng căn. Vui lòng
                  chọn căn diện tích lớn hơn phù hợp với nhóm của bạn.
                </p>
                <p className="text-xs text-rose-800">
                  Quý khách không thông báo đúng số lượng khách ở sẽ tự chịu
                  trách nhiệm về các vấn đề hành chính liên quan đến lưu trú
                  không đăng ký.
                </p>
              </div>
            </section>
          )}

          {error && (
            <section aria-live="polite">
              <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            </section>
          )}

          {loading && (
            <section aria-hidden={!!structuredRows.length}>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="h-32 rounded-3xl bg-slate-100 animate-pulse"
                  />
                ))}
              </div>
            </section>
          )}

          {!loading && !structuredRows.length && !error && (
            <section aria-live="polite">
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                Không có dữ liệu bảng giá để hiển thị.
              </div>
            </section>
          )}

          {/* Mobile: hiển thị dạng thẻ như hiện tại */}
          <section
            aria-label="Danh sách bảng giá theo loại phòng (mobile)"
            className="space-y-4 pb-4 lg:hidden"
          >
            {structuredRows.map((row, index) => (
              <article
                key={`${row.roomType || "row"}-${index}`}
                className="rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
              >
                <header className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      Loại phòng
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      <span className="mr-2 text-slate-400">
                        {row.order ? `${row.order}.` : ""}
                      </span>
                      {row.roomType || "Chưa có tên"}
                    </p>
                  </div>
                  {row.maxGuest ? (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-3.5 py-1 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(5,150,105,0.35)]">
                      <Users size={16} strokeWidth={2.2} />
                      <span className="tracking-wide">{row.maxGuest}</span>
                    </div>
                  ) : null}
                </header>

                {row.description ? (
                  <p className="mt-3 text-sm text-slate-600">
                    {row.description}
                  </p>
                ) : null}

                {row.prices.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {row.prices.map((group) => (
                      <div
                        key={`${row.roomType}-${group.key}`}
                        className={`rounded-2xl border p-3 ${
                          PRICE_GROUP_STYLES[group.key]?.container ||
                          "border-slate-100 bg-slate-50/70"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">
                            {group.label}
                          </p>
                        </div>
                        <div className="mt-2 grid grid-cols-1 gap-2">
                          {group.entries.map((entry, entryIndex) => (
                            <div
                              key={`${group.key}-${entry.label}-${entryIndex}`}
                              className="flex items-center justify-between rounded-xl bg-white px-3 py-2"
                            >
                              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 leading-tight">
                                {splitPriceLabel(entry.label).map(
                                  (line, lineIndex) => (
                                    <span
                                      key={`${entry.label}-${lineIndex}`}
                                      className="block"
                                    >
                                      {line}
                                    </span>
                                  )
                                )}
                              </span>
                              <span
                                className={`text-base font-semibold ${
                                  PRICE_GROUP_STYLES[group.key]?.value ||
                                  "text-emerald-600"
                                }`}
                              >
                                {entry.value}
                                <span className="ml-1 text-xs font-semibold text-slate-400">
                                  đ
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-5 rounded-2xl border border-dashed border-sky-600 bg-white/90 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-700">
                    Cho thuê xe máy
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-800">
                    150.000đ / 24h, có thẻ hầm xe không thêm phí gửi.
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    Loại xe: Airblade, Vision.
                  </p>
                </div>
              </article>
            ))}
          </section>

          {/* Desktop: hiển thị dạng bảng tổng hợp */}
          {structuredRows.length > 0 ? (
            <section
              aria-label="Bảng giá tổng hợp theo loại phòng (desktop)"
              className="hidden pb-4 lg:block"
            >
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-0 text-sm">
                    <thead>
                      <tr className="bg-slate-50/90">
                        <th className="sticky left-0 z-10 border-b border-slate-200 bg-slate-50/95 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          #
                        </th>
                        <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 min-w-[14rem]">
                          Loại phòng
                        </th>
                        <th className="border-b border-slate-200 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 min-w-[9rem]">
                          Khách tối đa
                        </th>
                        <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Đêm Thứ 7
                        </th>
                        <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Thứ 6 & Chủ nhật
                        </th>
                        <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Trong tuần
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {structuredRows.map((row, index) => {
                        const satGroup = row.prices.find(
                          (group) => group.key === "sat"
                        );
                        const friSunGroup = row.prices.find(
                          (group) => group.key === "friSun"
                        );
                        const weekdayGroup = row.prices.find(
                          (group) => group.key === "weekday"
                        );

                        return (
                          <tr
                            key={`row-table-${row.roomType || index}`}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                            }
                          >
                            <td className="sticky left-0 z-[5] border-b border-slate-100 bg-white px-4 py-3 text-xs font-semibold text-slate-500">
                              {row.order || index + 1}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-3">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold text-slate-900">
                                  {row.roomType || "Chưa có tên"}
                                </span>
                                {row.description ? (
                                  <span className="max-w-xs text-xs text-slate-500">
                                    {row.description}
                                  </span>
                                ) : null}
                              </div>
                            </td>
                            <td className="border-b border-slate-100 px-4 py-3 text-center text-sm text-slate-700 min-w-[9rem]">
                              {row.maxGuest || "-"}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-3 align-top text-sm">
                              {satGroup ? (
                                <div className="space-y-1">
                                  {satGroup.entries.map((entry) => (
                                    <div
                                      key={`sat-${row.roomType}-${entry.label}`}
                                    >
                                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                        {splitPriceLabel(entry.label).join(" ")}
                                      </p>
                                      <p className="text-sm font-semibold text-rose-700">
                                        {entry.value}
                                        <span className="ml-1 text-xs font-semibold text-slate-400">
                                          đ
                                        </span>
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400">
                                  -
                                </span>
                              )}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-3 align-top text-sm">
                              {friSunGroup ? (
                                <div className="space-y-1">
                                  {friSunGroup.entries.map((entry) => (
                                    <div
                                      key={`friSun-${row.roomType}-${entry.label}`}
                                    >
                                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                        {splitPriceLabel(entry.label).join(" ")}
                                      </p>
                                      <p className="text-sm font-semibold text-amber-600">
                                        {entry.value}
                                        <span className="ml-1 text-xs font-semibold text-slate-400">
                                          đ
                                        </span>
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400">
                                  -
                                </span>
                              )}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-3 align-top text-sm">
                              {weekdayGroup ? (
                                <div className="space-y-1">
                                  {weekdayGroup.entries.map((entry) => (
                                    <div
                                      key={`weekday-${row.roomType}-${entry.label}`}
                                    >
                                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                        {splitPriceLabel(entry.label).join(" ")}
                                      </p>
                                      <p className="text-sm font-semibold text-emerald-600">
                                        {entry.value}
                                        <span className="ml-1 text-xs font-semibold text-slate-400">
                                          đ
                                        </span>
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400">
                                  -
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default PricingPage;
