import BoiteRecherche from "./boiteRecherche/BoiteRecherche";
import "./Liste.css";
import Row from "./row/Row";
const Liste = ({ title,search }) => {
  return (
    <div className="liste">
      <p className="listTitle">{title}</p>
      <div className="outils">
        <BoiteRecherche search={search}/>
      </div>
      <ul className="rows">
        <li>
          <Row />
        </li>
        <li>
          <Row />
        </li>
        <li>
          <Row />
        </li>
        <li>
          <Row />
        </li>
        <li>
          <Row />
        </li>
        <li>
          <Row />
        </li>
        <li>
          <Row />
        </li>
        <li>
          <Row />
        </li>
        <li>
          <Row />
        </li>
        <li>
          <Row />
        </li>
        <li>
          <Row />
        </li>
        <li>
          <Row />
        </li>
        <li>
          <Row />
        </li>
      </ul>
    </div>
  );
};

export default Liste;
