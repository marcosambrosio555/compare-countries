import formatArea from "./formatArea.js"
import { data } from "./script.js"

const statisticsContent = document.querySelector(".content .statistics")

function updateStatistics(element) {

    const { name, area, color, id } = element

    const selected = statisticsContent.querySelector(".selected")
    const list = statisticsContent.querySelector(".list")
    const all = statisticsContent.querySelector(".all")

    let total = 0
    selected.innerText = ""
    list.innerHTML = ""
    all.innerHTML = ""

    selected.innerHTML = `<span class='color' style='background:${color}'></span> <span class='name'>${name}</span> <span class='area'>${formatArea(area)}km² :</span>`

    data.countriesSelected.map((item) => {
        if (item.id !== element.id) {
            const numberTimes = area / item.area
            list.innerHTML += `
                <li>
                    <span class='color' style='background:${item.color}'></span>
                    <span class='name'>${item.name}</span> 
                    <span class='area'>${formatArea(item.area)}km²</span> is 
                    <span class='numberTimes'>${numberTimes.toFixed(3)}</span> 
                    times 
                </li>
            `
            total += item.area;
        }
    })

    const numberTimes = area / total

    all.innerHTML = `
        <span class='color' style='background: #111'></span>
        <span class='name'>All countries</span> 
        <span class='area'>${formatArea(total)}km²</span> is 
        <span class='numberTimes'>${numberTimes.toFixed(3)}</span> 
        times 
    `

}

export default updateStatistics;