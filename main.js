const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this._field = field;
        this._rows = this._field.length;
        this._columns = this._field[0].length;
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

    print() {
        this._field.forEach(arr => console.log(arr.join('')));
    }

    addPlayerPositon(pos) {
        this._field[pos[0]][pos[1]] = pathCharacter;
    }

    static _generateWeightedArray(holePercentage, total) {
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

    static generateField(rows, columns, holePercentage) {
        let fieldArr = [];
        let weightedChars = this._generateWeightedArray(holePercentage, rows * columns);
        let hasHat = false;

        for (let i = 0; i < rows; i++) {
            let rowArr = [];

            for (let j = 0; j < columns; j++) {
                if (i === 0 && j === 0)
                    rowArr.push(pathCharacter);
                else {
                    let currentChar;
                    do {
                        let randomCharIndex = Math.floor(Math.random() * 10); // 10 because it's the totalWeight availlable -> sum of all weights
                        currentChar = weightedChars[randomCharIndex]; 
                    } while (currentChar === hat && hasHat)
                    
                    if (currentChar === hat && !hasHat)
                        hasHat = true;
    
                    rowArr.push(currentChar);
                }
            }
                
            fieldArr.push(rowArr);
        }

        if (!hasHat) {
            let randomRow = 0;
            let randomColumn = 0;

            do {
                randomRow = Math.floor(Math.random() * rows);
                randomColumn = Math.floor(Math.random() * columns);

            } while (randomRow === 0 && randomColumn === 0)
            
            hasHat = true;
            fieldArr[randomRow][randomColumn] = hat;
        }

        return fieldArr;
    }
}
const fieldArr = Field.generateField(4, 5, 20);
const myField = new Field(fieldArr);

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

function checkPosition(pos) {
    let field = myField.field;

    if (pos[0] < 0 || pos[0] > field.rows || pos[1] < 0 || pos[1] > field.columns) {
        console.log('Out of bounds!');
        return true;
    }
    if (field[pos[0]][pos[1]] === hole) {
        console.log('Opps! You just fell down a hole.');
        return true;
    }
    else if (field[pos[0]][pos[1]] === hat) {
        console.log('Congrats! You just found your hat.');
        return true;
    }

    return false;
}

function playGame() {

    let currentCoordinates = [0, 0];

    while (1) {
        myField.print();
        const moveDirection = prompt('Which way? ').toLowerCase();
        currentCoordinates = changePosition(moveDirection, currentCoordinates);

        if (checkPosition(currentCoordinates))
            break;

        myField.addPlayerPositon(currentCoordinates);
    }
    
}

playGame();