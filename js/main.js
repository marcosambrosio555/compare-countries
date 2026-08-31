import countries from "./countries.js";
import { getParameter } from "./parameters.js";
import { createId, makeColorPool, returnColor } from "./utils.js";
import {
    renderCheckpoints, renderDashboard, renderGraphics,
    renderStatistics, renderContext, renderTotal, renderRanking,
} from "./render.js";

const paramKey = document.body.dataset.param || "area";
const param = getParameter(paramKey);

const state = {
    param,
    selected: [],
    colorPool: makeColorPool(),
    dashboardView: "cubes",
    rankingDirection: "top",
    dragBox: null,
    zIndex: 2,
    nextZIndex: () => ++state.zIndex,
    onRemove: removeCountry,
    onFocusCountry: (id) => renderStatistics(state, id),
    onCycleColor: cycleColor,
};

// ---------- Build item from a country record ----------

function buildItem(country) {
    const value = param.getValue(country);
    return {
        id: createId(),
        name: country.name,
        value,
        paramsText: param.format(value),
        color: returnColor(state.colorPool),
        country,
    };
}

function findCountry(name) {
    return countries.find((c) => c.name.toLowerCase() === name.toLowerCase());
}

function addCountryByName(name) {
    const msg = document.querySelector(".form .msg");
    const input = document.querySelector(".form input");

    if (state.selected.length >= 24) {
        flashMessage(msg, input, "You can compare up to 24 countries at once");
        return false;
    }
    if (state.selected.some((i) => i.name.toLowerCase() === name.toLowerCase())) {
        flashMessage(msg, input, `${name} is already in the comparison`);
        return false;
    }
    const country = findCountry(name);
    if (!country) {
        flashMessage(msg, input, "That country doesn't exist — pick one from the list");
        return false;
    }
    msg.textContent = "";
    input.style.borderColor = "";
    const item = buildItem(country);
    state.selected.push(item);
    renderAll();
    syncUrl();
    return true;
}

function flashMessage(msg, input, text) {
    input.style.borderColor = "#c0392b";
    msg.textContent = text;
}

function removeCountry(id) {
    const item = state.selected.find((i) => i.id === id);
    if (!item) return;
    state.colorPool.push(item.color);
    state.selected = state.selected.filter((i) => i.id !== id);
    renderAll();
    syncUrl();
}

function cycleColor(id) {
    const item = state.selected.find((i) => i.id === id);
    if (!item) return;
    const old = item.color;
    item.color = returnColor(state.colorPool);
    state.colorPool.push(old);
    // renderAll();
}

function renderAll() {
    renderCheckpoints(state);
    renderDashboard(state);
    renderGraphics(state);
    renderStatistics(state);
    renderContext(state);
    renderTotal(state);
    renderRanking(state, countries);
    updateEmptyHints();
}

function updateEmptyHints() {
    document.querySelectorAll(".content > div").forEach((section) => {
        section.classList.toggle("is-empty", state.selected.length === 0);
    });
}

// ---------- URL sync (?c=Brazil,Japan,Nigeria) for sharing & deep-linking ----------

function syncUrl() {
    const url = new URL(window.location.href);
    if (state.selected.length) {
        url.searchParams.set("c", state.selected.map((i) => i.name).join(","));
    } else {
        url.searchParams.delete("c");
    }
    window.history.replaceState({}, "", url);
}

function loadFromUrl() {
    const url = new URL(window.location.href);
    const c = url.searchParams.get("c");
    if (!c) return;
    c.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 24).forEach((name) => {
        const country = findCountry(name);
        if (country && !state.selected.some((i) => i.name === name)) {
            state.selected.push(buildItem(country));
        }
    });
    renderAll();
}

// ---------- Search form ----------

function setupForm() {
    const input = document.querySelector(".form input");
    const list = document.querySelector(".countries");
    const form = document.querySelector(".form form");

    input.addEventListener("input", () => {
        const text = input.value.toLowerCase();
        list.innerHTML = "";
        if (!text) return;
        countries
            .filter((c) => c.name.toLowerCase().includes(text))
            .slice(0, 8)
            .forEach((c) => {
                list.innerHTML += `<option value="${c.name}">`;
            });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = input.value.trim();
        if (!value) return;
        const ok = addCountryByName(value);
        if (ok) {
            input.value = "";
            input.focus();
        }
    });
}

function setupRandomButton() {
    const btn = document.querySelector(".btn-random");
    if (!btn) return;
    btn.addEventListener("click", () => {
        const available = countries.filter((c) => !state.selected.some((i) => i.name === c.name));
        if (!available.length) return;
        const pick = available[Math.floor(Math.random() * available.length)];
        addCountryByName(pick.name);
    });
}

function setupClearButton() {
    const btn = document.querySelector(".btn-clear");
    if (!btn) return;
    btn.addEventListener("click", () => {
        state.selected.forEach((i) => state.colorPool.push(i.color));
        state.selected = [];
        renderAll();
        syncUrl();
    });
}

function setupShareButton() {
    const btn = document.querySelector(".btn-share");
    if (!btn) return;
    btn.addEventListener("click", async () => {
        syncUrl();
        try {
            await navigator.clipboard.writeText(window.location.href);
            btn.textContent = "Link copied!";
            setTimeout(() => (btn.textContent = "Share comparison"), 1800);
        } catch {
            window.prompt("Copy this link:", window.location.href);
        }
    });
}

// ---------- Tabs ----------

function setupTabs() {
    const buttons = document.querySelectorAll(".nav-links button");
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelector(".nav-links button.active")?.classList.remove("active");
            document.querySelector(".content .show")?.classList.remove("show");
            const target = btn.dataset.tab;
            document.getElementById(target).classList.add("show");
            btn.classList.add("active");
        });
    });
}

// ---------- Dashboard view switcher ----------

function setupDashboardViews() {
    const buttons = document.querySelectorAll(".view-switch button");
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelector(".view-switch button.active")?.classList.remove("active");
            btn.classList.add("active");
            state.dashboardView = btn.dataset.view;
            renderDashboard(state);
        });
    });
}

function setupRankingToggle() {
    const buttons = document.querySelectorAll(".ranking-toggle button");
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelector(".ranking-toggle button.active")?.classList.remove("active");
            btn.classList.add("active");
            state.rankingDirection = btn.dataset.dir;
            renderRanking(state, countries);
        });
    });
}

// ---------- Theme toggle ----------

function setupTheme() {
    const btn = document.querySelector(".btn-theme");
    if (!btn) return;
    const saved = localStorage.getItem("cc-theme");
    if (saved === "dark") document.documentElement.classList.add("dark");
    btn.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
        localStorage.setItem("cc-theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
    });
}

// ---------- Mobile nav ----------

function setupMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
}

// ---------- Init ----------

function init() {
    setupForm();
    setupRandomButton();
    setupClearButton();
    setupShareButton();
    setupTabs();
    setupDashboardViews();
    setupRankingToggle();
    setupTheme();
    setupMobileMenu();
    loadFromUrl();
    renderAll();
}

init();
