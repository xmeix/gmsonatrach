export const relexBtns = [
  {
    type: "DB",
    btns: ["accept", "refuse"], // if item.etat == en attente
    showBtn: true,
  },
];

export const EmployeBtns = [
  {
    type: "DC",
    btns: ["cancel"], //if en attente
    showBtn: true,
  },
  {
    type: "DM",
    btns: [],
    showBtn: true,
  },
  {
    type: "RFM",
    btns: ["update"], //update&&send if not accepté or refusé
    showBtn: true,
  },
  {
    type: "mission",
    btns: ["mission order"], //si item.etat en attente + cancel == item.etat == accepté && !==en cours
    showBtn: true,
  },
];
export const SecretaireBtns = [
  {
    type: "DC",
    btns: ["cancel"], // if item.etat == en attente
    showBtn: true,
  },
  {
    type: "DM",
    btns: ["accept", "refuse"], // if item.etat == en attente
    showBtn: true,
  },
  {
    type: "RFM",
    btns: [], // if item.etat == en attente
    showBtn: true,
  },
  {
    type: "OM",
    btns: [],
    showBtn: true,
  },
  {
    type: "DB",
    btns: ["cancel"], //if en attente
    showBtn: true,
  },
  {
    type: "mission",
    btns: ["cancel"], //si item.etat en attente
    showBtn: true,
  },
  {
    type: "user",
    btns: [], // if item.role !== directeur / responsable //deleted delete
    showBtn: true,
  },
];

export const DirecteurBtns = [
  {
    type: "DC",
    btns: ["accept", "refuse"], // if item.etat == en attente
    showBtn: true,
  },
  {
    type: "DM",
    btns: ["accept", "refuse"], // if item.etat == en attente
    showBtn: true,
  },
  {
    type: "RFM",
    btns: ["accept", "refuse"], // if item.etat == en attente
    showBtn: true,
  },
  {
    type: "OM",
    btns: [],
    showBtn: true,
  },
  {
    type: "DB",
    btns: ["cancel"], //if en attente
    showBtn: true,
  },
  {
    type: "mission",
    btns: ["accept", "refuse", "cancel", "mission order"], //si item.etat en attente
    showBtn: true,
  },
  {
    type: "user",
    btns: [""], // if item.role !== directeur / responsable //deleted delete
    showBtn: true,
  },
];

export const ResponsableBtns = [
  {
    type: "DC",
    btns: ["accept", "refuse", "cancel"], // if item.etat == en attente
    showBtn: true,
  },
  {
    type: "DM",
    btns: ["accept", "refuse"], // if item.etat == en attente
    showBtn: true,
  },
  {
    type: "RFM",
    btns: ["accept", "refuse"], // if item.etat == en attente
    showBtn: true,
  },
  {
    type: "OM",
    btns: [],
    showBtn: true,
  },
  {
    type: "DB",
    btns: ["cancel"], //if en attente
    showBtn: true,
  },
  {
    type: "mission",
    btns: ["accept", "refuse", "cancel", "mission order"], //si item.etat en attente + cancel == item.etat == accepté && !==en cours
    showBtn: true,
  },
  {
    type: "user",
    btns: [], //rm delete
    showBtn: true,
  },
];
