"use client";

import React, { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { dataStore } from "@/lib/data-store";
import { BlogPost } from "@/lib/types";

export default function SingleBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [blog, setBlog] = useState<BlogPost | undefined>(() => dataStore.getBlogBySlug(slug));

  useEffect(() => {
    setBlog(dataStore.getBlogBySlug(slug));
    const unsub = dataStore.subscribe(() => {
      setBlog(dataStore.getBlogBySlug(slug));
    });
    return unsub;
  }, [slug]);

  if (!blog) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold">Article not found.</h2>
        <Link href="/shop/blogs" className="text-[#E01B47] underline mt-4 inline-block font-semibold">
          Return to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 max-w-3xl mx-auto pb-32">
      <Link
        href="/shop/blogs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#E01B47] mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Articles
      </Link>

      <span className="text-xs font-extrabold uppercase tracking-widest text-[#E01B47] bg-rose-50 px-3 py-1 rounded-full inline-block mb-4">
        {blog.category}
      </span>

      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
        {blog.title}
      </h1>

      <div className="flex items-center gap-4 text-xs text-gray-500 pb-6 border-b border-gray-100 mb-8">
        <span className="flex items-center gap-1">
          <User className="w-3.5 h-3.5" /> {blog.author}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" /> {blog.publishedAt}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> {blog.readTime}
        </span>
      </div>

      <div className="h-72 sm:h-96 relative rounded-3xl overflow-hidden mb-10 shadow-storeCard">
        <Image src={blog.coverUrl} alt={blog.title} fill className="object-cover" />
      </div>

      <div className="prose max-w-none text-gray-700 text-sm sm:text-base leading-relaxed space-y-4">
        <p className="font-semibold text-gray-900 text-base">{blog.excerpt}</p>
        <p className="whitespace-pre-line">{blog.body}</p>
      </div>

      <div className="mt-14 pt-6 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">Published by Eastern Biochemicals Scientific Desk</span>
        <Link
          href="/shop"
          className="bg-[#E01B47] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#C4153C] transition-colors"
        >
          Explore Wellness Store
        </Link>
      </div>
    </div>
  );
}
