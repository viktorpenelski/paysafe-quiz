$(function () {

    let step = 0;

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
        $("#step-1").hide();
        $("#step-2").hide();
        $("#step-3").hide();
        var correct = $("label[data-correct=true].ui-checkboxradio-checked").length;
        $("#result").text(correct);
        $("#step-4").show();
    }

    progressbar.find(".ui-progressbar-value").css("background-color", "#66cc99");
});

class Question {
    constructor(question, answers, correctAnswerId) {
        this.question = question;
        this.answers = answers;
        this.correctAnswerId = correctAnswerId;
    }
}