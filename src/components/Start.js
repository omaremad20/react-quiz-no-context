export default function Start({ onClick }) {
  return (
    <div className="start">
      <h2>Welcome To The React Quiz!</h2>
      <h3>15 Questions To Test Your React Mastery</h3>
      <button className="btn" type="button" onClick={onClick}>
        Let's Start!
      </button>
    </div>
  );
}
