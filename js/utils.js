function createId() {
    const digits = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let id = "";
    for (let i = 0; i < 15; i++) {
        id += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return id;
}

const COLOR_POOL = [
    "rgb(255, 87, 87)", "rgb(255, 159, 67)", "rgb(255, 205, 86)", "rgb(46, 204, 113)",
    "rgb(26, 188, 156)", "rgb(52, 152, 219)", "rgb(93, 109, 235)", "rgb(155, 89, 182)",
    "rgb(232, 67, 147)", "rgb(255, 118, 117)", "rgb(0, 206, 201)", "rgb(9, 132, 227)",
    "rgb(108, 92, 231)", "rgb(253, 121, 168)", "rgb(0, 184, 148)", "rgb(225, 112, 85)",
    "rgb(250, 177, 160)", "rgb(129, 236, 236)", "rgb(116, 185, 255)", "rgb(162, 155, 254)",
    "rgb(255, 118, 177)", "rgb(85, 239, 196)", "rgb(223, 230, 233)", "rgb(178, 190, 195)",
    "rgb(214, 48, 49)", "rgb(225, 177, 44)", "rgb(0, 148, 50)", "rgb(2, 132, 130)",
    "rgb(9, 32, 63)", "rgb(111, 30, 81)",
];

function makeColorPool() {
    return [...COLOR_POOL];
}

function returnColor(pool) {
    const i = Math.floor(Math.random() * pool.length);
    return pool.splice(i, 1)[0];
}

export { createId, makeColorPool, returnColor };
