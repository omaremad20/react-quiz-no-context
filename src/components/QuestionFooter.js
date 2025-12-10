import { useEffect } from "react";

export default function QuestionFooter({
  timeToShow,
  userAnswer,
  handleNextBtn,
  currentQuestion,
  currentQuestionPoints,
  currentQuestionAnswer,
  questionsLength,
  dispatch,
  timer,
  currentPoints,
  questions,
  highScore,
}) {
  function handleShowingTime(timeInMilliSecond) {
    const fullTime = Number(timeInMilliSecond) / 60000;
    const mints = fullTime.toFixed(0);
    const seconds = (fullTime - Math.floor(fullTime)) * 60;
    let newSeconds =
      seconds.toFixed(0) < 10 ? `0${seconds.toFixed(0)}` : seconds.toFixed(0);

    return `0${mints}:${newSeconds}`;
  }

  useEffect(() => {
    let intervalID = "";
    function handleInterval() {
      intervalID = setInterval(() => {
        if (timer <= 0) {
          const newData = {
            fromStart: false,
            isLoading: false,
            currentQuestion: 0,
            currentPoints: currentPoints,
            questions: questions,
            variants: {
              enableCurrentQuestion: true,
              currentQuestionAnswer: -1,
              userAnswer: null,
            },
            timer: 60000 * 7.5,
            timeToShow: "07:30",
            isTimeOut: true,
            toResultPage: true,
            highScore: currentPoints > highScore ? currentPoints : highScore,
          };

          dispatch({
            type: "loserMode",
            payLoad: { ...newData },
          });

          return;
        } else {
          dispatch({
            type: "setTimer",
            payLoad: {
              timer: timer - 1000,
              timeToShow: handleShowingTime(timer - 1000),
            },
          });
        }
      }, 1000);
    }

    handleInterval();

    return () => {
      clearInterval(intervalID);
    };
  }, [questions, timer, currentPoints, highScore, dispatch]);

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "1.5rem",
          fontSize: "16px",
        }}
      >
        <p>
          Question Degree{" "}
          {userAnswer === currentQuestionAnswer ? currentQuestionPoints : 0} /{" "}
          {currentQuestionPoints}
        </p>
      </div>

      <div className="app-header">
        <div className="timer">{timeToShow}</div>

        {userAnswer !== null && (
          <button onClick={handleNextBtn} className="btn">
            {currentQuestion + 1 === questionsLength ? "Finish" : "Next"}
          </button>
        )}
      </div>

      <p className="current-question-number">{currentQuestion + 1}</p>
    </>
  );
}
