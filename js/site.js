function setupTheme() {
    const btn = document.querySelector(".btn-theme");
    const saved = localStorage.getItem("cc-theme");
    if (saved === "dark") document.documentElement.classList.add("dark");
    if (!btn) return;
    btn.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
        localStorage.setItem("cc-theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
    });
}

function setupMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
}

setupTheme();
setupMobileMenu();
