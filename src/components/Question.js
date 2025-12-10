export default function Question({
  question,
  answers,
  handleUserAnswer,
  enableCurrentQuestion,
  correctAnswer,
  userAnswer,
}) {
  return (
    <>
      <h4>{question}</h4>
      <div className="options">
        {answers.map((answer, index) => (
          <button
            disabled={!enableCurrentQuestion}
            onClick={() => handleUserAnswer(index)}
            key={index}
            className={
              enableCurrentQuestion
                ? "btn-option btn"
                : index === correctAnswer
                ? "btn-option btn correct"
                : "btn-option btn wrong"
            }
          >
            <p style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{answer}</span>
              <span>
                {index === userAnswer && !enableCurrentQuestion && (
                  <strong>
                    Your Answer{" "}
                    {index === userAnswer && index !== correctAnswer && "❌"}
                    {index === userAnswer && index === correctAnswer && "✅"}
                  </strong>
                )}
                {index !== userAnswer &&
                  index === correctAnswer &&
                  !enableCurrentQuestion && <strong>Correct Answer ✅</strong>}
              </span>
            </p>
          </button>
        ))}
      </div>
    </>
  );
}
