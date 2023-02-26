import "./BoiteInfo.css";
const BoiteInfo = () => {
  const attributs = [
    { title: "id mission", content: "1234" },
    { title: "objet mission", content: "Exploration" },
    { title: "type", content: "Scientific" },
    { title: "pays", content: "Mars" },
    { title: "budget", content: "$10 million" },
    { title: "employes", content: ["John Smith", "Jane Doe", "Bob Johnson"] },
    {
      title: "taches",
      content: ["Collect rock samples", "Take photos", "Analyze data"],
    },
  ];
  return (
    <div className="boiteinfo">
      <div className="header">
        <h1>Mission</h1>
        <p>{attributs[0]}</p>
      </div>
      <ul>
        <li>
          {" "}
          <p> ObjetMission: </p>
          <div>
            chnhhdjdjudujd,ndkdkdkdkd,dcd,cvodknvdvndokvndorvhv fnivnrvn
            dvnjdivneiuvn uvnrivnijv
          </div>
        </li>
      </ul>
    </div>
  );
};
export default BoiteInfo;
