class State {
    constructor(questions) {
        this.step = 0;
        this.correctAnswers = 0;
        this.questions = questions;
        this.jPrimerEmail = "";
    }

    provideAnswer(answerId) {
        if (this.step <= 0 || this.step > this.questions.length) {
            return;
        }
        this.questions[this.step - 1].providedAnswerId = answerId;
        if (answerId == this.questions[this.step - 1].correctAnswerId) {
            this.correctAnswers++;
        }
    }

    next() {
        this.step++;
    }

    // We always start at 0
    isStartStep() {
        return this.step === 0;
    }

    // The last question index is length of questions - 1
    // the last questions' step is length of quesitons
    isLastQuestion() {
        return this.questions.length == this.step;
    }

    // The "end" step is the one AFTER the lats question
    isEndStep() {
        return this.questions.length+1 == this.step;
    }

    persistFor(email) {
        submitEntry({
            email: email,
            questions: this.questions,
            correctAnswers: this.correctAnswers
        });
    }
}


class Question {
    constructor(question, answers, correctAnswerId) {
        this.question = question;
        this.answers = answers;
        this.correctAnswerId = correctAnswerId;
    }
}

class QuestionRepository {
    constructor() {
        this.q1 = new Question(
            "first question test",
            ["answer 1", "answer 2", "answer 3", "answer 4"],
            2
        );
        this.q2 = new Question(
            "sec question test",
            ["answer 1", "answer 2", "answer 3", "answer 4"],
            2
        );
        this.q3 = new Question(
            "th question test",
            ["answer 1", "answer 2", "answer 3", "answer 4"],
            2
        );
        this.q4 = new Question(
            "fourth question test",
            ["answer 1", "answer 2", "answer 3", "answer 4"],
            2
        );
        this.q5 = new Question(
            "fifth question test",
            ["answer 1", "answer 2", "answer 3", "answer 4"],
            2
        );


        this.questions = [this.q1, this.q2, this.q3, this.q4, this.q5];
    }

    get3RandomQuestions() {
        this._shuffle(this.questions);
        return this.questions.slice(0, 3);
    }

    // Fisher-Yates / Knuth Shuffle.
    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    _shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

}

var globalState;

$(function () {

    let qState = new QuestionRepository();
    let questions = qState.get3RandomQuestions();
    globalState = new State(questions);
    console.log(questions);

    $("#placeholder input").checkboxradio();
    $("#placeholder fieldset").controlgroup();
    $("button").button().click(function () {
        if (globalState.isStartStep()) {
            progress();
            $("#step-0").hide();
            $("#placeholder").show();
        } else if (globalState.isLastQuestion()) {
            finish(globalState);
        } else if (globalState.isEndStep()) {
            globalState.persistFor($("#jPrimerEmail").val());
            window.location.reload(true);
        }

        let answerId = $("#placeholder_fieldset input[type='radio']:checked").attr("answerId");
        console.log(answerId);
        if (globalState.step < 3) {
            $("#placeholder_question").text(questions[globalState.step].question);
            let fieldsetHtml = `<legend>Select an answer:</legend>`;
            questions[globalState.step].answers.forEach((answer, idx) => {
                fieldsetHtml += `<input type="radio" name="radio-${globalState.step}" answerId="${idx}">`
                fieldsetHtml += `<label for="radio-${idx}">${answer}</label>`;
                fieldsetHtml += `<br/>`
            });
            $("#placeholder_fieldset").html(fieldsetHtml);
        }
        globalState.provideAnswer(answerId);
        globalState.next();

    });
    var progressbar = $("#progressbar");
    var progressLabel = $(".progress-label");

    progressbar.progressbar({
        max: 90,
        value: 90,
        change: function () {
            progressLabel.text(progressbar.progressbar("value") + " seconds");
        }
    });

    function progress() {
        var val = progressbar.progressbar("value");
        progressbar.progressbar("value", val - 1);
        if (val > 0) {
            setTimeout(progress, 1000);
        } else {
            progressLabel.text("Result");
            finish();
        }
    }

    function finish() {
        progressbar.progressbar("value", 0);
        $("#placeholder").hide();
        let correct = globalState.correctAnswers;
        $("#result").text(correct);
        $("#step-4").show();
        attachEmptyOrValidListenerToSubmitBtn();
    }

    function attachEmptyOrValidListenerToSubmitBtn() {
        // $("#jPrimerEmail")[0].validity.valid
        let emailField = $("#jPrimerEmail");
        emailField.on('keyup blur', () => {
            console.log("changed!");
            let valid = emailField[0].validity.valid;
            if (emailField.val().length != 0 && !valid) {
                $("#btn-submit-reset").prop("disabled", true);
            } else {
                $("#btn-submit-reset").prop("disabled", false);
            }
        });
    }

    progressbar.find(".ui-progressbar-value").css("background-color", "#7887e6");
});

