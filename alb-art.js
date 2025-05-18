document.addEventListener('DOMContentLoaded', () => {
    const colorThief = new ColorThief();
    const images = document.querySelectorAll('.content img, .collection img');

    images.forEach(img => {
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

    function setFontSize() {
        // Handle auto font size for elements with data-auto-font-size
        const autoFontSizeElements = document.querySelectorAll('[data-auto-font-size]');
        autoFontSizeElements.forEach(element => {
            if (!element.hasAttribute('data-font-size-min-syt-id')) {
                const fontSize = getAutoFontSize(element);
                element.style.fontSize = fontSize - 2 + 'px';
            }
        });

        // Handle elements with data-font-size-min-syt-id
        const sytIdElements = document.querySelectorAll('[data-font-size-min-syt-id]');
        const sytIdGroups = {};

        // Group elements by their data-font-size-min-syt-id
        sytIdElements.forEach(element => {
            const sytId = element.getAttribute('data-font-size-min-syt-id');
            if (!sytIdGroups[sytId]) {
                sytIdGroups[sytId] = [];
            }
            sytIdGroups[sytId].push(element);
        });

        // Calculate and apply the smallest font size for each group
        Object.keys(sytIdGroups).forEach(sytId => {
            const elements = sytIdGroups[sytId];
            const fontSizes = elements.map(element => getAutoFontSize(element));
            const minFontSize = Math.min(...fontSizes);
            elements.forEach(element => {
                element.style.fontSize = minFontSize - 2 + 'px';
            });
        });
    }

    setFontSize();

    // Recalculate font sizes on window resize
    window.addEventListener('resize', () => {
        setFontSize();
    });

    setTimeout(setFontSize, 1000); // Initial call to set font size after a short delay
});

function getAutoFontSize(element) {
    const fontSize = parseInt(window.getComputedStyle(element).fontSize);
    const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
    const maxWidth = element.clientWidth;
    const text = element.innerText;
    let fontSizeToTry = fontSize;
    let textWidth = 0;
    let textHeight = 0;

    const textElement = document.createElement('span');
    textElement.style.fontFamily = window.getComputedStyle(element).fontFamily;
    textElement.style.position = 'absolute';
    textElement.style.visibility = 'hidden';
    textElement.style.whiteSpace = 'nowrap';
    textElement.innerText = text;

    document.body.appendChild(textElement);

    textElement.style.fontSize = fontSizeToTry + 'px';
    textWidth = textElement.clientWidth;
    textHeight = textElement.clientHeight;

    while (textWidth > maxWidth || textHeight > lineHeight) {
        fontSizeToTry -= 1;
        textElement.style.fontSize = fontSizeToTry + 'px';
        textWidth = textElement.clientWidth;
        textHeight = textElement.clientHeight;
    }

    document.body.removeChild(textElement);
    return fontSizeToTry;
}

function loco() {
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        multiplier: 1,
        lerp: 0.1
    });

    // Handle skip link
    document.querySelector('.skip-main').addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector('#main');
        target.focus();
        scroll.scrollTo(target);
    });

    // Update scroll on resize
    window.addEventListener('resize', () => scroll.update());
}

loco();

document.addEventListener('DOMContentLoaded', () => {
    loco();
});