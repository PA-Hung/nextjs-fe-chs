"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

type BookingDateFieldProps = {
    id: string
    name: string
    placeholder?: string
    isRequired?: boolean
}

const formatDateToInputValue = (date: Date | undefined) => {
    if (!date) {
        return ""
    }

    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, "0")
    const day = `${date.getDate()}`.padStart(2, "0")

    return `${year}-${month}-${day}`
}

export const BookingDateField = ({
    id,
    name,
    placeholder = "Chọn ngày",
    isRequired,
}: BookingDateFieldProps) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>()
    const containerRef = React.useRef<HTMLDivElement | null>(null)

    const handleSelectDate = (nextDate: Date | undefined) => {
        if (!nextDate) {
            return
        }

        setDate(nextDate)
        setIsOpen(false)
    }

    const handleToggleOpen = () => {
        setIsOpen((prev) => !prev)
    }

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current) {
                return
            }

            if (!containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (!isOpen) {
            return
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    const inputValue = formatDateToInputValue(date)

    return (
        <div ref={containerRef} className="relative">
            <input
                id={id}
                name={name}
                type="hidden"
                required={isRequired}
                value={inputValue}
                readOnly
            />

            <Button
                variant="outline"
                type="button"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                data-empty={!date}
                onClick={handleToggleOpen}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-normal text-slate-900 shadow-sm transition data-[empty=true]:text-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055A4] focus-visible:ring-offset-1"
            >
                <span>
                    {date
                        ? date.toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })
                        : placeholder}
                </span>
                <CalendarIcon className="h-4 w-4 text-slate-400" />
            </Button>

            {isOpen ? (
                <div className="absolute left-0 z-20 mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleSelectDate}
                        captionLayout="dropdown"
                    />
                </div>
            ) : null}
        </div>
    )
}

