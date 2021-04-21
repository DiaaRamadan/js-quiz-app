// select elements
const countSpan = document.querySelector('.quiz-info .count span');
const bulletsContainer = document.querySelector('.bullets .spans');
const quizArea = document.querySelector('.quiz-area');
const answersArea = document.querySelector('.answers-area');
const submitBtn = document.querySelector('.submit-button');
const resultContainer = document.querySelector('.results');
const countDownSpan = document.querySelector('.countdown');

let currentIndex = 0;
let rigthAnswer = 0;
let countDownInterval;
const timeCount = 120;

const getQuestions = () => {

    const request = new XMLHttpRequest();
    request.onload = function(){

        if(this.readyState === 4 && this.status === 200){
            
            const quizQuestions = JSON.parse(this.responseText);
            const questionsCount = quizQuestions.length;
            createBullets(questionsCount);
            addQuestionData(quizQuestions[currentIndex], questionsCount);
            countDown(timeCount, questionsCount);
            submitBtn.onclick = () => {
                // get right answer
                if(currentIndex < questionsCount){
                    const rigthAns = quizQuestions[currentIndex].rigth_answer;
                    currentIndex++;
                    checkAnswer(rigthAns, questionsCount);
                    clearQuestion();
                    handleBullets();
                    addQuestionData(quizQuestions[currentIndex], questionsCount);
                    clearInterval(countDownInterval);
                    countDown(timeCount, questionsCount);
                    showResults(questionsCount);
                   
                }
            }
        }
    }
    request.open('GET', 'html_questions.json', true);
    request.send();
}

const createBullets = (num) => {

    countSpan.innerHTML = num;

    for(let i = 0; i< num; i++){

        // create span
        const span = document.createElement('span');
        if(i === 0){
            span.className = 'on';
        }
        bulletsContainer.appendChild(span);
    }
}

const addQuestionData = (dataObj, questionCount) => {
    
    if(currentIndex < questionCount){
        // create the question title
        const qTitle = document.createElement('h2');
        const titleText = document.createTextNode(dataObj.title);
        qTitle.appendChild(titleText);
        quizArea.appendChild(qTitle);

        for(let i = 1; i<= 4; i++){
            const ansNum = `answer_${i}`;
            const ans = ` <div class="answer">
                        <input type="radio" data-answer="${dataObj[ansNum]}" name="questions" id="${ansNum}" ${(i === 1) ? 'checked' : ''}>
                        <label for="${ansNum}">${dataObj[ansNum]}</label>
                        </div>`;
            answersArea.insertAdjacentHTML('beforeend' , ans);
        }
    }

}

const checkAnswer = (rAnswer, count) => {

  
        const answers = document.getElementsByName('questions');
        let theChooseingAnswer;

        for(let i = 0; i< answers.length; i++){
            if(answers[i].checked){
                theChooseingAnswer = answers[i].dataset.answer;
            }
        }

        if(rAnswer == theChooseingAnswer){
            rigthAnswer++;
        }
      
        
}

const clearQuestion = () => {
    quizArea.innerHTML = '';
    answersArea.innerHTML = '';

}

const handleBullets = () => {
    const bullets = document.querySelectorAll('.bullets .spans span');
    const bulletsArray = Array.from(bullets);

    bulletsArray.forEach((span, index) => {
        if(currentIndex === index){
            span.className = 'on';
        }
    })
}

const showResults = (qCount) => {
    let theResults;
    if(qCount === currentIndex){
        quizArea.remove();
        answersArea.remove();
        submitBtn.remove();
        document.querySelector('.bullets').remove();
    }
   
    if(rigthAnswer > qCount / 2 && rigthAnswer < qCount){
        theResults = `<span class = 'good'>Good</span> ${rigthAnswer} From ${qCount} `;
    }else if(rigthAnswer === qCount){
        theResults = `<span class = 'perfect'>Perfect</span> ${rigthAnswer} From ${qCount}`;
    }else{
        theResults = `<span class = 'bad'>Bad</span> ${rigthAnswer} From ${qCount}`;
    }

    resultContainer.innerHTML = theResults;
    resultContainer.style.padding = '10px';
    resultContainer.style.marginTop ='10px';
    resultContainer.style.background ='white';
}

const countDown = (duration, count) => {
    if(currentIndex < count){
        let minuts, seconds;    
        countDownInterval = setInterval(() => {
            
            minuts = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minuts = minuts < 10 ? `0${minuts}`: minuts;
            seconds = seconds < 10 ? `0${seconds}`: seconds;
            countDownSpan.innerHTML = `${minuts}:${seconds}`;

            if(--duration < 0){
                clearInterval(countDownInterval);
                submitBtn.click();
            }

        }, 1000)
    }
}
getQuestions();