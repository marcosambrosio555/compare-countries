import countries from "./countries.js";
import { listParameters } from "./parameters.js";
import { badgeSVG } from "./badge.js";

const root = document.getElementById("rankingsRoot");

function buildTable(param) {
    const withValues = countries
        .map((c) => ({ country: c, value: param.getValue(c) }))
        .filter((x) => x.value !== null && x.value !== undefined && !Number.isNaN(x.value))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

    const max = Math.max(...withValues.map((x) => x.value), 1);

    const rows = withValues.map((entry, index) => `
        <div class="rank-row">
            <span class="rank-num">${index + 1}</span>
            ${badgeSVG(entry.country.name, 24)}
            <span class="rank-name">${entry.country.name}</span>
            <span class="rank-bar-wrap"><span class="rank-bar" style="width:${Math.max(4, (entry.value / max) * 100)}%; background:${param.accent}"></span></span>
            <span class="rank-value">${param.format(entry.value)}</span>
        </div>
    `).join("");

    return `
        <article class="section-block ranking-card" id="rank-${param.key}">
            <h3>${param.icon} Top 10 — ${param.label}</h3>
            <p class="tab-blurb">${param.intro}</p>
            <div class="ranking"><div class="list">${rows}</div></div>
            <p><a href="${param.key === "area" ? "index.html" : param.key === "gdpPerCapita" ? "gdp-per-capita.html" : param.key === "lifeExpectancy" ? "life-expectancy.html" : param.key + ".html"}">Build your own ${param.label.toLowerCase()} comparison →</a></p>
        </article>
    `;
}

root.innerHTML = listParameters().map(buildTable).join("");
