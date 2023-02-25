import BoiteRecherche from "./boiteRecherche/BoiteRecherche";
import "./Liste.css";
import Row from "./row/Row";
const Liste = ({ title }) => {
  return (
    <div className="liste">
      <p className="listTitle">{title}</p>
      <BoiteRecherche />P
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
