import { data } from "./script.js";

function format(value) {
    return value.toLocaleString('pt-br', {
        minimumFractionDigits: 0
    })
}

function formatArea(value) {
    const numberFormated = value.toLocaleString('pt-br', {
        minimumFractionDigits: 0
    })

    return `${numberFormated}km²`
}


function putValueFormated(value) {
    if (data.compare === "area") {
        return formatArea(value)
    }
    if (data.compare === "population") {
        return format(value)
    }
}


export { format, putValueFormated }