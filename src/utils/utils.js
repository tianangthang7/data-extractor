
export function asciiToHexa(str) {
    var backColor = [
        "#ffcdd2",
        "#ffd8b2",
        "#c8e6c9",
        "#b3e5fc",
        "#eccfff",
        "#fdcdff",
        "#d7cdff",
        "#cdeeff",
        "#f3ffcd",
        '#e28743',
        '#76b5c5',
        '#b2d6e4',
    ];
    var sum = 0;
    for (var n = 0; n < str.length; n++) {
        var hex = Number(str.charCodeAt(n));
        sum += hex;
    }
    sum += str.length;
    return backColor[sum % backColor.length];
}
export function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function translateSentence(sentence, mode) {
    function translateChar(char) {
        const isUpper = /[A-Z]/.test(char);
        let diff;
        switch (mode) {
            case "bold":
                diff = isUpper ? "𝗔".codePointAt(0) - "A".codePointAt(0) : "𝗮".codePointAt(0) - "a".codePointAt(0);
                break;
            case "italic":
                diff = isUpper ? "𝘈".codePointAt(0) - "A".codePointAt(0) : "𝘢".codePointAt(0) - "a".codePointAt(0);
        }
        try {
            return String.fromCodePoint(char.codePointAt(0) + diff);

        } catch (error) {
            console.log('error', char);
            return char;
        }
    }
    return sentence.replace(/[A-Za-z]/g, translateChar);
}

export const moneyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
});

export const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export function checkArraysOverlap(arr1, arr2) {
    return arr1.some(item => arr2.includes(item));
}

