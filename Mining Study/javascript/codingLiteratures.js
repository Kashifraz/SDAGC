// import fetch from "node-fetch";

var module = module || {};
console.log("yummy")
// A place where I can practice/brainstorm through my coding challenges.
// Purpose: to demonstrate my thought process, and how I logic my reasoning.

// Finds the highest digit, when number is passed in as an input.
export function findsHighestDigit(number) {
	const convert = number.toString()
	const slicing = convert.split('')
	const captureHighestInt = Math.max(...slicing)
	
    return captureHighestInt;
}
// Test Cases:
console.log(findsHighestDigit(121293)) // 9
console.log(findsHighestDigit(3002003)) // 3

var myArray = ['a', 'b', 'c', 'd'];

let add = myArray.unshift('addToFirst');
let remove = myArray.pop()
let gain = myArray.push('gainedLast')

console.log(myArray)
console.log(remove, myArray)
console.log(gain, myArray)

// -------------------------------------------------------------------------

export function sortArrayByLength(arr) {
	let sunday = []
	
	for(let i = 0; i < arr.length; i++) {
		sunday.push(arr[i])
	}
	return sunday.sort((a, b) => {
		return a.length-b.length
	})
}
// Test case(s)
console.log(sortArrayByLength(['hello', 'austi', 'im', '!'])) // [ '!', 'im', 'hello', 'austi' ]

// ---------------------------------------------------------------------------

export function calculateDifference(obj, limit) {
	
	const total = 0
	
	let extract = Object.values(obj)
	
	let add = extract.reduce((previousVal, currentValue) => previousVal + currentValue, total)
	
	return Math.abs(add) - limit

}

// ---------------------------------------------------------------------------

export function sumOfCubes(nums) {
	let collect = []
	
	for (let i = 0; i < nums.length; i++) {
		let cubed = Math.pow(nums[i], 3)
		collect.push(cubed)
	}
	const final = collect.reduce((prev, curr) => prev + curr, 0)
	return final
}

// ---------------------------------------------------------------------------
//Number() method converts string to number
export function yummyPi(n) {
	let shiftDecimalPlaces = Math.PI.toFixed(n); // 

	return Number(shiftDecimalPlaces);
}

// ---------------------------------------------------------------------------
//Two Sum 
//Brute Force Method:
// O(N^2) => O(N) = Time Complexity
// O(1) => "Constant" = Space Complexity
export function twoSum(array, targetSum) {
	for ( let i = 0; i < array.length; i++){
		const firstValue = array[i];
		for (let j = i + 1; j < array.length; j++){
			const secondValue = array[j];
			 if (firstValue + secondValue === targetSum){
				  return [firstValue, secondValue];
			 }
		}
	}
}

// Optimized/Refactored: 
// O(N) = Time Complexity 
// 0(1) = Space Complexity 
export function twoNumberSumOptimized(array, targetSum) {
	// sorts all elements in the array in ascending order (small to large)
	const sorted = array.sort((a, b) => {return a-b})	
	// define our left and right pointers
	// define default state if no pairs are found at all = to empty array
	let leftPointer = 0
	let rightPointer = sorted.length - 1
	let pairTwins = []
	let pairSum;
		// initilize our loop with a first condition
		// break out of loop with left and right pointer === targetSum
		// otherwise increment leftPointer if !=== targetSum 
		// otherwise decrement rightPionter if !==targetSum
		// return final state
		while (leftPointer !== rightPointer) {
			pairSum = sorted[leftPointer] + sorted[rightPointer]
				if (pairSum === targetSum) {
					pairTwins = [sorted[leftPointer], sorted[rightPointer]]
					break;
				} else if (pairSum < targetSum) {
					leftPointer++
				} else if (pairSum > targetSum) {
					rightPointer--
				}
		}
		return pairTwins
	}


export function countBits(n) {
	// we collect all elements from the loop inside of array, because the method Ill be using further down, work on array data types.
	// so instead of collecting all digits as numerial data type, we put it inside an array
	let total = []

	let bits = 0;
	// convert our number to Binary using toString() method, 2 represents the binary system that well converting into.
	// pass 2 as parameter
	let transform = n.toString(2);
	
	// loop through each element and put into collector
	for(let n = 0; n < transform.length; n++) {
		total += transform[n];  
	}
	// in order to traverse each bit, split() method converts each digit into a single string
	// filter each string with exact match of a '1' bit
	return total.split('').filter(x => x === '1').length
}

// ---------------------------------------------------------------------------

export function compareTriplets(a, b) {
	// we'll be keeping track of two states; points for Ally, and points for Brad
	let bTotal = 0
	let aTotal = 0
	let pointsArray = []
	// our points will be represented in an array data type
   
	// traversing the beginning of both our arrays, and compares each element; Ally and Brad
	for(let i = 0, j = 0; i < a.length; i++, j++) {
		aTotal += a[i] > b[j]
		bTotal += a[i] < b[j]
		pointsArray = [aTotal, bTotal]
	}
	// assign variables (Ally and Brad), to the pointsArray.
	//return the final data
	return pointsArray
   }

export function plusMinus(arr) {
	//count the amt of positive / zero / negative digits
	// set state to 0
	var dividend = arr.length
	var positive = 0 
	var zero = 0 
	var negative = 0 
	var finalRatio;
	var finalRatioDec = null
	
 for(let i = 0; i < arr.length; i++) {
	 if (arr[i] > 0) {
		 positive++
	 } else if (arr[i] === 0) {
		 zero++
	 } else if (arr[i] < 0) {
		 negative++
	 }
	 finalRatio = [positive, zero, negative]
	 finalRatio = finalRatio.map(x => x / dividend)
	 finalRatioDec = finalRatio.map(x => Number(x.toFixed(6)))
 	}
	 return finalRatioDec
	//console.log(finalRatioDec[0])
	//console.log(finalRatioDec[1])
	//console.log(finalRatioDec[2])
}

// output: [0.5, 0.166667, 0.333333]

// ---------------------------------------------------------------------------

export function integerBoolean(n) {
	let truthyFalsy = [];
	// splits string inside of array into invididual strings
	let singledDigits = n.split('')
	// loops through each index, and checks if the element is equal to 1 --> return boolean of 'true'
	for(let i = 0; i < singledDigits.length; i++) {
		if (singledDigits[i] === '1') {
			truthyFalsy.push(true)
		} else if (singledDigits[i] !== '1') {
			truthyFalsy.push(false)
			// returns us 'false' if element is not equal to '1'
		} else {
			// else set the default state to an empty array
			return []
		}
	}
		// invoke the variable of all truthy/falsy values
	return truthyFalsy
}

// ---------------------------------------------------------------------------

export function convertRomanNum(roman){
	let total = [];

	let finalTotal = 0;
	
	let splitting = roman.split('')
	
	const dictionary = {
		'I': 1,
		'IV': 4,
		'V': 5,
		'X': 10,
		'L': 50,
		'C': 100,
		'D': 500,
		'M': 1000,
	}
		for (var key in dictionary) {
			for(let i = 0; i < splitting.length; i++) {
				if(key === splitting[i]) {
					finalTotal += dictionary[key];
				} else if (splitting[i] === 'I' && splitting[i] === 'V' ) {
				 	total += splitting.map(x => x.join(' '))
				}
			}
			total.push(key)
		}
	return finalTotal


}

// ---------------------------------------------------------------------------

export function perimeter(l, num){
	// two variables 
	// conditional operator 
	// or use if/else statements for readability 
		
		let square = 4 * num;
		let circle = 6.28 * num;
	
		if (l === 's') {
			return square 
		} else if (l === 'c') {
			return circle 
		}
	}


// 	Try finding your ancestors and offspring with code.

// Create a function that takes a number x and a character y ("m" for male, "f" for female), and returns the name of an ancestor (m/f) or descendant (m/f).

// If the number is negative, return the related ancestor.
// If positive, return the related descendant.
// You are generation 0. In the case of 0 (male or female), return "me!".

export function DNA_generation(x, y) {
	//psudeocode32595
	// x && y; where... 
	// x === number
	//  y === 'm' || 'f' where m = male / f = female
	// if === 0 then return a string 'me!'
	//female = positive
	//male = negative
	// we want to store multiple values for each key
	// create object of arrays to store unique values
	
	const obj = {
		"-3": {m: "great grandfather", f: "great grandmother",},
		"-2": {m: "grandfather", f: "grandmother",},
		"-1": {m: "father", f: "mother",},
		0: {m: "me!", f: "me!",},
		1: {m: "son", f: "daughter",},
		2: {m: "grandson", f: "granddaughter",},
		3: {m: "great grandson", f: "great granddaughter",},
	  };
	
	  return obj[x][y];
	}

// Create a function that takes two numbers as arguments (num, length) and returns an array of multiples of num until the array length reaches length.


export function arrayOfMultiples (num, length) {
	// each single calculated element from transformer variable, is collected in finalArr
	let finalArr = [];
	// holding nest/variable per each calculation (base num * index)
	let transformer = 0
	// start at index 1, plus an additional index. 
	// we start at 1, so base number is not mutiplied by index 0. We want 0 omitted from final array output
	for(let i = 1; i < length + 1; i++) {
		// multiply the base num by the index
		// ie. 3(num) * 1(i) //  3(num) * 2(i) // 3(num) * 3(i)
		transformer = num * i
		// push each calculated value, into final empty array
		finalArr.push(transformer)
	}
	return finalArr;
}

	// Create a function that takes an object and returns the keys and values as separate arrays.
	// Return the keys sorted alphabetically, and their corresponding values in the same order.
export function objectToArray(obj) {
	// create 2 variables 1 to hold keys, 1 to hold values (thank you Github AI copilot)
	let keys = Object.keys(obj)
	let values = Object.values(obj)
		return [keys, values]

}
console.log("transforms single object to arrays = ",objectToArray({ favRestaurant: 'fogo de chao', occupation: 'software engineer', range: 'fullstack development', gene: 'mutation', type: 'telepathy/telekensis', galaxy: 'supernova', energy: 'expansion' }))

//A repdigit is a positive number composed out of the same digit. 
//Create a function that takes an integer and returns whether it's a repdigit or not.
export function isRepdigit(num) {
	const first = num % 2 === 0
	const stringifyNum = num.toString().split('')
	// console.log(stringifyNum)

	const total = []

	for (let i = 0; i < stringifyNum.length; i++) {
			// console.log("stringfyNum[i] =", stringifyNum[i])
			total.push(stringifyNum[i])
			console.log("total =",total)
	}

	for (let j = 0; j < total.length; j++) {
		if(total[j] !== total[0]) {
			return false
		}
	}
	return true 
}
console.log("is this a RepDigit...? 1 = ",isRepdigit(1))
console.log("is this a RepDigit...? 9 = ",isRepdigit(9))
console.log("is this a RepDigit...? 123 = ",isRepdigit(123))
console.log("is this a RepDigit...? 7777777 = ",isRepdigit(7777777))
console.log("is this a RepDigit...111573411 = ",isRepdigit(111573411))
console.log("is this a RepDigit...? 2222222222222 = ",isRepdigit(2222222222222))


// Create a function that counts the integer's number of digits.
export function count() {
	let convertNegInt = Math.abs(n)
	return convertNegInt > 1 ? Math.ceil(Math.log10(convertNegInt)) : 1
}

// Your task is to create a Circle constructor that creates a circle with a radius provided by an argument. 
// The circles constructed must have two methods getArea() (PI*r^2) and getPerimeter() (2*PI*r) which give both respective areas and perimeter (circumference).
// For help with this class, I have provided you with a Rectangle constructor which you can use as a base example.
class Circle {
	constructor(radius) {
		this.radius = radius;
	}
	getArea(){
		return Math.PI * Math.pow(this.radius, 2)
	}
	getPerim(){
		return 2 * Math.PI * this.radius
	}
}

// removes all falsey values within an array 
function compact(arr) {
	return arr.filter(Boolean)
}

// Given a grid of numbers, return a grid of the Spotlight Sum of each number. 
// The spotlight sum can be defined as the total of all numbers immediately surrounding the number on the grid, including the number in the total.
// function spotlightMap(grid) {
	
// }

// Create a function that takes an array of numbers and returns the second largest number.

function secondLargest(arr) {
	let calc = arr.sort(function(a, b){
		return a-b
	})
	return calc[calc.length - 2]
}

// Create a function that takes an array of numbers and return "Boom!" if the digit 7 appears in the array. Otherwise, return "there is no 7 in the array".
function sevenBoom(arr) {
	const stringify = arr.join('')
	const regex = /7/g
	const final = stringify.match(regex)
	console.log(final)
	return final ? 'Boom!' : 'there is no 7 in the array'
}

//Write a class called Rectangle that represents a rectangular two-dimensional region. It should have the following constructor:
// constructor(x, y, width, height)

class Rectangle {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	toString() {
		const {x, y, width, height} = this;
		return `[x=${x}, y=${y}, width=${width}, height=${height}]`;
	}
}

/*Given a total due and an array representing the amount of change in your pocket, determine whether or not you are able to pay for the item. 
Change will always be represented in the following order: quarters, dimes, nickels, pennies.

To illustrate: changeEnough([25, 20, 5, 0], 4.25) should yield true, since having 25 quarters, 20 dimes, 5 nickels and 0 pennies gives you 6.25 + 2 + .25 + 0 = 8.50.
*/

export function accountsReceivableAndPayable(cents, amountDue) {
	const initialValue = 0;
	const quarter = .25 * cents[0]
	const dime = .10 * cents[1]
	const nickel = .05 * cents[2]
	const penny = .01 * cents[3]
	
	var cents = [quarter, dime, nickel, penny]
	
	const loopAdd = cents.reduce((elementFir, elementSec) => elementFir + elementSec, initialValue);
	
	return loopAdd >= amountDue ? true : false
}

console.log("cent calc [8, 10, 50, 100], 5.00] = ", accountsReceivableAndPayable([8, 10, 50, 100], 5.00))
console.log("cent calc [8, 10, 50, 100], 55.00] = ", accountsReceivableAndPayable([8, 10, 50, 100], 55.00))

// Create a function that validates whether a number n is within the bounds of lower and upper. Return false if n is not an integer.

function intWithinBounds(n, lower, upper) {
	if( n >= lower && n < upper && Number.isInteger(n)) {
		return true
	} else if (n !== Number.isInteger(n)) {
			return false	
	}
}

console.log("is wthin bounds 7, 1, 22 = ", intWithinBounds(7, 1, 22))

/*You're given a string of words. You need to find the word "Nemo", and return a string like this: "I found Nemo at [the order of the word you find Nemo]!".

If you can't find Nemo, return "I can't find Nemo :(".
*/

// the index started at 0, and the tests expected the index to start at 1 -- which is why +1 is added within template literal
function findNemo(sentence) {
	const selectNemo = sentence.split(" ")
	const indexNemo = selectNemo.indexOf("Nemo")
 
	return selectNemo.includes("Nemo") ? `I found Nemo at ${indexNemo + 1}!` : "I can\'t find Nemo :("

}

//algorithms i've solved/played with over Thankgiving holiday :))) - 11.25.2022

// An array is special if every even index contains an even number and every odd index contains an odd number. 
// Create a function that returns true if an array is special, and false otherwise.
export function isSpecialArray(arr) {
	//begins @ index 0, then iterates on every even number (i.e next # 2)
	for(let a = 0; a < arr.length; a += 2){
		if(arr[a] % 2 != 0){
			// if the value of the even index does not have a remainder of 0 (making it an odd number - return false)
			return false
		}
	}
	//beings @ index 1, then iterates on every odd number (i.e next # is 3)
	for (let b = 1; b < arr.length; b += 2){
		if(arr[b] % 2 == 0){
			// if the value of the odd index is evenly divisible by 2 with a remainder of 0 (making it an even number @ the odd index) - return false  
			return false
		}
	}
		// even both conditions above have not been met, this is a "true" special array
		return true
}

console.log("[2, 3, 4, 9, 6, 11] = ",isSpecialArray([2, 3, 4, 9, 6, 11]))
console.log("[22, 3, 4, 7, 2, 44] = ",isSpecialArray([22, 3, 4, 7, 2, 44]))

//Create a function that takes an array of items and checks if the last item matches the rest of the array concatenated together.
export function matchLastItem(arr) {
	// removes last element of the array
	const last = arr.pop()
	// consolodates all elements into a single string
	const concat = arr.join('')
	// apply ternary operator if two strings match
	return concat === last ? true : false
}

console.log('"hope", "you", "are", "having", "a", "fine","lovely", "evening", "hopeyouarehavingafinelovelyevening"] =',matchLastItem(["hope", "you", "are", "having", "a", "fine", "lovely", "evening", "hopeyouarehavingafinelovelyevening"]))

// Create a function that moves all capital letters to the front of a word.
// *playing more with Regex -- its... actually pretty fun .... :)
export function capToFront(s) {
	// matches all global instance of Capital letters
	const regexMatch = /[A-Z]/g
	const collectCap = s.match(regexMatch).join('')
	// matches all global instance of lower case letters
	const regexSlice = /[a-z]/g
	const slicedArr = s.match(regexSlice).join('')
	// concatenate both regex variables
	return collectCap + slicedArr 
}

console.log(capToFront("HEy my naMe iS AUsTI, Decode tHIS"))

export function spinWords(string) {

	const dicing =  string.split(' ')
  

	for (let i = 0; i < dicing.length; i++) {
		// added two conditionals
		if (dicing[i].length >= 5 && dicing[i] !== 'metaverse!' && dicing[i] !== 'austi')
		dicing[i] = dicing[i].split('').reverse().join('');
	}
		return dicing.join(' ')
	}



console.log('spinWord 1 =',spinWords("hello"))
//should only spin the word "found", and omit metaverse + austi
console.log('spinWord 2 = ', spinWords("you found me in the metaverse! i'm austi"))



export 	function reverseWords(string) {
	const splicing = string.split(' ')
	const joins = splicing.reverse()
	return joins.join(' ')
}


// Create a function which concatenates the number 7 to the end of every chord in an array. Ignore all chords which already end with 7.
// examples:
/*jazzify(["G", "F", "C"]) ➞ ["G7", "F7", "C7"]

jazzify(["Dm", "G", "E", "A"]) ➞ ["Dm7", "G7", "E7", "A7"]

jazzify(["F7", "E7", "A7", "Ab7", "Gm7", "C7"]) ➞ ["F7", "E7", "A7", "Ab7", "Gm7", "C7"]

jazzify([]) ➞ []
*/

function jazzify(arr) {
	return arr.map(x => x.includes(7) ? x : x + 7);
}

/* output:
/*
Test Passed: Value == "['G7', 'F7', 'C7']"
Test Passed: Value == "['Dm7', 'G7', 'E7', 'A7']"
Test Passed: Value == "['F7', 'E7', 'A7', 'Ab7', 'Gm7', 'C7']"
Test Passed: Value == "['G7', 'C7']"
Test Passed: Value == '[]'
*/

//Create a function that returns true if two arrays contain identical values, and false otherwise.
function checkEquals(arr1, arr2) {
	
	const firstVar = arr1.toString()
	const calcVar = firstVar.split(' ').join('')
	
	const secondVar = arr2.toString()
	const calcSecVar = secondVar.split(' ').join('')
	
	console.log(calcVar)
	console.log(calcSecVar)
	
	if (calcVar === calcSecVar) {
  	return true 
  } else {
  	return false
  }
}

//Create a function that takes in a year and returns the correct century.
function century(year) {
	const centuryObject = {
		'1000': '10th century',
		'1001-1100': '11th century',
		'1101-1200': '12th century',
		'1201-1300': '13th century',
		'1310-1400': '14th century',
		'1401-1500': '15th century',
		'1501-1600': '16th century',
		'1601-1700': '17th century',
		'1701-1800': '18th century',
		'1801-1900': '19th century',
		'1901-2000': '20th century',
		'2001-2100': '21st century',
	}
		
	if (year === 1000) {
		return `${centuryObject[1000]}`
	} else if (year >= 1001 && !(year >= 1100)) {
		return `${centuryObject['1001-1100']}`
	} else if (year >= 1701 && !(year >= 1800)) {
		return `${centuryObject['1701-1800']}`
	} else if (year >= 1501 && !(year >= 1600)) {
		return `${centuryObject['1501-1600']}` 
	} else if (year >= 1601 && !(year >= 1700) ) {
		return `${centuryObject['1601-1700']}`
	} else if (year >= 1901 && !(year >= 2000) || year === 2000) {
	return `${centuryObject['1901-2000']}`
	} else if (year >= 2001 && !(year >= 2100)) {
	return `${centuryObject['2001-2100']}`
	} else {
		return year
	}
}



// Currying functions:
// how its useful --> 
/*function multiply {

}*/

// const sun =  [2, 10, 20].reduce(function(firstNum, x){
//  return firstNum + x;
// }, 1);




// (function(){
// 	return console.log("hello" + " "+ contacts.firstName + " " + "can be contacted @" + contacts.email);
// })(contacts); 

//Write a function that returns an anonymous function, which adds n to its input
function addsNum(n) {
	return function(input){
		return input + n;
	}
}

// Create a function that takes a country's name and its area as params and returns the area of the country's proportion of the total world's landmass.
function areaOfCountry(name, area) {
	
	// earths landmass = 148,940,000
	
	let countrysProportionToEarthLandMass = area / 148940000
	let decimalTruncate = countrysProportionToEarthLandMass.toFixed(4)
	let crops = Number.parseFloat(decimalTruncate) * 100
	
	if (crops > 1) {
		return `${name} is ${crops}% of the total world's landmass`
	} else if (crops < 1) {
		return `${name} is ${crops.toFixed(2)}% of the total world's landmass`
	}
}

console.log(areaOfCountry("Ireland", 32595));
console.log(areaOfCountry("Switzerland", 41284));
console.log(areaOfCountry("Netherlands", 41850));
console.log(areaOfCountry("Greece", 131990));
console.log(areaOfCountry("Sweden", 204035));

/*output
Egypt is 0.67% of the total world's landmass
Switzerland is 0.03% of the total world's landmass
Netherlands is 0.03% of the total world's landmass
Greece is 0.09% of the total world's landmass                 
*/

//global scope variable 
let salary = [
	["ABC", 24, 18000],
	["EFG", 30, 30000],
	["IJK", 28, 41000],
	["EFG", 31, 28000],
]

 function loopingMultiDimentionalArray(arr){
	const emptyPortal = []

	//local scope variable
	// let salary = [
	// // 	["ABC", 24, 18000],
	// // 	["EFG", 30, 30000],
	// // 	["IJK", 28, 41000],
	// // 	["EFG", 31, 28000],
	// // ]

	for (let i = 0, l1 = salary.length; i < l1; i++) {
		for (let j = 0, l2 = salary[i].length; j < l2; j++) {
			emptyPortal.push(salary[i][j]);
		}
	}
	return emptyPortal;
 }

 console.log(loopingMultiDimentionalArray(salary));

/* 
Create a function that returns the thickness (in meters) of a piece of paper after folding it n number of times. 
The paper starts off with a thickness of 0.5mm.
*/

 function numLayers(n) {
	const exponential = .5 * Math.pow(2, n) / 1000
				
	return `${exponential}m`
}

//Create a function that takes an array of numbers arr, a string str and return an array of numbers as per the following:
/*"Asc" returns a sorted array in ascending order.
"Des" returns a sorted array in descending order.
"None" returns an array without any modification.*/

function ascDesNone(arr, str) {
	const asc = function ascSortFunction(a, b){
		return a - b;
	}
	const desc = function descSortFunction(a, b) {
		return b - a;
	}
	return str === "Asc" ? arr.sort(asc)
			 : str === "Des" ? arr.sort(desc)
			 : str === "None" ? arr
			 : arr;
}

//Create a function that takes two arguments: the original price and the discount percentage as integers and returns the final price after the discount.

function dis(price, discount) {
	const discountPrice = price * discount / 100
	const totalPrice = parseFloat(price - discountPrice).toFixed(2)
	return Number(totalPrice)
}

/*Given radius r and height h (in cm), calculate the mass of a cylinder when it's filled with water and the cylinder itself doesn't weigh anything. The desired output should be given in kg and rounded to two decimal places.

How to solve:

Calculate the volume of the cylinder.
Convert cm³ into dm³.
1dm³ = 1L, 1L is 1Kg.
*/

function weight(r, h) {
	const radiusCalc = Math.pow(r, 2)
	const piCalc = Math.PI * radiusCalc 
	const cmDmCalc = piCalc / 1000 * h
	return Number(cmDmCalc.toFixed(2))
}

/*
Mubashir has written a mysterious function that takes two numbers x and d and returns multiplication?. Solve the riddle of what Mubashir's function is by having a look at some of the examples below.
*/

function mubashirFunction(x, d) {
	console.log(x)
	console.log(d)

	const paramA = x.toString().split('')
	const paramB = d.toString().split('')
	const paramANum = paramA.map(Number)
	const paramBNum = paramB.map(Number)
	
	console.log(paramBNum)
	const paramAAdd = paramANum.reduce((a, c) => a + c, initialValue = 0)
	const paramBMult = paramBNum.reduce((a, c) => a + c, initialValue = 0)
	
	console.log(paramAAdd)
	console.log(paramBMult)
	return paramAAdd * paramBMult
}

/*
A salesman has a number of cities to visit. He wants to calculate the total number of possible paths he could take, visiting each city once before returning home. Return the total number of possible paths a salesman can travel, given n cities.

If we have cities A, B and C, possible paths would be:
*/
// algorithm describing a factorial with a for loop
function paths(n) {
	for(let i = n - 1; i >= 1; i--) {
		n = n * i
	}
	return n
}

//Arrays can be mixed with various types. Your task for this challenge is to sum all the number elements in the given array. Create a function that takes an array and returns the sum of all numbers in the array.
function numbersSum(arr) {
	const filterArr = arr.filter(Number.isInteger)
	return filterArr.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue = 0)
}

//Create a function that squares every digit of a number.
function squareDigits(n) {
	const sepDigits = n.toString().split('')
	const mapSquare = sepDigits.map((digit) => digit ** 2)
	const combineDigits = mapSquare.join("")
	
	return +combineDigits
}



//Given an array of boxes, create a function that returns the total volume of all those boxes combined together. 
// A box is represented by an array with three elements: length, width and height

//For instance, totalVolume([2, 3, 2], [6, 6, 7], [1, 2, 1]) 
//should return 266 since (2 x 3 x 2) + (6 x 6 x 7) + (1 x 2 x 1) = 12 + 252 + 2 = 266.

function totalVolume(...boxes) {
	const initialValue = 0;
	const subArr = [...boxes]
	
	const multCallBackFunction = (prev, curr) => prev * curr;
	const multSubArr = subArr.map(arr => arr.reduce(multCallBackFunction, 1));
	const adding = multSubArr.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue);
	
	return adding
	
}




// removing duplicate from an array
// although concise, is not particularly efficient for large arrays -- quadratic time (large data sets/records)
const arr = ["Mike","Matt","Nancy","Adam","Jenny","Nancy","Carl"]

const uniqueArray = arr.filter(function(element, indexPosition, self) { // call back function
	console.log(arr.indexOf(element) == indexPosition) // console logs boolean
    return arr.indexOf(element) == indexPosition; // assigns an index per element. if there is a duplicate, that duplicate element will not be pushed into the new array -- the original element already has an assigned index, and the call back function verifies the attempt to assign an index to the duplicate -- is not the same index assigned to the original element 
})

console.log("uniqueArrayFunction --->", uniqueArray)

// new Set() constuctor creates a new Set object, and stores collections of values. These values in the set only occur once and are unique in the sets collection
console.log([...new Set(array)])

// hashtables refactor
// hash keys can only be strings or symbols; 1 & "1" will return just 1; (i.e) uniq([1, "1"]) === [1]
// hash key objects (even with differeing values) equal the same 
// this hash function does not recognize types

const array = ["Jace", "Luke", "Connor", "Evan", "Zach", "Brendan"]


// each subarray  = key
// the elements within subarray  = values

function uniq(array) {
	var visited = {};
	// filter through each subarray, and its elements
	return array.filter(function(element){

		// add each element from each sub array, in the visited object
		// only add the element if it does not exist in the visited object
		// if the same element already exists in the visited object, no need to add 
		return visited.hasOwnProperty(element) ? false : (visited[element] = true); 
	})
}

// this function hash tables lookup for primitives, and linear search for objects

function primLinear(array) {

	var prims = {"boolean":{}, "number":{}, "string":{}}, objs = []
	console.log(prims) // { boolean: {}, number: {}, string: {} }

	return array.filter(function(element){
		var type = typeof element;

		if (type in prims) {
			return prims[type].hasOwnProperty(element) ? false : (prims[type][element] = true)
		} else {
			return objs.indexOf(element) >=0 ? false : objs.push(element)
		}
	})

}

//convert hours to seconds
function howManySeconds(hours) {
	const min = hours * 60
	const mintosec = min * 60
	
	return mintosec
}


// receives an array of multiple objects, accesses the budget key and renders the digits cummulative
function cummulativeBudgets(arr) {
	let budgetCummulative = 0
	arr.forEach(array => {
		for (let digit in array) {
			if (digit === "budget") {
				budgetCummulative += array[digit]
				return budgetCummulative
			}
		}
	})
	return budgetCummulative
}

// receives a number and reverses the integers; it should also turn it positive even if it is negative
function rev(n) {
	const revString = Number(n)
	const positiveStr = Math.abs(revString).toString()
	const revStr = positiveStr.split('').reverse().join('')
	
	return revStr
}


// Create a function that takes a string, checks if it has the same number of x's and o's and returns either true or false.

/*
Return a boolean value (true or false).
Return true if the amount of x's and o's are the same.
Return false if they aren't the same amount.
The string can contain any character.
When "x" and "o" are not in the string, return true.
*/

function XO(str) {
	const strSplit = str.split('')
	const xAmount = []
	const oAmount = []
	
	for (let i = 0; i < strSplit.length; i++) {
		if (strSplit[i] === 'x' || strSplit[i] === 'X') {
			xAmount.push(strSplit[i])
		} else if (strSplit[i] === 'o' || strSplit[i] ==='O') {
			oAmount.push(strSplit[i])
		}
	}
	
	if (xAmount.length === oAmount.length) {
		return true
	} else {
		return false
	}
}
	
function maskify(str) {
	const strSplit = str.split('')
	const strSlice = strSplit.slice(-4)
	const strSliceJoin = strSlice.join('')
	const stor = []
	
	for (let i = 0; i < strSplit.length - 4; i++) {
	strSplit[i] = '#'
	stor.push(strSplit[i])
}
	const eleJoin = stor.concat(strSliceJoin)
	
    const strFilter = eleJoin.filter((element) => element !== ',')
	const stringify = strFilter.toString()
	const stringifyJoin = stringify.split('').join('')
	
	return stringifyJoin.replace(/,/g, "")
}
