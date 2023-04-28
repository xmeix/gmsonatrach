import { makeStyles } from "@material-ui/core";
import logo from "../../../assets/logo.svg";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import "./../Popup.css";
import { useStyles } from "./PopupDB";
import useFileGenerator from "../../../hooks/useFileGenerator";

const PopupDC = ({ item }) => {
  const classes = useStyles();
  const {
    DateDepart,
    DateRetour,
    LieuSejour,
    Nature,
    createdAt,
    etat,
    id,
    idDestinataire,
    idEmetteur,
    motif,
    nbRefus,
    raisonRefus,
    updatedAt,
    __t,
    _id,
  } = item;
  const FileItem = {
    id: _id,
    date: new Date(createdAt)
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
      .split("/")
      .join("-"),
    year:
      new Date(createdAt).getFullYear() -
      1 +
      "/" +
      new Date(createdAt).getFullYear(),
    nom: idEmetteur.nom,
    prenom: idEmetteur.prenom,
    structure: idEmetteur.structure,
    datedepart: new Date(DateDepart)
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
      .split("/")
      .join("-"),
    dateretour: new Date(DateRetour)
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
      .split("/")
      .join("-"),
    LieuSejour,
    fonction: idEmetteur.fonction,
    nbJours: Math.ceil(
      Math.abs(new Date(DateRetour) - new Date(DateDepart)) /
        (1000 * 60 * 60 * 24)
    ),
    Nature,
  };
  const [generateDocument] = useFileGenerator(
    FileItem,
    "/my-template-DC.docx",
    `Demande-de-congés-${createdAt}.docx`
  );
  const OmLabelLine = ({ label, content }) => (
    <div className="om-label-line">
      <div className="om-label">{label}</div>
      <div className="om-content">{content}</div>
    </div>
  );
  return (
    <>
      <div className="state">
        <div className="etat">
          <OmLabelLine
            label="Etat"
            content={
              <span
                style={{
                  color:
                    item.etat === "en-attente"
                      ? "var(--orange)"
                      : item.etat === "acceptée"
                      ? "var(--success)"
                      : "var(--error)",
                  fontWeight: "600",
                }}
              >
                {item.etat}
              </span>
            }
          />
        </div>
        <OmLabelLine
          label="Raison de refus: "
          content={
            <span style={{ whiteSpace: "initial" }}>
              {item.raisonRefus || "/"}
            </span>
          }
        />
      </div>
      <div className="popup-dc" id="DC-Demande">
        <div>
          <div className="dc-head">
            <div className="dc-head-description">
              <img src={logo} alt="" className="logo" />

              <div className="direction">
                Direction Corporate <br /> Ressources Humaines
              </div>
            </div>{" "}
            <h1 className="title">Demande de congé</h1>
          </div>

          <div className="om-body dc-body">
            <OmLabelLine
              label="Date de création"
              content={": " + FileItem.date}
            />
            <OmLabelLine label="Motif" content={": " + motif} />
            <OmLabelLine label="Matricule" content={": " + FileItem.id} />
            <OmLabelLine
              label="Nom & Prénom"
              content={": " + `${FileItem.nom} ${FileItem.prenom}`}
            />

            <OmLabelLine
              label="Structure"
              content={": " + FileItem.structure}
            />
            <OmLabelLine label="Fonction" content={": " + FileItem.fonction} />
            <OmLabelLine
              label="Nombre de jours"
              content={": " + FileItem.nbJours}
            />
            <OmLabelLine
              label="Date de départ"
              content={": " + FileItem.datedepart}
            />
            <OmLabelLine
              label="Date de retour"
              content={": " + FileItem.dateretour}
            />
            <OmLabelLine label="Lieu de séjour" content={": " + LieuSejour} />
            <OmLabelLine label="Nature de la demande" content={": " + Nature} />
          </div>
          <div>
            <div
              style={{
                fontWeight: "700",
                textAlign: "left",
                padding: "1.5em 0",
              }}
            >
              Nom, Prénom et Fonction de l'intérimaire (pour les cadres
              supérieurs):
            </div>
            <Table className={classes.table} size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" className={classes.tableCell}>
                    Case réservée au Service Gestion
                  </TableCell>
                  <TableCell align="center" className={classes.tableCell}>
                    Accord du Responsable Hiérarchique <br /> Nom et Qualité du
                    Responsable
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center" className={classes.tableCell}>
                    <div style={{ height: "100px" }}></div>
                  </TableCell>
                  <TableCell align="center" className={classes.tableCell}>
                    <div style={{ height: "100px" }}></div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center" className={classes.tableCell}>
                    <div className="subtitle">
                      Signature du Responsable des Congés
                    </div>
                    <div style={{ height: "100px" }}></div>
                  </TableCell>
                  <TableCell align="center" className={classes.tableCell}>
                    <div className="subtitle">Signature de L’intéressé</div>
                    <div style={{ height: "100px" }}></div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="observation" style={{ padding: "1em" }}>
              <span> Observation:</span> Toute demande de congé ne comportant
              pas le nom et la qualité des signataires ne peut être prise en
              considération.
            </div>
            <div className="note" style={{ fontSize: "10px" }}>
              Djenane El Malik - Hydra 16035 - Alger - Tél. : 213 23 48 30 30 –
              48 31 31 Fax : 213 23 48 33 33 – 48 35 35 Télex : 66203 66204
              66222
            </div>
          </div>
        </div>
      </div>
      <button onClick={generateDocument}>Generate PDF</button>
    </>
  );
};

export default PopupDC;
