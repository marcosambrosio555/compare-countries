const checkpoints = document.querySelector(".checkpoints")
import formatArea from "./formatArea.js";
import { updateGraphics } from "./graphics.js";
import { data } from "./script.js";
import updateStatistics from "./statistics.js";
import updateTotalArea from "./totalArea.js";
import { deleteBlock, increaseIndex } from "./utilities.js";


function putCheckPoints({ name, color, id, area }) {
    const template = document.querySelector(".template")
    const point = template.cloneNode(true)
    point.classList.remove("template")
    point.addEventListener("click", () => {
        increaseIndex(id)
        updateStatistics({ name, color, id, area })
    })
    point.querySelector(".color").style.background = color;
    point.querySelector(".name").innerText = name;
    point.querySelector(".area").innerText = `${formatArea(area)}km²`;
    point.id = id
    point.querySelector(".btn-remove").addEventListener("click", (event) => {
        point.remove()
        deleteBlock(id)
        data.colors.push(color);
        const indexElement = data.countriesSelected.findIndex(item => item.id === id)
        data.countriesSelected.splice(indexElement, 1)
        updateGraphics()
        updateTotalArea()
        updateStatistics()
        event.stopPropagation()
    })

    checkpoints.appendChild(point)
}

export default putCheckPoints;