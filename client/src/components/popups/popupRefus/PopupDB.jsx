import useFileGenerator from "../../../hooks/useFileGenerator";
import logo from "../../../assets/logo.svg";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  InputAdornment,
  makeStyles,
} from "@material-ui/core";
import { OmLabelLine } from "./PopupOM";
export const useStyles = makeStyles({
  table: {
    borderCollapse: "separate",
    borderRight: "solid 1px black",
    borderTop: "solid 1px black",
  },
  tableCell: {
    padding: "10px",
    fontWeight: 500,
    fontSize: 13,
    borderLeft: "solid 1px black",
    borderBottom: "solid 1px black",
  },
});

const PopupDB = ({ item }) => {
  const classes = useStyles();
  const {
    _id,
    createdAt,
    numSC,
    designationSC,
    montantEngage,
    nature,
    depart,
    destination,
    employes,
    dateDepart,
    dateRetour,
    direction,
    sousSection,
    division,
    base,
    gisement,
    observation,
    motifDep,
  } = item;
  const FileItem = {
    id: _id,
    year: new Date(createdAt).getFullYear(),
    date: new Date(createdAt)
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
      .split("/")
      .join("-"),
    numSC,
    designationSC,
    montantEngage,
    nature:
      nature === "aller-retour"
        ? `${depart} / ${destination} / ${depart} `
        : `${depart} / ${destination} `,
    employes,
    nbEmployes: employes.length,
    datedepart: new Date(dateDepart)
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
      .split("/")
      .join("-"),
    timedepart: new Date(dateDepart).toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
    dateretour: new Date(dateRetour)
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
      .split("/")
      .join("-"),
    timeretour: new Date(dateRetour).toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
    direction,
    sousSection,
    division,
    base,
    gisement,
    observation,
    motifDep,
  };

  const [generateDocument] = useFileGenerator(
    FileItem,
    "/my-template-DB.docx",
    `FicheSuiveuse-${FileItem.date}.docx`
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
      <div className="popup-db">
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell}>
                  <img
                    src={logo}
                    alt=""
                    className="logo-image"
                    style={{ height: "70px", width: "60px", flex: 1 }}
                  />
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <div className="titre">Fiche Suiveuse</div>
                  <div>Budget Exploitation</div>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <div>
                    <span>Ordre</span> ....
                  </div>
                  <div>
                    <span>N°</span> {FileItem.id}/{FileItem.year}
                  </div>
                  <div>
                    <span>Date:</span> {FileItem.date}
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className={classes.tableCell}>
                  Référence budgétaire
                </TableCell>
                <TableCell className={classes.tableCell} colSpan={2}>
                  <div>
                    <span>N° sous compte:</span> {FileItem.numSC}
                  </div>
                  <div>
                    <span>Désignation sous compte:</span>
                    {FileItem.designationSC}
                  </div>
                  <div>
                    <span>Montant engagé:</span> {FileItem.montantEngage}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <div className="db-body">
          <div>
            <span>Nature:</span>{" "}
            {nature === "aller-retour"
              ? `${depart} / ${destination} / ${depart} `
              : `${depart} / ${destination} `}
            au profit de:
            <span>
              <br />
              <br />- {FileItem.nbEmployes} personnes
            </span>
          </div>
          <div className="db-date">
            <span>
              Départ: {FileItem.datedepart + " "} à {" " + FileItem.timedepart}
            </span>
            <span>
              Retour:{FileItem.dateretour + " "} à {" " + FileItem.timeretour}
            </span>
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell}>direction</TableCell>
                <TableCell className={classes.tableCell}>
                  Service section Sous - section
                </TableCell>
                <TableCell className={classes.tableCell}>division</TableCell>
                <TableCell className={classes.tableCell}>base</TableCell>
                <TableCell className={classes.tableCell}>gisement</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className={classes.tableCell}>
                  {direction || "projet SH-ONE"}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {sousSection || "/"}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {division || "/"}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {base || "/"}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {gisement || "/"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <div className="db-body">
          <span>Observations:</span>
          {observation}
          <span>Motif du déplacement: </span>
          {"mission de " + motifDep}
        </div>
        <Table className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell align="left" className={classes.tableCell}>
                <p>Date de création:</p> <br />
                <br />
                <p>Visa de l'ordonnateur:</p>
              </TableCell>
              <TableCell align="left" className={classes.tableCell}>
                <p>Service du Budget </p>
                <br /> <br />
                <p>Controlé le</p>
                <br /> <br />
                <p>Visa</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="db-subtitle">Partie réservée à la Trésorerie</div>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell}>
                  No De la facture:
                </TableCell>
                <TableCell className={classes.tableCell}>
                  +dépassement:
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className={classes.tableCell}>
                  Montant engagé:
                </TableCell>
                <TableCell className={classes.tableCell}>
                  -insuffisance
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <div className="db-subtitle">Règlements</div>
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell}>Date:</TableCell>
                <TableCell className={classes.tableCell}>Acomptes</TableCell>
                <TableCell className={classes.tableCell}>Solde</TableCell>
                <TableCell className={classes.tableCell}>
                  Observations
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className={classes.tableCell}> </TableCell>
                <TableCell className={classes.tableCell}> </TableCell>
                <TableCell className={classes.tableCell}> </TableCell>
                <TableCell className={classes.tableCell}> </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableCell}> </TableCell>
                <TableCell className={classes.tableCell}> </TableCell>
                <TableCell className={classes.tableCell}> </TableCell>
                <TableCell className={classes.tableCell}> </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <div className="db-subtitle">
          La liste nominative des missionnaires du{" "}
          {new Date(dateDepart)
            .toLocaleDateString("en-GB", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })
            .split("/")
            .join("-")}{" "}
          au{" "}
          {new Date(dateRetour)
            .toLocaleDateString("en-GB", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })
            .split("/")
            .join("-")}
        </div>
        <div className="db-subtitle">
          BC N° /{direction || "SH-ONE"}/{new Date(createdAt).getFullYear()}
        </div>
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell}></TableCell>
                <TableCell className={classes.tableCell}>
                  Nom & Prénom:
                </TableCell>
                <TableCell className={classes.tableCell}>Départ</TableCell>
                <TableCell className={classes.tableCell}>Retour</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employes.map((emp, i) => (
                <TableRow key={i}>
                  <TableCell className={classes.tableCell}>{emp._id}</TableCell>
                  <TableCell className={classes.tableCell}>
                    {emp.nom + " " + emp.prenom}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {new Date(dateDepart)
                      .toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      })
                      .split("/")
                      .join("-")}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {new Date(dateRetour)
                      .toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      })
                      .split("/")
                      .join("-")}
                  </TableCell>
                </TableRow>
              ))}
              <TableCell className={classes.tableCell}></TableCell>
              <TableCell className={classes.tableCell}></TableCell>
              <TableCell className={classes.tableCell}></TableCell>
              <TableCell className={classes.tableCell}></TableCell>
            </TableBody>
          </Table>
        </TableContainer>
        <div className="db-subtitle">
          Le Directeur projet SH One <br /> A.FELFOUL{" "}
        </div>
      </div>
      <button onClick={generateDocument}>Generate Document</button>
    </>
  );
};

export default PopupDB;
