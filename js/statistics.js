import formatArea from "./formatArea.js"
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
        const { name, area, color } = element
        selected.innerHTML = `<span class='color' style='background:${color}'></span> <span class='name'>${name}</span> <span class='area'>${formatArea(area)}km² :</span>`
        putEachCountry(element)
        putAllCountries(area, total)
    } else {
        if (data.countriesSelected.length >= 1) {
            const element = data.countriesSelected.at(-1)
            const { name, color, area } = element
            selected.innerHTML = `<span class='color' style='background:${color}'></span> <span class='name'>${name}</span> <span class='area'>${formatArea(area)}km² :</span>`
            putEachCountry(element)
            putAllCountries(area, total)
        }
    }

}

function putEachCountry(element) {
    data.countriesSelected.map((item) => {
        if (item.id !== element.id) {
            const numberTimes = element.area / item.area
            list.innerHTML += `
                <li>
                    <span class='color' style='background:${item.color}'></span>
                    <span class='name'>${item.name}</span> 
                    <span class='area'>${formatArea(item.area)}km²</span> is 
                    <span class='numberTimes'>${numberTimes.toFixed(2)}</span> 
                    times 
                </li>
            `
            total += item.area;
        }
    })
}

function putAllCountries(area, total) {
    const numberTimes = area / total

    all.innerHTML = `
        <span class='color' style='background: #111'></span>
        <span class='name'>All countries</span> 
        <span class='area'>${formatArea(total)}km²</span> is 
        <span class='numberTimes'>${numberTimes.toFixed(2)}</span> 
        times 
    `
}

export default updateStatistics;