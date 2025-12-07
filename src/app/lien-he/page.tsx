import Link from "next/link";
import type { Metadata } from "next";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

const beachBackgroundStyle = {
    backgroundImage:
        "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.6), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.4), transparent 40%), linear-gradient(180deg, #E8F6FF 0%, #F5FBFF 45%, #FFF7EA 100%)",
};

export const metadata: Metadata = {
    title: "Liên hệ Châu Homestay Vũng Tàu – tư vấn & đặt phòng",
    description:
        "Liên hệ Châu Homestay Vũng Tàu để được tư vấn căn hộ The Sóng, villa phù hợp nhu cầu, hỗ trợ đặt phòng, báo giá và giải đáp thắc mắc.",
    openGraph: {
        title: "Liên hệ Châu Homestay Vũng Tàu – tư vấn & đặt phòng",
        description:
            "Liên hệ Châu Homestay Vũng Tàu để được tư vấn căn hộ The Sóng, villa phù hợp nhu cầu, hỗ trợ đặt phòng, báo giá và giải đáp thắc mắc.",
        url: "https://chauhomestay.com/lien-he",
        type: "website",
    },
    alternates: {
        canonical: "/lien-he",
    },
};

type ContactDetail = {
    title: string;
    value: string;
    description: string;
    icon: string;
    href?: string;
    ctaLabel?: string;
};

const contactDetails: ContactDetail[] = [
    {
        title: "Hotline",
        value: "0963 686 963",
        description: "Kết nối trực tiếp, tư vấn căn phù hợp chỉ trong 3 phút.",
        href: "tel:0963686963",
        icon: "📞",
        ctaLabel: "Gọi ngay",
    },
    {
        title: "Zalo",
        value: "0963 686 963",
        description: "Chat realtime, nhận album ảnh & báo giá cập nhật.",
        href: "https://zalo.me/0963686963",
        icon: "💬",
        ctaLabel: "Chat Zalo",
    },
    {
        title: "Email",
        value: "chauhomestay@gmail.com",
        description: "Nhận hợp đồng, hoá đơn, voucher công tác dễ dàng.",
        href: "mailto:chauhomestay@gmail.com",
        icon: "✉️",
        ctaLabel: "Gửi email",
    },
    {
        title: "Địa chỉ",
        value: "Căn 1.28 – The Sóng, 28 Thi Sách, Vũng Tàu",
        description: "Hẹn gặp trực tiếp để tham quan căn mẫu và nhận chìa khoá.",
        href: "https://maps.google.com/?q=Ch%C3%A2u+Homestay+The+S%C3%B3ng",
        icon: "📍",
        ctaLabel: "Chỉ đường",
    },
    {
        title: "Giờ hỗ trợ",
        value: "08:00 – 21:00 mỗi ngày",
        description: "Luôn có người trực hotline & Zalo kể cả cuối tuần, lễ.",
        icon: "🕘",
    },
    {
        title: "Mạng xã hội",
        value: "@chauhomestay (Facebook, TikTok)",
        description: "Cập nhật căn mới, review khách và ưu đãi độc quyền.",
        href: "https://www.facebook.com/chauhomestaythesong",
        icon: "📲",
        ctaLabel: "Theo dõi",
    },
];

type Highlight = {
    title: string;
    description: string;
    icon: string;
};

const highlights: Highlight[] = [
    {
        title: "Trải nghiệm cá nhân hoá",
        description: "Đề xuất layout căn, setup trang trí sinh nhật, BBQ hay làm việc từ xa đúng nhu cầu của bạn.",
        icon: "🤝",
    },
    {
        title: "Đội ngũ onsite 24/7",
        description: "Luôn có nhân sự túc trực tại The Sóng để hỗ trợ check-in, khắc phục sự cố trong vòng 15 phút.",
        icon: "🛎️",
    },
    {
        title: "Hệ sinh thái tiện ích",
        description: "Kết nối dịch vụ đưa đón, tour Vũng Tàu, thuê xe máy/ô tô và chef tại gia với đối tác tin cậy.",
        icon: "🌴",
    },
];

const ContactPage = () => {
    return (
        <div className="min-h-screen overflow-x-hidden text-slate-900" style={beachBackgroundStyle}>
            <SiteHeader />

            <main className="mx-auto flex max-w-6xl flex-col px-3 pt-4 pb-12 sm:px-4 md:px-6 lg:px-8 lg:pt-3 lg:pb-16">
                <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Liên hệ" }]} />
                <div className="mt-6 space-y-6 sm:space-y-8 lg:space-y-10">
                    <section className="grid gap-6 rounded-3xl bg-white/80 p-4 shadow-2xl shadow-sky-100/80 ring-1 ring-white/60 sm:rounded-[32px] sm:gap-8 sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:rounded-[48px] lg:gap-10 lg:p-10">
                        <article className="space-y-4 sm:space-y-6">
                            <p className="text-xs uppercase tracking-[0.4em] text-[#b88b5a] sm:text-sm">Kết nối nhanh</p>
                            <h1 className="text-2xl font-semibold leading-snug text-slate-900 sm:text-[2rem] md:text-[2.4rem]">
                                Liên hệ Châu Homestay Vũng Tàu
                            </h1>
                            <p className="text-sm text-slate-600 sm:text-base">
                                Châu Homestay hỗ trợ trọn hành trình: chọn căn hộ/villa phù hợp, chuẩn bị tiện ích và chăm sóc trong suốt kỳ nghỉ.
                                Chỉ cần để lại thông tin hoặc gọi trực tiếp, đội ngũ sẽ phản hồi trong vài phút.
                            </p>
                            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                                <Link
                                    href="tel:0963686963"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0055A4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#92c8ff] sm:px-6 sm:py-3 sm:text-base"
                                    aria-label="Gọi hotline Châu Homestay"
                                >
                                    📞 Hotline 0963 686 963
                                </Link>
                                <Link
                                    href="https://zalo.me/0963686963"
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0055A4] bg-white/60 px-5 py-2.5 text-sm font-semibold text-[#0055A4] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055A4]/20 sm:px-6 sm:py-3 sm:text-base"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Chat Zalo với Châu Homestay"
                                >
                                    💬 Chat Zalo ngay
                                </Link>
                            </div>
                        </article>

                        <div className="rounded-2xl bg-gradient-to-br from-[#fdf7eb] via-white to-[#e6f4ff] p-1 sm:rounded-[32px] lg:rounded-[40px]">
                            <div className="h-full rounded-xl bg-white/70 p-5 sm:rounded-3xl sm:p-6 lg:rounded-[36px] lg:p-8">
                                <p className="text-xs uppercase tracking-[0.3em] text-[#0055A4] sm:text-sm">Cam kết</p>
                                <ul className="mt-4 space-y-3 text-xs text-slate-600 sm:mt-6 sm:space-y-4 sm:text-sm">
                                    <li className="flex items-start gap-2.5 sm:gap-3">
                                        <span className="text-base sm:text-lg">✅</span>
                                        <div>
                                            <p className="font-semibold text-slate-900">Giữ chỗ chuẩn xác</p>
                                            <p className="break-words">Đặt qua hotline/Zalo được xử lý tự động, hạn chế overbook, đảm bảo chỗ ở chính xác.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2.5 sm:gap-3">
                                        <span className="text-base sm:text-lg">🧹</span>
                                        <div>
                                            <p className="font-semibold text-slate-900">Vệ sinh & check-list 12 bước</p>
                                            <p className="break-words">Mỗi căn được rà soát decor, thiết bị trước khi bàn giao.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2.5 sm:gap-3">
                                        <span className="text-base sm:text-lg">🧭</span>
                                        <div>
                                            <p className="font-semibold text-slate-900">Hỗ trợ lịch trình</p>
                                            <p className="break-words">Gợi ý quán ăn, địa điểm tham quan và ưu đãi đối tác độc quyền.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl bg-white/85 p-4 shadow-2xl shadow-slate-200/80 ring-1 ring-white/60 sm:rounded-[32px] sm:p-6 lg:rounded-[40px] lg:p-10">
                        <header className="space-y-3 text-center">
                            <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Thông tin liên hệ</p>
                            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl">Chọn kênh phù hợp với bạn</h2>
                            <p className="text-sm text-slate-600 sm:text-base">
                                Mọi kênh đều được kết nối tự động nên bạn luôn nhận trạng thái đặt phòng chính xác và cập nhật theo thời gian thực.
                            </p>
                        </header>

                        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:mt-10 md:grid-cols-2">
                            {contactDetails.map((detail) => {
                                return (
                                    <article
                                        key={detail.title}
                                        className="group rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl shadow-sky-100/80 transition hover:-translate-y-1 hover:shadow-2xl focus-within:-translate-y-1 focus-within:shadow-2xl sm:rounded-[24px] sm:p-5 lg:rounded-[32px] lg:p-6"
                                        aria-label={`Thông tin ${detail.title}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl sm:text-2xl">{detail.icon}</span>
                                            <p className="text-xs uppercase tracking-[0.35em] text-[#0055A4]">{detail.title}</p>
                                        </div>
                                        <p className="mt-3 break-words text-lg font-semibold text-slate-900 sm:mt-4 sm:text-xl lg:text-2xl">{detail.value}</p>
                                        <p className="mt-2 text-xs text-slate-600 sm:text-sm">{detail.description}</p>
                                        {detail.href ? (
                                            <a
                                                href={detail.href}
                                                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0055A4] transition hover:text-[#003f7f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#92c8ff]"
                                                target={detail.href.startsWith("http") ? "_blank" : undefined}
                                                rel={detail.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                                aria-label={`${detail.ctaLabel ?? "Xem chi tiết"} ${detail.title}`}
                                            >
                                                {detail.ctaLabel ?? "Xem chi tiết"}
                                                <span aria-hidden="true">→</span>
                                            </a>
                                        ) : null}
                                    </article>
                                );
                            })}
                        </div>
                    </section>

                    <section className="grid gap-6 rounded-2xl bg-white/90 p-4 shadow-2xl shadow-slate-200/80 ring-1 ring-white/70 sm:rounded-[32px] sm:gap-8 sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:rounded-[40px] lg:p-10">
                        <article className="space-y-4 sm:space-y-5">
                            <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Vì sao khách chọn chúng tôi</p>
                            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl">Đồng hành trước, trong và sau chuyến đi</h2>
                            <p className="text-sm text-slate-600 sm:text-base">
                                Chúng tôi thấu hiểu kỳ nghỉ của bạn cần sự linh hoạt. Đội ngũ luôn chủ động cập nhật tình trạng phòng cho khách quen,
                                đề xuất option mới và hỗ trợ cá nhân hoá từng dịp đặc biệt.
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                                {highlights.map((item) => (
                                    <article
                                        key={item.title}
                                        className="rounded-2xl border border-white/70 bg-[#f7fbff] p-4 shadow-inner shadow-white/60 sm:rounded-3xl sm:p-5"
                                    >
                                        <div className="text-xl sm:text-2xl">{item.icon}</div>
                                        <p className="mt-2 text-base font-semibold text-slate-900 sm:mt-3 sm:text-lg">{item.title}</p>
                                        <p className="mt-1.5 text-xs text-slate-600 sm:mt-2 sm:text-sm">{item.description}</p>
                                    </article>
                                ))}
                            </div>
                        </article>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="rounded-2xl border border-white/70 bg-white/95 p-1 shadow-lg shadow-slate-200/70 sm:rounded-[24px] lg:rounded-[32px]">
                                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-[28px]">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.8999589340024!2d107.09339207597493!3d10.349883866914617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31756fdc15b97963%3A0xb6e1940f291814cd!2sCh%C3%A2u%20Homestay%20The%20S%C3%B3ng!5e0!3m2!1svi!2s!4v1764315764119!5m2!1svi!2s"
                                        loading="lazy"
                                        allowFullScreen
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="h-full w-full border-0"
                                        aria-label="Bản đồ vị trí Châu Homestay The Sóng"
                                    />
                                </div>
                            </div>
                            <div className="rounded-xl border border-dashed border-[#0055A4]/30 bg-[#f5fbff] p-4 text-xs text-slate-600 sm:rounded-2xl sm:p-5 sm:text-sm lg:rounded-[28px] lg:p-6">
                                <p className="font-semibold text-slate-900">Ghé trực tiếp The Sóng?</p>
                                <p className="mt-2 break-words">
                                    Vui lòng nhắn trước qua Zalo để đội ngũ chuẩn bị thẻ thang máy và hướng dẫn gửi xe. Check-in sớm hoặc check-out muộn
                                    tuỳ theo tình trạng phòng thực tế.
                                </p>
                                <Link
                                    href="https://maps.google.com/?q=Ch%C3%A2u+Homestay+The+S%C3%B3ng"
                                    className="mt-4 inline-flex items-center gap-1 font-semibold text-[#0055A4] transition hover:text-[#003f7f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#92c8ff]"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Mở bản đồ Châu Homestay trên Google Maps"
                                >
                                    Mở trên Google Maps
                                    <span aria-hidden="true">↗</span>
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
};

export default ContactPage;

