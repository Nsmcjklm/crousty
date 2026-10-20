/* =========================================================
   Crousty Bao, Béziers
   ========================================================= */
(() => {
  "use strict";

  /* Animation d'entrée du hero */
  requestAnimationFrame(() => document.body.classList.add("loaded"));

  /* Menu mobile */
  const burger = document.getElementById("burger");
  const links = document.getElementById("navLinks");
  const setMenu = (open) => {
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  };
  burger.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* Header : se cache en descendant, revient en remontant */
  const header = document.getElementById("header");
  let lastY = scrollY;
  addEventListener("scroll", () => {
    const y = scrollY;
    header.classList.toggle("hidden", !links.classList.contains("open") && y > lastY && y > 240);
    lastY = y;
  }, { passive: true });

  /* Lien actif dans le menu */
  const navAnchors = [...links.querySelectorAll("a")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) navAnchors.forEach((a) => a.classList.toggle("active", a.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["carte", "crousty", "infos"].forEach((id) => spy.observe(document.getElementById(id)));

  /* Apparition au scroll */
  const revealEls = [...document.querySelectorAll("[data-reveal]")];
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
  revealEls.forEach((el) => revealObs.observe(el));
  // après un saut (ancre), on révèle aussi ce qui a été dépassé
  addEventListener("scroll", () => {
    revealEls.forEach((el) => {
      if (!el.classList.contains("in") && el.getBoundingClientRect().top < innerHeight) {
        el.classList.add("in");
        revealObs.unobserve(el);
      }
    });
  }, { passive: true });

  /* Jour courant en évidence dans les horaires */
  const parts = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "short" }).formatToParts(new Date());
  const days = { dim: 0, lun: 1, mar: 2, mer: 3, jeu: 4, ven: 5, sam: 6 };
  const today = days[parts.find((p) => p.type === "weekday").value.replace(".", "").toLowerCase()];
  document.querySelectorAll("#hours tr").forEach((tr) => tr.classList.toggle("today", Number(tr.dataset.day) === today));

  /* Plan Google Maps chargé seulement au clic */
  document.getElementById("loadMap").addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.title = "Plan d'accès : Crousty Bao, 41 avenue Saint-Saëns, Béziers";
    iframe.src = "https://www.google.com/maps?q=41+avenue+Camille+Saint-Sa%C3%ABns,+34500+B%C3%A9ziers&z=16&output=embed";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    document.getElementById("map").replaceChildren(iframe);
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
