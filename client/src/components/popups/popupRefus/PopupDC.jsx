import { makeStyles } from "@material-ui/core";
import logo from "../../../assets/logo.svg";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import "./../Popup.css";
import usePDFGenerator from "../../../hooks/usePDFGenerator";
import { useStyles } from "./PopupDB";

const PopupDC = ({ item }) => {
  const classes = useStyles();
  const [pdfRef, generatePDF] = usePDFGenerator("demande-congé");
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
          <span className="etat-label">Etat:</span>
          <div className="etat-content">{etat}</div>
        </div>
        <div className="etat">
          <span className="etat-label">Raison de refus:</span>
          <div className="etat-content">{raisonRefus || "/"}</div>
        </div>
      </div>
      <div className="popup-dc" id="DC-Demande" ref={pdfRef}>
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
              content={
                ": " +
                new Date(createdAt)
                  .toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })
                  .split("/")
                  .join("-")
              }
            />
            <OmLabelLine label="Motif" content={": " + motif} />
            <OmLabelLine label="Matricule" content={": " + idEmetteur._id} />
            <OmLabelLine
              label="Nom & Prénom"
              content={": " + `${idEmetteur.nom} ${idEmetteur.prenom}`}
            />

            <OmLabelLine
              label="Structure"
              content={": " + idEmetteur.structure}
            />
            <OmLabelLine
              label="Nombre de jours"
              content={": " + idEmetteur.structure}
            />
            <OmLabelLine
              label="Date de départ"
              content={
                ": " +
                new Date(DateDepart)
                  .toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })
                  .split("/")
                  .join("-")
              }
            />
            <OmLabelLine
              label="Date de retour"
              content={
                ": " +
                new Date(DateRetour)
                  .toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })
                  .split("/")
                  .join("-")
              }
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
      <button onClick={generatePDF}>Generate PDF</button>
    </>
  );
};

export default PopupDC;
