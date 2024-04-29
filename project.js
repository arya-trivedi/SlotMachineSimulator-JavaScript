/*
    Author : Arya Trivedi
    Date : 04/29/2024
    Program : Slot Machine Simulator using JavaScript.

    Description: The program depicts a slot machine. The UI is prompt based, shows
    how to take input from user. The user will start with an amount they want to bet
    upon. Number of lines they want to bet and amount per line.

    The program will then spin the wheel based upon number of rowxcolumns. For simplicity
    we are keeping 3x3 grid. You can change the rows to as many as you like.

    The grid will be transposed and print a random result. If the symbols match on a
    line, the player wins. Else player looses and the balance is accordingly adjusted.

    The user can play again or quit the game. If the deposited amount becomes zero,
    the program will quite automatically saying all the initial balance is lost.
*/

//this is how we import prompt-sync library
const prompt = require("prompt-sync")();

//global variables
const ROWS = 3; //num of rows
const COLS = 3; //num of cols

//map of symbols and how many of them in our spin wheel
const SYMBOLS_COUNT = {
    "A" : 2, //only 2 rows of A, highest value or most rare
    "B" : 4,
    "C" : 6,
    "D" : 8 //8 rows of D, lowest value or most common
}
//map of symbols and value/worth of each of them
const SYMBOLS_VALUES = {
    "A" : 5, //if wheel row gets all A's, bet win is multiplied by 5
    "B" : 4, //if wheel row gets all A's, bet win is multiplied by 4
    "C" : 3,
    "D" : 2
}

//function to take deposit from the user
const deposit = () => {

    while(true){
        const depositAmount = prompt("Enter a deposit amount: ");
        //input is in string, convert into float
        const numberDepositAmount = parseFloat(depositAmount);
    
        //NaN -= Not a number, check if number entered is valid
        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log("Invalid deposit, Try again!");
        } else{
            return depositAmount; //if valid, retun deposit amount
        }
    }
}
//function to take number of lines user wants to play (between 1-3)
//the game requires how many lines player wants to match when the
//wheel is spinned
const getNumberofLines = () => {

    while(true){
        const lines = prompt("Enter number of lines to bet between 1 and 3 : ");
        //input is in string, convert into float
        const numberOfLines = parseFloat(lines);
    
        //number entered is valid, its not less than 0 and not higher than 3
        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3){
            console.log("Invalid number of lines, Try again!");
        } else{
            return numberOfLines; //if valid, retun deposit amount
        }
    }
}

//the function gets a bet amount, this has to be less
//than the balance amount. Also, we need to take of
//number of lines for each bet. 
const getBet = (balance, lines) => {

    while(true){
        const bet = prompt("Enter your bet amount per line : ");
        const numberOfBet = parseFloat(bet);
    
        //number entered is valid, its not less than 0 
        //and not higher than balance amount
        if(isNaN(numberOfBet) || numberOfBet <= 0 || numberOfBet > balance/lines){
            console.log("Invalid bet, Try again!");
        } else{
            return numberOfBet; //if valid, retun bet amount
        }
    }
}

// the funcction will simulate spinning of a wheel.

const spin = () => {
    const symbols = []; //array are constant reference types in JavaScript
    //started by generating all possible answers and stored in symbols array
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for (let i=0; i < count; i++){
            symbols.push(symbol); //push to append to an array
        }
    }
    // const nested array which will store random symbols
    const reels = [];  // temp array to store all reels
    for(let i = 0; i < COLS; i++){ //columns
        reels.push([]); //this will create a nested array for length of COLS, i.e. [[],[],[]]
        //a copy of symbols array from above to work upon
        const reelSymbols = [...symbols]; //copy
        for(let j=0; j < ROWS; j++) { //rows 
            //Math.random() will give us a value between 0 & 1, floating pt. value
            //we multiply that index with whatever length of our symbol is to get max possible number
            //math.floor will round it to nearest whole number round down, less than
            //end of array - 1 (floor is round down )
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            //slice and remove one element, randomIndex is index we are
            //removing position, so we don't select again while we
            //generating the wheel
            reelSymbols.splice(randomIndex,1); //remove 1 element to avoid duplicates
        }
    }
    return reels;
}

// the spin output will be like [[A,B,C],[D,D,C],[A,B,A]] (random)
// this will rows are as shown below
// [A, D, A]
// [B, D, B]
// [C, C, A]
// above is called transposing a matrix or 2d array
const transpose = (reels) => {
    const rows = [];
    for(let i = 0; i < ROWS; i++){
        rows.push([]);
        for(let j=0; j < COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

// build a piped out like { "A" | "B" | "C"}
const printRows = (rows) => { //pass array rows
    for(const row of rows){
        let rowString = ""; //empty string
        for(const [i, symbol] of row.entries()){
            rowString += symbol; //append
            if(i != row.length - 1){ //till end of array 
                rowString += " | "; // add a pipe to non last element
            }
        }
        console.log(rowString) // this will print every individual to row string
    }
}

// function to find players winnings
const getWinnings = (rows, bet, lines) => {
    let winnings = 0; //initialize
    for (let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols){
            if(symbol != symbols[0]){ //if first symbol matches, all matches
                allSame = false;
                break;
            }
        }
        if(allSame){//player won
            //get the value associated with that specific symbol
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }
    return winnings;
}

//finally we can have a game function
//which iterate though till player is broke
//or wants to stop the game.
const game = () => {

    //deposit amount can change, so it cannot change
    let depositAmount = deposit();

    while(true){
        console.log("Current Balance $" + depositAmount);
        const numberOfLines = getNumberofLines();
        const bet = getBet(depositAmount, numberOfLines);
        depositAmount -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows,bet,numberOfLines);
        depositAmount += winnings;
        console.log("You won, $" + winnings.toString());

        if(depositAmount <= 0){
            console.log("You ran out of money!");
            break;
        }
        const playAgain = prompt("Do you want to play again(y/n)? ");
        if(playAgain != "y") break;
    }
    console.log("Final Balance $" + depositAmount);
}

//finally call the game function.
game();


