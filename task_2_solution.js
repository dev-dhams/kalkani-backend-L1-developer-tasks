/*
Task (1) : Write a program to print the following pattern
Sample input:
Please enter your lucky number: 5
Output : 
    1
   13A
  135AB
 1357ABC
13579ABCD
 1357ABC
  135AB
   13A
    1
*/
// Function for printing of pattern
const printPattern = (lucky_number) => {
  var temp_strings = [];
  // First for loop
  for (let i = 1; i <= lucky_number; i++) {
    var output = "";
    // Generate empty spaces and join into output
    for (let j = lucky_number - i; j >= 1; j--) {
        output = output + " ";
    }
    // Generate numbers and join into output
    for (let k = 1; k <= i * 2; k += 2) {
        output = output + k.toString();
    }
    // Generate alphabets and join into output
    for (let l = 0; l < i; l++) {
      l !== 0 ? (output = output + String.fromCharCode(64 + l)) : "";
    }
    temp_strings.push(output);
    console.log(output);
  }
  for (let m = temp_strings.length - 2; m >= 0; m--) {
    console.log(temp_strings[m]);
  }
};
// Readline is node js package used to read input from terminal or command line
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
// Print patter according to number input by user
readline.question(`Please enter your lucky number : `, (lucky_number) => {
  printPattern(lucky_number);
  readline.close();
});
