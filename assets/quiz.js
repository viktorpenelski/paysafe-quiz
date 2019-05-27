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

    isFirst() {
        return this.step === 0;
    }

    isLast() {
        return this.step === 4;
    }

    persist() {
        console.log(this);
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

    $("input").checkboxradio();
    $("fieldset").controlgroup();
    $("button").button().click(function () {
        if (globalState.isFirst()) {
            progress();
            $("#step-0").hide();
            $("#step-1").show();
        } else if (globalState.step == 1) {
            $("#step-1").hide();
            $("#step-2").show();
        } else if (globalState.step == 2) {
            $("#step-2").hide();
            $("#step-3").show();
        } else if (globalState.step == 3) {
            finish(globalState);
        } else if (globalState.isLast()) {
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
        globalState.persist();

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
        $("#step-1").hide();
        $("#step-2").hide();
        $("#step-3").hide();
        let correct = globalState.correctAnswers;
        $("#result").text(correct);
        $("#step-4").show();
    }

    progressbar.find(".ui-progressbar-value").css("background-color", "#66cc99");
});

