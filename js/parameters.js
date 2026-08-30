// Central registry of every comparison "parameter" (metric) supported by the app.
// Adding a new metric only requires a new entry here — every page/tab reads from this config,
// so the whole app (dashboard, graphics, statistics, context facts, totals, rankings) adapts automatically.

const PARAMETERS = {

    area: {
        key: "area",
        label: "Area",
        pageTitle: "Compare Countries by Area",
        navLabel: "Area",
        unit: "km²",
        icon: "🗺️",
        accent: "#2f8f6d",
        getValue: (c) => c.area,
        format: (v) => (v === null || v === undefined ? "No data available" : `${formatNumber(v)} km²`),
        scale: { mode: "sqrt", desktop: 220, mobile: 420 },
        intro: "Area measures how much land (and water) a country covers, in square kilometres. It's the most classic way to compare the physical size of nations — from vast Russia to the 0.44 km² Vatican City.",
        context: {
            label: "Football pitches",
            refValue: 7140,
            refLabel: "a regulation football (soccer) pitch (105m × 68m ≈ 7,140 m²)",
            unitWord: "football pitches",
            compute: (value) => {
                const areaM2 = value * 1_000_000;
                const times = areaM2 / 7140;
                return `covers the same area as roughly ${formatNumber(Math.round(times))} football pitches`;
            }
        }
    },

    population: {
        key: "population",
        label: "Population",
        pageTitle: "Compare Countries by Population",
        navLabel: "Population",
        unit: "people",
        icon: "👥",
        accent: "#3468c0",
        getValue: (c) => c.population,
        format: (v) => (v === null || v === undefined ? "No data available" : `${formatNumber(v)} people`),
        scale: { mode: "sqrt", desktop: 20000, mobile: 42000 },
        intro: "Population counts every person living in a country. It shapes everything from labour markets and elections to infrastructure and culture — and it varies enormously, from China's 1.4 billion people to Vatican City's 800 residents.",
        context: {
            label: "Camp Nou crowds",
            refValue: 99354,
            refLabel: "a sold-out crowd at Camp Nou stadium (99,354 seats)",
            unitWord: "sold-out stadiums",
            compute: (value) => {
                const times = value / 99354;
                return `is like filling Camp Nou stadium ${formatNumber(Math.round(times))} times over`;
            }
        }
    },

    density: {
        key: "density",
        label: "Population Density",
        pageTitle: "Compare Countries by Population Density",
        navLabel: "Density",
        unit: "people/km²",
        icon: "🧭",
        accent: "#c0575d",
        getValue: (c) => (c.area && c.population ? c.population / c.area : null),
        format: (v) => (v === null || v === undefined ? "No data available" : `${formatNumber(round(v, 1))} people/km²`),
        scale: { mode: "sqrt", desktop: 0.32, mobile: 0.65 },
        intro: "Density is population divided by area — it tells you how crowded a country feels on average, from the wide-open spaces of Mongolia to the packed streets of Monaco and Singapore.",
        context: {
            label: "vs. Manhattan",
            refValue: 28000,
            refLabel: "the population density of Manhattan, New York (≈28,000 people/km²)",
            unitWord: "as dense as Manhattan",
            compute: (value) => {
                const ratio = value / 28000;
                if (ratio >= 1) return `is ${formatNumber(round(ratio, 2))}× as densely packed as Manhattan`;
                return `is about ${formatNumber(round(ratio * 100, 1))}% as densely packed as Manhattan`;
            }
        }
    },

    gdp: {
        key: "gdp",
        label: "GDP (nominal)",
        pageTitle: "Compare Countries by GDP",
        navLabel: "GDP",
        unit: "USD",
        icon: "💰",
        accent: "#b8860b",
        getValue: (c) => c.gdp,
        format: (v) => (v === null || v === undefined ? "No data available" : `${formatCurrencyMillions(v)}`),
        scale: { mode: "sqrt", desktop: 420, mobile: 850 },
        intro: "Gross Domestic Product (GDP) is the total value of everything a country produces in a year. It's the standard yardstick for the size of an economy — though it says nothing about how that wealth is shared.",
        context: {
            label: "vs. the ISS",
            refValue: 150000,
            refLabel: "the estimated total cost of the International Space Station (~US$150 billion)",
            unitWord: "International Space Stations",
            compute: (value) => {
                const times = value / 150000;
                return `could fund roughly ${formatNumber(round(times, 1))} International Space Stations`;
            }
        }
    },

    gdpPerCapita: {
        key: "gdpPerCapita",
        label: "GDP per Capita",
        pageTitle: "Compare Countries by GDP per Capita",
        navLabel: "GDP / capita",
        unit: "USD",
        icon: "🏦",
        accent: "#7a4fc4",
        getValue: (c) => c.gdpPerCapita,
        format: (v) => (v === null || v === undefined ? "No data available" : `$${formatNumber(v)} / person`),
        scale: { mode: "sqrt", desktop: 3.4, mobile: 7 },
        intro: "GDP per capita divides a country's total economic output by its population, giving a rough sense of average income and living standards — a very different picture from raw GDP.",
        context: {
            label: "vs. an iPhone",
            refValue: 999,
            refLabel: "the retail price of a new iPhone (~US$999)",
            unitWord: "iPhones",
            compute: (value) => {
                const times = value / 999;
                return `is equivalent to about ${formatNumber(round(times, 1))} new iPhones per person, per year`;
            }
        }
    },

    lifeExpectancy: {
        key: "lifeExpectancy",
        label: "Life Expectancy",
        pageTitle: "Compare Countries by Life Expectancy",
        navLabel: "Life Expectancy",
        unit: "years",
        icon: "❤️",
        accent: "#c0577f",
        getValue: (c) => c.lifeExpectancy,
        format: (v) => (v === null || v === undefined ? "No data available" : `${formatNumber(round(v, 1))} years`),
        scale: { mode: "linear", desktop: 2.1, mobile: 1.5 },
        intro: "Life expectancy at birth estimates how many years, on average, a newborn in that country could expect to live. It's one of the clearest single indicators of healthcare, nutrition and living conditions.",
        context: {
            label: "vs. world average",
            refValue: 73.2,
            refLabel: "the current global average life expectancy (≈73.2 years)",
            unitWord: "years vs. the world average",
            compute: (value) => {
                const diff = value - 73.2;
                const sign = diff >= 0 ? "above" : "below";
                return `is ${formatNumber(round(Math.abs(diff), 1))} years ${sign} the global average`;
            }
        }
    }
};

function formatNumber(value) {
    if (value === null || value === undefined || Number.isNaN(value)) return "—";
    return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function formatCurrencyMillions(millions) {
    if (millions === null || millions === undefined) return "—";
    if (millions >= 1_000_000) return `$${formatNumber(round(millions / 1_000_000, 2))} trillion`;
    if (millions >= 1_000) return `$${formatNumber(round(millions / 1_000, 1))} billion`;
    return `$${formatNumber(millions)} million`;
}

function round(value, decimals = 0) {
    if (value === null || value === undefined) return value;
    const f = Math.pow(10, decimals);
    return Math.round(value * f) / f;
}

function getParameter(key) {
    return PARAMETERS[key] || PARAMETERS.area;
}

function listParameters() {
    return Object.values(PARAMETERS);
}

export { PARAMETERS, getParameter, listParameters, formatNumber, formatCurrencyMillions, round };
