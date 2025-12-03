"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterSelectProps {
  id: string;
  name: string;
  defaultValue?: string;
  options: Array<{ label: string; value: string }>;
  label: string;
  ariaLabel: string;
  className?: string;
}

export const FilterSelect = React.forwardRef<HTMLInputElement, FilterSelectProps>(
  ({ id, name, defaultValue = "", options, label, ariaLabel, className }, ref) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = React.useState(defaultValue);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleValueChange = (newValue: string) => {
      setValue(newValue);

      const params = new URLSearchParams(searchParams.toString());

      if (newValue === "all") {
        params.delete(name);
      } else {
        params.set(name, newValue);
      }

      params.set("current", "1");

      router.push(`?${params.toString()}`);
    };

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          {label}
        </label>
        <input
          type="hidden"
          ref={inputRef}
          name={value === "all" ? undefined : name}
          value={value === "all" ? "" : value}
        />
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger
            id={id}
            aria-label={ariaLabel}
            className={cn(
              "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80b9ff]",
              className
            )}
          >
            <SelectValue placeholder={options[0]?.label || "Chọn..."} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value || `option-${option.label}`} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);

FilterSelect.displayName = "FilterSelect";

