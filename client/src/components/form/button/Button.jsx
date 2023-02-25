import "./Button.css";
const Button = ({ label, type }) => {
  return (
    <button
      className="btn2"
      style={{ border: type === 1 && "solid .1px var(--light-gray)" }}
    >
      {label}
    </button>
  );
};
export default Button;
