import { useState } from "react";
import BoiteRecherche from "./boiteRecherche/BoiteRecherche";
import "./Liste.css";
import Row from "./row/Row";
const Liste = ({ title, search, filterOptions }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const data = [
    { name: "John", age: 30 },
    { name: "Jane", age: 25 },
    { name: "Bob", age: 40 },
  ];
  const id = "Lamia boualouache";
  const state = "missionnaire";
  const buttons = ["accepter", "refuser"];

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
          <option value="" disabled>
            filter
          </option>
          {filterOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <ul className="rows">
        <li>
          <Row title={id} state={state} buttons={buttons} />
        </li>
        <li>
          <Row title={id} state={state} buttons={buttons} />
        </li>
        <li>
          <Row title={id} state={state} buttons={buttons} />
        </li>
        <li>
          <Row title={id} state={state} buttons={buttons} />
        </li>
        <li>
          <Row title={id} state={state} buttons={buttons} />
        </li>
      </ul>
    </div>
  );
};

export default Liste;
