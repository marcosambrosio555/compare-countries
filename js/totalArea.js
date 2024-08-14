import formatArea from "./formatArea.js";
import { data } from "./script.js";

const totalContent = document.querySelector(".content .totalArea")
const percentContent = document.querySelector(".percent")
const block = totalContent.querySelector(".block")
const h2 = totalContent.querySelector("h2")

function updateTotalArea() {


    block.innerHTML = ""
    percentContent.innerHTML = ""
    h2.innerHTML = ""

    if (data.countriesSelected.length > 0) {

        const totalArea = data.countriesSelected.reduce((total, item) => {
            return total += Number(item.area);
        }, 0)

        h2.innerHTML = `Total area : <span class="area">${formatArea(totalArea)}km²</span>`

        data.countriesSelected.map(item => {
            const div = document.createElement("div")
            div.classList.add("part")
            const widthPercent = (item.area * 100) / totalArea
            const color = item.color
            div.style.width = `${widthPercent}%`
            div.style.backgroundColor = color
            putPercent(item, widthPercent)
            block.appendChild(div)
        })
    }


}

function putPercent(item, widthPercent) {
    const { name, color, area } = item
    percentContent.innerHTML += `
        <div class='item'>
            <span class='color' style='background:${color}'></span>
            <span class='name'>${name}</span>
            <span class='area'>${formatArea(area)}km²</span>
            <span class='per'>${widthPercent.toFixed(2)}%</span>
        </div>
    `
}


export default updateTotalArea;