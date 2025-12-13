import type { Metadata } from "next";
import Link from "next/link";
import { FaFire, FaSmoking, FaDog, FaVolumeUp, FaBan } from "react-icons/fa";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

const beachBackgroundStyle = {
    backgroundImage:
        "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.6), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.4), transparent 40%), linear-gradient(180deg, #E8F6FF 0%, #F5FBFF 45%, #FFF7EA 100%)",
};

export const metadata: Metadata = {
    title: "Nội quy lưu trú tại Châu Homestay Vũng Tàu",
    description:
        "Nội quy lưu trú tại Châu Homestay Vũng Tàu giúp kỳ nghỉ của bạn và mọi người xung quanh thoải mái, an toàn và văn minh hơn.",
    openGraph: {
        title: "Nội quy lưu trú tại Châu Homestay Vũng Tàu",
        description:
            "Nội quy lưu trú tại Châu Homestay Vũng Tàu giúp kỳ nghỉ của bạn và mọi người xung quanh thoải mái, an toàn và văn minh hơn.",
        url: "https://chauhomestay.com/noi-quy",
        type: "website",
    },
    alternates: {
        canonical: "/noi-quy",
    },
};

export default function AccommodationRulesPage() {
    return (
        <div className="min-h-screen text-slate-900" style={beachBackgroundStyle}>
            <SiteHeader />
            <main className="mx-auto max-w-5xl px-4 pt-4 pb-12 sm:px-6 lg:px-8 lg:pt-3 lg:pb-16">
                <Breadcrumb
                    items={[
                        { label: "Trang chủ", href: "/" },
                        { label: "Nội quy lưu trú" },
                    ]}
                />

                <section className="space-y-8 rounded-[48px] bg-white/85 p-6 shadow-2xl shadow-slate-200/70 ring-1 ring-white/60 lg:p-12">
                    {/* Header */}
                    <header className="space-y-4 text-center">
                        <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Quy định & Nội quy</p>
                        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl lg:text-5xl">
                            Nội quy lưu trú Châu Homestay
                        </h1>
                        <p className="text-base text-slate-600 md:text-lg">Accommodation Rules</p>
                    </header>

                    {/* Time Info Cards */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 ring-1 ring-blue-200/50">
                            <div className="mb-2 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-slate-900">NHẬN NHÀ</h2>
                            </div>
                            <p className="text-sm text-slate-600">Check-in time</p>
                            <p className="mt-2 text-2xl font-bold text-blue-600">Từ 14:00</p>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 ring-1 ring-amber-200/50">
                            <div className="mb-2 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-slate-900">TRẢ NHÀ</h2>
                            </div>
                            <p className="text-sm text-slate-600">Check-out time</p>
                            <p className="mt-2 text-2xl font-bold text-amber-600">Trước 12:00</p>
                        </div>
                    </div>

                    {/* Rules List */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-slate-900">Quy định chung / General Rules</h2>

                        <div className="space-y-4">
                            {/* Rule 1 */}
                            <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50/50 p-5">
                                <div className="space-y-2">
                                    <p className="font-semibold text-slate-900">
                                        Quý khách xuất trình hộ chiếu hoặc căn cước công dân để làm thủ tục nhận phòng và đăng ký lưu trú theo quy định của pháp luật.
                                    </p>
                                    <p className="text-sm italic text-slate-600">
                                        Kindly present your passport with the valid entry visa for the check-in procedure.
                                    </p>
                                </div>
                            </div>

                            {/* Rule 2 */}
                            <div className="rounded-xl border-l-4 border-red-500 bg-red-50/50 p-5">
                                <div className="space-y-2">
                                    <p className="font-semibold text-slate-900">
                                        Không mang súng đạn, chất cháy nổ, chất độc hại, các chất gây nghiện, vật nuôi hoặc thực phẩm có mùi tanh hôi vào phòng.
                                    </p>
                                    <p className="text-sm italic text-slate-600">
                                        Do not bring firearms, explosives, toxic substances, addictive substances, pets or food with a bad smell into the room.
                                    </p>
                                </div>
                            </div>

                            {/* Rule 3 */}
                            <div className="rounded-xl border-l-4 border-red-500 bg-red-50/50 p-5">
                                <div className="space-y-2">
                                    <p className="font-semibold text-slate-900">
                                        Không sử dụng ma túy, không tổ chức đánh bạc và các tệ nạn xã hội khác.
                                    </p>
                                    <p className="text-sm italic text-slate-600">
                                        Do not have drugs, do not organize gambling and other social evils.
                                    </p>
                                </div>
                            </div>

                            {/* Rule 4 */}
                            <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50/50 p-5">
                                <div className="space-y-2">
                                    <p className="font-semibold text-slate-900">
                                        Không thay đổi, di chuyển đồ đạc trong phòng hoặc từ phòng này sang phòng khác. Trường hợp tài sản, đồ dùng trong phòng bị mất, hỏng do Quý khách gây ra sẽ phải bồi thường 100% giá trị.
                                    </p>
                                    <p className="text-sm italic text-slate-600">
                                        Do not change or move the furniture and equipment from one place to another. Guest with being liable to indemnify the host at current prices for any losses or damages caused.
                                    </p>
                                </div>
                            </div>

                            {/* Rule 5 */}
                            <div className="rounded-xl border-l-4 border-red-500 bg-red-50/50 p-5">
                                <div className="space-y-2">
                                    <p className="font-semibold text-slate-900">
                                        Không đưa thêm người vào phòng khi chưa đăng ký trước với chủ nhà. Nếu vi phạm mức phạt hành chính có thể lên đến 5 triệu vnđ/người.
                                    </p>
                                    <p className="text-sm italic text-slate-600">
                                        Please do not get more people in the room without prior notice to host. The fine will be 15 milion vnđ per case.
                                    </p>
                                </div>
                            </div>

                            {/* Rule 6 */}
                            <div className="rounded-xl border-l-4 border-red-500 bg-red-50/50 p-5">
                                <div className="space-y-2">
                                    <p className="font-semibold text-slate-900">
                                        Không hút thuốc, hoặc gây khói ở trong phòng và khu vực cấm vì sẽ làm kích hoạt hệ thống báo cháy hoạt động. Nếu vi phạm mức phạt hành chính sẽ là từ 2 triệu vnđ.
                                    </p>
                                    <p className="text-sm italic text-slate-600">
                                        Do not smoking in the room or forbidden places. The fine will be 2 milion vnđ in case.
                                    </p>
                                </div>
                            </div>

                            {/* Rule 7 */}
                            <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50/50 p-5">
                                <div className="space-y-2">
                                    <p className="font-semibold text-slate-900">
                                        Thời gian trả phòng là 11h00, nếu muộn hơn quý khách sẽ phải thanh toán thêm phụ phí là 250.000vnđ/giờ. Trong trường hợp cần thiết, vui lòng liên hệ với chúng tôi để được đồng ý và hỗ trợ checkout muộn mức phí phù hợp.
                                    </p>
                                    <p className="text-sm italic text-slate-600">
                                        Check-out time is 11noon, otherwise, overtime surcharge will be 250.000 vnđ/hour
                                    </p>
                                </div>
                            </div>

                            {/* Rule 8 */}
                            <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50/50 p-5">
                                <div className="space-y-2">
                                    <p className="font-semibold text-slate-900">
                                        Trước khi trả nhà, quý khách vui lòng báo trước 15 phút, thanh toán toàn bộ các hoá đơn và trả lại chìa khoá phòng cho chủ nhà.
                                    </p>
                                    <p className="text-sm italic text-slate-600">
                                        Prior to leaving the apartment, please kindly announce 15 minutes, pay all bills and return keys to host.
                                    </p>
                                </div>
                            </div>

                            {/* Rule 9 */}
                            <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50/50 p-5">
                                <div className="space-y-2">
                                    <p className="font-semibold text-slate-900">
                                        Để rác đúng nơi quy định tại phòng rác. Trả lại bếp sạch sẽ ngăn nắp sau khi sử dụng. Phụ phí dọn rác hoặc dọn bếp (nếu có) sẽ là từ 300.000đ tuỳ theo mức độ.
                                    </p>
                                    <p className="text-sm italic text-slate-600">
                                        Please keep hygienic, put garbage in the right place in the garbage room. Leave the kitchen clean and tidy after use. Sercharge will be from 300.000đ for cleaning the kitchen.
                                    </p>
                                </div>
                            </div>

                            {/* Rule 10 */}
                            <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50/50 p-5">
                                <div className="space-y-2">
                                    <p className="font-semibold text-slate-900">
                                        Quý khách giữ gìn vệ sinh nơi ở và cả nơi cộng cộng, không mặc đồ còn ướt sau khi đi bơi, đi tắm biển về vào sảnh, thang máy, hành lang, lên căn hộ.
                                    </p>
                                    <p className="text-sm italic text-slate-600">
                                        Please keep the apartment and the community area be clean, don't wear wet clothes in hallways, reception hall, elevators…
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="rounded-2xl bg-gradient-to-br from-[#b88b5a]/10 to-[#b88b5a]/5 p-6 ring-1 ring-[#b88b5a]/20">
                        <p className="mb-2 text-center text-sm text-slate-600">
                            Nếu quý khách cần sự hỗ trợ, xin vui lòng gọi đến số:
                        </p>
                        <p className="mb-1 text-center text-sm italic text-slate-600">
                            If you need any support, contact no.:
                        </p>
                        <a
                            href="tel:0963686963"
                            className="block text-center text-2xl font-bold text-[#b88b5a] transition hover:text-[#a67a4a]"
                        >
                            0963.6869.63
                        </a>
                        <p className="mt-2 text-center text-sm text-slate-600">(ms.Thảo)</p>
                        <p className="mt-4 text-center text-base font-semibold text-slate-900">
                            Chúc Quý khách một kỳ nghỉ vui vẻ ! Enjoy your stay with us !
                        </p>
                    </div>

                    {/* Fee Table */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-slate-900">Biểu phí / Charge</h2>

                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Nội dung</th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">Mức phí</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm text-slate-700">
                                            Gây hư hại cơ sở vật chất, nôn mửa bẩn, phải đền bù
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-red-600">100% giá trị</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm text-slate-700">
                                            Gây khói, lửa làm kích hoạt báo cháy (mức phạt từ)
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-red-600">2.000.000 đ</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm text-slate-700">
                                            Không bỏ rác đúng theo quy định (khu vực công cộng)
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-amber-600">500.000 đ</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm text-slate-700">Không dọn rác, bày bừa rác trong phòng</td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-amber-600">300.000 đ</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm text-slate-700">Không dọn rửa bếp, trả lại bếp ngăn nắp</td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-amber-600">300.000 đ</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm text-slate-700">
                                            Nếu tự ý thêm khách vào lưu trú mà không báo với chủ nhà để đăng ký, phí phạt hành chính sẽ là từ
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-red-600">đến 4 triệu đồng/người</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm text-slate-700">Phụ thu thêm mỗi khách phát sinh</td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-amber-600">200.000 đ</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm text-slate-700">Không cho phép thú cưng, nếu phát hiện phí phụ thu sẽ là</td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-red-600">2.000.000 đ</td>
                                    </tr>
                                    <tr className="bg-red-50/50">
                                        <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                                            Tuyệt đối không tổ chức đánh bạc, sử dụng chất cấm, mại dâm, bay nhảy, tệ nạn
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-red-600">Theo quy định của Pháp luật</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-6 text-center">
                            <h3 className="mb-2 text-lg font-semibold text-slate-900">PHỤ PHÍ QUÁ GIỜ</h3>
                            <p className="mb-1 text-sm text-slate-600">Over time sur-charge</p>
                            <p className="text-sm font-medium text-slate-700">Niêm yết tại chỗ ở</p>
                            <p className="text-xs text-slate-500">Listing at accommodation</p>
                        </div>

                        <div className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-6 text-center">
                            <h3 className="mb-2 text-lg font-semibold text-slate-900">PHÍ GỬI XE</h3>
                            <p className="mb-1 text-sm text-slate-600">Parking fee</p>
                            <div className="space-y-1 text-sm text-slate-700">
                                <p className="font-medium">
                                    Ô tô/car: <span className="text-slate-600">Tuỳ theo từng địa điểm</span>
                                </p>
                                <p className="font-medium">
                                    Xe máy/motobike: <span className="text-slate-600">Tuỳ theo từng địa điểm</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Prohibition Icons */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-slate-900">Các quy định cấm / Prohibitions</h3>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {/* No Fire/Smoke */}
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-red-200 bg-red-50/50 p-6">
                                <div className="relative mb-3 flex h-16 w-16 items-center justify-center">
                                    {/* Prohibition circle with diagonal line */}
                                    <FaBan className="absolute h-16 w-16 text-red-500" />
                                    {/* Flame icon */}
                                    <FaFire className="relative h-10 w-10 text-slate-800" />
                                </div>
                                <p className="text-center text-xs font-semibold text-slate-900">Không lửa/khói</p>
                                <p className="mt-1 text-center text-xs text-slate-600">No Fire/Smoke</p>
                            </div>

                            {/* No Smoking */}
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-red-200 bg-red-50/50 p-6">
                                <div className="relative mb-3 flex h-16 w-16 items-center justify-center">
                                    {/* Prohibition circle with diagonal line */}
                                    <FaBan className="absolute h-16 w-16 text-red-500" />
                                    {/* Cigarette icon */}
                                    <FaSmoking className="relative h-10 w-10 text-slate-800" />
                                </div>
                                <p className="text-center text-xs font-semibold text-slate-900">Không hút thuốc</p>
                                <p className="mt-1 text-center text-xs text-slate-600">No Smoking</p>
                            </div>

                            {/* No Pets */}
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-red-200 bg-red-50/50 p-6">
                                <div className="relative mb-3 flex h-16 w-16 items-center justify-center">
                                    {/* Prohibition circle with diagonal line */}
                                    <FaBan className="absolute h-16 w-16 text-red-500" />
                                    {/* Dog/Pet icon */}
                                    <FaDog className="relative h-10 w-10 text-slate-800" />
                                </div>
                                <p className="text-center text-xs font-semibold text-slate-900">Không thú cưng</p>
                                <p className="mt-1 text-center text-xs text-slate-600">No Pets</p>
                            </div>

                            {/* No Loud Noise */}
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-red-200 bg-red-50/50 p-6">
                                <div className="relative mb-3 flex h-16 w-16 items-center justify-center">
                                    {/* Prohibition circle with diagonal line */}
                                    <FaBan className="absolute h-16 w-16 text-red-500" />
                                    {/* Volume/Speaker icon */}
                                    <FaVolumeUp className="relative h-10 w-10 text-slate-800" />
                                </div>
                                <p className="text-center text-xs font-semibold text-slate-900">Không ồn ào</p>
                                <p className="mt-1 text-center text-xs text-slate-600">No Loud Noise</p>
                                <p className="mt-2 text-center text-xs font-semibold text-amber-600">22:00 – 06:00</p>
                            </div>
                        </div>
                    </div>

                    {/* Quiet Hours */}
                    <div className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-6 text-center">
                        <p className="text-lg font-semibold text-slate-900">Giờ yên tĩnh / Quiet Hours</p>
                        <p className="mt-2 text-2xl font-bold text-amber-600">22:00 – 06:00</p>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}

