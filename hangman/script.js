let wordsLevel1 = ["bug", "loop", "code", "data", "byte", "int", "char", "bool", "float", "if"];
let wordsLevel2 = ["script", "server", "python", "object", "method", "array", "string", "class", "module", "query"];
let wordsLevel3 = ["function", "variable", "compiler", "algorithm", "debugging", "inheritance", "polymorphism", "recursion", "framework", "database"];

let wrongGuesses = document.getElementById("counter");
let gameResult = document.getElementById("gameResult");

let wrongGuessesCounter = 0;
let guessWord = "";
let guessedLetters = [];

let newGame = () => {
    let level;
    let mainBox = document.getElementsByClassName("main-div");

    mainBox[0].style.display = "none";

    let selectDificultyDiv = document.createElement("div");
    selectDificultyDiv.className = "dificulties";
    document.body.appendChild(selectDificultyDiv);

    let lettersDiv = document.getElementsByClassName("letters-div");
    if (lettersDiv[0].firstChild) {
        while (lettersDiv[0].firstChild) {
            lettersDiv[0].removeChild(lettersDiv[0].firstChild);
        }
    }

    if (gameResult.innerHTML !== "") {
        gameResult.innerHTML = "";
    }

    if (wrongGuessesCounter > 0) {
        wrongGuessesCounter = 0;
        wrongGuesses.innerHTML = "" + wrongGuessesCounter;
    }

    guessedLetters = [];

    let dificulties = ["easy", "normal", "hard"];
    dificulties.forEach(dificultie => {
        let button = document.createElement("button");
        button.innerHTML = dificultie;
        button.addEventListener('click', () => {
            level = dificultie;
            document.body.removeChild(selectDificultyDiv);
            mainBox[0].style.display = "inline";

            Game(level);
        });

        selectDificultyDiv.appendChild(button);
    })
}


function Game(level) {
    let words;

    switch (level) {
        case "easy":
            words = wordsLevel1;
            break;
        case "normal":
            words = wordsLevel2;
            break;
        case "hard":
            words = wordsLevel3;
            break;
        default:
            words = undefined;
            break;
    }

    let index = Math.floor(Math.random() * words.length);
    guessWord = words[index];
    words.splice(index, 1);

    console.log(`The selected word is: ${guessWord}`);

    createLetters(guessWord);
    createKeyboard();
}

let createLetters = (word) => {
    let lettersDiv = document.getElementsByClassName("letters-div")[0];
    lettersDiv.innerHTML = "";

    for (let i = 0; i < word.length; i++) {
        let newP = document.createElement("p");
        newP.id = "" + i;
        newP.className = "letters-paragraf";
        newP.innerHTML = "_";

        if (i === 0) {
            newP.innerHTML = word[0];
        } else if (i === word.length - 1) {
            newP.innerHTML = word[word.length - 1];
        }

        lettersDiv.appendChild(newP);
    }
}

let createKeyboard = () => {
    let keyboardDiv = document.querySelector(".virtual-keyboard");
    if (!keyboardDiv) {
        keyboardDiv = document.createElement("div");
        keyboardDiv.className = "virtual-keyboard";
        document.querySelector(".main-div").appendChild(keyboardDiv);
    }

    keyboardDiv.innerHTML = "";

    let letters = "abcdefghijklmnopqrstuvwxyz".split("");
    letters.forEach(letter => {
        let button = document.createElement("button");
        button.innerHTML = letter;
        button.disabled = guessedLetters.includes(letter);
        button.addEventListener("click", () => handleLetterClick(letter, button));
        keyboardDiv.appendChild(button);
    });
};

let handleLetterClick = (letter, button) => {
    console.log(`Letter clicked: ${letter}`);

    if (guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);
    console.log(`Guessed letters: ${guessedLetters}`);

    let positions = checkForLetters(guessWord, letter);
    console.log(`Positions of the letter: ${positions}`);

    if (positions.length === 0) {
        wrongGuessesCounter++;
        wrongGuesses.innerHTML = `${wrongGuessesCounter}`;
    } else {
        for (let i = 0; i < positions.length; i++) {
            let paragraf = document.getElementById(`${positions[i]}`);
            paragraf.innerHTML = guessWord[positions[i]];
        }
    }

    button.disabled = true;

    if (wrongGuessesCounter >= 6) {
        gameResult.innerHTML = `Game over. The word was ${guessWord}.`;
        setTimeout(() => {
            askWindow();
        }, 2000);
    }

    if (checkForWin(guessWord)) {
        gameResult.innerHTML = "Congratulations! You guessed the word!";
        setTimeout(() => {
            askWindow();
        }, 2000);
    }
};

function checkForLetters(word, letter) {
    let positions = [];

    for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
            positions.push(i);
        }
    }

    return positions;
}

function checkForWin(word) {
    for (let i = 0; i < word.length; i++) {
        let p = document.getElementById(`${i}`);
        if (p.innerHTML === "_") {
            return false;
        }
    }
    return true;
}

function askWindow() {
    let div = document.createElement("div");
    div.className = "ask-window";
    let mainBox = document.getElementsByClassName("main-div");
    mainBox[0].style.display = "none";
    document.body.appendChild(div);
    let p = document.createElement("p");
    p.innerHTML = "Do you want to play again?";
    let yesButton = document.createElement("button");
    yesButton.innerHTML = "Yes";
    yesButton.addEventListener('click', () => {
        newGame();
        div.remove();
    });
    let noButton = document.createElement("button");
    noButton.innerHTML = "No";
    noButton.addEventListener('click', () => {
        div.remove();
    });

    div.appendChild(p);
    div.appendChild(yesButton);
    div.appendChild(noButton);
}

newGame();
