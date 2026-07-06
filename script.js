const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
const nav = document.querySelector(".nav");
const quickNav = document.querySelector(".mobile-section-nav");
const quickLinks = document.querySelectorAll(".mobile-section-nav a");

if (window.lucide) {
  window.lucide.createIcons();
}

toggle?.addEventListener("click", () => {
  const isOpen = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

links?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    links.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

const updateNav = () => {
  nav?.classList.toggle("scrolled", window.scrollY > 24);
};

updateNav();
window.addEventListener("scroll", updateNav, { passive: true });

let navIdleTimer;
let keepQuickNavAwakeUntil = 0;

const isMobileNav = () => window.matchMedia("(max-width: 620px)").matches;

const startedInsideQuickNav = (event) => event.target.closest?.(".mobile-section-nav");

const hideQuickNav = (event) => {
  if (event && startedInsideQuickNav(event)) return;
  if (!isMobileNav() || !quickNav) return;
  if (Date.now() < keepQuickNavAwakeUntil) {
    document.body.classList.remove("nav-sleeping");
    return;
  }
  document.body.classList.add("nav-sleeping");
};

const revealQuickNavAfter = (delay = 760) => {
  if (!isMobileNav() || !quickNav) return;
  window.clearTimeout(navIdleTimer);
  navIdleTimer = window.setTimeout(() => {
    updateQuickActive();
    document.body.classList.remove("nav-sleeping");
  }, delay);
};

const updateQuickActive = () => {
  if (!quickLinks.length) return;
  const probeY = window.scrollY + window.innerHeight * 0.38;
  const current = sections.reduce((active, section) => {
    return section.offsetTop <= probeY ? section : active;
  }, sections[0]);

  if (!current) return;

  const activeId = current.id === "redes" ? "contacto" : current.id;
  quickLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === activeId);
  });
};

const showQuickNavSoon = () => {
  if (!isMobileNav() || !quickNav) return;
  if (Date.now() < keepQuickNavAwakeUntil) {
    updateQuickActive();
    document.body.classList.remove("nav-sleeping");
    return;
  }
  hideQuickNav();
  updateQuickActive();
  revealQuickNavAfter(820);
};

["pointerdown", "touchstart"].forEach((eventName) => {
  window.addEventListener(eventName, hideQuickNav, { passive: true });
});

["pointerup", "touchend", "touchcancel"].forEach((eventName) => {
  window.addEventListener(eventName, () => revealQuickNavAfter(520), { passive: true });
});

["touchmove", "wheel", "scroll"].forEach((eventName) => {
  window.addEventListener(eventName, showQuickNavSoon, { passive: true });
});

quickLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    keepQuickNavAwakeUntil = Date.now() + 1400;
    document.body.classList.remove("nav-sleeping");
    const target = document.querySelector(link.getAttribute("href"));
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    quickLinks.forEach((item) => item.classList.toggle("active", item === link));
    revealQuickNavAfter(520);
  });
});

const sectionIds = ["inicio", "servicios", "paquetes", "cocteles", "contacto", "redes"];
const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

if ("IntersectionObserver" in window && quickLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const activeId = visible.target.id === "redes" ? "contacto" : visible.target.id;
    quickLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === activeId);
    });
  }, {
    threshold: [0.22, 0.38, 0.55],
    rootMargin: "-18% 0px -45% 0px"
  });

  sections.forEach((section) => sectionObserver.observe(section));
}

updateQuickActive();
window.addEventListener("resize", updateQuickActive, { passive: true });

const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  reveals.forEach((item) => observer.observe(item));
} else {
  reveals.forEach((item) => item.classList.add("visible"));
}
