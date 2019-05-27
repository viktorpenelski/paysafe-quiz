class Question {
    constructor(html, answers, correctAnswerId, questionId) {
        this.html = html;
        this.answers = answers;
        this.correctAnswerId = correctAnswerId;
        this.questionId = questionId;
    }
}

class QuestionRepository {
    constructor() {
        this.q1 = new Question(
            `<h2>Is it mandatory to declare <code>RuntimeException</code> in the list of exceptions that a method throws?</h2>`,
            [
                "Yes",
                "No",
                "Yes, but if the exception is a child of RuntimeException"
            ],
            1,
            1
        );
        this.q2 = new Question(
            `<h2>What will be printed in the console after running the following piece of code:</h2>

<div class=centered><pre><code>

List<Integer> integers = Arrays.asList(1, 2, 6, 9);

int result = integers.stream()
        .filter(integer -> integer % 2 == 1)
        .mapToInt(integer -> integer + 1)
        .sum();

System.out.println(result);

</code></pre></div>
            `,
            ["22", "10", "12", "8"],
            2,
            2
        );
        this.q3 = new Question(
            `<h2>What will be printed in the console?</h2>
<div class=centered><pre><code>
Thread t = new Thread(() -> System.out.print(Thread.currentThread().getName() + " "));
System.out.print(Thread.currentThread().getName() + " ");
t.run();
</code></pre></div>
            `,
            [
                "main main ",
                "Thread-0 main ",
                "main Thread-0 ",
                "Thread-0 Thread-0 "
            ],
            0,
            3
        );
        this.q4 = new Question(
            "<h2>Which of the following is <b>incorrect</b> about <code>LinkedHashSet</code>:</h2>",
            [
                "Elements are ordered by size",
                "Elements are unique",
                "Elements can be iterated over",
                "Elements are stored in the same order as they are inserted"
            ],
            2,
            4
        );
        this.q5 = new Question(
            `<h2>A butcher had a number of legs of lamb to chop up. 
            He chopped each leg into 11 pieces. 
            He chopped at the rate of 45 strokes per minute. How many legs would he chop in 22 minutes?</h2>`,
            [
                "27", 
                "90", 
                "99", 
                "33"
            ],
            2,5

        );

        this.q6 = new Question(
            `<h2>Amoebas reproduce by splitting in two. 
            An amoeba which does so every minute is placed in a jar at exactly ten o'clock in the morning. 
            At 12:00 noon the jar is full. At what time is the jar half full?</h2>`,
            [
                "11:59", 
                "11:30", 
                "11:00", 
                "10:01"
            ],
            0,
            6
        );


        this.questions = [this.q1, this.q2, this.q3, this.q4, this.q5, this.q6];
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