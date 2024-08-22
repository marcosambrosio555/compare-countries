import { putValueFormated } from "./format.js";
import { data } from "./script.js";

const totalContent = document.querySelector(".content .total")
const percentContent = document.querySelector(".percent")
const block = totalContent.querySelector(".block")
const h2 = totalContent.querySelector("h2")

function updateTotal() {

    block.innerHTML = ""
    percentContent.innerHTML = ""
    h2.innerHTML = ""

    if (data.countriesSelected.length > 0) {

        const totalparams = data.countriesSelected.reduce((total, item) => {
            return total += Number(item.value);
        }, 0)

        h2.innerHTML = `Total : <span class="params">${putValueFormated(totalparams)}</span>`

        data.countriesSelected.map(item => {
            const div = document.createElement("div")
            div.classList.add("part")
            div.id = item.id
            const widthPercent = (item.value * 100) / totalparams
            const color = item.color
            div.style.width = `${widthPercent}%`
            div.style.backgroundColor = color
            putPercent(item, widthPercent)
            block.appendChild(div)
        })
    }


}

function putPercent(item, widthPercent) {
    const { name, color, params, id } = item
    percentContent.innerHTML += `
        <div class='item' id='${id}'>
            <span class='color' style='background:${color}'></span>
            <span class='name'>${name}</span>
            <span class='params'>${params}</span>
            <span class='per'>${widthPercent.toFixed(2)}%</span>
        </div>
    `
}


export default updateTotal;