"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  formatJalali,
  isoToJalali,
  jalaliMonthLength,
  jalaliMonthNames,
  jalaliToIso,
  jalaliWeekday,
  jalaliWeekdayShort,
  toPersianDigits,
  todayJalali,
} from "@/lib/jalali";

type DatePickerProps = {
  label?: string;
  error?: string;
  value?: string;
  onChange: (isoDate: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
};

export function DatePicker({
  label,
  error,
  value,
  onChange,
  onBlur,
  placeholder = "انتخاب تاریخ",
  id,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(() => (value ? isoToJalali(value) : null), [value]);
  const today = useMemo(() => todayJalali(), []);
  const [viewYear, setViewYear] = useState(selected?.jy ?? today.jy);
  const [viewMonth, setViewMonth] = useState(selected?.jm ?? today.jm);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setViewYear(selected?.jy ?? today.jy);
    setViewMonth(selected?.jm ?? today.jm);
  }, [open, selected, today]);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        onBlur?.();
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onBlur]);

  const monthLength = jalaliMonthLength(viewYear, viewMonth);
  const leadingBlanks = jalaliWeekday(...gregorianOfFirstDay(viewYear, viewMonth));

  function goToPrevMonth() {
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function selectDay(day: number) {
    onChange(jalaliToIso(viewYear, viewMonth, day));
    setOpen(false);
    onBlur?.();
  }

  function selectToday() {
    onChange(jalaliToIso(today.jy, today.jm, today.jd));
    setOpen(false);
    onBlur?.();
  }

  const displayText = selected ? formatJalali(selected.jy, selected.jm, selected.jd) : "";

  return (
    <div className="flex flex-col gap-1" ref={containerRef}>
      {label && (
        <label htmlFor={id} className="text-sm text-slate-600">
          {label}
        </label>
      )}
      <div>
        <button
          type="button"
          id={id}
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 ${
            error ? "border-danger" : "border-slate-200"
          }`}
        >
          <span className={displayText ? "text-slate-800" : "text-slate-400"}>
            {displayText || placeholder}
          </span>
          <FiCalendar className="h-4 w-4 text-slate-400" />
        </button>

        {open && (
          <div className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={goToNextMonth}
                aria-label="ماه بعد"
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-slate-800">
                {jalaliMonthNames[viewMonth - 1]} {toPersianDigits(viewYear)}
              </span>
              <button
                type="button"
                onClick={goToPrevMonth}
                aria-label="ماه قبل"
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7 text-center text-xs text-slate-400">
              {jalaliWeekdayShort.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {Array.from({ length: leadingBlanks }).map((_, i) => (
                <span key={`blank-${i}`} />
              ))}
              {Array.from({ length: monthLength }).map((_, i) => {
                const day = i + 1;
                const isSelected =
                  selected?.jy === viewYear && selected?.jm === viewMonth && selected?.jd === day;
                const isToday =
                  today.jy === viewYear && today.jm === viewMonth && today.jd === day;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => selectDay(day)}
                    className={`rounded-lg py-1.5 transition-colors ${
                      isSelected
                        ? "bg-primary text-white"
                        : isToday
                          ? "border border-primary text-primary"
                          : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {toPersianDigits(day)}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={selectToday}
              className="mt-2 w-full rounded-lg py-1.5 text-center text-xs text-primary hover:bg-blue-50"
            >
              امروز
            </button>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

function gregorianOfFirstDay(jy: number, jm: number): [number, number, number] {
  const iso = jalaliToIso(jy, jm, 1);
  const [gy, gm, gd] = iso.split("-").map(Number);
  return [gy, gm, gd];
}
