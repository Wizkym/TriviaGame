// some global variables
let time = 30;
let qnCounter = 0;
let newDiv, card;
let int;
let isCorrect = false;
let graded = false;
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
newQn = {qn: "What was Jerry’s apple-based ad slogan?", choices: ["Got Apples?", "Apples: they're great", "Hungry for apples", "Where are the apples"], ans: "Got Apples?"};
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
        graded = false;
        this.timer();
    },
    timer: function () {// controls time
        clearInterval(int);
          int = setInterval(() =>{      // fat arrow functions for the win
            if (time <= 0) {     // if time runs out
                this.unanswered++;
                let unan = 'Hmm.. you\'re outta time! Ans: ';
                this.flash(isCorrect, questions[qnCounter].ans, unan);
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

            // update progress bar
            let width = (qnCounter * 10);
            let progress = $( ".progress-bar" );
            progress.attr( {"aria-valuenow": qnCounter.toString() + '0', });
            progress.css('width', width.toString() + '%');

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

        if ((!time <= 0) && (isCorrect) && (qnCounter <= 9)) {  // if player picks a correct answer
            this.correct++;
        } else if ((!time <= 0) && (!isCorrect) && (qnCounter <= 9)) { // if player picks a wrong answer
            this.incorrect++;
        } else if ((qnCounter > 9)) {       // if all questions are done
            this.showResults();
        }
        graded = true;
        this.flash(isCorrect, questions[qnCounter].ans, "");       // displays the correct answer and status
    },
    flash: function (bol, ans, x) {
        clearInterval(int);
        let result;

        if (bol) {
            result = 'Correct! \n ' + ans;
        } else {
            if ((!bol) && (x === "")) {
            result = 'Wrong! The answer is: ' + ans;
            }else {
                result = x + ans;
            }
        }

        $('.card-body').append(`<p class="result">${result}</p>`);

        setTimeout(function(){
            $(`.result`).remove();
            trivia.next();
        }, 5000);

    },
    showResults: function () {
        clearInterval(int);         // clear the set interval
        card = $("#myCard");
        card.hide('slow');          // hide the card holding the questions & choices

        newDiv = $('<div>', {id: 'resultDiv'});     //define the results div
        let newBtn = $("<input>", { type: "button", class: "center newBtn btn btn-info", id: "restart", value: "Click to Restart"  });

        newDiv.append(`<h2 class="card-title">Your Results</h2><hr>
            <p>Correct: ${this.correct}</p>
            <p>Wrong: ${this.incorrect}</p>
            <p>Unanswered: ${this.unanswered}</p>`);
        newDiv.css('background-image', 'url(./assets/images/results.jpg)')
            .css('background-size', 'auto 100%')
            .css('color', 'white')
            .css('padding', ' 20px 0 310px 0');
        newDiv.append(newBtn);
        $(".container").append(newDiv);
    },
    restart: function () {
        qnCounter = -1;
        this.correct = 0;
        this.incorrect = 0;
        this.unanswered = 0;
        card.show();
        this.next();
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

        if (!graded) {
        trivia.choiceChecker(str);}
    });

    $('.container').on('click', '.newBtn', function (event) {
        $('#resultDiv').remove();       // purge the dynamic div
        trivia.restart();
    });
});