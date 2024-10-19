export const setDataInLocalStroge = (tokenName, token) => {
    return localStorage.setItem(tokenName, token);
}

export const getDataFromLocalStroge = (tokenName) => {
    return localStorage.getItem(tokenName);
}

export const removeLocalStorage = (tokenName) => {
    return localStorage.removeItem(tokenName);
}