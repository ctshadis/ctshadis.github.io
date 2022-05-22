const wins_cookie_name = "wins?";
const games_cookie_name = "games!";
//const cookie_name = "cookie";
document.addEventListener("DOMContentLoaded", () => {
  createSquares();
  getNewWord();

  let guessedWords = [[]];
  let availableSpace = 1;

  let word;
  let guessedWordCount = 0;

  const keys = document.querySelectorAll(".keyboard-row button");

  function getNewWord() {
    
    fetch(
      `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5&zipf>3`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
          "x-rapidapi-key": "618e03cbc5msh6d609b10bb2485cp10a87cjsn54b1edd25f0d",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        word = res.word;
        word = "fixed";
      
      })
      .catch((err) => {
        console.error(err);
      });
      
      
  }

  function getCurrentWordArr() {
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1];
  }

  function updateGuessedWords(letter) {
    const currentWordArr = getCurrentWordArr();

    if (currentWordArr && currentWordArr.length < 5) {
      currentWordArr.push(letter);

      const availableSpaceEl = document.getElementById(String(availableSpace));

      availableSpace = availableSpace + 1;
      availableSpaceEl.textContent = letter;
    }
  }

  function getTileColor(letter, index) {
    const isCorrectLetter = word.includes(letter);

    if (!isCorrectLetter) {
      return "rgb(58, 58, 60)";
    }

    const letterInThatPosition = word.charAt(index);
    const isCorrectPosition = letter === letterInThatPosition;

    if (isCorrectPosition) {
      return "rgb(83, 141, 78)";
    }

    return "rgb(181, 159, 59)";
  }

  function handleSubmitWord() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length !== 5) {
      window.alert("Word must be 5 letters");
      //currentWordArr = [];
      
    }

    const currentWord = currentWordArr.join("");

    fetch(`https://wordsapiv1.p.rapidapi.com/words/${currentWord}`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
        "x-rapidapi-key": "618e03cbc5msh6d609b10bb2485cp10a87cjsn54b1edd25f0d",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw Error();
        }

        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileColor = getTileColor(letter, index);

            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            const querytext = '[data-key=' + letter;
            const key = document.querySelector(querytext);
            letterEl.classList.add("animate__flipInX");
            letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
            key.style = `background-color:${tileColor};border-color:${tileColor}`;
            
          }, interval * index);
        });

        guessedWordCount += 1;

        if (currentWord === word) {
          //window.alert("Congratulations!");
          doWinCookie();
          doGamesCookie();
          window.alert("Congratulations! Refresh to play again");




        }

        if (guessedWords.length === 6) {
          doGamesCookie();
          window.alert(`Sorry, you have no more guesses! The word is ${word}.`);
          
        }

        guessedWords.push([]);
      })
      .catch(() => {
        window.alert("Word is not recognised!");
      });
  }

  function createSquares() {
    const gameBoard = document.getElementById("board");

    for (let index = 0; index < 30; index++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.classList.add("animate__animated");
      square.setAttribute("id", index + 1);
      gameBoard.appendChild(square);
    }
  }

  function handleDeleteLetter() {
    const currentWordArr = getCurrentWordArr();
    let removedLetter;
    if(currentWordArr.length > 0){
      removedLetter = currentWordArr.pop();

      guessedWords[guessedWords.length - 1] = currentWordArr;

      const lastLetterEl = document.getElementById(String(availableSpace - 1));

      lastLetterEl.textContent = "";
      availableSpace = availableSpace - 1;
    }
    
  }

  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const letter = target.getAttribute("data-key");

      if (letter === "enter") {
        handleSubmitWord();
        return;
      }

      if (letter === "del") {
        handleDeleteLetter();
        return;
      }

      updateGuessedWords(letter);
    };
  }
});

let mod = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
function displayModal() {
  mod.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
function hideModal() {
  mod.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == mod) {
    mod.style.display = "none";
  }
}



function doWinCookie() {

  if(document.cookie)
    {index = document.cookie.indexOf(wins_cookie_name);}
  //Is there a cookie named Counter_Cookie? If so, use that.
  
  else
    {index = -1;}
  //If there isn't, set the index to minus one (-1).
  
  var expires = "Monday, 04-Apr-2030 05:00:00 GMT"
  //A variable is set up to represent the expires date.
  
  if (index == -1)
  {document.cookie=wins_cookie_name+"=1+; expires=" + expires;}
  //If the index was set to minus one, then set the cookie with the name Counter_Cookie, a number 1, then the expires date.
  
  else
  {
  countbegin = (document.cookie.indexOf("?", index) + 2);
  countend = document.cookie.indexOf("+", index);
  if (countend == -1) {
  countend = document.cookie.length;
  }
  count = eval(document.cookie.substring(countbegin, countend)) + 1;
  
  document.cookie=wins_cookie_name+"="+count+"+; expires=" + expires;
  }
  }


  function doGamesCookie() {

    if(document.cookie)
      {index = document.cookie.indexOf(games_cookie_name);}
    //Is there a cookie named Counter_Cookie? If so, use that.
    
    else
      {index = -1;}
    //If there isn't, set the index to minus one (-1).
    
    var expires = "Monday, 04-Apr-2030 05:00:00 GMT"
    //A variable is set up to represent the expires date.
    
    if (index == -1)
    {document.cookie=games_cookie_name+"=1-; expires=" + expires;}
    //If the index was set to minus one, then set the cookie with the name Counter_Cookie, a number 1, then the expires date.
    
    else
    {
    countbegin = (document.cookie.indexOf("!", index) + 2);
    countend = document.cookie.indexOf("-", index);
    if (countend == -1) {
    countend = document.cookie.length;
    }
    count = eval(document.cookie.substring(countbegin, countend)) + 1;
    
    document.cookie=games_cookie_name+"="+count+"-; expires=" + expires;
    }
    }
  
  



