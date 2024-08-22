import { format, putValueFormated } from "./format.js"
import { data } from "./script.js"

const statisticsContent = document.querySelector(".content .statistics")
const selected = statisticsContent.querySelector(".selected")
const list = statisticsContent.querySelector(".list")
const all = statisticsContent.querySelector(".all")
let total = 0

function updateStatistics(element) {

    total = 0
    selected.innerHTML = ""
    list.innerHTML = ""
    all.innerHTML = ""

    if (element) {
        const { name, params, color, value } = element
        selected.innerHTML = `<span class='color' style='background:${color}'></span> <span class='name'>${name}</span> <span class='params'>${params} :</span>`
        selected.id = element.id
        putEachCountry(element)
        putAllCountries(value, total)
    } else {
        if (data.countriesSelected.length >= 1) {
            const element = data.countriesSelected.at(-1)
            const { name, color, params, value } = element
            selected.innerHTML = `<span class='color' style='background:${color}'></span> <span class='name'>${name}</span> <span class='params'>${params} :</span>`
            putEachCountry(element)
            putAllCountries(value, total)
        }
    }

}

function putEachCountry(element) {

    data.countriesSelected.map((item) => {
        if (item.id !== element.id) {
            const numberTimes = element.value / item.value

            list.innerHTML += `
                <li id='${item.id}'>
                    <span class='color' style='background:${item.color}'></span>
                    <span class='name'>${item.name}</span> 
                    <span class='params'>${item.params}</span> is 
                    <span class='numberTimes'>${format(numberTimes)}</span> 
                    times 
                </li>
            `
            total += item.value;
        }
    })

}

function putAllCountries(value, total) {
    const numberTimes = value / total
    all.innerHTML = `
        <span class='color' style='background: #111'></span>
        <span class='name'>All countries</span> 
        <span class='params'>${putValueFormated(total)}</span> is 
        <span class='numberTimes'>${format(numberTimes)}</span> 
        times 
    `
}

export default updateStatistics;