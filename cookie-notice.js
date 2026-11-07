/* Site-wide, lightweight cookie and browser-storage notice. */
(() => {
  "use strict";
  const KEY = "kastine_cookie_notice_dismissed_v1";
  try { if (window.localStorage.getItem(KEY) === "yes") return; } catch (_) {}

  const path = location.pathname;
  const prefix = /\/(posts|amp|blog)\//.test(path) ? "../" : "";
  const style = document.createElement("style");
  style.textContent = `
    .kastine-cookie-notice{position:fixed;z-index:9998;left:18px;right:18px;bottom:18px;max-width:900px;margin:0 auto;padding:18px 20px;display:flex;align-items:center;gap:20px;background:#10251f;color:#f8fafc;border:1px solid rgba(203,213,225,.28);border-radius:10px;box-shadow:0 14px 45px rgba(2,6,23,.28);font:inherit}
    .kastine-cookie-copy{flex:1;min-width:0}
    .kastine-cookie-copy strong{display:block;margin:0 0 5px;font-size:.98rem;letter-spacing:.01em}
    .kastine-cookie-copy p{margin:0;color:#d7e3dd;font-size:.86rem;line-height:1.5}
    .kastine-cookie-copy a{color:#f4d58a;text-decoration:underline;text-underline-offset:3px}
    .kastine-cookie-dismiss{flex:0 0 auto;min-height:40px;padding:9px 17px;border:1px solid #f4d58a;border-radius:6px;background:#f4d58a;color:#172b25;font:inherit;font-size:.88rem;font-weight:700;cursor:pointer}
    .kastine-cookie-dismiss:hover{background:#ffe6a8}
    .kastine-cookie-dismiss:focus-visible,.kastine-cookie-copy a:focus-visible{outline:3px solid #93c5fd;outline-offset:3px}
    @media(max-width:620px){.kastine-cookie-notice{left:10px;right:10px;bottom:10px;padding:15px;gap:12px;align-items:flex-start}.kastine-cookie-notice{flex-direction:column}.kastine-cookie-dismiss{width:100%}}
    @media(prefers-reduced-motion:no-preference){.kastine-cookie-notice{animation:kastine-cookie-in .22s ease-out}@keyframes kastine-cookie-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}}
  `;
  document.head.appendChild(style);

  const notice = document.createElement("aside");
  notice.className = "kastine-cookie-notice";
  notice.setAttribute("role", "region");
  notice.setAttribute("aria-label", "Cookie and browser storage notice");
  notice.innerHTML = '<div class="kastine-cookie-copy"><strong>Cookies &amp; similar technologies</strong><p>This site uses essential browser storage (including local storage, which works similarly to cookies) to remember preferences and help prevent repeated reactions. We also record article activity such as page views, reactions, downloads and shares to understand how the publication is used. If you choose a translated version, Google Translate may use its own cookies to provide the translation service. <a href="' + privacyUrl + '">Read our Privacy Notice</a>.</p></div><button class="kastine-cookie-dismiss" type="button">Got it</button>';
  document.body.appendChild(notice);

  const dismiss = () => {
    notice.remove();
    try { window.localStorage.setItem(KEY, "yes"); } catch (_) {}
  };
  notice.querySelector("button").addEventListener("click", dismiss);
})();