// some global variables
let time = 30;
let qnCounter = 0;
let int;
let isCorrect = false;
// questions bank
const questions = [];
let newQn = {qn: "Which song do Rick and Morty use to save the world?", choices: ["Get Shrinky", "Get Schwifty", "Get Springy", "Get Splurgey"], ans: "Get Schwifty"};
questions.push(newQn);
newQn = {qn: "What movie is Rick and Morty a homage to?", choices: ["Looper", "Guardians of the Galaxy", "The Terminator", "Back to the Future"], ans: "Back to the Future"};
questions.push(newQn);
newQn = {qn: "Which dimension are our Rick and Morty (ostensibly) from?", choices: ["C-137", "F-375", "G-677", "D-265"], ans: "C-137"};
questions.push(newQn);
newQn = {qn: "Which substance is Rick addicted to?", choices: ["Opium", "Alcohol", "Cocaine", "Tobacco"], ans: "Alcohol"};
questions.push(newQn);
newQn = {qn: "What was Jerry’s apple-based ad slogan?", choices: ["Got Apples?", "Apples: they're great", "Hungry for apples", "Where are the apples"], ans: "Got Apples"};
questions.push(newQn);
newQn = {qn: "What food does Rick turn himself into?", choices: ["Onion", "Pickle", "Banana", "Cucumber"], ans: "Pickle"};
questions.push(newQn);
newQn = {qn: "What is the intergalactic superhero team called?", choices: ["Avengers", "Revengers", "Vindicators", "Justice League"], ans: "Vindicators"};
questions.push(newQn);
newQn = {qn: "Which undercover agent did Birdperson marry?", choices: ["Donna", "Becky", "Sarah", "Tammy"], ans: "Tammy"};
questions.push(newQn);
newQn = {qn: "How old is Morty?", choices: ["12", "14", "16", "18"], ans: "14"};
questions.push(newQn);
newQn = {qn: "Which McDonald’s dipping sauce is Rick obsessed with?", choices: ["Szechuan Sauce", "Tangy ranch dip", "Sticky BBQ sauce", "Sweet chilli sauce"], ans: "Szechuan Sauce"};
questions.push(newQn);

let trivia = {
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    next: function () {      // resets for the next question
        isCorrect = false;
        time = 30;
        qnCounter++;
        this.timer();
    },
    timer: function () {// controls time
        clearInterval(int);
          int = setInterval(() =>{
            if (time <= 0) {     // if time runs out
                this.unanswered++;
                this.next();
            }
            else {
                time--;
                $("#time").text(time);
            }
        }, 1000);
        this.populate();
    },
    populate: function () {     // displays the questions and choices
        if (qnCounter > 9) {           // if quiz is over
            this.showResults();
        } else {
            let qnSlot = $("#question");
            qnSlot.text(questions[qnCounter].qn);   // displays the current question

            // populate the choices for the question
            for (let x = 0; x < questions[qnCounter].choices.length; x++) {
                $("#choice" + (x + 1)).text(questions[qnCounter].choices[x]);
            }
        }
    },
    choiceChecker: function (choice) {    // checks for the correct choices
        for (let x = 0; x < questions[qnCounter].choices.length; x++) {
            if (choice === questions[qnCounter].ans) {
                isCorrect = true;
            }
        }

        if ((!time <= 0) && (isCorrect) && (qnCounter < 9)) {  // if player picks a correct answer
            this.correct++;
            this.next();
        } else if ((!time <= 0) && (!isCorrect) && (qnCounter < 9)) { // if player picks a wrong answer
            this.incorrect++;
            this.next();
        } else if ((qnCounter = 9)) {       // if all questions are done
            this.showResults();
        }
    },
    showResults: function () {
        clearInterval(int);
        let card = $("#myCard");
        card.empty();

        let newBtn = $("<input>", { type: "button", class: " center newBtn btn btn-info", id: "restart", value: "Click to Restart"  });

        card.css('background-image', 'url(./assets/images/results.jpg)')
            .css('background-size', 'auto 100%')
            //.css('background-repeat', 'no-repeat')
            .css('color', 'white')
            .css('padding', ' 20px 0 310px 0');
        card.append(`<h2 class="card-title">Your Results</h2><hr>
            <p>Correct: ${this.correct}</p>
            <p>Wrong: ${this.incorrect}</p>
            <p>Unanswered: ${this.unanswered}</p>`);
        card.append(newBtn);
    }
};

$(document).ready(function() {
    $("#myCard").css('display', 'none');    // dynamically hides the trivia card

    $("#startBtn").on("click", function () {
        $(".jumbotron").css("display", "none");    // hides the jumbotron dynamically
        $("#myCard").css('display', '');    // displays the trivia card
        trivia.timer();    // runs the timer function after every second
    });

    $(".myChoices").on("click", function () {
        let str = this.textContent.trim();
        console.log(str);
        trivia.choiceChecker(str);
    })

    $(".newBtn").on("click", function () {
        qnCounter = 0;
        trivia.timer();
    })
});