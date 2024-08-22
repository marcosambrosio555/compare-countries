import { data } from "./script.js";
import { returnColor } from "./utilities.js";

function updateColor(atualColor, element) {
    const { id } = element;
    const newColor = returnColor()
    document.querySelector(`.dashboard #${id}`).style.background = newColor
    document.querySelector(`.checkpoints #${id} .color`).style.background = newColor
    document.querySelector(`.graphics #${id} .width`).style.background = newColor
    document.querySelector(`.total .block #${id}`).style.background = newColor
    document.querySelector(`.total .percent #${id} .color`).style.background = newColor
    document.querySelector(`.statistics #${id} .color`).style.background = newColor
    element.color = newColor;
    data.colors.push(atualColor)
}


export default updateColor;
