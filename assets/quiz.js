class State {
    constructor(questions) {
        this.step = 0;
        this.correctAnswers = 0;
        this.questions = questions;
        this.jPrimerEmail = "";
    }

    getQuestion() {
        return this.questions[this.step];
    }

    provideAnswer(answerId) {
        this.questions[this.step - 1].providedAnswerId = answerId;
        if (answerId == this.questions[this.step - 1].correctAnswerId) {
            this.correctAnswers++;
        }
    }

    isFirstStep() {
        return this.step == 0;
    }

    next() {
        if (this._startStep)
            this._startStep = false;
        this.step++;
    }

    isQuestionStep() {
        return this.step >= 0 && this.step <= this.questions.length;
    }

    // The last question index is length of questions - 1
    // the last step is the one after the last question
    isLastStep() {
        return this.questions.length == this.step;
    }

    // The "end" step is the one AFTER the lats question
    shouldReset() {
        return this.questions.length + 1 == this.step;
    }

    timedOut() {
        this.step = this.questions.length + 1;
    }

    persistFor(email) {
        submitEntry({
            email: email,
            questionIds: this.questions.map(q => q.questionId),
            answerIds: this.questions.map(q => q.providedAnswerId),
            correctAnswers: this.correctAnswers
        });
    }
}

var globalState;

$(function () {

    let qState = new QuestionRepository();
    let questions = qState.get3RandomQuestions();
    globalState = new State(questions);

    $("#placeholder input").checkboxradio();
    $("#placeholder fieldset").controlgroup();
    $("button").button().click(function () {
        if (globalState.isFirstStep()) {
            progress();
            $("#step-0").hide();
            $("#placeholder").show();
        } else if (globalState.isLastStep()) {
            finish();
        } else if (globalState.shouldReset()) {
            globalState.persistFor($("#jPrimerEmail").val());
            window.location.reload(true);
        }

        visualizeQuestion();
        scorePoints();

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
            scorePoints();
            globalState.timedOut();
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
        let emailField = $("#jPrimerEmail");
        emailField.on('keyup blur', () => {
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

function visualizeQuestion() {
    if (globalState.isQuestionStep() && !globalState.isLastStep()) {
        let q = globalState.getQuestion();
        $("#placeholder_question").html(q.html);
        let fieldsetHtml = `<legend>Select an answer:</legend>`;
        q.answers.forEach((answer, idx) => {
            fieldsetHtml += `<input type="radio" name="radio-${globalState.step}" answerId="${idx}">`;
            fieldsetHtml += `<label for="radio-${idx}">${answer}</label>`;
            fieldsetHtml += `<br/>`;
        });
        $("#placeholder_fieldset").html(fieldsetHtml);
    }
}

function scorePoints() {
    if (globalState.isQuestionStep()) {
        let answerId = $("#placeholder_fieldset input[type='radio']:checked").attr("answerId");
        if (answerId) {
            globalState.provideAnswer(answerId);
        }
    }
}

