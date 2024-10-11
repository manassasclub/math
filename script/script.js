const gridContainer = document.querySelector('.grid');
const gridSize = 20; // Number of rows and columns
var currentScreen = "main";
if (localStorage.getItem('lastVisitedPage') != null) {
    currentScreen = localStorage.getItem('lastVisitedPage');
    document.querySelector('.navbar-item.current-page').classList.remove('current-page');
    document.querySelector(`[to="${currentScreen}"]`).classList.add('current-page');
}
var screenNames = ["main", "about", "mission", "whales"];

const symbols = ["+", "-", "%", "×", "=", "√", "∞", "π", "e"];
var posForRandNums = [0, 1];
var symbCount = 0;
var mobileCount = 0;

var is_whales = false;
// var is_whales = (Math.random() * 1000000) < 1.5;

function clearGrid() {
    symbCount = 0;
    mobileCount = 0;
    posForRandNums = [0, 1];
    gridContainer.innerHTML = "";
}

// Create grid cells dynamically
function createGrid() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        const symbol = document.createElement('span');
        const whale = document.createElement('img');
        whale.src = "./script/whale.png";
        whale.width = 50;
        whale.classList.add('whale');
        if (!is_whales) {
            symbol.textContent = symbols[symbCount % symbols.length];
            if (posForRandNums.includes(i)) {
                symbol.textContent = Math.round(Math.random()*9);
                posForRandNums = [posForRandNums[0]+5,posForRandNums[1]+5];
            }
            cell.appendChild(symbol);
        }
        else {
            cell.appendChild(whale);
        }
        symbCount++;
        gridContainer.appendChild(cell);
        if (i % symbols.length === 0) {
            symbCount += 5;
            mobileCount += 2;
        }
        mobileCount++;
        // when held down
        var mouseDown = false;
        var count = 0;
        var timeOut = 0;
        cell.addEventListener('mousedown', () => {
            mouseDown = true;
            count++;
            if (count > 1) {
                clearTimeout(timeOut);
            }
            // if (count > 10) {
            //     count = 0;
            //     let userInput = prompt('Are you a bloger?');
            //     if (!userInput.toLowerCase().includes('n') && userInput.toLowerCase().includes('y')) {
            //         let password = prompt('Enter your password');
            //         if (password == '2+2!=5') {
            //             window.location.href = 'https:///';
            //         }
            //     }
            // }
            if (count > 10) {
                count = 0;
                const game = document.createElement('div');
                game.style.width = "100%";
                game.style.height = "150%";
                if (document.getElementById('secret').innerHTML == "") {
                    document.getElementById('secret').style.display = "flex";
                    game.innerHTML = `
                      <iframe id="game" src="https://www.onlinegames.io/games/2021/unity2/draw-here/index.html" 
                        width="100%" height="100%" scrolling="auto" frameBorder="0"
                          style="border:0;">
                      </iframe>
                    `;
                    
                    document.getElementById('secret').appendChild(game);
                }
            }
        });
        cell.addEventListener('mouseup', () => {
            mouseDown = false;
            timeOut = setTimeout(() => {
                count = 0;
            }, 500);
        })
        if (window.outerWidth > 560 && !is_whales) {
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
        } else {
            // console.log("i", i);
            // one by one highlight cells in order
            addConstantGlow(gridContainer, mobileCount, gridSize, 4000);
        }
        if (!is_whales) {
        cell.addEventListener('dblclick', () => {
            gridContainer.children[i].classList.add('longerglow');
            setTimeout(() => {
                gridContainer.children[i].classList.remove('longerglow');
            }, 4000);
        });
        }  
    }
}

function addConstantGlow(gridContainer, i, gridSize, totalTimeToTravel=5000) {
    setTimeout(() => {
        gridContainer.children[i].classList.add('glow-bright');
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
    }, (totalTimeToTravel/gridSize*gridSize) * i);
    setTimeout(() => {
        for (let j = 0; j < gridSize * gridSize; j++) {
            gridContainer.children[j].classList.remove('glow');
            gridContainer.children[j].classList.remove('glowlow');
            gridContainer.children[j].classList.remove('glow-bright');
            gridContainer.children[j].classList.remove('radtopleft');
            gridContainer.children[j].classList.remove('radtopright');
            gridContainer.children[j].classList.remove('radbottomleft');
            gridContainer.children[j].classList.remove('radbottomright');
        }
        // addConstantGlow(gridContainer, i, gridSize);
    }, (500 + (totalTimeToTravel/gridSize*gridSize)) * i);
    if (i == 0) {
        setTimeout(() => {
            addConstantGlow(gridContainer, i, gridSize, totalTimeToTravel);
        }, totalTimeToTravel);
    }
}

async function loadMarkdown(page) {
    try {
        await fetch(`public/${page}.md`).then(response => response.text())
        .then(text => {
            markdownText = text;
        });
        localStorage.setItem('lastVisitedPage', page);
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
    is_whales = false;
    while (varMatch) {
        const key = varMatch[1].trim();
        switch (key) {
            case "title":
                document.title = varMatch[2];
                break;
            case "backgroundImage":
                console.log("background-image");
                document.body.style.background = varMatch[2];
                break;
            case "backgroundColor":
                document.body.style.backgroundColor = varMatch[2];
                break;
            case "textColor":
                document.body.style.color = varMatch[2];
                break;
            case "whales-grid":
                console.log(varMatch[2].includes("t"));
                if (varMatch[2].toLowerCase().includes("t"))
                is_whales = true;
                break;
            default:
                r.style.setProperty(`--${key}`, varMatch[2]);
                break;
        }
        clearGrid();
        createGrid();

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
                    classes.push(classMatch[1]);
                    if (classMatch[2]) {
                        content = classMatch[2];
                    }
                    line = line.replace("."+classMatch[1], '');
                    classMatch = line.trim().match(/^\.([^.\s]+)\s*(.*)$/m);
                }

                if (classes.length>0 && openedTags.includes(classes[classes.length-1])) {
                    currentDiv = document.getElementsByClassName(currentDiv)[document.getElementsByClassName(currentDiv).length-1].parentElement.classList[0];
                    delete openedTags[openedTags.indexOf(classes[classes.length-1])];
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

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('navbar-item')) {
        document.getElementById('content-container').innerHTML = "";
        document.querySelector('.navbar-item.current-page').classList.remove('current-page');
        event.target.classList.add('current-page');
        currentScreen = event.target.getAttribute('to');
        loadMarkdown(currentScreen);
    }
});

// Call the function on page load
window.onload = loadMarkdown(currentScreen);