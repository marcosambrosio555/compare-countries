function createId() {

    const digits = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let id = ""

    for (let i = 0; i < 15; i++) {
        const numberRandom = Math.floor(Math.random() * digits.length)
        id += digits.charAt(numberRandom)
    }

    return id;

}


export default createId;