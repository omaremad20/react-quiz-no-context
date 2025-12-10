function Result({
  isTimeOut,
  userDegree,
  handleStartFromTheBegning,
  maxPossible,
  points,
  highScore,
}) {
  return (
    <>
      {isTimeOut && (
        <p
          style={{
            fontSize: "24px",
            fontWeight: "900",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Time Out !
        </p>
      )}

      <p
        className="result"
        style={{
          paddingInline: "8rem",
          paddingBlock: "1.75rem",
          fontSize: "16px",
        }}
      >
        You Scored {points} Out Of {maxPossible} Points : ({" "}
        {userDegree.toFixed(1)}%)
      </p>

      <p style={{ textAlign: "center", fontSize: "14px", fontWeight: "600" }}>
        High Score Is : {highScore}
      </p>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "end",
          marginTop: "3rem",
        }}
      >
        <button className="btn" onClick={handleStartFromTheBegning}>
          Restart Quiz
        </button>
      </div>
    </>
  );
}

export default Result;
