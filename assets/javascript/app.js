// some global variables
let time = 30;
let qnCounter = 0;
let newDiv, card;
let int;
let isCorrect = false;
let graded = false;
// questions bank
const questions = [
  {
    qn: "Which song do Rick and Morty use to save the world?",
    choices: ["Get Shrinky", "Get Schwifty", "Get Springy", "Get Splurgey"],
    ans: "Get Schwifty",
  },
  {
    qn: "What movie is Rick and Morty a homage to?",
    choices: [
      "Looper",
      "Guardians of the Galaxy",
      "The Terminator",
      "Back to the Future",
    ],
    ans: "Back to the Future",
  },
  {
    qn: "Which dimension are our Rick and Morty (ostensibly) from?",
    choices: ["C-137", "F-375", "G-677", "D-265"],
    ans: "C-137",
  },
  {
    qn: "Which substance is Rick addicted to?",
    choices: ["Opium", "Alcohol", "Cocaine", "Tobacco"],
    ans: "Alcohol",
  },
  {
    qn: "What was Jerry\’s apple-based ad slogan?",
    choices: [
      "Got Apples?",
      "Apples: they're great",
      "Hungry for apples",
      "Where are the apples",
    ],
    ans: "Got Apples?",
  },
  {
    qn: "What food does Rick turn himself into?",
    choices: ["Onion", "Pickle", "Banana", "Cucumber"],
    ans: "Pickle",
  },
  {
    qn: "What is the intergalactic superhero team called?",
    choices: ["Avengers", "Revengers", "Vindicators", "Justice League"],
    ans: "Vindicators",
  },
  {
    qn: "Which undercover agent did Birdperson marry?",
    choices: ["Donna", "Becky", "Sarah", "Tammy"],
    ans: "Tammy",
  },
  {
    qn: "How old is Morty?",
    choices: ["12", "14", "16", "18"],
    ans: "14",
  },
  {
    qn: "Which McDonald’s dipping sauce is Rick obsessed with?",
    choices: [
      "Szechuan Sauce",
      "Tangy ranch dip",
      "Sticky BBQ sauce",
      "Sweet chilli sauce",
    ],
    ans: "Szechuan Sauce",
  }
];

let trivia = {
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  next: function () {
    // resets for the next question
    isCorrect = false;
    time = 30;
    qnCounter++;
    graded = false;
    this.timer();
  },
  // controls time
  timer: function () {
    clearInterval(int);
    // fat arrow functions for the win
    int = setInterval(() => {
      // if time runs out
      if (time <= 0) {
        this.unanswered++;
        let unan = "Hmm.. you're outta time! Ans: ";
        this.flash(isCorrect, questions[qnCounter].ans, unan);
      } else {
        time--;
        $("#time").text(time);
      }
    }, 1000);
    this.populate();
  },
  // displays the questions and choices
  populate: function () {
    // if quiz is over
    if (qnCounter > 9) {
      this.showResults();
    } else {
      let qnSlot = $("#question");
      qnSlot.text(questions[qnCounter].qn); // displays the current question

      // update progress bar
      let width = qnCounter * 10;
      let progress = $(".progress-bar");
      progress.attr({ "aria-valuenow": qnCounter.toString() + "0" });
      progress.css("width", width.toString() + "%");

      // populate the choices for the question
      for (let x = 0; x < questions[qnCounter].choices.length; x++) {
        $("#choice" + (x + 1)).text(questions[qnCounter].choices[x]);
      }
    }
  },
  // checks for the correct choices
  choiceChecker: function (choice) {
    for (let x = 0; x < questions[qnCounter].choices.length; x++) {
      if (choice === questions[qnCounter].ans) {
        isCorrect = true;
      }
    }

    if (!time <= 0 && isCorrect && qnCounter <= 9) {
      // if player picks a correct answer
      this.correct++;
    } else if (!time <= 0 && !isCorrect && qnCounter <= 9) {
      // if player picks a wrong answer
      this.incorrect++;
    } else if (qnCounter > 9) {
      // if all questions are done
      this.showResults();
    }
    graded = true;
    this.flash(isCorrect, questions[qnCounter].ans, ""); // displays the correct answer and status
  },
  flash: function (bol, ans, x) {
    clearInterval(int); // stop the timer
    let result; // declare variable to store the result output

    if (bol) {
      result = "Correct! \n " + ans; // correct choice
    } else {
      if (!bol && x === "") {
        result = "Wrong! The answer is: " + ans; // wrong choice
      } else {
        result = x + ans; // unanswered
      }
    }

    $(".card-body").append(`<h3 class="result">${result}</h3>`);

    // removes the result after 5 seconds
    setTimeout(function () {
      $(`.result`).remove();
      trivia.next();
    }, 5000);
  },
  showResults: function () {
    clearInterval(int); // clear the set interval
    card = $("#myCard");
    card.hide("slow"); // hide the card holding the questions & choices

    newDiv = $("<div>", { id: "resultDiv" }); // define the results div
    let newBtn = $("<input>", {
      type: "button",
      class: "center newBtn btn btn-info",
      id: "restart",
      value: "Click to Restart",
    });

    // add the result elements
    newDiv.append(`<h2 class="card-title">Your Results</h2><hr>
            <p>Correct: ${this.correct}</p>
            <p>Wrong: ${this.incorrect}</p>
            <p>Unanswered: ${this.unanswered}</p>`);
    // customize the div
    newDiv
      .css("background-image", "url(./assets/images/results.jpg)")
      .css("background-size", "auto 100%")
      .css("color", "white")
      .css("padding", " 20px 0 310px 0");
    newDiv.append(newBtn);
    $(".container").append(newDiv);
  },
  restart: function () {
    // when the restart button is clicked
    qnCounter = -1;
    this.correct = 0;
    this.incorrect = 0;
    this.unanswered = 0;
    card.show();
    this.next();
  },
};

$(document).ready(function () {
  $("#myCard").css("display", "none"); // dynamically hides the trivia card

  $("#startBtn").on("click", function () {
    $(".jumbotron").css("display", "none"); // hides the jumbotron dynamically
    $("#myCard").css("display", ""); // displays the trivia card
    trivia.timer(); // runs the timer function after every second
  });

  $(".myChoices").on("click", function () {
    let str = this.textContent.trim();
    console.log(str);

    if (!graded) {
      // prevents the game from accepting multiple answers
      trivia.choiceChecker(str);
    }
  });

  $(".container").on("click", ".newBtn", function (event) {
    $("#resultDiv").remove(); // purge the dynamic div
    trivia.restart();
  });
});
