import "./Row.css";
const Row = () => {
  return (
    <div className="row">
      <div className="info">
        <p className="id">
          <span>id:</span> 188875
        </p>
        <p className="etat">en cours</p>
      </div>
      <div className="buttons">
        <button className="btn">Accepter</button>
        <button className="btn">Refuser</button>
      </div>
    </div>
  );
};

export default Row;
