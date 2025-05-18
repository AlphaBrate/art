
document.addEventListener('DOMContentLoaded', () => {
    const colorThief = new ColorThief();
    const images = document.querySelectorAll('.content img, .collection img');

    images.forEach(img => {
        // Ensure image is loaded before extracting color
        if (img.complete) {
            setGlowColor(img);
        } else {
            img.addEventListener('load', () => setGlowColor(img));
        }
    });

    function setGlowColor(img) {
        try {
            const dominantColor = colorThief.getColor(img);
            const rgbColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
            img.style.setProperty('--glow-color', rgbColor);
        } catch (e) {
            console.error('Error extracting color:', e);
        }
    }
});

// get data-auto-font-size

function getAutoFontSize(element) {
    // get the highest font size that in one line
    const fontSize = parseInt(window.getComputedStyle(element).fontSize);
    const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
    const maxWidth = element.clientWidth;
    const text = element.innerText;
    const words = text.split(' ');
    let fontSizeToTry = fontSize;
    let textWidth = 0;
    let textHeight = 0;
    let textElement = document.createElement('span');
    textElement.style.fontSize = fontSizeToTry + 'px';
    textElement.style.fontFamily = window.getComputedStyle(element).fontFamily;
    textElement.style.position = 'absolute';
    textElement.style.visibility = 'hidden';
    textElement.style.whiteSpace = 'nowrap';
    textElement.innerText = text;
    document.body.appendChild(textElement);
    textWidth = textElement.clientWidth;
    textHeight = textElement.clientHeight;
    document.body.removeChild(textElement);
    while (textWidth > maxWidth || textHeight > lineHeight) {
        fontSizeToTry -= 1;
        textElement = document.createElement('span');
        textElement.style.fontSize = fontSizeToTry + 'px';
        textElement.style.fontFamily = window.getComputedStyle(element).fontFamily;
        textElement.style.position = 'absolute';
        textElement.style.visibility = 'hidden';
        textElement.style.whiteSpace = 'nowrap';
        textElement.innerText = text;
        document.body.appendChild(textElement);
        textWidth = textElement.clientWidth;
        textHeight = textElement.clientHeight;
        document.body.removeChild(textElement);
    }
    return fontSizeToTry;
}

const autoFontSizeElements = document.querySelectorAll('[data-auto-font-size]');
autoFontSizeElements.forEach(element => {
    const fontSize = getAutoFontSize(element);
    element.style.fontSize = fontSize - 2 + 'px';
});