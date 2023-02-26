import "./SuiviDepense.css";
import Input from "./../../../components/form/input/Input";
import Button from "./../../../components/form/button/Button";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
const SuiviDepense = () => {
  return (
    <div className="suividepense">
      <p>Suivi Dépense</p>
      <div className="element">
        <div className="formdepense">
          <h1>Créer Dépense</h1>
          <div className="creerdepense">
            <div className="premierInput">
              <Input label="Titre" />
              <Input label="Description" />
            </div>
            <div className="deuxiemInput">
              <Input label="Nombre Unité" width="50%" />
              <div className="iconprix">
                <Input label="Prix Unité" width="50%" />
              </div>
            </div>

            <div className="depenseButton">
              <Button name="Add" />
            </div>
          </div>
        </div>
        <div className="listedepense">
          <h1>Liste Dépense</h1>
          <input className="search" type="text" placeholder="Recherche..." />
          <div className="searchicon">
            <SearchRoundedIcon />
          </div>
          <div className="liste1">
            <div className="item1">
              <p>Frais de formation</p>
              <p>Inscription à une formation en ligne </p>
            </div>
            <div className="item2">
              <p>x-10 unitées</p>
              <p>200 euros</p>
            </div>
            <div className="deleteicon">
              <DeleteRoundedIcon />
            </div>
          </div>
          <div className="liste1">
            <div className="item1">
              <p>Frais de stationnement</p>
              <p>Stationnement dans un parking </p>
            </div>
            <div className="item2">
              <p>x-3 unitées</p>
              <p>15 euros</p>
            </div>
            <div className="deleteicon">
              <DeleteRoundedIcon />
            </div>
          </div>
          <div className="liste1">
            <div className="item1">
              <p>Frais de déplacement</p>
              <p> Déplacement en taxi </p>
            </div>
            <div className="item2">
              <p>x-1 unitée</p>
              <p>40 euros</p>
            </div>
            <div className="deleteicon">
              <DeleteRoundedIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SuiviDepense;
