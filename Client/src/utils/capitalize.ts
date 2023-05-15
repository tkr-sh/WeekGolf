const capitalize = (str: String) => {
    return str.length > 0 ? str[0].toUpperCase() + str.slice(1).toLowerCase() : "";
}

export default capitalize;