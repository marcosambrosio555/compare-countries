import { data } from "./script.js"

function calculateScale() {
    if (data.compare === "area") {
        return data.deviceWidth >= 540 ? 200 : 400
    }

    if (data.compare === "population") {
        return data.deviceWidth >= 540 ? 5000 : 10000
    }
}

export { calculateScale }