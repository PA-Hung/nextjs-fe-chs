import Image from "next/image";
import Link from "next/link";

import type { BlogTravelPost } from "@/lib/types/blog";

interface BlogTeaserSectionProps {
    posts: BlogTravelPost[];
}

const stripHtml = (html: string): string => {
    if (!html) {
        return "";
    }

    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

export const BlogTeaserSection = ({ posts }: BlogTeaserSectionProps) => {
    if (!posts || posts.length === 0) {
        return null;
    }

    const topPosts = posts.slice(0, 3);

    return (
        <section className="space-y-8 rounded-[40px] bg-white/80 p-8 shadow-xl shadow-slate-200/60">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b88b5a]">
                        Blog du lịch
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                        Gợi ý lịch trình & trải nghiệm gần Châu Homestay
                    </h2>
                    <p className="text-sm text-slate-600">
                        Một vài bài viết để bạn hình dung rõ hơn về lịch trình, địa điểm ăn uống và góc
                        check-in quanh The Sóng và villa.
                    </p>
                </div>
                <Link
                    href="/guide-book"
                    className="hidden items-center text-sm font-semibold text-[#0055A4] underline-offset-4 hover:underline sm:inline-flex"
                >
                    Xem tất cả bài viết
                    <span aria-hidden className="ml-1">
                        →
                    </span>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {topPosts.map((post) => {
                    const excerpt =
                        (post.summary && post.summary.trim().length > 0
                            ? post.summary
                            : stripHtml(post.content).slice(0, 80)) + "...";

                    return (
                        <article
                            key={post._id}
                            className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            {post.coverImage ? (
                                <div className="relative h-40 w-full">
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
                                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#b88b5a]">
                                    Blog du lịch
                                </p>
                                <Link
                                    href={`/guide-book/${post.slug}`}
                                    className="mt-2 line-clamp-2 text-sm font-semibold text-slate-900 hover:text-[#0055A4]"
                                >
                                    {post.title}
                                </Link>
                                <p className="mt-2 line-clamp-3 text-xs text-slate-600">{excerpt}</p>
                                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                                    <time dateTime={post.publishedAt || post.createdAt}>
                                        {new Date(
                                            post.publishedAt || post.createdAt,
                                        ).toLocaleDateString("vi-VN")}
                                    </time>
                                    <span>Châu Homestay</span>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            <div className="flex justify-center sm:hidden">
                <Link
                    href="/guide-book"
                    className="inline-flex items-center text-sm font-semibold text-[#0055A4] underline-offset-4 hover:underline"
                >
                    Xem tất cả bài viết
                    <span aria-hidden className="ml-1">
                        →
                    </span>
                </Link>
            </div>
        </section>
    );
};


