export default function ProgressBar({
  currentPoints,
  currentQuestion,
  totalQuestions,
}) {
  return (
    <>
      <progress value={currentQuestion + 1} max={totalQuestions}></progress>
      <div className="progress" style={{ marginTop: "1rem" }}>
        <p>
          Questions {currentQuestion + 1} / {totalQuestions}
        </p>
        <p>{currentPoints} / 280</p>
      </div>
    </>
  );
}
