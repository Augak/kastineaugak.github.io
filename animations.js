/* Kastine Augak portfolio motion add-on.
   Progressive enhancement only: no content is hidden if a library or WebGL is unavailable. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var saveData = Boolean(connection && connection.saveData);
  var canUseThree = window.innerWidth > 768 && !saveData && !reduceMotion;

  /* Start the CSS hero entrance immediately; it does not depend on a CDN. */
  document.documentElement.classList.add("ka-motion-enabled");

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function animatePage() {
    if (reduceMotion || !window.gsap) return;
    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    /* Hero entrance is handled by local CSS so it works even if GSAP/CDN fails. */

    if (!window.ScrollTrigger) return;
    var headings = gsap.utils.toArray(
      "main > section:not(.hero-section) .container > h2, " +
      "main > section:not(.hero-section) .container > .section-intro, " +
      "main > section:not(.hero-section) .container > p:first-of-type"
    );
    headings.forEach(function (element) {
      gsap.from(element, {
        y: 22,
        opacity: 0,
        duration: .7,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: element, start: "top 88%", once: true }
      });
    });

    var cards = gsap.utils.toArray(
      "main .card, main .venture-card, main .blog-card, main .article-card, " +
      "main .bio-block, main .contact-info, main .contact-form-container"
    );
    cards.forEach(function (element, index) {
      gsap.from(element, {
        y: 26,
        opacity: 0,
        duration: .72,
        delay: (index % 3) * .055,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: element, start: "top 91%", once: true }
      });
    });
  }

  async function addThreeBackground() {
    if (!canUseThree) return;
    var canvas = document.getElementById("webgl-bg");
    if (!canvas || !window.WebGLRenderingContext) return;

    try {
      var THREE = await import("https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js");
      var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false,
        powerPreference: "low-power"
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      renderer.setClearColor(0x000000, 0);

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, .1, 100);
      camera.position.z = 9;

      var geometry = new THREE.IcosahedronGeometry(3.15, 2);
      var wireGeometry = new THREE.WireframeGeometry(geometry);
      var material = new THREE.LineBasicMaterial({
        color: 0x72a9c9,
        transparent: true,
        opacity: .38,
        depthWrite: false
      });
      var mesh = new THREE.LineSegments(wireGeometry, material);
      mesh.position.set(2.15, .15, -1.2);
      mesh.rotation.set(.22, -.28, .08);
      scene.add(mesh);

      var pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
      function onPointerMove(event) {
        pointer.targetX = (event.clientX / Math.max(window.innerWidth, 1) - .5) * .22;
        pointer.targetY = (event.clientY / Math.max(window.innerHeight, 1) - .5) * .16;
      }
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      function resize() {
        camera.aspect = window.innerWidth / Math.max(window.innerHeight, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight, false);
      }
      window.addEventListener("resize", resize, { passive: true });

      var frame = 0;
      var running = true;
      function render() {
        if (!running) return;
        frame = window.requestAnimationFrame(render);
        pointer.x += (pointer.targetX - pointer.x) * .025;
        pointer.y += (pointer.targetY - pointer.y) * .025;
        mesh.rotation.y += .0007 + pointer.x * .0015;
        mesh.rotation.x += (pointer.y - mesh.rotation.x * .015) * .004;
        mesh.position.y = .15 + Math.sin(performance.now() * .00022) * .12;
        renderer.render(scene, camera);
      }
      render();

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
          running = false;
          window.cancelAnimationFrame(frame);
        } else if (!running) {
          running = true;
          render();
        }
      });

      window.addEventListener("pagehide", function () {
        running = false;
        window.cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("resize", resize);
        wireGeometry.dispose();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      }, { once: true });
    } catch (error) {
      /* WebGL/CDN failures leave the original page untouched and fully readable. */
      canvas.style.display = "none";
    }
  }

  loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js")
    .then(function () {
      return loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js");
    })
    .then(animatePage)
    .catch(function () {
      /* Animation libraries are optional; the page remains visible without them. */
    });

  addThreeBackground();
})();
