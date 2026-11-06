/* Article engagement for crawlable static article pages.
   Uses the same public Supabase tables and RPCs as blog-feed.js. */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.0/+esm";

(() => {
  "use strict";
  const slug = document.body.dataset.articleSlug;
  if (!slug) return;

  const SUPABASE_URL = "https://wgmitkwpxfpivwtnfhlg.supabase.co";
  const SUPABASE_KEY = "sb_publishable_FWlyszb9Zqa-t1CUqXBj6w_8jQUQzbl";
  const db = createClient(SUPABASE_URL, SUPABASE_KEY);
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
  const compact = (value) => {
    const n = Number(value || 0);
    return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(".0", "") + "k" : n.toLocaleString();
  };
  const makeId = () => {
    try { return crypto.randomUUID(); }
    catch (_) { return "v" + Math.random().toString(36).slice(2) + Date.now().toString(36); }
  };
  function visitorKey() {
    try {
      let value = localStorage.getItem("kastine_blog_visitor") || "";
      if (!value) {
        value = makeId() + makeId().slice(0, 8);
        localStorage.setItem("kastine_blog_visitor", value);
      }
      return value;
    } catch (_) { return makeId() + makeId().slice(0, 8); }
  }
  const visitor = visitorKey();
  const article = document.querySelector("main article");
  const title = document.querySelector("main article h1")?.textContent?.trim() || document.title;
  const articleText = () => document.querySelector(".article-body")?.innerText || "";

  async function logEvent(type) {
    try {
      await db.from("article_events").insert({
        article_slug: slug, event_type: type, visitor_key: visitor
      });
    } catch (_) {}
  }

  async function refreshStats() {
    try {
      const results = await Promise.all([
        db.rpc("get_public_article_stats", { p_slug: slug }),
        db.rpc("get_public_article_love_count", { p_slug: slug })
      ]);
      if (results[0].error) throw results[0].error;
      if (results[1].error) throw results[1].error;
      const stats = results[0].data?.[0] || {};
      document.querySelectorAll("[data-stat]").forEach((el) => {
        const key = el.dataset.stat;
        el.textContent = key === "loves" ? compact(results[1].data || 0) : Number(stats[key] || 0).toLocaleString();
      });
    } catch (_) {
      document.querySelectorAll("[data-stat]").forEach((el) => {
        if (el.textContent === "—") el.textContent = "—";
      });
    }
  }

  async function loadComments() {
    const list = $("comment-list");
    if (!list) return;
    list.innerHTML = '<p class="comment-empty">Loading the discussion…</p>';
    try {
      const result = await db.from("article_comments")
        .select("id,display_name,comment_text,created_at")
        .eq("article_slug", slug)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(100);
      if (result.error) throw result.error;
      const comments = result.data || [];
      if (!comments.length) {
        list.innerHTML = '<p class="comment-empty">No comments yet. Be the first to start a thoughtful discussion.</p>';
        return;
      }
      const ids = comments.map((comment) => comment.id);
      const countResult = await db.rpc("get_public_comment_reaction_counts", { p_comment_ids: ids });
      const counts = {};
      (countResult.data || []).forEach((item) => {
        (counts[item.comment_id] ||= {})[item.reaction] = Number(item.reaction_count || 0);
      });
      list.innerHTML = comments.map((comment) => {
        const reactions = counts[comment.id] || {};
        const when = new Date(comment.created_at).toLocaleString();
        return '<article class="public-comment" data-comment-id="' + esc(comment.id) + '">' +
          '<div class="public-comment-heading"><strong>' + esc(comment.display_name) + '</strong><time datetime="' + esc(comment.created_at) + '">' + esc(when) + '</time></div>' +
          '<p>' + esc(comment.comment_text).replace(/\n/g, "<br>") + '</p>' +
          '<div class="comment-reactions" aria-label="React to this comment">' +
          '<button type="button" data-comment-reaction="love" aria-label="Love comment">♥️ <span>' + compact(reactions.love) + '</span></button>' +
          '<button type="button" data-comment-reaction="like" aria-label="Like comment">👍 <span>' + compact(reactions.like) + '</span></button>' +
          '<button type="button" data-comment-reaction="insightful" aria-label="Insightful comment">💡 <span>' + compact(reactions.insightful) + '</span></button>' +
          '<button type="button" data-comment-reaction="useful" aria-label="Useful comment">👏 <span>' + compact(reactions.useful) + '</span></button>' +
          '</div></article>';
      }).join("");
      list.querySelectorAll("[data-comment-reaction]").forEach((button) => {
        button.addEventListener("click", async () => {
          const comment = button.closest("[data-comment-id]");
          const message = $("comment-message");
          button.disabled = true;
          if (message) message.textContent = "Saving your reaction…";
          try {
            const response = await db.from("article_comment_reactions").insert({
              comment_id: comment.dataset.commentId,
              visitor_key: visitor,
              reaction: button.dataset.commentReaction
            });
            if (response.error) {
              if (message) message.textContent = response.error.code === "23505"
                ? "You have already reacted to this comment on this browser."
                : "Your reaction could not be saved. Please try again.";
              return;
            }
            if (message) message.textContent = "Thank you for supporting the discussion.";
            await loadComments();
          } catch (_) {
            if (message) message.textContent = "The reaction could not be saved. Check your connection and try again.";
          } finally { button.disabled = false; }
        });
      });
    } catch (_) {
      list.innerHTML = '<p class="comment-empty">The discussion is temporarily unavailable. Please refresh and try again.</p>';
    }
  }

  document.querySelectorAll("[data-reaction]").forEach((button) => {
    button.addEventListener("click", async () => {
      const message = $("reaction-message");
      const buttons = [...document.querySelectorAll("[data-reaction]")];
      buttons.forEach((item) => { item.disabled = true; });
      if (message) message.textContent = "Saving your reaction…";
      try {
        const response = await db.from("article_reactions").insert({
          article_slug: slug, visitor_key: visitor, reaction: button.dataset.reaction
        });
        if (response.error) {
          if (message) message.textContent = response.error.code === "23505"
            ? "You have already reacted to this article on this browser."
            : "Your reaction could not be saved. Please try again.";
          return;
        }
        if (message) message.textContent = "Thank you for your reaction.";
        await refreshStats();
      } catch (_) {
        if (message) message.textContent = "The reaction could not be saved. Check your connection and try again.";
      } finally { buttons.forEach((item) => { item.disabled = false; }); }
    });
  });

  const form = $("comment-form");
  if (form) form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = $("comment-name").value.trim();
    const body = $("comment-text").value.trim();
    const message = $("comment-message");
    const button = form.querySelector('button[type="submit"]');
    if (name.length < 2 || body.length < 3) {
      if (message) message.textContent = "Please enter your name and a comment of at least three characters.";
      return;
    }
    button.disabled = true;
    button.textContent = "Posting…";
    if (message) message.textContent = "Sending your comment…";
    try {
      const response = await db.from("article_comments").insert({
        article_slug: slug,
        display_name: name,
        comment_text: body,
        status: "published"
      });
      if (response.error) {
        if (message) message.textContent = "Your comment could not be posted. Please try again.";
        return;
      }
      $("comment-text").value = "";
      if (message) message.textContent = "Your comment is now public. Thank you for joining the conversation.";
      await logEvent("comment");
      await loadComments();
      await refreshStats();
    } catch (_) {
      if (message) message.textContent = "Your comment could not be sent. Check your connection and try again.";
    } finally {
      button.disabled = false;
      button.textContent = "Post comment";
    }
  });

  const download = (filename, content, type) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
    logEvent("download");
  };
  $("download-text")?.addEventListener("click", () => {
    download((slug || "article") + ".txt", title + "\n\n" + articleText(), "text/plain;charset=utf-8");
  });
  $("download-html")?.addEventListener("click", () => {
    const page = article ? article.outerHTML : document.body.innerHTML;
    const html = '<!doctype html><html lang="en"><meta charset="utf-8"><title>' + esc(title) +
      '</title><body><main>' + page + '</main></body></html>';
    download((slug || "article") + ".html", html, "text/html;charset=utf-8");
  });
  $("print-article")?.addEventListener("click", () => {
    logEvent("print");
    window.print();
  });
  $("share-article")?.addEventListener("click", async () => {
    await logEvent("share");
    const data = { title, text: document.querySelector(".intro")?.textContent || title, url: location.href };
    const message = $("share-message");
    if (navigator.share) {
      try { await navigator.share(data); if (message) message.textContent = "Thanks for sharing."; }
      catch (_) {}
    } else if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(location.href); if (message) message.textContent = "Article link copied. You can now share it."; }
      catch (_) { window.prompt("Copy this article link:", location.href); }
    } else window.prompt("Copy this article link:", location.href);
  });
  $("open-discussion")?.addEventListener("click", () => {
    logEvent("discussion_open");
    $("article-discussion")?.scrollIntoView({ behavior: "smooth", block: "start" });
    $("comment-name")?.focus({ preventScroll: true });
  });

  logEvent("view");
  refreshStats();
  loadComments();
})();