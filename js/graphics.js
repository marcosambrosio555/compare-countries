import { calculateScale } from "./calculateScale.js"
import { data } from "./script.js"

const graphics = document.querySelector(".content .graphics .list")
const h2 = document.querySelector(".content .graphics h2")

function updateGraphics() {

    let scaleDiv = calculateScale() * 500

    graphics.innerHTML = ""
    h2.innerText = ""

    // Order from smaller to bigger  country
    data.countriesSelected.sort((a, b) => {
        return b.value - a.value;
    });

    if (data.countriesSelected.length > 0) {
        h2.innerText = "Graphics"
    }

    data.countriesSelected.map(item => {

        const { id, name, color, value, params } = item

        graphics.innerHTML += `
            <div class="graphic" id=${id}>
                <div class="top">
                    <span class='name'>${name}</span>
                    <span class="params">${params}</span>
                </div>
                <span class='width' style='background : ${color}; width : ${value / scaleDiv}rem;'></span>
            </div>
        `

    })

}


export { updateGraphics }