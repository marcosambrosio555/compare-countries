import { data } from "./script.js";

const dashboard = document.querySelector(".content .dashboard")

let rectLeft = dashboard.getBoundingClientRect().left
let rectTop = dashboard.getBoundingClientRect().top
let leftPos;
let topPos;



function putBlock({ area, color, id }) {

    const block = document.createElement("div")

    const width = data.deviceWidth >= 540 ? 200 : 300

    const scaleArea = Number(area / width)

    block.classList.add("box")

    // Desktop
    block.addEventListener("mousedown", () => {
        if (!data.selectedBlock) {
            data.half = Number(Math.sqrt(scaleArea) / 2);
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
    // block.addEventListener("mousemove", () => {

    //     if (block.id !== data.selectedBlock) {
    //         data.moving = false
    //     } else {
    //         data.moving = true
    //     }

    // })


    /* Mobile */
    block.addEventListener("touchstart", (e) => {
        e.preventDefault()
        if (!data.selectedBlock) {
            data.half = Number(Math.sqrt(scaleArea) / 2);
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
    // block.addEventListener("touchmove", () => {

    //     if (block.id !== data.selectedBlock) {
    //         data.moving = false
    //     } else {
    //         data.moving = true
    //     }

    // });

    block.style.width = `${Math.sqrt(scaleArea)}px`
    block.style.height = `${Math.sqrt(scaleArea)}px`
    block.style.background = color
    block.id = id
    data.zIndex++;
    block.style.zIndex = data.zIndex;

    dashboard.appendChild(block)

}

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


export default putBlock;