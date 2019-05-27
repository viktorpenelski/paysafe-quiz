class Question {
    constructor(question, answers, correctAnswerId) {
        this.question = question;
        this.answers = answers;
        this.correctAnswerId = correctAnswerId;
    }
}

class QuestionStorage {

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

$(function () {

    let step = 0;

    let qState = new QuestionStorage();
    let questions = qState.get3RandomQuestions();
    console.log(questions);

    $("input").checkboxradio();
    $("fieldset").controlgroup();
    $("button").button().click(function () {
        if (step == 0) {
            progress();
            $("#step-0").hide();
            $("#step-1").show();
        } else if (step == 1) {
            $("#step-1").hide();
            $("#step-2").show();
        } else if (step == 2) {
            $("#step-2").hide();
            $("#step-3").show();
        } else if (step == 3) {
            finish();
        } else if (step == 4) {
            window.location.reload(true);
        }

        if (step < 3) {
            $("#placeholder_question").text(questions[step].question);
            let fieldsetHtml = `<legend>Select an answer:</legend>`
            questions[step].answers.forEach((answer, idx) => {
                fieldsetHtml += `<input type="radio" name="radio-${step}" id="radio-${step}-${idx}">`
                fieldsetHtml += `<label for="radio-${idx}">${answer}</label>`;
                fieldsetHtml += `<br/>`
            });
            $("#placeholder_fieldset").html(fieldsetHtml);
        }
        step++;

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
        var correct = $("label[data-correct=true].ui-checkboxradio-checked").length;
        $("#result").text(correct);
        $("#step-4").show();
    }

    progressbar.find(".ui-progressbar-value").css("background-color", "#66cc99");
});

