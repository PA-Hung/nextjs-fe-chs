import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Pagination } from "@/components/common/Pagination";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getBlogTravelPosts } from "@/lib/api/blog-list";
import type { BlogTravelPost } from "@/lib/types/blog";

export const metadata: Metadata = {
    title: "Blog du lịch Vũng Tàu",
    description:
        "Các bài viết chia sẻ kinh nghiệm du lịch Vũng Tàu, gợi ý lịch trình, địa điểm ăn uống và trải nghiệm gần Châu Homestay.",
};

const stripHtml = (html: string): string => {
    if (!html) {
        return "";
    }

    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

interface BlogListPageProps {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined;
    }>;
}

const pageBackgroundStyle = {
    backgroundImage:
        "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.6), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.35), transparent 40%), linear-gradient(180deg, #CCE9FF 0%, #E1F2FF 45%, #FFF7EA 100%)",
};

const BlogListPage = async ({ searchParams }: BlogListPageProps) => {
    const resolvedSearchParams = await searchParams;
    const currentParam = resolvedSearchParams?.current;
    const currentPage =
        typeof currentParam === "string" && Number.isFinite(Number(currentParam)) && Number(currentParam) > 0
            ? Number(currentParam)
            : 1;

    const pageSize = 9;

    let posts: BlogTravelPost[] = [];
    let totalPages = 1;

    try {
        const data = await getBlogTravelPosts({ current: currentPage, pageSize });
        posts = data.result;
        totalPages = data.meta.pages || 1;
    } catch {
        // Nếu lỗi, để posts rỗng, UI sẽ hiển thị message nhẹ nhàng
    }

    return (
        <div className="min-h-screen text-slate-900" style={pageBackgroundStyle}>
            <SiteHeader />
            <main className="mx-auto flex max-w-6xl flex-col px-4 pt-4 pb-12 sm:px-6 lg:px-8 lg:pt-3 lg:pb-16">
                <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Blog du lịch" }]} />
                <section className="space-y-6 rounded-[40px] bg-white/80 p-6 shadow-xl shadow-slate-200/60 sm:p-10">
                    <header className="space-y-3 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b88b5a]">
                            Blog du lịch
                        </p>
                        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                            Cẩm nang du lịch Vũng Tàu cùng Châu Homestay
                        </h1>
                        <p className="text-base text-slate-600">
                            Tổng hợp kinh nghiệm, lịch trình gợi ý và những điểm đến thú vị gần căn hộ The Sóng
                            và villa của Châu Homestay.
                        </p>
                    </header>

                    {posts.length === 0 ? (
                        <p className="mt-8 text-center text-sm text-slate-500">
                            Hiện chưa có bài viết nào. Vui lòng quay lại sau.
                        </p>
                    ) : (
                        <>
                            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {posts.map((post) => {
                                    const excerpt =
                                        (post.summary && post.summary.trim().length > 0
                                            ? post.summary
                                            : stripHtml(post.content).slice(0, 50)) + "...";

                                    return (
                                        <article
                                            key={post._id}
                                            className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                        >
                                            {post.coverImage ? (
                                                <div className="relative h-48 w-full">
                                                    <Image
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : null}
                                            <div className="flex flex-1 flex-col p-5">
                                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b88b5a]">
                                                    Blog du lịch
                                                </p>
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    className="mt-2 text-base font-semibold text-slate-900 transition hover:text-[#0055A4]"
                                                >
                                                    {post.title}
                                                </Link>
                                                <p className="mt-3 line-clamp-3 text-sm text-slate-600">{excerpt}</p>
                                                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                                                    <time dateTime={post.publishedAt || post.createdAt}>
                                                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
                                                            "vi-VN",
                                                        )}
                                                    </time>
                                                    <span>Châu Homestay</span>
                                                </div>
                                                <div className="mt-4">
                                                    <Link
                                                        href={`/blog/${post.slug}`}
                                                        className="inline-flex items-center text-sm font-semibold text-[#0055A4] underline-offset-4 hover:underline"
                                                    >
                                                        Đọc tiếp
                                                        <span aria-hidden className="ml-1">
                                                            →
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            <div className="mt-10 flex justify-center">
                                <Pagination
                                    current={currentPage}
                                    totalPages={totalPages}
                                    basePath="/blog"
                                    // Giữ pageSize trong query để nếu sau này BE/FE dùng lại sẽ không mất
                                    query={{ pageSize: String(pageSize) }}
                                />
                            </div>
                        </>
                    )}
                </section>
            </main>
            <SiteFooter />
        </div>
    );
};

export default BlogListPage;


