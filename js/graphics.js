import formatArea from "./formatArea.js"
import { data } from "./script.js"

const graphics = document.querySelector(".content .graphics")
const templateGraphic = document.querySelector(".graphic.template")

// graphics.style.background = "red"

function updateGraphics() {
    graphics.innerHTML = ""
    data.countriesSelected.sort((a, b) => {
        return b.area - a.area;
    });
    data.countriesSelected.map(item => {
        const { name, color, area } = item
        const card = templateGraphic.cloneNode(true)
        card.classList.remove("template")
        card.querySelector(".name").innerText = name
        card.querySelector(".area").innerText = `${formatArea(area)}km²`;
        card.querySelector(".width").style.width = `${area / 200000}rem`;
        card.querySelector(".width").style.background = color
        graphics.appendChild(card)
    })
}

export { updateGraphics }