import { useState } from "react";
import BoiteRecherche from "./boiteRecherche/BoiteRecherche";
import "./Liste.css";
import Row from "./row/Row";
const Liste = ({ title, search }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const options = ["etat", "moyen de transport"];
  const data = [
    { name: "John", age: 30 },
    { name: "Jane", age: 25 },
    { name: "Bob", age: 40 },
  ];

  const filteredData = data.filter((item) => {
    //selectedOption ? item.name === selectedOption : true;
  });
  return (
    <div className="liste">
      <p className="listTitle">{title}</p>
      <div className="outils">
        <BoiteRecherche search={search} />

        <select
          className="selectBox"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="">filter: Select an option</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
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
