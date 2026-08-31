import { badgeSVG } from "./badge.js";
import { formatNumber } from "./parameters.js";

// ---------- Checkpoints (the little pills under the search form) ----------

function renderCheckpoints(state) {
    const container = document.querySelector(".checkpoints");
    container.innerHTML = "";

    state.selected.forEach((item) => {
        const el = document.createElement("div");
        el.className = "point";
        el.id = item.id;
        el.innerHTML = `
            <span class="badge">${badgeSVG(item.name, 28)}</span>
            <span class="color" style="background:${item.color}"></span>
            <div class="center">
                <span class="name">${item.name}</span>
                <span class="params">${item.paramsText}</span>
            </div>
            <span class="btn-remove" title="Remove ${item.name}" aria-label="Remove ${item.name}">✕</span>
        `;
        el.addEventListener("click", (e) => {
            if (e.target.closest(".btn-remove") || e.target.closest(".color")) return;
            state.onFocusCountry(item.id);
        });
        el.querySelector(".btn-remove").addEventListener("click", (e) => {
            e.stopPropagation();
            state.onRemove(item.id);
        });
        el.querySelector(".color").addEventListener("click", (e) => {
            e.stopPropagation();
            state.onCycleColor(item.id);
        });
        container.appendChild(el);
    });
}

// ---------- Dashboard: 4 switchable visual modes ----------

function calcBoxSide(value, param, deviceWidth) {
    if (value === null || value === undefined || Number.isNaN(value)) return 22;
    const k = deviceWidth >= 540 ? param.scale.desktop : param.scale.mobile;
    if (param.scale.mode === "linear") {
        return Math.max(28, value * k);
    }
    const scale = value / k;
    return Math.max(16, Math.sqrt(Math.max(scale, 0)));
}

function renderDashboard(state) {
    const dashboard = document.getElementById("dashboard");
    dashboard.className = `dashboard view-${state.dashboardView}`;

    if (state.selected.length === 0) {
        dashboard.innerHTML = emptyState(state.param);
        dashboard.dataset.view = "";
        return;
    }

    // Só limpamos tudo quando o utilizador muda de modo de visualização
    // (cubes/bubbles/bars/cards). A adicionar/remover país dentro do MESMO
    // modo, os blocos já existentes não são recriados — assim mantêm a
    // posição onde o utilizador os arrastou (ver renderCubes).
    const viewChanged = dashboard.dataset.view !== state.dashboardView;
    console.log(`[render] modo="${state.dashboardView}" mudouDeModo=${viewChanged} totalSelecionados=${state.selected.length}`);
    if (viewChanged) {
        console.log("[render] modo mudou -> a limpar dashboard e recriar tudo");
        dashboard.innerHTML = "";
    }
    dashboard.dataset.view = state.dashboardView;

    if (state.dashboardView === "cubes") return renderCubes(state, dashboard);
    if (state.dashboardView === "bubbles") return renderBubbles(state, dashboard);
    if (state.dashboardView === "bars") return renderColumnBars(state, dashboard);
    return renderCards(state, dashboard);
}

// Remove do container os elementos cujo país já não está selecionado,
// e devolve um Map id -> elemento com os que sobraram (para reaproveitar).
function reconcile(container, selector, selected) {
    const existing = new Map();
    container.querySelectorAll(selector).forEach((el) => existing.set(el.id, el));
    const currentIds = new Set(selected.map((i) => i.id));
    let removidos = 0;
    existing.forEach((el, id) => {
        if (!currentIds.has(id)) {
            el.remove();
            existing.delete(id);
            removidos++;
        }
    });
    console.log(`[reconcile] "${selector}": ${existing.size} bloco(s) reaproveitado(s), ${removidos} removido(s)`);
    return existing;
}

function emptyState(param) {
    return `
        <div class="empty-state">
            <div class="empty-icon">${param.icon}</div>
            <p>Add a country above to start comparing <strong>${param.label.toLowerCase()}</strong>.</p>
            <p class="empty-hint">Try "Brazil", "Japan" or "Nigeria" to get going.</p>
        </div>
    `;
}

function renderCubes(state, dashboard) {
    const existing = reconcile(dashboard, ".box", state.selected);

    state.selected.forEach((item) => {
        const side = calcBoxSide(item.value, state.param, window.innerWidth);
        let box = existing.get(item.id);
        const isNew = !box;

        if (isNew) {
            console.log(`[renderCubes] novo bloco para "${item.name}" -> posição inicial`);
            box = document.createElement("div");
            box.className = "box";
            box.id = item.id;
            box.style.zIndex = String(state.nextZIndex());
            attachDrag(box, state);
            dashboard.appendChild(box);
        } else {
            console.log(`[renderCubes] bloco de "${item.name}" reaproveitado -> mantém posição arrastada`);
        }

        // Tamanho/cor/texto atualizam sempre; posição (left/top/position)
        // só é definida na criação — se já existia, fica onde estava.
        box.style.width = `${side}px`;
        box.style.height = `${side}px`;
        box.style.background = item.color;
        box.title = `${item.name} — ${item.paramsText}`;
        box.innerHTML = side > 46 ? `<span class="box-label">${item.name}</span>` : "";
    });
}

function attachDrag(box, state) {
    const dashboard = document.getElementById("dashboard");

    function start(clientX, clientY) {
        const rect = dashboard.getBoundingClientRect();
        const boxRect = box.getBoundingClientRect();
        state.dragOffsetX = clientX - boxRect.left;
        state.dragOffsetY = clientY - boxRect.top;
        state.dragBox = box;
        state.dragRect = rect;
        box.style.zIndex = String(state.nextZIndex());
        box.classList.add("dragging");
    }

    box.addEventListener("mousedown", (e) => start(e.clientX, e.clientY));
    box.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        start(t.clientX, t.clientY);
    }, { passive: true });

    function move(clientX, clientY) {
        if (state.dragBox !== box) return;
        const left = clientX - state.dragRect.left - state.dragOffsetX;
        const top = clientY - state.dragRect.top - state.dragOffsetY;
        box.style.position = "absolute";
        box.style.left = `${left}px`;
        box.style.top = `${top}px`;
    }

    window.addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
    window.addEventListener("touchmove", (e) => {
        if (state.dragBox !== box) return;
        const t = e.touches[0];
        move(t.clientX, t.clientY);
    }, { passive: true });

    function end() {
        if (state.dragBox === box) {
            state.dragBox = null;
            box.classList.remove("dragging");
        }
    }
    window.addEventListener("mouseup", end);
    window.addEventListener("touchend", end);
}

function renderBubbles(state, dashboard) {
    let wrap = dashboard.querySelector(".bubble-wrap");
    if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "bubble-wrap";
        dashboard.appendChild(wrap);
    }
    const existing = reconcile(wrap, ".bubble", state.selected);

    state.selected.forEach((item) => {
        const side = Math.min(220, Math.max(46, calcBoxSide(item.value, state.param, window.innerWidth) * 0.9));
        let bubble = existing.get(item.id);
        if (!bubble) {
            bubble = document.createElement("div");
            bubble.className = "bubble";
            bubble.id = item.id;
            wrap.appendChild(bubble);
        }
        bubble.style.width = `${side}px`;
        bubble.style.height = `${side}px`;
        bubble.style.background = `radial-gradient(circle at 32% 28%, ${lighten(item.color)}, ${item.color})`;
        bubble.innerHTML = `<span>${item.name}</span><small>${item.paramsText}</small>`;
    });
}

function lighten(rgbStr) {
    const m = rgbStr.match(/\d+/g);
    if (!m) return rgbStr;
    const [r, g, b] = m.map(Number);
    const mix = (c) => Math.round(c + (255 - c) * 0.45);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function renderColumnBars(state, dashboard) {
    const max = Math.max(...state.selected.map((i) => i.value || 0), 1);
    let wrap = dashboard.querySelector(".column-wrap");
    if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "column-wrap";
        dashboard.appendChild(wrap);
    }
    const existing = reconcile(wrap, ".column", state.selected);

    state.selected.forEach((item) => {
        const heightPct = Math.max(4, ((item.value || 0) / max) * 100);
        let col = existing.get(item.id);
        if (!col) {
            col = document.createElement("div");
            col.className = "column";
            col.id = item.id;
            wrap.appendChild(col);
        }
        col.innerHTML = `
            <span class="column-value">${item.paramsText}</span>
            <div class="column-bar" style="height:${heightPct}%; background:${item.color};"></div>
            <span class="column-name">${item.name}</span>
        `;
    });
}

function renderCards(state, dashboard) {
    let grid = dashboard.querySelector(".card-grid");
    if (!grid) {
        grid = document.createElement("div");
        grid.className = "card-grid";
        dashboard.appendChild(grid);
    }
    const existing = reconcile(grid, ".country-card", state.selected);

    state.selected.forEach((item) => {
        const c = item.country;
        let card = existing.get(item.id);
        if (!card) {
            card = document.createElement("div");
            card.className = "country-card";
            card.id = item.id;
            grid.appendChild(card);
        }
        card.style.setProperty("--accent", item.color);
        card.innerHTML = `
            <div class="country-card-top">
                ${badgeSVG(item.name, 44)}
                <div>
                    <p class="cc-name">${item.name}</p>
                    <p class="cc-capital">${c && c.capital ? c.capital : "—"}${c && c.region ? " · " + c.region : ""}</p>
                </div>
            </div>
            <p class="cc-value">${item.paramsText}</p>
        `;
    });
}

// ---------- Graphics tab: horizontal ranked bars ----------

function renderGraphics(state) {
    const list = document.querySelector(".graphics .list");
    const h2 = document.querySelector(".graphics h2");
    list.innerHTML = "";
    h2.textContent = state.selected.length ? `${state.param.label} — ranked` : "";

    const sorted = [...state.selected].sort((a, b) => (b.value || 0) - (a.value || 0));
    const max = Math.max(...sorted.map((i) => i.value || 0), 1);

    sorted.forEach((item, index) => {
        const widthPct = Math.max(3, ((item.value || 0) / max) * 100);
        const row = document.createElement("div");
        row.className = "graphic";
        row.id = item.id;
        row.innerHTML = `
            <div class="top">
                <span class="rank">#${index + 1}</span>
                ${badgeSVG(item.name, 22)}
                <span class="name">${item.name}</span>
                <span class="params">${item.paramsText}</span>
            </div>
            <span class="width" style="background:${item.color}; width:${widthPct}%;"></span>
        `;
        list.appendChild(row);
    });
}

// ---------- Statistics tab ----------

function renderStatistics(state, focusId) {
    const selectedEl = document.querySelector(".statistics .selected");
    const list = document.querySelector(".statistics .list");
    const all = document.querySelector(".statistics .all");
    selectedEl.innerHTML = "";
    list.innerHTML = "";
    all.innerHTML = "";

    if (state.selected.length === 0) return;

    const focus = state.selected.find((i) => i.id === focusId) || state.selected.at(-1);
    selectedEl.innerHTML = `${badgeSVG(focus.name, 26)} <span class="name">${focus.name}</span> <span class="params">${focus.paramsText}:</span>`;

    let total = 0;
    state.selected.forEach((item) => {
        if (item.id === focus.id) return;
        total += item.value || 0;
        const times = item.value ? focus.value / item.value : 0;
        const li = document.createElement("li");
        li.id = item.id;
        li.innerHTML = `
            ${badgeSVG(item.name, 20)}
            <span class="name">${item.name}</span>
            <span class="params">${item.paramsText}</span> is
            <span class="numberTimes">${formatNumber(round1(times))}×</span>
        `;
        list.appendChild(li);
    });

    if (total > 0) {
        const times = focus.value / total;
        all.innerHTML = `
            <span class="color" style="background:#111"></span>
            <span class="name">All other selected countries combined</span>
            <span class="params">${state.param.format(total)}</span> —
            <span class="numberTimes">${focus.name} is ${formatNumber(round1(times))}×</span> that total
        `;
    }
}

function round1(v) {
    return Math.round(v * 100) / 100;
}

// ---------- Context / "fun facts" tab ----------

function renderContext(state) {
    const container = document.querySelector(".context .block");
    const h2 = document.querySelector(".context h2");
    const refLine = document.querySelector(".context .ref-line");
    container.innerHTML = "";
    h2.textContent = state.selected.length ? "Fun context" : "";
    refLine.textContent = `Reference: ${state.param.context.refLabel}.`;

    state.selected.forEach((item) => {
        const div = document.createElement("div");
        div.className = "col";
        div.id = item.id;
        const factText = item.value !== null && item.value !== undefined
            ? state.param.context.compute(item.value)
            : "has no data available for this metric yet";
        div.innerHTML = `
            ${badgeSVG(item.name, 26)}
            <span class="name">${item.name}</span>
            <span class="params">${item.paramsText}</span>
            <span class="fact">${item.name} ${factText}.</span>
        `;
        container.appendChild(div);
    });
}

// ---------- Total tab ----------

function renderTotal(state) {
    const h2 = document.querySelector(".total h2");
    const block = document.querySelector(".total .block");
    const percent = document.querySelector(".total .percent");
    h2.innerHTML = "";
    block.innerHTML = "";
    percent.innerHTML = "";

    if (state.selected.length === 0) return;

    const total = state.selected.reduce((acc, i) => acc + (i.value || 0), 0);
    h2.innerHTML = `Combined total: <span class="params">${state.param.format(total)}</span>`;

    state.selected.forEach((item) => {
        const widthPct = total ? ((item.value || 0) * 100) / total : 0;
        const part = document.createElement("div");
        part.className = "part";
        part.id = item.id;
        part.style.width = `${widthPct}%`;
        part.style.background = item.color;
        part.title = `${item.name}: ${widthPct.toFixed(1)}%`;
        block.appendChild(part);

        const row = document.createElement("div");
        row.className = "item";
        row.id = item.id;
        row.innerHTML = `
            ${badgeSVG(item.name, 20)}
            <span class="name">${item.name}</span>
            <span class="params">${item.paramsText}</span>
            <span class="per">${widthPct.toFixed(2)}%</span>
        `;
        percent.appendChild(row);
    });
}

// ---------- Ranking tab: top / bottom 10 from the whole dataset ----------

function renderRanking(state, allCountries) {
    const container = document.querySelector(".ranking .list");
    const h2 = document.querySelector(".ranking h2");
    if (!container) return;
    h2.textContent = `World ranking — ${state.param.label}`;

    const selectedIds = new Set(state.selected.map((i) => i.name));
    const withValues = allCountries
        .map((c) => ({ country: c, value: state.param.getValue(c) }))
        .filter((x) => x.value !== null && x.value !== undefined && !Number.isNaN(x.value));

    const order = state.rankingDirection === "bottom"
        ? withValues.sort((a, b) => a.value - b.value)
        : withValues.sort((a, b) => b.value - a.value);

    const top10 = order.slice(0, 10);
    const max = Math.max(...top10.map((x) => x.value), 1);

    container.innerHTML = "";
    top10.forEach((entry, index) => {
        const row = document.createElement("div");
        row.className = "rank-row" + (selectedIds.has(entry.country.name) ? " is-selected" : "");
        const widthPct = Math.max(4, (entry.value / max) * 100);
        row.innerHTML = `
            <span class="rank-num">${index + 1}</span>
            ${badgeSVG(entry.country.name, 26)}
            <span class="rank-name">${entry.country.name}</span>
            <span class="rank-bar-wrap"><span class="rank-bar" style="width:${widthPct}%"></span></span>
            <span class="rank-value">${state.param.format(entry.value)}</span>
        `;
        container.appendChild(row);
    });
}

export {
    renderCheckpoints, renderDashboard, renderGraphics,
    renderStatistics, renderContext, renderTotal, renderRanking,
};
