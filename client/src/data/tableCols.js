export const columnsDemandes = [
  { id: "createdAt", label: "date", minWidth: "20px" },
  { id: "idEmetteur", label: "Sender", minWidth: "20px" },
  { id: "motif", label: "Motif", minWidth: "20px" },
  { id: "structure", label: "Structure", minWidth: "20px" },
  { id: "etat", label: "State", minWidth: "20px" },
];
export const filterDemOptions = [
  "en-attente",
  "acceptée",
  "refusée",
  "annulée",
  "DM",
  "DC",
];
export const filterDBOptions = ["en-attente", "acceptée", "refusée", "annulée"];

export const columnsRFM = [
  { id: "createdAt", label: "date", minWidth: "20px" },
  { id: "idEmploye", label: "Sender", minWidth: "20px" },
  { id: "etat", label: "State", minWidth: "20px" },
];
export const filterRFMOptions = ["créé", "en-attente", "accepté", "refusé"];

export const columnsUsersEmp = [
  { id: "createdAt", label: "date", minWidth: "20px" },
  { id: "nom", label: "Last Name", minWidth: "20px" },
  { id: "prenom", label: "First Name", minWidth: "20px" },
  { id: "fonction", label: "Function", minWidth: "20px" },
  { id: "email", label: "Email", minWidth: "20px" },
  { id: "role", label: "Role", minWidth: "20px" },
];

export const filterUserOptions = [
  "directeur",
  "secretaire",
  "employe",
  "responsable",
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

export const columnsMissions = [
  { id: "createdAt", label: "Date", minWidth: "20px" },
  { id: "createdBy", label: "Created by", minWidth: "20px" },
  { id: "objetMission", label: "Mission objective", minWidth: "20px" },
  { id: "budget", label: "Budget", minWidth: "20px" },
  { id: "tDateDeb", label: "start date", minWidth: "20px" },
  { id: "tDateRet", label: "end date", minWidth: "20px" },
  { id: "etat", label: "State", minWidth: "20px" },

  { id: "raisonRefus", label: "Reason for refusal", minWidth: "20px" },
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
