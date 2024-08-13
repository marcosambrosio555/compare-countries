import countries from "./countries.js";
import createId from "./createId.js";
import { updateGraphics } from "./graphics.js";
import putBlock from "./putBlock.js";
import putCheckPoints from "./putCheckPoint.js";
import updateStatistics from "./statistics.js";
import updateTotalArea from "./totalArea.js";
import { returnColor } from "./utilities.js";

export let data = {
    moving: false,
    area: 0,
    colors: [
        "#ff0000", "#ffbf00", "#ffff00", "#80ff00", "#008000", "#00ffff",
        "#0040ff", "#8000ff", "#ff00bf", "#f0a8a8", "#f0dea8", "#f0f0a8",
        "#ccf0a8", "#bef4be", "#a8f0f0", "#a8baf0", "#cca8f0", "#f0a8de",
        "#6b2e2e", "#6b5c2e", "#6b6b2e", "#4d6b2e", "#4a614a", "#2e6b6b",
        "#2e3d6b", "#4d2e6b", "#6b2e5c",
    ],
    half: 0,
    zIndex: 2,
    selectedBlock: null,
    block: null,
    countriesSelected: [],
    deviceWidth: window.innerWidth
}

// form

const inputValue = document.querySelector(".form form input")
const btnAdd = document.querySelector(".form form button")
const msg = document.querySelector(".form form .msg")
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

btnAdd.addEventListener("click", (e) => {
    e.preventDefault();
    if (inputValue.value) {

        if (data.countriesSelected.length >= 20) {
            inputValue.style.borderColor = "#a33"
            msg.innerText = "Too many countries"
            return
        }

        const filtered = countries.filter(item => {
            return item.name.toLocaleLowerCase() === inputValue.value.toLocaleLowerCase()
        })

        if (filtered.length === 1) {
            msg.innerText = ""
            inputValue.value = ""
            inputValue.style.borderColor = "#333"
            inputValue.focus()
            putElement(filtered[0])
        } else {
            inputValue.style.borderColor = "#a33"
            msg.innerText = "Doesn't exists"
        }
    }
})

// putElement({ name: "Russia", area: 17098300 })

function putElement(element) {

    const color = returnColor();
    const id = createId()

    const object = {
        ...element,
        color,
        id
    }

    data.countriesSelected.push(object)
    putBlock(object);
    putCheckPoints(object);
    updateStatistics(object)
    updateGraphics();
    updateTotalArea();
}

const navLinks = document.querySelectorAll(".nav-links a")

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        document.querySelector(".nav-links a.active").classList.remove("active")
        link.classList.add("active")
    })
})