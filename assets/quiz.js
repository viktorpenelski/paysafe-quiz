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
            $("#placeholder_question").html(questions[globalState.step].html);
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

