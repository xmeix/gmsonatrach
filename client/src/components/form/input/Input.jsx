import "./Input.css";
const Input = ({ label, width, type }) => {
  return (
    <div className="input">
      <label className="label">{label}</label>
      <input
        className="subinput"
        type={type ? type : "text"}
        placeholder={label}
        style={{ width: width }}
      />
    </div>
  );
};
export default Input;
