import { calculateScale } from "./calculateScale.js";
import { data } from "./script.js";

const dashboard = document.querySelector(".content .dashboard")

let rectLeft
let rectTop
let leftPos;
let topPos;

updateClientRect()

export function updateClientRect() {
    rectLeft = dashboard.getBoundingClientRect().left
    rectTop = dashboard.getBoundingClientRect().top
    requestAnimationFrame(updateClientRect)
}


function putBlock({ id, color, value }) {

    const block = document.createElement("div")
    const scaleDiv = calculateScale()

    const scale = Number(value / scaleDiv)

    block.classList.add("box")

    // Desktop
    block.addEventListener("mousedown", () => {
        if (!data.selectedBlock) {
            data.half = Number(Math.sqrt(scale) / 2);
            data.selectedBlock = id
            data.block = block
            data.moving = true;
            data.zIndex++;
            block.style.zIndex = data.zIndex;
        }
    })
    block.addEventListener("mouseup", () => {
        data.selectedBlock = null
        data.block = null
        data.moving = false;
    })


    /* Mobile */
    block.addEventListener("touchstart", (e) => {
        e.preventDefault()
        if (!data.selectedBlock) {
            data.half = Number(Math.sqrt(scale) / 2);
            data.selectedBlock = id
            data.moving = true;
            data.zIndex++;
            block.style.zIndex = data.zIndex;
            data.block = block
        }
    }, { passive: false });

    block.addEventListener("touchend", () => {
        data.moving = false;
        data.selectedBlock = null
        data.block = null
    });

    putBlockStyle(block, id, color, value, scale)

    dashboard.appendChild(block)

}

function putBlockStyle(block, id, color, value, scale) {
    block.style.width = `${Math.sqrt(scale)}px`
    block.style.height = `${Math.sqrt(scale)}px`
    block.style.background = color
    block.id = id
    data.zIndex++;
    block.style.zIndex = data.zIndex;

}

// Desktop
dashboard.addEventListener("mousemove", (e) => {

    const { clientX, clientY } = e;

    leftPos = clientX - rectLeft - data.half
    topPos = clientY - rectTop - data.half

    if (data.block) {
        if (data.moving && data.block.id === data.selectedBlock) {
            data.block.style.left = `${leftPos}px`
            data.block.style.top = `${topPos}px`
        }
    }

})

// Mobile
dashboard.addEventListener("touchmove", (e) => {

    const { clientX, clientY } = e.touches[0];

    leftPos = clientX - rectLeft - data.half
    topPos = clientY - rectTop - data.half

    if (data.block) {
        if (data.moving && data.block.id === data.selectedBlock) {
            data.block.style.left = `${leftPos}px`
            data.block.style.top = `${topPos}px`
        }
    }

})

dashboard.addEventListener("dblclick", (e) => {
    data.moving = false;
    data.selectedBlock = null
    data.block = null
})


export default putBlock;