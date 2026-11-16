"use client";

import { useActionState } from "react";
import { saveArticle, type ActionState } from "@/lib/actions/admin";
import type { Article } from "@/lib/types";

export function ArticleForm({ article }: { article?: Article }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveArticle, null);

  return (
    <form action={action} className="card max-w-3xl space-y-4 p-5">
      {article && <input type="hidden" name="id" value={article.id} />}
      {article?.published_at && <input type="hidden" name="published_at" value={article.published_at} />}

      <div>
        <label className="label" htmlFor="title">Title *</label>
        <input id="title" name="title" required defaultValue={article?.title} className="input" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="slug">URL slug</label>
          <input id="slug" name="slug" defaultValue={article?.slug} placeholder="auto from title" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="cover_image_url">Cover image URL</label>
          <input id="cover_image_url" name="cover_image_url" type="url" defaultValue={article?.cover_image_url ?? ""} className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="excerpt">Excerpt (used for listing & SEO description)</label>
        <textarea id="excerpt" name="excerpt" rows={2} defaultValue={article?.excerpt} className="input" />
      </div>
      <div>
        <label className="label" htmlFor="content">Content (Markdown)</label>
        <textarea id="content" name="content" rows={18} defaultValue={article?.content} className="input font-mono text-sm" />
        <p className="mt-1 text-xs text-muted">
          Supports Markdown: ## Heading, **bold**, *italic*, - lists, [links](https://…), &gt; quotes, tables.
        </p>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={article?.published} className="h-4 w-4" />
        Published (visible on the website)
      </label>

      {state && !state.ok && <p className="text-sm text-red-600" role="alert">{state.message}</p>}
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Saving…" : article ? "Save changes" : "Create article"}
      </button>
    </form>
  );
}
