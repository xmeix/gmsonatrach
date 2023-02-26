import "./Row.css";
const Row = ({ title, state, buttons }) => {
  return (
    <div className="row">
      <div className="info">
        <p className="id">{title}</p>
        <p className="etat">{state}</p>
      </div>
      <div className="buttons">
        {buttons.map((button, i) => (
          <button key={i} className="btn">
            {button}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Row;
