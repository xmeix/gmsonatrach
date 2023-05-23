//MAKE DEMANDES COLUMNS

export const columnsDemandes = [
  { id: "createdAt", label: "date de création", minWidth: "20px" },
  { id: "idEmetteur", label: "de", minWidth: "20px" },
  { id: "motif", label: "Motif", minWidth: "20px" },
  { id: "structure", label: "Structure", minWidth: "20px" },
  { id: "etat", label: "état Demande", minWidth: "20px" },
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
  { id: "createdAt", label: "date de création", minWidth: "20px" },
  { id: "idEmploye", label: "de", minWidth: "20px" },
  { id: "etat", label: "état", minWidth: "20px" },
];

export const filterRFMOptions = ["créé", "en-attente", "accepté", "refusé"];

export const columnsUsersEmp = [
  { id: "createdAt", label: "date de création", minWidth: "20px" },
  { id: "nom", label: "Nom", minWidth: "20px" },
  { id: "prenom", label: "prénom", minWidth: "20px" },
  { id: "fonction", label: "Fonction", minWidth: "20px" },
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
export const columnsOM = [
  { id: "createdAt", label: "date de création", minWidth: "20px" },
  { id: "mission.id", label: "id mission", minWidth: "20px" },
  { id: "employe.nom", label: "Nom", minWidth: "20px" },
  { id: "employe.prenom", label: "prénom", minWidth: "20px" },
  { id: "mission.objetMission", label: "Objet mission", minWidth: "20px" },
];
export const columnsMissions = [
  { id: "createdAt", label: "date de création", minWidth: "20px" },
  { id: "createdBy", label: "par", minWidth: "20px" },
  { id: "objetMission", label: "objet Mission", minWidth: "20px" },
  { id: "budget", label: "Budget", minWidth: "20px" },
  { id: "tDateDeb", label: "date début", minWidth: "20px" },
  { id: "tDateRet", label: "date fin", minWidth: "20px" },
  { id: "etat", label: "état", minWidth: "20px" },

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
