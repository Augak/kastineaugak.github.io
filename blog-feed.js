/* Live Blogger feed for Kastine Augak's portfolio blog.
   Blogger remains the publishing desk; published posts sync here automatically. */
(() => {
  "use strict";

  const BLOG_URL = "https://kastineaugak1.blogspot.com";
  const FEED_URL = BLOG_URL + "/feeds/posts/default?alt=json-in-script&max-results=100&callback=KastineBlog.receive";
  const postsRoot = document.getElementById("blog-posts");
  const status = document.getElementById("blog-status");
  const search = document.getElementById("blog-search");
  const categoriesRoot = document.getElementById("blog-categories");
  const empty = document.getElementById("blog-empty");

  if (!postsRoot || !status) return;

  let posts = [];
  let activeCategory = "All";
  let query = "";

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function cleanArticleHtml(source) {
    const parsed = new DOMParser().parseFromString(String(source || ""), "text/html");
    const allowed = new Set(["P","BR","HR","H2","H3","H4","UL","OL","LI","BLOCKQUOTE","PRE","CODE","STRONG","B","EM","I","U","A","IMG","TABLE","THEAD","TBODY","TR","TH","TD","DIV","SPAN"]);
    const walker = parsed.createTreeWalker(parsed.body, NodeFilter.SHOW_ELEMENT);
    const elements = [];
    while (walker.nextNode()) elements.push(walker.currentNode);
    elements.reverse().forEach((node) => {
      if (!allowed.has(node.tagName)) {
        node.replaceWith(parsed.createTextNode(node.textContent || ""));
        return;
      }
      [...node.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (node.tagName === "A" && name === "href") {
          try {
            const url = new URL(attr.value, BLOG_URL);
            if (url.protocol === "https:" || url.protocol === "http:") {
              node.setAttribute("href", url.href);
              node.setAttribute("target", "_blank");
              node.setAttribute("rel", "noopener noreferrer");
            } else node.removeAttribute("href");
          } catch (_) { node.removeAttribute("href"); }
        } else if (node.tagName === "IMG" && name === "src") {
          try {
            const url = new URL(attr.value, BLOG_URL);
            if (url.protocol === "https:") {
              node.setAttribute("src", url.href);
              node.setAttribute("loading", "lazy");
              node.setAttribute("decoding", "async");
            } else node.removeAttribute("src");
          } catch (_) { node.removeAttribute("src"); }
        } else if (!((node.tagName === "A" && ["href","title"].includes(name)) ||
                     (node.tagName === "IMG" && ["src","alt","title","width","height"].includes(name)))) {
          node.removeAttribute(attr.name);
        }
      });
    });
    return parsed.body.innerHTML;
  }

  function plainText(html) {
    const doc = new DOMParser().parseFromString(String(html || ""), "text/html");
    return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
  }

  function postLink(entry) {
    const link = (entry.link || []).find((item) => item.rel === "alternate" && item.href);
    if (!link) return BLOG_URL;
    try {
      const url = new URL(link.href);
      return url.hostname.endsWith("blogspot.com") || url.hostname === new URL(BLOG_URL).hostname ? url.href : BLOG_URL;
    } catch (_) { return BLOG_URL; }
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently published";
    return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(date);
  }

  function renderCategories() {
    const labels = [...new Set(posts.flatMap((post) => post.labels))].sort((a,b) => a.localeCompare(b));
    categoriesRoot.innerHTML = "";
    ["All", ...labels].forEach((label) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "blog-filter" + (activeCategory === label ? " is-active" : "");
      button.textContent = label;
      button.setAttribute("aria-pressed", String(activeCategory === label));
      button.addEventListener("click", () => {
        activeCategory = label;
        renderCategories();
        renderPosts();
      });
      categoriesRoot.appendChild(button);
    });
  }

  function renderPosts() {
    const filtered = posts.filter((post) => {
      const categoryMatch = activeCategory === "All" || post.labels.includes(activeCategory);
      const text = (post.title + " " + post.excerpt + " " + post.labels.join(" ")).toLowerCase();
      return categoryMatch && text.includes(query);
    });

    postsRoot.innerHTML = "";
    empty.hidden = filtered.length !== 0;
    if (!filtered.length) return;

    filtered.forEach((post) => {
      const article = document.createElement("article");
      article.className = "post-summary live-post";
      const labels = post.labels.length
        ? '<div class="post-labels">' + post.labels.map((label) => '<span>' + escapeHtml(label) + '</span>').join("") + "</div>"
        : "";
      article.innerHTML =
        '<div class="post-meta"><time datetime="' + escapeHtml(post.published) + '">' + escapeHtml(formatDate(post.published)) + '</time><span>•</span><span>' + escapeHtml(post.author) + '</span></div>' +
        '<h3>' + escapeHtml(post.title) + '</h3>' +
        labels +
        '<p class="post-excerpt">' + escapeHtml(post.excerpt || "Open this publication to read the full article.") + '</p>' +
        '<details class="post-reader"><summary>Read full article</summary><div class="post-full-content">' + post.safeContent + '</div><p class="original-link"><a href="' + escapeHtml(post.url) + '" target="_blank" rel="noopener noreferrer">View original publication →</a></p></details>';
      postsRoot.appendChild(article);
    });
  }

  window.KastineBlog = {
    receive(data) {
      const entries = data && data.feed && data.feed.entry ? data.feed.entry : [];
      posts = entries.map((entry) => {
        const content = entry.content && entry.content.$t ? entry.content.$t : (entry.summary && entry.summary.$t ? entry.summary.$t : "");
        const labels = (entry.category || []).map((item) => item.term).filter(Boolean);
        return {
          title: entry.title && entry.title.$t ? entry.title.$t : "Untitled publication",
          published: entry.published && entry.published.$t ? entry.published.$t : "",
          author: entry.author && entry.author[0] && entry.author[0].name ? entry.author[0].name.$t : "Kastine Augak",
          labels,
          excerpt: plainText(content).slice(0, 260),
          safeContent: cleanArticleHtml(content),
          url: postLink(entry)
        };
      });
      status.textContent = posts.length
        ? posts.length + " published article" + (posts.length === 1 ? "" : "s") + " · Live from MediaRecap"
        : "No public articles have been published yet. New posts will appear here automatically.";
      renderCategories();
      renderPosts();
    },
    fail() {
      status.textContent = "The live feed could not be reached right now.";
      postsRoot.innerHTML = '<div class="blog-empty">Please try again later, or <a href="' + BLOG_URL + '" target="_blank" rel="noopener">read MediaRecap directly</a>.</div>';
    }
  };

  if (search) {
    search.addEventListener("input", () => {
      query = search.value.trim().toLowerCase();
      renderPosts();
    });
  }

  const feedScript = document.createElement("script");
  feedScript.src = FEED_URL;
  feedScript.async = true;
  feedScript.onerror = () => window.KastineBlog.fail();
  document.head.appendChild(feedScript);
  window.setTimeout(() => {
    if (status.textContent.includes("Connecting")) window.KastineBlog.fail();
  }, 12000);
})();
