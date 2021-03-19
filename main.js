const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(myField, playerPos) {
        this._field = myField;
        this._rows = this._field.length;
        this._columns = this._field[0].length;
        this._playerPos = playerPos;
    }

    get field() {
        return this._field;
    }

    get rows() {
        return this._rows;
    }

    get columns() {
        return this._columns;
    }

    get playerPos() {
        return this._playerPos;
    }

    print() {
        this._field.forEach(arr => console.log(arr.join('')));
    }

    addPlayerPositon(pos) {
        this._field[pos[0]][pos[1]] = pathCharacter;
    }

    static _generateWeightedArray(holePercentage) {
        let characters = [hole, fieldCharacter];
        holePercentage /= 10;
        let fieldPercentage = 10 - holePercentage;
        
        let charWeights = [holePercentage, fieldPercentage];
        let weightedChars = [];
        let currentChar = 0;

        while (currentChar < characters.length) {
            for (let i = 0; i < charWeights[currentChar]; i++) {
                weightedChars.push(characters[currentChar]);
            }
            currentChar++;
        }

        return weightedChars;
    }

    static generatePlayerPosition(rows, columns) {
        let row = Math.floor(Math.random() * rows);
        let column = Math.floor(Math.random() * columns);

        return [row, column];
    }

    static generateField(rows, columns, holePercentage, playerPos) {
        let fieldArr = [];
        let weightedChars = this._generateWeightedArray(holePercentage);
        let hasHat = false;

        for (let i = 0; i < rows; i++) {
            let rowArr = [];

            for (let j = 0; j < columns; j++) {
                if (i === playerPos[0] && j === playerPos[1]) {
                    rowArr.push(pathCharacter);
                    continue;
                }

                let currentChar;
                do {
                    let randomCharIndex = Math.floor(Math.random() * 10); // 10 because it's the totalWeight availlable -> sum of all weights
                    currentChar = weightedChars[randomCharIndex]; 
                } while (currentChar === hat && hasHat)
                
                if (currentChar === hat && !hasHat)
                    hasHat = true;

                rowArr.push(currentChar);

            }
                
            fieldArr.push(rowArr);
        }

        if (!hasHat) {
            let randomRow = 0;
            let randomColumn = 0;

            do {
                randomRow = Math.floor(Math.random() * rows);
                randomColumn = Math.floor(Math.random() * columns);

            } while (randomRow === playerPos[0] && randomColumn === playerPos[1])
            
            hasHat = true;
            fieldArr[randomRow][randomColumn] = hat;
        }

        return fieldArr;
    }
}


function generateBoard() {
    const rows = 10;
    const columns = 10;
    const playerPos = Field.generatePlayerPosition(rows, columns);
    const fieldArr = Field.generateField(rows, columns, 30, playerPos);
    const myField = new Field(fieldArr, playerPos);

    return myField;
}


function changePosition(direction, coordinates) {
    let newCoordinates = coordinates;

    switch(direction) {
        case 'd': newCoordinates[0] += 1; break;
        case 'u': newCoordinates[0] -= 1; break;
        case 'r': newCoordinates[1] += 1; break;
        case 'l': newCoordinates[1] -= 1; break;
    }

    return newCoordinates;
}

function checkPosition(pos, myField) {

    if (pos[0] < 0 || pos[0] > (myField.rows - 1) || pos[1] < 0 || pos[1] > (myField.columns - 1)) {
        console.log('Out of bounds!');
        return true;
    }
    if (myField.field[pos[0]][pos[1]] === hole) {
        console.log('Opps! You just fell down a hole.');
        return true;
    }
    else if (myField.field[pos[0]][pos[1]] === hat) {
        console.log('Congrats! You just found your hat.');
        return true;
    }

    return false;
}

function playGame() {
    let playAgain = 'y';

    while (playAgain === 'y') {
        let myField = generateBoard();
        let currentCoordinates = myField.playerPos;

        while (1) {
            myField.print();
            const moveDirection = prompt('Which way? ').toLowerCase();
            currentCoordinates = changePosition(moveDirection, currentCoordinates);

            if (checkPosition(currentCoordinates, myField))
                break;

            myField.addPlayerPositon(currentCoordinates);
        }

        playAgain = prompt('Play again? (type y if yes and n if no) ').toLowerCase();
    }
}

playGame();