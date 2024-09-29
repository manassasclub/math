const gridContainer = document.querySelector('.grid');
const gridSize = 20; // Number of rows and columns

const symbols = ["+", "-", "%", "×", "=", "√", "∞", "π", "e"];
var posForRandNums = [0, 1];
var symbCount = 0;

// Create grid cells dynamically
for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    const symbol = document.createElement('span');
    symbol.textContent = symbols[symbCount % symbols.length];
    if (posForRandNums.includes(i)) {
        symbol.textContent = Math.round(Math.random()*9);
        posForRandNums = [posForRandNums[0]+5,posForRandNums[1]+5];
    }
    symbCount++;
    cell.appendChild(symbol);
    gridContainer.appendChild(cell);
    if (i % symbols.length === 0) {
        symbCount += 5;
    }

    // when held down
    var mouseDown = false;
    cell.addEventListener('mousedown', () => {
        mouseDown = true;
    });
    cell.addEventListener('mouseup', () => {
        mouseDown = false;
    })
    cell.addEventListener('mouseover', () => {
        if (i > 0) {
            gridContainer.children[i - 1].classList.add('glow');
        }
        if (i > gridSize) {
            gridContainer.children[i - gridSize].classList.add('glow');
            gridContainer.children[i - gridSize - 1].classList.add('glowlow');
            gridContainer.children[i - gridSize - 1].classList.add('radtopleft');
        }
        if (i > gridSize + 1) {
            gridContainer.children[i - gridSize + 1].classList.add('glowlow');
            gridContainer.children[i - gridSize + 1].classList.add('radtopright');
        }
        if (i + 1 < (gridSize * gridSize)) {
            gridContainer.children[i + 1].classList.add('glow');
        }
        if (i + gridSize < (gridSize * gridSize)) {
            gridContainer.children[i + gridSize].classList.add('glow');
            gridContainer.children[i + gridSize - 1].classList.add('glowlow');
            gridContainer.children[i + gridSize - 1].classList.add('radbottomleft');
        }
        if (i + gridSize + 1 < (gridSize * gridSize)) {
            gridContainer.children[i + gridSize + 1].classList.add('glowlow');
            gridContainer.children[i + gridSize + 1].classList.add('radbottomright');
        }
        if (mouseDown) {
            gridContainer.children[i].classList.add('longerglow');
            gridContainer.children[i].classList.add('radtopleft');
            gridContainer.children[i].classList.add('radtopright');
            gridContainer.children[i].classList.add('radbottomleft');
            gridContainer.children[i].classList.add('radbottomright');
            setTimeout(() => {
                gridContainer.children[i].classList.remove('longerglow');
                gridContainer.children[i].classList.remove('radtopleft');
                gridContainer.children[i].classList.remove('radtopright');
                gridContainer.children[i].classList.remove('radbottomleft');
                gridContainer.children[i].classList.remove('radbottomright');
            }, 1000);
        }
    });
    cell.addEventListener('mouseout', () => {
        for (let j = 0; j < gridSize * gridSize; j++) {
            gridContainer.children[j].classList.remove('glow');
            gridContainer.children[j].classList.remove('glowlow');
            gridContainer.children[j].classList.remove('radtopleft');
            gridContainer.children[j].classList.remove('radtopright');
            gridContainer.children[j].classList.remove('radbottomleft');
            gridContainer.children[j].classList.remove('radbottomright');
        }
        // const rand = Number(Math.floor(Math.random() * 1000));
        // if (rand == 0) {
        //     gridContainer.children[i].classList.add('longerglow');
        //     setTimeout(() => {
        //         gridContainer.children[i].classList.remove('longerglow');
        //     }, 4000);
        // }
    });

    cell.addEventListener('dblclick', () => {
        gridContainer.children[i].classList.add('longerglow');
        setTimeout(() => {
            gridContainer.children[i].classList.remove('longerglow');
        }, 4000);
    });
}



async function loadMarkdown() {
    var markdownText = "";
    try {
    // Fetch the markdown file from the server
    await fetch('public/main.md').then(response => response.text())
        .then(text => {
            markdownText = text;
        });
    } catch (error) {
        console.error('Error fetching the markdown file:', error);
        document.getElementById('content-container').innerText = 'Error loading content.';
    }

    if (markdownText == "") {
        return;
    }
    const contentBody = document.getElementsByClassName('content-body')[0];
    document.getElementById('content-container').innerHTML = "";
    
    const parser = new DOMParser();

    var r = document.querySelector(':root');
    // skip the ones that start with . 
    var varMatch = markdownText.match(/^#(.*)\s*=\s*(.*)$/m);
    while (varMatch) {
        const key = varMatch[1].trim();
        switch (key) {
            case "title":
                document.title = varMatch[2];
                break;
            default:
                r.style.setProperty(`--${key}`, varMatch[2]);
                break;
        }

        markdownText = markdownText.replace(varMatch[0], '');
        varMatch = markdownText.match(/^#(.*)\s*=\s*(.*)$/m);
    }
    marked.setOptions({
        gfm: true,  // GitHub Flavored Markdown
        breaks: true  // Treat single new lines as <br> (line breaks)
    });  

    const lines = markdownText.split('\n');
    const openedTags = [];
    var currentDiv = "content-container";
    for (let i = 0; i < lines.length; i++) {
        var line = lines[i];
        var classMatch = line.match(/^\.([^.\s]+)\s*(.*)$/m);
        var classes = [];
        if (classMatch) {
            while (classMatch && classMatch.length > 1) {
                // openedTags.push(classMatch[1]);
                // classes.push(classMatch[1]);
                markdownText = markdownText.replace(classMatch[0], '');
                var content = "";
                while (line.startsWith(".") && classMatch[1]) {
                    console.log("here", i, classMatch[1]);
                    classes.push(classMatch[1]);
                    if (classMatch[2]) {
                        content = classMatch[2];
                    }
                    line = line.replace("."+classMatch[1], '');
                    classMatch = line.trim().match(/^\.([^.\s]+)\s*(.*)$/m);
                }
                console.log(classes);
                if (classes.length>0 && openedTags.includes(classes[classes.length-1])) {
                    currentDiv = document.getElementsByClassName(currentDiv)[document.getElementsByClassName(currentDiv).length-1].parentElement.classList[0];
                    delete openedTags[openedTags.indexOf(currentDiv)];
                } else if (classes.length>0) {
                    const tempHtml = marked.parse(content);
                    if (!tempHtml || content == "") {
                        // console.log("ok");
                        for (let j = 0; j < classes.length; j++) {
                            const toImp = document.createElement('div');
                            toImp.classList.add(classes[j]);
                            document.getElementsByClassName(currentDiv)[document.getElementsByClassName(currentDiv).length-1].appendChild(toImp);
                            currentDiv = classes[j];
                            openedTags.push(classes[j]);
                        }
                    } else {
                        const toImp = parser.parseFromString(tempHtml, 'text/html').body.firstChild;
                        for (let j = 0; j < classes.length; j++) {
                            toImp.classList.add(classes[j]);
                        }
                        classes = [];
                        document.getElementsByClassName(currentDiv)[document.getElementsByClassName(currentDiv).length-1].appendChild(toImp);
                    }
                }
                line = line.replace("."+content, '');
                classMatch = line.trim().match(/^\.([^.\s]+)\s*(.*)$/m);
            }
            
        } else {
            // console.log("sure");
            const tempHtml = marked.parse(line);
            const toImp = parser.parseFromString(tempHtml, 'text/html').body.firstChild;
            if (!toImp) {
                document.getElementsByClassName(currentDiv)[document.getElementsByClassName(currentDiv).length-1].innerHTML += "<br>";
            } else {
                document.getElementsByClassName(currentDiv)[document.getElementsByClassName(currentDiv).length-1].appendChild(toImp);
                markdownText = markdownText.replace(line, '');
            }
        }
    }
    if (contentBody) {
        document.getElementById('content-container').appendChild(contentBody);
    }
    // Inject the HTML content into the output div
    // document.getElementById('content-container').innerHTML += htmlContent;
}

// Call the function on page load
window.onload = loadMarkdown;