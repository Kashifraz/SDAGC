//INDEX PG
//show alert
var allButtons = document.getElementsByTagName('button');

function showAlert() {
    alert("Dig into the grave; find items; insert code; find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find me;find...");
    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].textContent = 'find me';
    }
}

//search for ITEMS
//ROT 13 code
//coded with copilot
function handleSearch(query) {
    var myFriend = document.getElementById('myFriend');
    var myGod = document.getElementById('myGod');
    var myLife = document.getElementById('myLife');
    var myHumour = document.getElementById('myHumour');
    var myHome = document.getElementById('myHome');
    var mySpirit = document.getElementById('mySpirit');
    var myFamily = document.getElementById('myFamily');

    var searchResult;

    if (query === 'zlSvernaqFcver') {
        searchResult = myFriend;
        searchResult.href = 'myFriendSpider.html';
        searchResult.textContent = 'myFriend🕷️';
        speakText(searchResult.textContent);
    } 
    else if (query === 'zlTbqVfurer') {
        searchResult = myGod;
        searchResult.href = 'myGodIsHereGate.html';
        searchResult.textContent = 'myGodIsHere';
        speakText(searchResult.textContent);
    } 
    else if (query === 'zlYvsrObevat') {
        searchResult = myLife;
        searchResult.href = 'myLifeBoring.html';
        searchResult.textContent = 'myLifeBoring';
        speakText(searchResult.textContent);
    } 
    else if (query === 'zlFcvevgGenccrq') {
        searchResult = mySpirit;
        searchResult.href = 'mySpiritTrapped.html';
        searchResult.textContent = 'mySpiritTrapped';
        speakText(searchResult.textContent);
    } 
    else if (query === 'zlUbzrYbfg') {
        searchResult = myHome;
        searchResult.href = 'myHomeLost.html';
        searchResult.textContent = 'myHomeLost';
        speakText(searchResult.textContent);
    } 
    else if (query === 'zlZvqaFvyyyl') {
        searchResult = myHumour;
        searchResult.href = 'myHumour.html';
        searchResult.textContent = 'myHumour';
        speakText(searchResult.textContent);
    } 
    else if (query === 'zlSnzvylUnun'){
        searchResult = myFamily;
        searchResult.href = 'myFamilyHaha.html';
        searchResult.textContent = 'myFamilyHaha';
        speakText(searchResult.textContent);
    } 
    else {
        searchResult.style.display = 'none';
    }

    // Update href and textContent of all buttons
    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].onclick = function() {
            window.location.href = searchResult.href;
        };
        allButtons[i].textContent = searchResult.textContent;
    }
}

//creating buttons at random positions
//coded with copilot
window.onload = function() {
    var container = document.getElementById('buttonContainer');
    var searchContent = document.querySelector('.searchContent').getBoundingClientRect();

    for (var i = 0; i < 45; i++) {
        var button = document.createElement('button');
        button.textContent = 'h3llo';
        button.style.position = 'absolute';
        button.style.whiteSpace = 'nowrap';

        var left, top;
        do {
            left = Math.random() * (window.innerWidth - button.offsetWidth * 2);
            top = Math.random() * (window.innerHeight - button.offsetHeight * 2);
        } 
        while (left > searchContent.left && left < searchContent.right 
            && top > searchContent.top && top < searchContent.bottom);

        button.style.left = left + 'px';
        button.style.top = top + 'px';
        container.appendChild(button);

        // Add event listener to the button
        button.addEventListener('click', function() {
            if (this.textContent === 'h3llo') {
                this.textContent = 'nice to meet you';
                speakText(this.textContent);

            }  else if (this.textContent === 'nice to meet you') {
                this.textContent = 'how are you';
                speakText(this.textContent);

            } else if (this.textContent === 'how are you') {
                this.textContent = "i'm doing well, thanks";
                speakText(this.textContent);

            } else if (this.textContent === "i'm doing well, thanks") {
                this.textContent = 'did you have a nice weekend?';               
                speakText(this.textContent);

            } else if (this.textContent === "did you have a nice weekend?") {
                this.textContent = "oh, you did? that's great!";        
                speakText(this.textContent);

            } else if (this.textContent === "oh, you did? that's great!") {
                this.textContent = "what did you get up to?";           
                speakText(this.textContent);

            } else if (this.textContent === "what did you get up to?") {
                this.textContent = "that sounds fun! what did you see?";           
                speakText(this.textContent);

            } else if (this.textContent === "that sounds fun! what did you see?") {
                this.textContent = "oh, that's cool!";           
                speakText(this.textContent);

            } else if (this.textContent === "oh, that's cool!") {
                this.textContent = "me? i just slept in and relaxed, you know, as usual";           
                speakText(this.textContent);

            } else if (this.textContent === "me? i just slept in and relaxed, you know, as usual") {
                this.textContent = "anyway, it was great catching up";           
                speakText(this.textContent);

            } else if (this.textContent === "anyway, it was great catching up") {
                this.textContent = "see you later";           
                speakText(this.textContent);

            } else if (this.textContent === "see you later") {
                this.textContent = "maybe you will need this";           

            } else if (this.textContent === "maybe you will need this") {
                window.open('myCode.html', '_blank');

            } else if (this.textContent === 'find me') {
                alert('Did you find me?');
                speakText(this.textContent);
            }
            console.log(this.textContent);
        });
    }
}

//speak the button text
function speakText(text) {
    var utterance = new SpeechSynthesisUtterance(text);
    var voices = window.speechSynthesis.getVoices();

    // Log the list of voice names and their index numbers
    // voices.forEach((voice, index) => {
    //     console.log(`${index}, ${voice.name}`);
    // });

    if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = function() {
            voices = window.speechSynthesis.getVoices();
            if (voices[148]) {
                utterance.voice = voices[148]; //change to desired voice
            } else {
                utterance.voice = voices[0]; //default voice
                console.log('voice not available, using default voice');
            }
            window.speechSynthesis.speak(utterance);
        };
    } else {
        if (voices[148]) {
            utterance.voice = voices[148]; //change to desired voice
        } else {
            utterance.voice = voices[0]; //default voice
            console.log('voice not available, using default voice');
        }
        window.speechSynthesis.speak(utterance);
    }
}

//MyMindSilly PG
function returnPg() {
    window.location.href = 'index.html';
}

//MySpiritCorrupted PG
function toSpritPath(){
    window.location.href = 'mySpiritP5/spiritPathA.html';
}

//MyHomeLost PG
function moveStarRandomly() {
    var star = document.getElementById('star');
    var left = Math.random() * (window.innerWidth - star.offsetWidth);
    var top = Math.random() * (window.innerHeight - star.offsetHeight);
    star.style.position = 'absolute';
    star.style.left = left + 'px';
    star.style.top = top + 'px';
}

setInterval(moveStarRandomly, 2000); // Change position every 1 sec

var noteShown = false;

function showNotes() {
    var star = document.getElementById('star');
    var note = document.createElement('p');
    note.textContent = 'this world is so huge';
    note.style.position = 'absolute';
    note.style.left = star.style.left;
    note.style.top = star.style.top;

    if (!noteShown) {
        note.textContent = 'this world is so huge';
        noteShown = true;
    } else {
        note.textContent = "but there is no spot for my home";
        noteShown = false;
    }

    document.body.appendChild(note);
}