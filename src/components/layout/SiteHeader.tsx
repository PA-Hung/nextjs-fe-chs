"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Căn hộ The Sóng", href: "/can-ho-the-song" },
  { label: "Villa", href: "#villas" },
  { label: "Guide Book", href: "/blog" },
  { label: "Liên hệ", href: "/lien-he" },
];

export const SiteHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo1.png"
              alt="Logo Châu Homestay"
              width={56}
              height={56}
              priority
              className="h-14 w-14 rounded-full bg-white p-1 shadow object-contain"
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-slate-900">Châu Homestay</span>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-500">The Sóng Vũng Tàu</span>
            </div>
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="https://zalo.me"
            className="hidden rounded-full bg-[#0055A4] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b67c6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80b9ff] md:inline-flex"
          >
            Liên hệ Zalo
          </Link>
          <Button
            type="button"
            onClick={handleToggleMenu}
            variant="outline"
            size="icon"
            aria-label="Mở menu"
            aria-expanded={isMenuOpen}
            className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 md:hidden"
          >
            <span className="sr-only">Menu</span>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>
      {isMenuOpen ? (
        <div className="border-t border-slate-100 bg-white/95 px-4 py-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-4 text-sm font-medium text-slate-600">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                tabIndex={0}
                onClick={handleCloseMenu}
                className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="https://zalo.me"
              className="rounded-full bg-[#0055A4] px-4 py-2 text-center font-semibold text-white transition hover:bg-[#0b67c6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80b9ff]"
            >
              Đặt phòng qua Zalo
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
};

