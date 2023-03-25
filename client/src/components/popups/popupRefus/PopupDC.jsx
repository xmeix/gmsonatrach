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
const useStyles = makeStyles({
  table: {
    minWidth: 200,
    borderCollapse: "separate",
    border: "solid 1px var(--light-gray)",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    backgroundColor: "var(--blue3)",
    fontSize: "12px",
    border: "solid 1px var(--light-gray)",
  },
  tableCell: {
    padding: "10px",
    fontWeight: 500,
    fontSize: 13,
    border: "solid 1px var(--light-gray)",
  },
});
const PopupDC = ({ item }) => {
  const classes = useStyles();
  const [pdfRef, generatePDF] = usePDFGenerator("demande-congé");

  return (
    <>
      <div className="state">
        <div className="etat">
          <span className="etat-label">Etat:</span>
          <div className="etat-content">{item.etat}</div>
        </div>
        <div className="etat">
          <span className="etat-label">Raison de refus:</span>
          <div className="etat-content">{item.raisonRefus || "/"}</div>
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

          <div className="before-table">
            <div>
              <span>Date de création:</span>
              {Intl.DateTimeFormat(["ban", "id"]).format(
                new Date(item.createdAt)
              )}
            </div>
            <div>
              <span>Motif:</span> {item.motif || "/"}
            </div>
            <div>
              <span>Matricule:</span> {item.idEmetteur._id}
            </div>
            <div>
              <span>Nom & Prenom:</span>
              {item.idEmetteur.nom + " " + item.idEmetteur.prenom}
            </div>
            <div>
              <span>Structure:</span> {item.idEmetteur.structure}
            </div>
            <div>
              <span>Nombre de jours:</span> {item.idEmetteur.structure}
            </div>
            <div>
              <span>Date de départ:</span>
              {Intl.DateTimeFormat(["ban", "id"]).format(
                new Date(item.DateDepart)
              )}
            </div>
            <div>
              <span>Date de retour:</span>
              {Intl.DateTimeFormat(["ban", "id"]).format(
                new Date(item.DateRetour)
              )}
            </div>
            <div>
              <span>Lieu de séjour:</span> {item.LieuSejour}
            </div>
            <div>
              <span>Nature de la demande:</span> {item.Nature}
            </div>
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
                  <TableCell align="center" className={classes.tableHeaderCell}>
                    Case réservée au Service Gestion
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeaderCell}>
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
