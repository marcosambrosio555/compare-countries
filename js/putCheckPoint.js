import { updateGraphics } from "./graphics.js";
import { data } from "./script.js";
import updateStatistics from "./statistics.js";
import updateTotal from "./total.js";
import updateColor from "./updateColor.js";
import { deleteBlock, increaseIndex } from "./utilities.js";

const checkpoints = document.querySelector(".checkpoints")

function putCheckPoints(element) {

    const { name, color, id, params, value } = element;
    let originalColor = color;

    const template = document.querySelector(".template")
    const point = template.cloneNode(true)
    point.classList.remove("template")

    point.addEventListener("click", () => {
        increaseIndex(id)
        updateStatistics({ name, color: originalColor, id, params, value })
    })

    point.querySelector(".color").style.background = `${color}`;
    point.querySelector(".name").innerText = name;
    point.querySelector(".params").innerText = params;
    point.id = id

    point.querySelector(".btn-remove").addEventListener("click", (event) => {
        deleteCountry(point, id, color)
        updateGraphics()
        updateTotal()
        updateStatistics()
        event.stopPropagation()
    })

    point.querySelector(".color").addEventListener("click", (e) => {
        const atualColor = point.querySelector(".color").style.background
        updateColor(atualColor, element)
        originalColor = element.color;
        e.stopPropagation()
    })

    checkpoints.appendChild(point)

}

function deleteCountry(point, id, color) {
    point.remove()
    deleteBlock(id)
    data.colors.push(color);
    const indexElement = data.countriesSelected.findIndex(item => item.id === id)
    data.countriesSelected.splice(indexElement, 1)
}


export default putCheckPoints;