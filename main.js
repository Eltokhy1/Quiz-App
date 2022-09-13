let bullets = document.querySelector(".bullets .spans");
let rating = document.querySelector(".results span");
let countOfQuestions = document.querySelector(".question-counts span");
let divTitle = document.querySelector(".question-title");
let questions = document.querySelector(".questions");
let submit = document.querySelector(".button");
let allBulletsChild = [];
let countdownElement = document.querySelector(".countdown");
let currentObject = 0;
let right_Answer = 0;
let countdownInterval;
function getQuestion() {
  ajax = new XMLHttpRequest();
  ajax.open("GET", "json.json");
  ajax.send();
  ajax.onload = function () {
    if (ajax.readyState === 4 && ajax.status === 200) {
      let Data = JSON.parse(this.responseText);
      let numberOfQuestions = Data.length;
      shuffle(Data);
      createDynamic(numberOfQuestions);
      showData(Data[currentObject], numberOfQuestions);
      countdown(5, numberOfQuestions);
      submit.addEventListener("click", (eo) => {
        if (currentObject < numberOfQuestions) {
          let rightAnswer = Data[currentObject].right_answer;
          currentObject++;
          checkAnswer(rightAnswer, numberOfQuestions);
          divTitle.innerHTML = "";
          questions.innerHTML = "";
          showData(Data[currentObject], numberOfQuestions);
          clearInterval(countdownInterval);
          countdown(5, numberOfQuestions);
          handleBullets(currentObject, numberOfQuestions);
          if (currentObject === numberOfQuestions) {
            showResults(numberOfQuestions);
          }
        }
      });
    } else {
      console.log(Error("Api Not Found"));
    }
  };
}

function createDynamic(questions) {
  countOfQuestions.innerHTML = questions;
  // Create Spans
  for (let i = 0; i < questions; i++) {
    // Create Bullet
    let spans = document.createElement("span");
    // Check If Its First Span
    if (i === 0) {
      spans.classList = "active";
    }
    // Append Bullets To Main Bullet Container
    bullets.appendChild(spans);
    allBulletsChild.push(spans);
  }
}

function shuffle(array) {
  // Settings Vars
  let current = array.length,
    temp,
    random;

  while (current > 0) {
    // Get Random Number
    random = Math.floor(Math.random() * current);

    // Decrease Length By One
    current--;

    // [1] Save Current Element in Stash
    temp = array[current];

    // [2] Current Element = Random Element
    array[current] = array[random];

    // [3] Random Element = Get Element From Stash
    array[random] = temp;
  }
  return array;
}

function showData(data, count) {
  if (currentObject < count) {
    let questionTitle = document.createElement("h2");
    let textOfQuetionTitle = document.createTextNode(data.title);
    questionTitle.append(textOfQuetionTitle);
    divTitle.appendChild(questionTitle);
    for (let i = 1; i <= 4; i++) {
      let divQuestion = document.createElement("div");
      divQuestion.classList.add("question");
      // create radio
      let radio = document.createElement("input");
      // create custom attribute to radio
      radio.type = "radio";
      radio.setAttribute("name", "choose");
      radio.setAttribute("id", `answer_${i}`);
      radio.dataset.answer = data[`answer_${i}`];
      if (i === 1) {
        radio.checked = true;
      }

      // create label
      let label = document.createElement("label");
      let textOfLabel = document.createTextNode(data[`answer_${i}`]);
      label.appendChild(textOfLabel);
      label.htmlFor = `answer_${i}`;

      // append radio and label to question div
      divQuestion.appendChild(radio);
      divQuestion.appendChild(label);
      // append question to questions div
      questions.appendChild(divQuestion);
    }
  }
}

function checkAnswer(rightAnswer, count) {
  let radios = document.getElementsByName("choose");
  let userChoice;
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      userChoice = radios[i].dataset.answer;
    }
  }
  if (userChoice === rightAnswer) {
    right_Answer += 1;
  }
}
function handleBullets(index, count) {
  if (index < count) {
    // allBulletsChild.forEach((ele) => {
    //   ele.classList.remove("active");
    // });
    allBulletsChild[index].classList = "active";
  }
}

function showResults(count) {
  submit.remove();
  divTitle.innerHTML = `Result: ${right_Answer}/${count}`;
  divTitle.style.paddingBottom = 0;
  divTitle.style.textAlign = "center";
  if (right_Answer < 5) {
    rating.innerHTML = "bad";
    rating.classList.add("bad");
  } else if (right_Answer < 9) {
    rating.innerHTML = "good";
    rating.classList.add("good");
  } else {
    rating.innerHTML = "perfect";
    rating.classList.add("perfect");
  }
}

function countdown(duration, count) {
  if (currentObject < count) {
    countdownInterval = setInterval(function () {
      let minutes;
      let seconds;
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countdownElement.innerHTML = `${minutes}:${seconds}`;
      --duration;
      if (duration < 0) {
        clearInterval(countdownInterval);
        submit.click();
      }
    }, 1000);
  }
}

getQuestion();
