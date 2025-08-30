let textInput = '';
let wordsToConnect = [];
let maxConnections = 0;
let lineColor = '#ff0000';
let lineAlpha = 255;
let lineThickness = 1;
let backgroundColor = '#ffffff';
let fontColor = '#000000';
let selectedFont = 'EB Garamond';
let noiseLevel = 0;
let resolutionScale = 1;
let fontSize = 16; // New font size variable
let positions = [];
let canvas;

function setup() {
    canvas = createCanvas(100, 100);
    canvas.parent('canvas-container');
    noLoop();
}

function calculateCanvasSize() {
    resolutionScale = document.getElementById('resolution').value / 100;
    fontSize = parseInt(document.getElementById('fontSize').value); // Get font size from slider
    let textSizeValue = Math.round(fontSize * resolutionScale);
    textSize(textSizeValue);
    textFont(selectedFont);
    let lineHeight = textSizeValue * 1.5;
    let margin = 20 * resolutionScale;
    let maxWidth = Math.min(windowWidth - 40, 1200 * resolutionScale) - margin * 2;

    let words = textInput.split(/\s+/);
    let x = margin;
    let y = margin;
    let maxLineWidth = 0;
    let currentLineWidth = 0;

    for (let word of words) {
        let wordWidth = textWidth(word + ' ');
        if (x + wordWidth > maxWidth) {
            maxLineWidth = Math.max(maxLineWidth, currentLineWidth);
            x = margin;
            y += lineHeight;
            currentLineWidth = 0;
        }
        currentLineWidth = x + wordWidth;
        x += wordWidth;
    }
    maxLineWidth = Math.max(maxLineWidth, currentLineWidth);

    let canvasWidth = Math.max(300 * resolutionScale, maxLineWidth + margin * 2);
    let canvasHeight = Math.max(200 * resolutionScale, y + lineHeight + margin);
    return { width: canvasWidth, height: canvasHeight };
}

function drawVisualization() {
    background(backgroundColor);
    positions = [];

    let textSizeValue = Math.round(fontSize * resolutionScale); // Use fontSize variable
    textSize(textSizeValue);
    textFont(selectedFont);
    let lineHeight = textSizeValue * 1.5;
    let margin = 20 * resolutionScale;
    let maxWidth = width - margin * 2;

    let words = textInput.split(/\s+/);
    let x = margin;
    let y = margin;

    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let wordWidth = textWidth(word + ' ');
        if (x + wordWidth > maxWidth) {
            x = margin;
            y += lineHeight;
        }
        let cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
        if (wordsToConnect.includes(cleanWord)) {
            positions.push({ word: cleanWord, x: x + wordWidth / 2, y: y + lineHeight / 2 });
        }
        fill(fontColor);
        text(word, x, y);
        x += wordWidth;
    }

    stroke(red(lineColor), green(lineColor), blue(lineColor), lineAlpha);
    strokeWeight(lineThickness);
    let connections = 0;
    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            if (positions[i].word !== positions[j].word) {
                if (maxConnections > 0 && connections >= maxConnections) break;
                let noiseOffset = noiseLevel / 100;
                let x1 = positions[i].x + (noise(noiseOffset * i) - 0.5) * noiseLevel;
                let y1 = positions[i].y + (noise(noiseOffset * (i + 1000)) - 0.5) * noiseLevel;
                let x2 = positions[j].x + (noise(noiseOffset * j) - 0.5) * noiseLevel;
                let y2 = positions[j].y + (noise(noiseOffset * (j + 1000)) - 0.5) * noiseLevel;
                line(x1 - 5, y1 - 15, x2 - 5, y2 - 15);
                connections++;
            }
        }
        if (maxConnections > 0 && connections >= maxConnections) break;
    }
}

document.getElementById('downloadBtn').addEventListener('click', () => {
    textInput = document.getElementById('inputText').value;
    wordsToConnect = document.getElementById('wordsToConnect').value
        .split(',')
        .map(word => word.trim().replace(/[^a-zA-Z]/g, '').toLowerCase())
        .filter(word => word.length > 0);
    maxConnections = parseInt(document.getElementById('maxConnections').value);
    lineColor = document.getElementById('lineColor').value;
    lineAlpha = parseInt(document.getElementById('lineAlpha').value);
    lineThickness = parseInt(document.getElementById('lineThickness').value);
    backgroundColor = document.getElementById('backgroundColor').value;
    fontColor = document.getElementById('fontColor').value;
    selectedFont = document.getElementById('fontSelect').value;
    noiseLevel = parseInt(document.getElementById('noiseLevel').value);
    fontSize = parseInt(document.getElementById('fontSize').value); // Capture font size

    let { width, height } = calculateCanvasSize();
    resizeCanvas(width, height);
    drawVisualization();
});

document.getElementById('confirmDownloadBtn').addEventListener('click', () => {
    saveCanvas(canvas, `text-visualization-${resolutionScale * 100}percent`, 'png');
});

function windowResized() {
    let { width, height } = calculateCanvasSize();
    resizeCanvas(width, height);
    drawVisualization();
}