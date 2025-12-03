import Link from "next/link";

const footerLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Căn hộ The Sóng", href: "/can-ho-the-song" },
  { label: "Villa", href: "/villa" },
  { label: "Guide Book", href: "/blog" },
  { label: "Liên hệ", href: "/lien-he" },
];

const infoItems = [
  { label: "Hotline", value: "0963 686 963" },
  { label: "Zalo", value: "0963 686 963" },
  { label: "Địa chỉ", value: "28 Thi Sách, Phường Vũng Tàu, TP Hồ Chí Minh" },
];

export const SiteFooter = () => {
  return (
    <footer className="mt-16 border-t border-white/60 bg-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 text-sm text-slate-600 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3 text-center lg:text-left">
          <p className="text-lg font-semibold text-slate-900">Châu Homestay – The Sóng Vũng Tàu</p>
          <p className="text-xs tracking-[0.4em] text-[#0055A4]">Staycation by the sea</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 lg:justify-start">
            {infoItems.map((item) => (
              <div key={item.label}>
                <span className="font-semibold text-slate-700">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 text-center text-sm font-medium text-slate-600 lg:text-right">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-white/60 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Châu Homestay – Giữ trọn khoảnh khắc bên biển.
      </div>
    </footer>
  );
};

