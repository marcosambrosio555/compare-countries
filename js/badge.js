// Generates a small, deterministic, purely-CSS/SVG "country badge" — two initials over a
// gradient built from a hash of the country's name. It never depends on an external image,
// so it can never fail to load / show up blank, unlike real flag icons.

const GRADIENTS = [
    ["#ff5f6d", "#ffc371"], ["#36d1dc", "#5b86e5"], ["#f7971e", "#ffd200"],
    ["#8e2de2", "#4a00e0"], ["#11998e", "#38ef7d"], ["#fc4a1a", "#f7b733"],
    ["#c31432", "#240b36"], ["#0f2027", "#2c5364"], ["#ee0979", "#ff6a00"],
    ["#2193b0", "#6dd5ed"], ["#cc2b5e", "#753a88"], ["#00b09b", "#96c93d"],
    ["#dd5e89", "#f7bb97"], ["#4568dc", "#b06ab3"], ["#ff512f", "#dd2476"],
    ["#1d976c", "#93f9b9"], ["#654ea3", "#eaafc8"], ["#00c6ff", "#0072ff"],
];

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function initialsFor(name) {
    const clean = name.replace(/[^A-Za-zÀ-ÿ' ]/g, "");
    const parts = clean.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Returns an <svg> markup string — safe to inject via innerHTML, no network request involved.
function badgeSVG(name, size = 40) {
    const hash = hashString(name);
    const [c1, c2] = GRADIENTS[hash % GRADIENTS.length];
    const angle = hash % 360;
    const initials = initialsFor(name);
    const gradId = `g${hash}`;
    return `
        <svg class="badge-svg" width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${name} flag placeholder">
            <defs>
                <linearGradient id="${gradId}" gradientTransform="rotate(${angle})">
                    <stop offset="0%" stop-color="${c1}" />
                    <stop offset="100%" stop-color="${c2}" />
                </linearGradient>
            </defs>
            <rect width="40" height="40" rx="9" fill="url(#${gradId})" />
            <text x="20" y="24" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="13" font-weight="700" fill="rgba(255,255,255,0.92)">${initials}</text>
        </svg>
    `;
}

export { badgeSVG, initialsFor };
