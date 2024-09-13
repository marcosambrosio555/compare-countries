import countries from "./countries.js"
import createId from "./createId.js"
import { format } from "./format.js"
import { returnColor } from "./utilities.js"


import { updateGraphics } from "./graphics.js";
import putBlock from "./putBlock.js";
import putCheckPoints from "./checkPoint.js";
import updateStatistics from "./statistics.js";
import updateTotal from "./total.js";
import { updateComparation } from "./comparation.js";

const compare = document.getElementById("compare").value

export let data = {
    moving: false,
    area: 0,
    colors: [
        "rgb(255, 51, 51)", "rgb(179, 255, 102)", "rgb(0, 255, 64)", "rgb(51, 255, 255)", "rgb(13, 115, 115)", "rgb(13, 38, 115)",
        "rgb(51, 102, 255)", "rgb(64, 13, 115)", "rgb(153, 51, 255)", "rgb(255, 51, 204)", "rgb(238, 129, 238)", "rgb(255, 194, 204)",
        "rgb(250, 120, 73)", "rgb(251, 188, 0)", "rgb(204, 157, 37)", "rgb(216, 135, 64)", "rgb(155, 100, 100)", "rgb(184, 168, 122)",
        "rgb(153, 184, 122)", "rgb(122, 184, 138)", "rgb(122, 184, 184)", "rgb(122, 138, 184)", "rgb(153, 122, 184)", "rgb(184, 122, 168)",
        "rgb(115, 13, 13)", "rgb(204, 56, 56)", "rgb(115, 13, 89)", "rgb(115, 89, 13)", "rgb(64, 115, 13)", "rgb(13, 115, 38)", "rgb(128, 128, 128)",
    ],
    half: 0,
    zIndex: 2,
    selectedBlock: null,
    block: null,
    countriesSelected: [],
    deviceWidth: window.innerWidth,
    compare
}


const navLinks = document.querySelectorAll(".nav-links button")

navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        document.querySelector(".nav-links button.active").classList.remove("active")
        document.querySelector(".content .show").classList.remove("show")
        const block = link.className
        document.querySelector(`.content .${block}`).classList.add("show")
        link.classList.add("active")
    })
})

// form

const inputValue = document.querySelector(".form form input")
const listCountries = document.querySelector(".countries")

inputValue.addEventListener("input", () => {
    const text = inputValue.value.toLocaleLowerCase()
    listCountries.innerHTML = ""

    const filtered = countries.filter((item) => {
        return item.name.toLocaleLowerCase().includes(text)
    })

    for (let i in filtered) {
        listCountries.innerHTML += `
            <option value='${filtered[i].name}'>
        `
        if (i >= 6) break;
    }

})

const btnAdd = document.querySelector(".form form button")
const msg = document.querySelector(".form form .msg")

btnAdd.addEventListener("click", (e) => {
    e.preventDefault();
    if (inputValue.value) {

        const value = inputValue.value.trim()

        if (data.countriesSelected.length >= 20) {
            inputValue.style.borderColor = "#a33"
            msg.innerText = "Too many countries"
            return
        }

        const filtered = countries.filter(item => {
            return item.name.toLocaleLowerCase() === value.toLocaleLowerCase()
        })

        if (filtered.length === 1) {
            msg.innerText = ""
            inputValue.value = ""
            inputValue.style.borderColor = "#ced4da"
            inputValue.focus()
            putElement(filtered[0])
        } else {
            inputValue.style.borderColor = "#a33"
            msg.innerText = "Doesn't exists"
        }
    }
})

function putElement(element) {

    const color = returnColor();
    const id = createId()

    const params = typeOfValue(element[data.compare], data.compare)

    const object = {
        name: element.name,
        ...params,
        color,
        id
    }

    data.countriesSelected.push(object)
    putCheckPoints(object);

    putBlock(object);
    updateGraphics();
    updateStatistics(object);
    updateTotal();

    // Especial
    if (data.compare === "area") {
        updateComparation()
    }
}

function typeOfValue(value, compare) {
    if (compare === "population") {
        data.compare = "population"
        return {
            params: `${format(value)}`,
            value
        }
    } else if (compare === "area") {
        data.compare = "area"
        return {
            params: `${format(value)}km²`,
            value
        }
    }
}

export default putElement;