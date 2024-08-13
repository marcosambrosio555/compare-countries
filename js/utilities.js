import { data } from "./script.js"

const dashboard = document.querySelector(".content .dashboard")


function returnColor() {
    const numberRandom = Math.floor(Math.random() * data.colors.length)
    const color = data.colors.splice(numberRandom, 1)
    return color[0]
}

function deleteBlock(id) {
    dashboard.querySelector(`#${id}`).remove()
}

function increaseIndex(id) {
    data.zIndex++;
    dashboard.querySelector(`#${id}`).style.zIndex = data.zIndex
}


export { returnColor, deleteBlock, increaseIndex }