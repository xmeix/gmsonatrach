//MAKE DEMANDES COLUMNS

export const columnsDemandes = [
  { id: "createdAt", label: "date d'envoi", minWidth: "20px" },
  { id: "uid", label: "Identifiant", minWidth: "20px" },
  { id: "idEmetteur", label: "par", minWidth: "20px" },
  // { id: "motif", label: "Motif", minWidth: "20px" },
  { id: "etat", label: "état Demande", minWidth: "20px" },
];

export const filterDemOptions = [
  "DM",
  "DC",
  "en-attente",
  "acceptée",
  "refusée",
  "annulée",
];

export const filterDBOptions = ["en-attente", "acceptée", "refusée", "annulée"];

export const columnsRFM = [
  { id: "createdAt", label: "date de création", minWidth: "20px" },
  { id: "idEmploye", label: "par", minWidth: "20px" },
  { id: "mission.uid", label: "Mission", minWidth: "20px" },
  { id: "etat", label: "état", minWidth: "20px" },
];

export const filterRFMOptions = ["en-attente", "accepté"];

// export const columnsUsersEmp = [
//   { id: "createdAt", label: "date de création", minWidth: "20px" },
//   { id: "nom", label: "Nom", minWidth: "20px" },
//   { id: "prenom", label: "prénom", minWidth: "20px" },
//   { id: "fonction", label: "Fonction", minWidth: "20px" },
//   { id: "email", label: "Email", minWidth: "20px" },
//   { id: "role", label: "Role", minWidth: "20px" },
// ];
export const columnsUsersEmp = [
  { id: "createdAt", label: "date d'adhésion", minWidth: "20px" },
  { id: "uid", label: "Identifiant", minWidth: "20px" },
  { id: "nom", label: "Nom", minWidth: "20px" },
  { id: "prenom", label: "prénom", minWidth: "20px" },
];
export const filterResOptions = [
   "secretaire",
  "employe", 
   "non-missionnaire",
  "missionnaire",
];
export const filterUserOptions = [
  "directeur",
  "secretaire",
  "employe",
  "responsable",
  "relex",
  "non-missionnaire",
  "missionnaire",
  "DG",
  "PMO",
  "FIN",
  "SD",
  "PRC",
  "HCM",
  "MRO",
  "IPM",
  "PDN",
  "TECH",
  "DATA",
  "CHANGE",
];
export const columnsOM = [
  { id: "createdAt", label: "date de création", minWidth: "20px" },
  { id: "uid", label: "ID ORDRE", minWidth: "20px" },
  { id: "employe.nom", label: "Nom", minWidth: "20px" },
  { id: "employe.prenom", label: "prénom", minWidth: "20px" },
  { id: "mission.uid", label: "ID MISSION", minWidth: "20px" },
];
export const columnsMissions = [
  { id: "createdAt", label: "date de création", minWidth: "20px" },
  { id: "uid", label: "ID Mission", minWidth: "20px" },
  { id: "createdBy", label: "par", minWidth: "20px" },
  { id: "tDateDeb", label: "date début", minWidth: "20px" },
  { id: "etat", label: "état", minWidth: "20px" },
];
export const filterResMissionsOptions = [
  "local",
  "etranger",
  "avion",
  "route",
  "en-attente",
  "acceptée", //planifié
  "refusée",
  "en-cours",
  "annulée",
  "terminée",
];
export const filterMissionsOptions = [
  "PMO",
  "FIN",
  "SD",
  "PRC",
  "HCM",
  "MRO",
  "IPM",
  "PDN",
  "TECH",
  "DATA",
  "CHANGE",
  "local",
  "etranger",
  "avion",
  "route",
  "en-attente",
  "acceptée", //planifié
  "refusée",
  "en-cours",
  "annulée",
  "terminée",
];
export const filterOMOptions = [
  "PMO",
  "FIN",
  "SD",
  "PRC",
  "HCM",
  "MRO",
  "IPM",
  "PDN",
  "TECH",
  "DATA",
  "CHANGE",
];
