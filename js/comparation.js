import { format } from "./format.js"
import { data } from "./script.js"

const comparation = document.querySelector(".content .comparation .block")
const h2 = document.querySelector(".content .comparation h2")

function updateComparation() {

    comparation.innerHTML = ""
    h2.innerText = ""

    if (data.countriesSelected.length > 0) {
        h2.innerText = "Comparation"
    }

    // Football Field
    const areaFootball = 105 * 70
    comparation.innerHTML += `<h3>Football field Area : ${format(areaFootball)}mm²</h3>`

    data.countriesSelected.map(item => {

        const { id, name, color, value, params } = item

        const areaCountry = value * 1000 * 1000
        const numberTimes = areaCountry / areaFootball

        comparation.innerHTML += `
            <div class="col" id=${id}>
                <span class='color' style='background:${color}'></span>
                <span class='name'>${name}</span> 
                <span class='params'>${params}</span>
                <span class='numberTimes'> is ${format(Math.round(numberTimes))} football fields.</span>
            </div>
        `

    })

}


export { updateComparation }