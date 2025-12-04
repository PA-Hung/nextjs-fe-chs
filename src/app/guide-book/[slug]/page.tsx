import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBlogPostBySlug } from "@/lib/api/blog";
import { generateArticleSchema, type ArticleSchema } from "@/lib/seo/jsonld";
import { generateSeoMetadata } from "@/lib/seo/metadata";
import type { BlogTravelPost } from "@/lib/types/blog";

const pageBackgroundStyle = {
    backgroundImage:
        "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.6), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.35), transparent 40%), linear-gradient(180deg, #CCE9FF 0%, #E1F2FF 45%, #FFF7EA 100%)",
};

interface GuideBookPostPageProps {
    params: Promise<{ slug: string }>;
}

const stripHtml = (html: string): string => {
    if (!html) {
        return "";
    }

    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

const resolveImageUrl = (url: string | undefined | null): string | undefined => {
    if (!url) {
        return undefined;
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    // Giả sử url là path tương đối từ root
    return `https://chauhomestay.com${url.startsWith("/") ? url : `/${url}`}`;
};

export const generateMetadata = async ({
    params,
}: GuideBookPostPageProps): Promise<Metadata> => {
    const { slug } = await params;

    try {
        const post = await getBlogPostBySlug(slug);
        const description =
            post.summary && post.summary.trim().length > 0
                ? post.summary
                : stripHtml(post.content).slice(0, 160);

        const ogImage = resolveImageUrl(post.coverImage);

        return generateSeoMetadata(
            {
                title: post.title,
                description,
                image: ogImage,
                url: `/guide-book/${slug}`,
                type: "article",
                publishedTime: post.publishedAt || post.createdAt,
                modifiedTime: post.updatedAt,
                author: "Châu Homestay",
                tags: ["guide book", "vũng tàu", "hướng dẫn", "chau homestay"],
            },
            "https://chauhomestay.com",
        );
    } catch (error) {
        if (error instanceof Error && error.message === "BLOG_POST_NOT_FOUND") {
            return {
                title: "Không tìm thấy bài viết",
                description: "Bài viết bạn đang tìm không tồn tại hoặc chưa được publish.",
            };
        }

        return {
            title: "Có lỗi xảy ra",
            description: "Không thể tải nội dung bài viết vào lúc này.",
        };
    }
};

const createArticleSchema = (post: BlogTravelPost, slug: string): ArticleSchema => {
    const coverImageUrl = resolveImageUrl(post.coverImage) ?? "";

    return {
        headline: post.title,
        description:
            post.summary && post.summary.trim().length > 0
                ? post.summary
                : stripHtml(post.content).slice(0, 200),
        image: coverImageUrl,
        datePublished: post.publishedAt || post.createdAt,
        dateModified: post.updatedAt,
        author: {
            name: "Châu Homestay",
            url: "https://chauhomestay.com",
        },
        publisher: {
            name: "Châu Homestay",
            logo: {
                url: "https://chauhomestay.com/logo.png",
                width: 200,
                height: 200,
            },
        },
        url: `https://chauhomestay.com/guide-book/${slug}`,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://chauhomestay.com/guide-book/${slug}`,
        },
    };
};

const GuideBookPostPage = async ({ params }: GuideBookPostPageProps) => {
    const { slug } = await params;

    let post: BlogTravelPost;
    try {
        post = await getBlogPostBySlug(slug);
    } catch (error) {
        if (error instanceof Error && error.message === "BLOG_POST_NOT_FOUND") {
            notFound();
        }

        throw error;
    }

    const articleSchema = createArticleSchema(post, slug);

    const publishedDate = post.publishedAt || post.createdAt;

    return (
        <>
            <JsonLd data={generateArticleSchema(articleSchema)} />
            <div className="min-h-screen text-slate-900" style={pageBackgroundStyle}>
                <SiteHeader />
                <main className="mx-auto flex max-w-6xl flex-col px-4 pt-4 pb-12 sm:px-6 lg:px-8 lg:pt-3 lg:pb-16">
                    <Breadcrumb
                        items={[
                            { label: "Trang chủ", href: "/" },
                            { label: "Guide Book", href: "/guide-book" },
                            { label: post.title },
                        ]}
                    />
                    <section className="rounded-[40px] bg-white/80 p-6 shadow-xl shadow-slate-200/60 sm:p-10">
                        <article className="mx-auto max-w-3xl">
                            <header className="mb-8">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b88b5a]">
                                    Guide Book
                                </p>
                                <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
                                    {post.title}
                                </h1>
                                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                                    <time dateTime={publishedDate}>
                                        {new Date(publishedDate).toLocaleDateString("vi-VN")}
                                    </time>
                                    <span aria-hidden="true">•</span>
                                    <span>Châu Homestay</span>
                                </div>
                                {post.summary ? (
                                    <p className="mt-4 text-base text-slate-700">{post.summary}</p>
                                ) : null}
                            </header>

                            {post.coverImage ? (
                                <div className="mb-8 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
                                    <div className="relative h-64 w-full sm:h-80">
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 768px"
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            ) : null}

                            <section
                                className="ck-content prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-[#0055A4] prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-img:rounded-2xl"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </article>
                    </section>
                </main>
                <SiteFooter />
            </div>
        </>
    );
};

export default GuideBookPostPage;

