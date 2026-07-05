const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
const nav = document.querySelector(".nav");

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
