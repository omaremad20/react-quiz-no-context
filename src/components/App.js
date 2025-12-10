import { useReducer } from "react";
import Error from "./Error.js";
import Header from "./Header.js";
import Loader from "./Loader.js";
import Main from "./Main.js";
import ProgressBar from "./ProgressBar.js";
import Question from "./Question.js";
import QuestionFooter from "./QuestionFooter.js";
import Result from "./Result.js";
import Start from "./Start.js";

function reducerFn(state, action) {
  switch (action.type) {
    case "handleLetsStartButton":
      return { ...state, fromStart: false, isLoading: true };

    case "initQuestions":
      return {
        ...state,
        isLoading: false,
        questions: action.payLoad.questions,
        variants: {
          ...state.variants,
          currentQuestionAnswer: action.payLoad.currentQuestionAnswer,
        },
      };

    case "setTimer":
      return {
        ...state,
        timer: action.payLoad.timer,
        timeToShow: action.payLoad.timeToShow,
      };

    case "loserMode":
      return { ...action.payLoad };

    case "Next":
      return {
        ...state,
        currentQuestion: action.payLoad.currentQuestion,
        variants: { ...action.payLoad.variants },
      };

    case "userAnswer":
      return {
        ...state,
        currentPoints: action.payLoad.currentPoints,
        userAnswerIndex: action.payLoad.userAnswerIndex,
        variants: { ...action.payLoad.variants },
      };

    case "setToResultPage":
      return { ...action.payLoad };

    case "errorHandler":
      return {
        ...state,
        errorMessage: action.payLoad.errorMessage,
        isLoading: false,
      };

    case "fromBegian":
      return { ...action.payLoad };

    default:
      throw new Error("Unknown Process");
  }
}

export default function App() {
  const intialState = {
    fromStart: true,
    isLoading: false,
    currentQuestion: 0,
    currentPoints: 0,
    questions: [],
    variants: {
      enableCurrentQuestion: true,
      currentQuestionAnswer: -1,
      userAnswer: null,
    },
    timer: 60000 * 7.5,
    timeToShow: "07:30",
    isTimeOut: false,
    toResultPage: false,
    errorMessage: "",
    highScore: 0,
  };

  const [state, dispatch] = useReducer(reducerFn, intialState);
  const {
    currentQuestion,
    currentPoints,
    questions,
    variants,
    fromStart,
    isLoading,
    timer,
    timeToShow,
    isTimeOut,
    toResultPage,
    errorMessage,
    highScore,
  } = state;
  const { enableCurrentQuestion, currentQuestionAnswer, userAnswer } = variants;
  const maxPossible = questions.reduce((prev, curr) => prev + curr.points, 0);

  async function handleClick() {
    dispatch({ type: "handleLetsStartButton" });
    try {
      const questionsRequest = await fetch(`http://localhost:9000/questions`);
      const questionsResponse = await questionsRequest.json();
      dispatch({
        type: "initQuestions",
        payLoad: {
          questions: questionsResponse,
          currentQuestionAnswer:
            questionsResponse[currentQuestion].correctOption,
        },
      });
    } catch (error) {
      dispatch({
        type: "errorHandler",
        payLoad: { errorMessage: error.message },
      });
    }
  }

  function handleNextBtn() {
    if (currentQuestion + 1 === questions.length) {
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
        isTimeOut: false,
        toResultPage: true,
        highScore: currentPoints > highScore ? currentPoints : highScore,
        errorMessage: "",
      };

      dispatch({ type: "setToResultPage", payLoad: { ...newData } });
      return;
    }

    dispatch({
      type: "Next",
      payLoad: {
        currentQuestion: currentQuestion + 1,
        variants: {
          enableCurrentQuestion: true,
          currentQuestionAnswer: questions[currentQuestion + 1].correctOption,
          userAnswer: null,
        },
      },
    });
  }

  function handleUserAnswer(userAnswerIndex) {
    if (enableCurrentQuestion === false) return;
    dispatch({
      type: "userAnswer",
      payLoad: {
        currentPoints:
          userAnswerIndex === currentQuestionAnswer
            ? currentPoints + questions[currentQuestion].points
            : currentPoints,
        variants: {
          ...variants,
          enableCurrentQuestion: false,
          userAnswer: userAnswerIndex,
        },
      },
    });
  }

  function handleStartFromTheBegning() {
    const data = {
      fromStart: false,
      isLoading: false,
      currentQuestion: 0,
      currentPoints: 0,
      questions: questions,
      variants: {
        enableCurrentQuestion: true,
        currentQuestionAnswer: questions[0].correctOption,
        userAnswer: null,
      },
      timer: 60000 * 7.5,
      timeToShow: "07:30",
      toResultPage: false,
      errorMessage: "",
      highScore: currentPoints > highScore ? currentPoints : highScore,
    };

    dispatch({ type: "fromBegian", payLoad: { ...data } });
  }

  return (
    <div className="app">
      <Header />
      <Main className="main">
        {fromStart && !toResultPage && <Start onClick={handleClick} />}
        {isLoading && <Loader />}
        {questions.length > 0 &&
          !isLoading &&
          !fromStart &&
          !toResultPage &&
          !errorMessage && (
            <>
              <ProgressBar
                currentPoints={currentPoints}
                currentQuestion={currentQuestion}
                totalQuestions={questions.length}
              />
              <Question
                question={questions[currentQuestion].question}
                answers={questions[currentQuestion].options}
                handleUserAnswer={handleUserAnswer}
                enableCurrentQuestion={enableCurrentQuestion}
                correctAnswer={questions[currentQuestion].correctOption}
                userAnswer={userAnswer}
              />
              <QuestionFooter
                timeToShow={timeToShow}
                userAnswer={userAnswer}
                handleNextBtn={handleNextBtn}
                currentQuestion={currentQuestion}
                currentQuestionPoints={questions[currentQuestion].points}
                currentQuestionAnswer={questions[currentQuestion].correctOption}
                questionsLength={questions.length}
                dispatch={dispatch}
                timer={timer}
                currentPoints={currentPoints}
                questions={questions}
                highScore={highScore}
              />
            </>
          )}
        {toResultPage && (
          <Result
            isTimeOut={isTimeOut}
            userDegree={Math.ceil((currentPoints / maxPossible) * 100)}
            points={currentPoints}
            handleStartFromTheBegning={handleStartFromTheBegning}
            highScore={highScore}
          />
        )}
        {errorMessage && <Error errorMessage={errorMessage} />}
      </Main>
    </div>
  );
}
