// import { user } from "react-redux";

// const users = user((state) => state.auth.users);
// const employeesNonMissionnaires = users.filter(
//   (user) => user.role === "employe" && user.etat === "non-missionnaire"
// );

export const userButtons = [
  {
    id: 1,
    title: "Annuler",
    onClick: "",
    type: "reset",
  },
  {
    id: 2,
    title: "Ajouter",
    onClick: "",
    type: "submit",
  },
];
export const missionButtons = [
  {
    id: 1,
    title: "Voir classement des employés",
    onClick: "",
    type: "",
  },
  {
    id: 2,
    title: "Prédire succés mission",
    onClick: "",
    type: "",
  },
  {
    id: 3,
    title: "Annuler",
    onClick: "",
    type: "reset",
  },

  {
    id: 4,
    title: "Ajouter",
    onClick: "",
    type: "submit",
  },
];

export const ticketEntries = [
  {
    id: "object",
    label: "Objet",
    inputType: "text",
    width: "230px",
    placeholder: "Objet du problème",
    required: true,
  },
  {
    id: "description",
    label: "Description",
    inputType: "textarea",
    width: "230px",
    placeholder: "Veuillez décrire votre problème",
    required: true,
  },
];
export const userEntries = [
  {
    id: "nom",
    label: "Nom",
    inputType: "text",
    width: "230px",
    placeholder: "Nom",
    required: true,
  },
  {
    id: "prenom",
    label: "Prénom",
    inputType: "text",
    width: "230px",
    placeholder: "Prénom",
    required: true,
  },
  {
    id: "fonction",
    label: "Fonction",
    inputType: "text",
    width: "230px",
    placeholder: "ex: Ingénieur",
    required: true,
  },
  {
    id: "numTel",
    label: "Numéro de téléphone",
    inputType: "tel",
    width: "230px",
    placeholder: "ex: 05xxxxxx77",
    required: true,
  },
  {
    id: "email",
    label: "Email",
    inputType: "email",
    width: "230px",
    placeholder: "ex: email@sonatrach.dz",
    required: true,
  },
  {
    id: "password",
    label: "Mot de passe",
    inputType: "password",
    width: "230px",
    placeholder: "*****",
    required: true,
  },
  {
    id: "role",
    label: "Rôle",
    inputType: "select",
    width: "230px",
    placeholder: "ex: Employé",
    options: [
      { label: "Secrétaire", value: "secretaire" },
      { label: "Employé", value: "employe" },
      { label: "Relex", value: "relex" },
      { label: "Responsable", value: "responsable" },
    ],
    isMulti: false,
    required: false,
  },
  {
    id: "structure",
    label: "Structure",
    inputType: "select",
    width: "230px",
    placeholder: "ex: TECH",
    options: [
      { label: "PMO", value: "PMO" },
      { label: "FIN", value: "FIN" },
      { label: "SD", value: "SD" },
      { label: "PRC", value: "PRC" },
      { label: "HCM", value: "HCM" },
      { label: "MRO", value: "MRO" },
      { label: "IPM", value: "IPM" },
      { label: "PDN", value: "PDN" },
      { label: "TECH", value: "TECH" },
      { label: "DATA", value: "DATA" },
      { label: "CHANGE", value: "CHANGE" },
    ],
    isMulti: false,
    required: false,
  },
];

export const DBEntries = [
  {
    id: "numSC",
    label: "Numéro sous-compte",
    inputType: "number",
    width: "230px",
    placeholder: "ex: 21456478",
    required: true,
  },
  {
    id: "designationSC",
    label: "Designation sous-compte",
    inputType: "text",
    width: "230px",
    placeholder: "ex: Achat de billet",
    required: true,
  },
  {
    id: "montantEngage",
    label: "Montant Engagé",
    inputType: "number",
    width: "230px",
    placeholder: "ex: 500000",
    required: true,
  },
  {
    id: "nature",
    label: "Nature",
    inputType: "select",
    width: "230px",
    placeholder: "ex: Retour",
    options: [
      { label: "Aller-retour", value: "aller-retour" },
      { label: "Retour", value: "retour" },
      { label: "Aller", value: "aller" },
    ],
    isMulti: false,
    required: true,
  },
  {
    id: "depart",
    label: "lieu de départ",
    inputType: "text",
    width: "230px",
    placeholder: "ex: Alger",
    required: true,
  },
  {
    id: "destination",
    label: "lieu de destination",
    inputType: "text",
    width: "230px",
    placeholder: "ex: Oran",
    required: true,
  },
  {
    id: "paysDestination",
    label: "pays de destination",
    inputType: "select",
    width: "230px",
    placeholder: "ex:: Algérie",
    options: [
      {
        label: "Afghanistan",
        value: "Afghanistan",
      },
      {
        label: "Albanie",
        value: "Albanie",
      },
      {
        label: "Algérie",
        value: "Algérie",
      },
      {
        label: "Andorre",
        value: "Andorre",
      },
      {
        label: "Angola",
        value: "Angola",
      },
      {
        label: "Antigua-et-Barbuda",
        value: "Antigua-et-Barbuda",
      },
      {
        label: "Argentine",
        value: "Argentine",
      },
      {
        label: "Arménie",
        value: "Arménie",
      },
      {
        label: "Australie",
        value: "Australie",
      },
      {
        label: "Autriche",
        value: "Autriche",
      },
      {
        label: "Azerbaïdjan",
        value: "Azerbaïdjan",
      },
      {
        label: "Bahamas",
        value: "Bahamas",
      },
      {
        label: "Bahreïn",
        value: "Bahreïn",
      },
      {
        label: "Bangladesh",
        value: "Bangladesh",
      },
      {
        label: "Barbade",
        value: "Barbade",
      },
      {
        label: "Biélorussie",
        value: "Biélorussie",
      },
      {
        label: "Belgique",
        value: "Belgique",
      },
      {
        label: "Belize",
        value: "Belize",
      },
      {
        label: "Bénin",
        value: "Bénin",
      },
      {
        label: "Bhoutan",
        value: "Bhoutan",
      },
      {
        label: "Bolivie",
        value: "Bolivie",
      },
      {
        label: "Bosnie-Herzégovine",
        value: "Bosnie-Herzégovine",
      },
      {
        label: "Botswana",
        value: "Botswana",
      },
      {
        label: "Brésil",
        value: "Brésil",
      },
      {
        label: "Brunéi",
        value: "Brunéi",
      },
      {
        label: "Bulgarie",
        value: "Bulgarie",
      },
      {
        label: "Burkina Faso",
        value: "Burkina Faso",
      },
      {
        label: "Burundi",
        value: "Burundi",
      },
      {
        label: "Cambodge",
        value: "Cambodge",
      },
      {
        label: "Cameroun",
        value: "Cameroun",
      },
      {
        label: "Canada",
        value: "Canada",
      },
      {
        label: "Cap-Vert",
        value: "Cap-Vert",
      },
      {
        label: "République centrafricaine",
        value: "République centrafricaine",
      },
      {
        label: "Tchad",
        value: "Tchad",
      },
      {
        label: "Chili",
        value: "Chili",
      },
      {
        label: "Chine",
        value: "Chine",
      },
      {
        label: "Colombie",
        value: "Colombie",
      },
      {
        label: "Comores",
        value: "Comores",
      },
      {
        label: "Congo",
        value: "Congo",
      },
      {
        label: "Costa Rica",
        value: "Costa Rica",
      },
      {
        label: "Croatie",
        value: "Croatie",
      },
      {
        label: "Cuba",
        value: "Cuba",
      },
      {
        label: "Chypre",
        value: "Chypre",
      },
      {
        label: "République tchèque",
        value: "République tchèque",
      },
      {
        label: "Danemark",
        value: "Danemark",
      },
      {
        label: "Djibouti",
        value: "Djibouti",
      },
      {
        label: "Dominique",
        value: "Dominique",
      },
      {
        label: "République dominicaine",
        value: "République dominicaine",
      },
      {
        label: "Timor oriental",
        value: "Timor oriental",
      },
      {
        label: "Équateur",
        value: "Équateur",
      },
      {
        label: "Égypte",
        value: "Égypte",
      },
      {
        label: "Salvador",
        value: "Salvador",
      },
      {
        label: "Guinée équatoriale",
        value: "Guinée équatoriale",
      },
      {
        label: "Érythrée",
        value: "Érythrée",
      },
      {
        label: "Estonie",
        value: "Estonie",
      },
      {
        label: "Éthiopie",
        value: "Éthiopie",
      },
      {
        label: "Fidji",
        value: "Fidji",
      },
      {
        label: "Finlande",
        value: "Finlande",
      },
      {
        label: "France",
        value: "France",
      },
      {
        label: "Gabon",
        value: "Gabon",
      },
      {
        label: "Gambie",
        value: "Gambie",
      },
      {
        label: "Géorgie",
        value: "Géorgie",
      },
      {
        label: "Allemagne",
        value: "Allemagne",
      },
      {
        label: "Ghana",
        value: "Ghana",
      },
      {
        label: "Grèce",
        value: "Grèce",
      },
      {
        label: "Grenade",
        value: "Grenade",
      },
      {
        label: "Guatemala",
        value: "Guatemala",
      },
      {
        label: "Guinée",
        value: "Guinée",
      },
      {
        label: "Guinée-Bissau",
        value: "Guinée-Bissau",
      },
      {
        label: "Guyane",
        value: "Guyane",
      },
      {
        label: "Haïti",
        value: "Haïti",
      },
      {
        label: "Honduras",
        value: "Honduras",
      },
      {
        label: "Hongrie",
        value: "Hongrie",
      },
      {
        label: "Islande",
        value: "Islande",
      },
      {
        label: "Inde",
        value: "Inde",
      },
      {
        label: "Indonésie",
        value: "Indonésie",
      },
      {
        label: "Iran",
        value: "Iran",
      },
      {
        label: "Irak",
        value: "Irak",
      },
      {
        label: "Irlande",
        value: "Irlande",
      },
      {
        label: "Palestine",
        value: "Palestine",
      },
      {
        label: "Italie",
        value: "Italie",
      },
      {
        label: "Jamaïque",
        value: "Jamaïque",
      },
      {
        label: "Japon",
        value: "Japon",
      },
      {
        label: "Jordanie",
        value: "Jordanie",
      },
      {
        label: "Kazakhstan",
        value: "Kazakhstan",
      },
      {
        label: "Kenya",
        value: "Kenya",
      },
      {
        label: "Kiribati",
        value: "Kiribati",
      },
      {
        label: "Corée du Nord",
        value: "Corée du Nord",
      },
      {
        label: "Corée du Sud",
        value: "Corée du Sud",
      },
      {
        label: "Kosovo",
        value: "Kosovo",
      },
      {
        label: "Koweït",
        value: "Koweït",
      },
      {
        label: "Kirghizistan",
        value: "Kirghizistan",
      },
      {
        label: "Laos",
        value: "Laos",
      },
      {
        label: "Lettonie",
        value: "Lettonie",
      },
      {
        label: "Liban",
        value: "Liban",
      },
      {
        label: "Lesotho",
        value: "Lesotho",
      },
      {
        label: "Libéria",
        value: "Libéria",
      },
      {
        label: "Libye",
        value: "Libye",
      },
      {
        label: "Liechtenstein",
        value: "Liechtenstein",
      },
      {
        label: "Lituanie",
        value: "Lituanie",
      },
      {
        label: "Luxembourg",
        value: "Luxembourg",
      },
      {
        label: "Macédoine du Nord",
        value: "Macédoine du Nord",
      },
      {
        label: "Madagascar",
        value: "Madagascar",
      },
      {
        label: "Malawi",
        value: "Malawi",
      },
      {
        label: "Malaisie",
        value: "Malaisie",
      },
      {
        label: "Maldives",
        value: "Maldives",
      },
      {
        label: "Mali",
        value: "Mali",
      },
      {
        label: "Malte",
        value: "Malte",
      },
      {
        label: "Îles Marshall",
        value: "Îles Marshall",
      },
      {
        label: "Mauritanie",
        value: "Mauritanie",
      },
      {
        label: "Maurice",
        value: "Maurice",
      },
      {
        label: "Mexique",
        value: "Mexique",
      },
      {
        label: "Micronésie",
        value: "Micronésie",
      },
      {
        label: "Moldavie",
        value: "Moldavie",
      },
      {
        label: "Monaco",
        value: "Monaco",
      },
      {
        label: "Mongolie",
        value: "Mongolie",
      },
      {
        label: "Monténégro",
        value: "Monténégro",
      },
      {
        label: "Maroc",
        value: "Maroc",
      },
      {
        label: "Mozambique",
        value: "Mozambique",
      },
      {
        label: "Myanmar",
        value: "Myanmar",
      },
      {
        label: "Namibie",
        value: "Namibie",
      },
      {
        label: "Nauru",
        value: "Nauru",
      },
      {
        label: "Népal",
        value: "Népal",
      },
      {
        label: "Pays-Bas",
        value: "Pays-Bas",
      },
      {
        label: "Nouvelle-Zélande",
        value: "Nouvelle-Zélande",
      },
      {
        label: "Nicaragua",
        value: "Nicaragua",
      },
      {
        label: "Niger",
        value: "Niger",
      },
      {
        label: "Nigéria",
        value: "Nigéria",
      },
      {
        label: "Îles Mariannes du Nord",
        value: "Îles Mariannes du Nord",
      },
      {
        label: "Norvège",
        value: "Norvège",
      },
      {
        label: "Oman",
        value: "Oman",
      },
      {
        label: "Pakistan",
        value: "Pakistan",
      },
      {
        label: "Palaos",
        value: "Palaos",
      },
      {
        label: "Palestine",
        value: "Palestine",
      },
      {
        label: "Panama",
        value: "Panama",
      },
      {
        label: "Papouasie-Nouvelle-Guinée",
        value: "Papouasie-Nouvelle-Guinée",
      },
      {
        label: "Paraguay",
        value: "Paraguay",
      },
      {
        label: "Pérou",
        value: "Pérou",
      },
      {
        label: "Philippines",
        value: "Philippines",
      },
      {
        label: "Pologne",
        value: "Pologne",
      },
      {
        label: "Portugal",
        value: "Portugal",
      },
      {
        label: "Qatar",
        value: "Qatar",
      },
      {
        label: "Roumanie",
        value: "Roumanie",
      },
      {
        label: "Russie",
        value: "Russie",
      },
      {
        label: "Rwanda",
        value: "Rwanda",
      },
      {
        label: "Saint-Kitts-et-Nevis",
        value: "Saint-Kitts-et-Nevis",
      },
      {
        label: "Sainte-Lucie",
        value: "Sainte-Lucie",
      },
      {
        label: "Saint-Vincent-et-les Grenadines",
        value: "Saint-Vincent-et-les Grenadines",
      },
      {
        label: "Samoa",
        value: "Samoa",
      },
      {
        label: "Saint-Marin",
        value: "Saint-Marin",
      },
      {
        label: "Sao Tomé-et-Principe",
        value: "Sao Tomé-et-Principe",
      },
      {
        label: "Arabie saoudite",
        value: "Arabie saoudite",
      },
      {
        label: "Sénégal",
        value: "Sénégal",
      },
      {
        label: "Serbie",
        value: "Serbie",
      },
      {
        label: "Seychelles",
        value: "Seychelles",
      },
      {
        label: "Sierra Leone",
        value: "Sierra Leone",
      },
      {
        label: "Singapour",
        value: "Singapour",
      },
      {
        label: "Slovaquie",
        value: "Slovaquie",
      },
      {
        label: "Slovénie",
        value: "Slovénie",
      },
      {
        label: "Îles Salomon",
        value: "Îles Salomon",
      },
      {
        label: "Somalie",
        value: "Somalie",
      },
      {
        label: "Afrique du Sud",
        value: "Afrique du Sud",
      },
      {
        label: "Soudan du Sud",
        value: "Soudan du Sud",
      },
      {
        label: "Espagne",
        value: "Espagne",
      },
      {
        label: "Sri Lanka",
        value: "Sri Lanka",
      },
      {
        label: "Soudan",
        value: "Soudan",
      },
      {
        label: "Suriname",
        value: "Suriname",
      },
      {
        label: "Suède",
        value: "Suède",
      },
      {
        label: "Suisse",
        value: "Suisse",
      },
      {
        label: "Syrie",
        value: "Syrie",
      },
      {
        label: "Taïwan",
        value: "Taïwan",
      },
      {
        label: "Tadjikistan",
        value: "Tadjikistan",
      },
      {
        label: "Tanzanie",
        value: "Tanzanie",
      },
      {
        label: "Thaïlande",
        value: "Thaïlande",
      },
      {
        label: "Togo",
        value: "Togo",
      },
      {
        label: "Tonga",
        value: "Tonga",
      },
      {
        label: "Trinité-et-Tobago",
        value: "Trinité-et-Tobago",
      },
      {
        label: "Tunisie",
        value: "Tunisie",
      },
      {
        label: "Turquie",
        value: "Turquie",
      },
      {
        label: "Turkménistan",
        value: "Turkménistan",
      },
      {
        label: "Tuvalu",
        value: "Tuvalu",
      },
      {
        label: "Ouganda",
        value: "Ouganda",
      },
      {
        label: "Ukraine",
        value: "Ukraine",
      },
      {
        label: "Émirats arabes unis",
        value: "Émirats arabes unis",
      },
      {
        label: "Royaume-Uni",
        value: "Royaume-Uni",
      },
      {
        label: "États-Unis",
        value: "États-Unis",
      },
      {
        label: "Uruguay",
        value: "Uruguay",
      },
      {
        label: "Ouzbékistan",
        value: "Ouzbékistan",
      },
      {
        label: "Vanuatu",
        value: "Vanuatu",
      },
      {
        label: "Cité du Vatican",
        value: "Cité du Vatican",
      },
      {
        label: "Venezuela",
        value: "Venezuela",
      },
      {
        label: "Viêt Nam",
        value: "Viêt Nam",
      },
      {
        label: "Yémen",
        value: "Yémen",
      },
      {
        label: "Zambie",
        value: "Zambie",
      },
      {
        label: "Zimbabwe",
        value: "Zimbabwe",
      },
    ],
    required: true,
  },
  {
    id: "motifDep",
    label: "motif de déplacement",
    inputType: "select",
    width: "230px",
    placeholder: "ex: travail",
    options: [
      { label: "Mission travail", value: "travail" },
      { label: "Mission formation", value: "formation" },
    ],
    isMulti: false,
    required: true,
  },
  {
    id: "observation",
    label: "observation",
    inputType: "textarea",
    width: "230px",
    placeholder: "observation",
    required: true,
  },
  {
    id: "dateDepart",
    label: "date de départ",
    inputType: "date",
    width: "230px",
    placeholder: "date de départ",
    required: true,
  },
  {
    id: "dateRetour",
    label: "date de retour",
    inputType: "date",
    width: "230px",
    placeholder: "date de retour",
    required: true,
  },
  {
    id: "direction",
    label: "direction",
    inputType: "text",
    width: "230px",
    placeholder: "ex: DC-DSI",
    required: true,
  },
  {
    id: "sousSection",
    label: "sous-section",
    inputType: "text",
    width: "230px",
    placeholder: "sous-section",
    required: true,
  },
  {
    id: "division",
    label: "Division",
    inputType: "text",
    width: "230px",
    placeholder: "division",
    required: true,
  },
  {
    id: "base",
    label: "Base",
    inputType: "text",
    width: "230px",
    placeholder: "base",
    required: true,
  },
  {
    id: "gisement",
    label: "Gisement",
    inputType: "text",
    width: "230px",
    placeholder: "gisement",
    required: true,
  },
  {
    id: "employes",
    label: "Employés impliqués",
    inputType: "select",
    width: "230px",
    placeholder: "employés",
    options: [], // options will be dynamically populated based on data from the backend
    isMulti: true,
    required: true,
  },
];

export const DCEntries = [
  {
    id: "motif",
    label: "Motif",
    inputType: "text",
    width: "230px",
    placeholder: "motif",
    required: true,
  },
  {
    id: "DateDepart",
    label: "date de départ",
    inputType: "date",
    width: "230px",
    placeholder: "date de départ",
    required: true,
  },
  {
    id: "DateRetour",
    label: "date de retour",
    inputType: "date",
    width: "230px",
    placeholder: "date de retour",
    required: true,
  },
  {
    id: "LieuSejour",
    label: "lieu de séjour",
    inputType: "text",
    width: "230px",
    placeholder: "lieu de séjour",
    required: true,
  },
  {
    id: "Nature",
    label: "Nature",
    inputType: "select",
    width: "230px",
    placeholder: "ex: annuel",
    options: [
      { label: "Reliquat", value: "reliquat" },
      { label: "Annuel", value: "annuel" },
      { label: "Sans-solde", value: "sans-solde" },
      { label: "Exceptionnel", value: "exceptionnel" },
      { label: "Récupération", value: "recupération" },
    ],
    isMulti: false,
    required: true,
  },
];

export const DMEntries = [
  {
    id: "motif",
    label: "motif",
    inputType: "textarea",
    width: "230px",
    placeholder: "motif",
    required: true,
  },
];
export const RFMEntries = [];
export const MissionEntries = [
  {
    id: "objetMission",
    label: "Objet de la mission",
    inputType: "text",
    width: "230px",
    placeholder: "objet de la mission",
    required: true,
  },
  {
    id: "structure",
    label: "Structure",
    inputType: "select",
    width: "230px",
    placeholder: "ex: PMO",
    options: [
      { label: "PMO", value: "PMO" },
      { label: "FIN", value: "FIN" },
      { label: "SD", value: "SD" },
      { label: "PRC", value: "PRC" },
      { label: "HCM", value: "HCM" },
      { label: "MRO", value: "MRO" },
      { label: "IPM", value: "IPM" },
      { label: "PDN", value: "PDN" },
      { label: "TECH", value: "TECH" },
      { label: "DATA", value: "DATA" },
      { label: "CHANGE", value: "CHANGE" },
    ],
    isMulti: false,
    required: true,
  },
  {
    id: "taches",
    label: "Tâches",
    inputType: "create-select",
    width: "230px",
    placeholder: "ex: former une équipe",
    isMulti: true,
    required: false,
  },

  {
    id: "budget",
    label: "Budget engagé",
    inputType: "number",
    width: "230px",
    placeholder: "ex: 50000",
    required: true,
  },
  {
    id: "type",
    label: "Type de mission",
    inputType: "select",
    width: "230px",
    placeholder: "ex: Local",
    options: [
      { label: "Local", value: "local" },
      { label: "Etranger", value: "etranger" },
    ],
    isMulti: false,
    required: true,
  },
  {
    id: "pays",
    label: "Pays",
    inputType: "select",
    width: "230px",
    placeholder: "ex: Algérie",
    options: [
      {
        label: "Afghanistan",
        value: "Afghanistan",
      },
      {
        label: "Albanie",
        value: "Albanie",
      },
      {
        label: "Algérie",
        value: "Algérie",
      },
      {
        label: "Andorre",
        value: "Andorre",
      },
      {
        label: "Angola",
        value: "Angola",
      },
      {
        label: "Antigua-et-Barbuda",
        value: "Antigua-et-Barbuda",
      },
      {
        label: "Argentine",
        value: "Argentine",
      },
      {
        label: "Arménie",
        value: "Arménie",
      },
      {
        label: "Australie",
        value: "Australie",
      },
      {
        label: "Autriche",
        value: "Autriche",
      },
      {
        label: "Azerbaïdjan",
        value: "Azerbaïdjan",
      },
      {
        label: "Bahamas",
        value: "Bahamas",
      },
      {
        label: "Bahreïn",
        value: "Bahreïn",
      },
      {
        label: "Bangladesh",
        value: "Bangladesh",
      },
      {
        label: "Barbade",
        value: "Barbade",
      },
      {
        label: "Biélorussie",
        value: "Biélorussie",
      },
      {
        label: "Belgique",
        value: "Belgique",
      },
      {
        label: "Belize",
        value: "Belize",
      },
      {
        label: "Bénin",
        value: "Bénin",
      },
      {
        label: "Bhoutan",
        value: "Bhoutan",
      },
      {
        label: "Bolivie",
        value: "Bolivie",
      },
      {
        label: "Bosnie-Herzégovine",
        value: "Bosnie-Herzégovine",
      },
      {
        label: "Botswana",
        value: "Botswana",
      },
      {
        label: "Brésil",
        value: "Brésil",
      },
      {
        label: "Brunéi",
        value: "Brunéi",
      },
      {
        label: "Bulgarie",
        value: "Bulgarie",
      },
      {
        label: "Burkina Faso",
        value: "Burkina Faso",
      },
      {
        label: "Burundi",
        value: "Burundi",
      },
      {
        label: "Cambodge",
        value: "Cambodge",
      },
      {
        label: "Cameroun",
        value: "Cameroun",
      },
      {
        label: "Canada",
        value: "Canada",
      },
      {
        label: "Cap-Vert",
        value: "Cap-Vert",
      },
      {
        label: "République centrafricaine",
        value: "République centrafricaine",
      },
      {
        label: "Tchad",
        value: "Tchad",
      },
      {
        label: "Chili",
        value: "Chili",
      },
      {
        label: "Chine",
        value: "Chine",
      },
      {
        label: "Colombie",
        value: "Colombie",
      },
      {
        label: "Comores",
        value: "Comores",
      },
      {
        label: "Congo",
        value: "Congo",
      },
      {
        label: "Costa Rica",
        value: "Costa Rica",
      },
      {
        label: "Croatie",
        value: "Croatie",
      },
      {
        label: "Cuba",
        value: "Cuba",
      },
      {
        label: "Chypre",
        value: "Chypre",
      },
      {
        label: "République tchèque",
        value: "République tchèque",
      },
      {
        label: "Danemark",
        value: "Danemark",
      },
      {
        label: "Djibouti",
        value: "Djibouti",
      },
      {
        label: "Dominique",
        value: "Dominique",
      },
      {
        label: "République dominicaine",
        value: "République dominicaine",
      },
      {
        label: "Timor oriental",
        value: "Timor oriental",
      },
      {
        label: "Équateur",
        value: "Équateur",
      },
      {
        label: "Égypte",
        value: "Égypte",
      },
      {
        label: "Salvador",
        value: "Salvador",
      },
      {
        label: "Guinée équatoriale",
        value: "Guinée équatoriale",
      },
      {
        label: "Érythrée",
        value: "Érythrée",
      },
      {
        label: "Estonie",
        value: "Estonie",
      },
      {
        label: "Éthiopie",
        value: "Éthiopie",
      },
      {
        label: "Fidji",
        value: "Fidji",
      },
      {
        label: "Finlande",
        value: "Finlande",
      },
      {
        label: "France",
        value: "France",
      },
      {
        label: "Gabon",
        value: "Gabon",
      },
      {
        label: "Gambie",
        value: "Gambie",
      },
      {
        label: "Géorgie",
        value: "Géorgie",
      },
      {
        label: "Allemagne",
        value: "Allemagne",
      },
      {
        label: "Ghana",
        value: "Ghana",
      },
      {
        label: "Grèce",
        value: "Grèce",
      },
      {
        label: "Grenade",
        value: "Grenade",
      },
      {
        label: "Guatemala",
        value: "Guatemala",
      },
      {
        label: "Guinée",
        value: "Guinée",
      },
      {
        label: "Guinée-Bissau",
        value: "Guinée-Bissau",
      },
      {
        label: "Guyane",
        value: "Guyane",
      },
      {
        label: "Haïti",
        value: "Haïti",
      },
      {
        label: "Honduras",
        value: "Honduras",
      },
      {
        label: "Hongrie",
        value: "Hongrie",
      },
      {
        label: "Islande",
        value: "Islande",
      },
      {
        label: "Inde",
        value: "Inde",
      },
      {
        label: "Indonésie",
        value: "Indonésie",
      },
      {
        label: "Iran",
        value: "Iran",
      },
      {
        label: "Irak",
        value: "Irak",
      },
      {
        label: "Irlande",
        value: "Irlande",
      },
      {
        label: "Palestine",
        value: "Palestine",
      },
      {
        label: "Italie",
        value: "Italie",
      },
      {
        label: "Jamaïque",
        value: "Jamaïque",
      },
      {
        label: "Japon",
        value: "Japon",
      },
      {
        label: "Jordanie",
        value: "Jordanie",
      },
      {
        label: "Kazakhstan",
        value: "Kazakhstan",
      },
      {
        label: "Kenya",
        value: "Kenya",
      },
      {
        label: "Kiribati",
        value: "Kiribati",
      },
      {
        label: "Corée du Nord",
        value: "Corée du Nord",
      },
      {
        label: "Corée du Sud",
        value: "Corée du Sud",
      },
      {
        label: "Kosovo",
        value: "Kosovo",
      },
      {
        label: "Koweït",
        value: "Koweït",
      },
      {
        label: "Kirghizistan",
        value: "Kirghizistan",
      },
      {
        label: "Laos",
        value: "Laos",
      },
      {
        label: "Lettonie",
        value: "Lettonie",
      },
      {
        label: "Liban",
        value: "Liban",
      },
      {
        label: "Lesotho",
        value: "Lesotho",
      },
      {
        label: "Libéria",
        value: "Libéria",
      },
      {
        label: "Libye",
        value: "Libye",
      },
      {
        label: "Liechtenstein",
        value: "Liechtenstein",
      },
      {
        label: "Lituanie",
        value: "Lituanie",
      },
      {
        label: "Luxembourg",
        value: "Luxembourg",
      },
      {
        label: "Macédoine du Nord",
        value: "Macédoine du Nord",
      },
      {
        label: "Madagascar",
        value: "Madagascar",
      },
      {
        label: "Malawi",
        value: "Malawi",
      },
      {
        label: "Malaisie",
        value: "Malaisie",
      },
      {
        label: "Maldives",
        value: "Maldives",
      },
      {
        label: "Mali",
        value: "Mali",
      },
      {
        label: "Malte",
        value: "Malte",
      },
      {
        label: "Îles Marshall",
        value: "Îles Marshall",
      },
      {
        label: "Mauritanie",
        value: "Mauritanie",
      },
      {
        label: "Maurice",
        value: "Maurice",
      },
      {
        label: "Mexique",
        value: "Mexique",
      },
      {
        label: "Micronésie",
        value: "Micronésie",
      },
      {
        label: "Moldavie",
        value: "Moldavie",
      },
      {
        label: "Monaco",
        value: "Monaco",
      },
      {
        label: "Mongolie",
        value: "Mongolie",
      },
      {
        label: "Monténégro",
        value: "Monténégro",
      },
      {
        label: "Maroc",
        value: "Maroc",
      },
      {
        label: "Mozambique",
        value: "Mozambique",
      },
      {
        label: "Myanmar",
        value: "Myanmar",
      },
      {
        label: "Namibie",
        value: "Namibie",
      },
      {
        label: "Nauru",
        value: "Nauru",
      },
      {
        label: "Népal",
        value: "Népal",
      },
      {
        label: "Pays-Bas",
        value: "Pays-Bas",
      },
      {
        label: "Nouvelle-Zélande",
        value: "Nouvelle-Zélande",
      },
      {
        label: "Nicaragua",
        value: "Nicaragua",
      },
      {
        label: "Niger",
        value: "Niger",
      },
      {
        label: "Nigéria",
        value: "Nigéria",
      },
      {
        label: "Îles Mariannes du Nord",
        value: "Îles Mariannes du Nord",
      },
      {
        label: "Norvège",
        value: "Norvège",
      },
      {
        label: "Oman",
        value: "Oman",
      },
      {
        label: "Pakistan",
        value: "Pakistan",
      },
      {
        label: "Palaos",
        value: "Palaos",
      },
      {
        label: "Palestine",
        value: "Palestine",
      },
      {
        label: "Panama",
        value: "Panama",
      },
      {
        label: "Papouasie-Nouvelle-Guinée",
        value: "Papouasie-Nouvelle-Guinée",
      },
      {
        label: "Paraguay",
        value: "Paraguay",
      },
      {
        label: "Pérou",
        value: "Pérou",
      },
      {
        label: "Philippines",
        value: "Philippines",
      },
      {
        label: "Pologne",
        value: "Pologne",
      },
      {
        label: "Portugal",
        value: "Portugal",
      },
      {
        label: "Qatar",
        value: "Qatar",
      },
      {
        label: "Roumanie",
        value: "Roumanie",
      },
      {
        label: "Russie",
        value: "Russie",
      },
      {
        label: "Rwanda",
        value: "Rwanda",
      },
      {
        label: "Saint-Kitts-et-Nevis",
        value: "Saint-Kitts-et-Nevis",
      },
      {
        label: "Sainte-Lucie",
        value: "Sainte-Lucie",
      },
      {
        label: "Saint-Vincent-et-les Grenadines",
        value: "Saint-Vincent-et-les Grenadines",
      },
      {
        label: "Samoa",
        value: "Samoa",
      },
      {
        label: "Saint-Marin",
        value: "Saint-Marin",
      },
      {
        label: "Sao Tomé-et-Principe",
        value: "Sao Tomé-et-Principe",
      },
      {
        label: "Arabie saoudite",
        value: "Arabie saoudite",
      },
      {
        label: "Sénégal",
        value: "Sénégal",
      },
      {
        label: "Serbie",
        value: "Serbie",
      },
      {
        label: "Seychelles",
        value: "Seychelles",
      },
      {
        label: "Sierra Leone",
        value: "Sierra Leone",
      },
      {
        label: "Singapour",
        value: "Singapour",
      },
      {
        label: "Slovaquie",
        value: "Slovaquie",
      },
      {
        label: "Slovénie",
        value: "Slovénie",
      },
      {
        label: "Îles Salomon",
        value: "Îles Salomon",
      },
      {
        label: "Somalie",
        value: "Somalie",
      },
      {
        label: "Afrique du Sud",
        value: "Afrique du Sud",
      },
      {
        label: "Soudan du Sud",
        value: "Soudan du Sud",
      },
      {
        label: "Espagne",
        value: "Espagne",
      },
      {
        label: "Sri Lanka",
        value: "Sri Lanka",
      },
      {
        label: "Soudan",
        value: "Soudan",
      },
      {
        label: "Suriname",
        value: "Suriname",
      },
      {
        label: "Suède",
        value: "Suède",
      },
      {
        label: "Suisse",
        value: "Suisse",
      },
      {
        label: "Syrie",
        value: "Syrie",
      },
      {
        label: "Taïwan",
        value: "Taïwan",
      },
      {
        label: "Tadjikistan",
        value: "Tadjikistan",
      },
      {
        label: "Tanzanie",
        value: "Tanzanie",
      },
      {
        label: "Thaïlande",
        value: "Thaïlande",
      },
      {
        label: "Togo",
        value: "Togo",
      },
      {
        label: "Tonga",
        value: "Tonga",
      },
      {
        label: "Trinité-et-Tobago",
        value: "Trinité-et-Tobago",
      },
      {
        label: "Tunisie",
        value: "Tunisie",
      },
      {
        label: "Turquie",
        value: "Turquie",
      },
      {
        label: "Turkménistan",
        value: "Turkménistan",
      },
      {
        label: "Tuvalu",
        value: "Tuvalu",
      },
      {
        label: "Ouganda",
        value: "Ouganda",
      },
      {
        label: "Ukraine",
        value: "Ukraine",
      },
      {
        label: "Émirats arabes unis",
        value: "Émirats arabes unis",
      },
      {
        label: "Royaume-Uni",
        value: "Royaume-Uni",
      },
      {
        label: "États-Unis",
        value: "États-Unis",
      },
      {
        label: "Uruguay",
        value: "Uruguay",
      },
      {
        label: "Ouzbékistan",
        value: "Ouzbékistan",
      },
      {
        label: "Vanuatu",
        value: "Vanuatu",
      },
      {
        label: "Cité du Vatican",
        value: "Cité du Vatican",
      },
      {
        label: "Venezuela",
        value: "Venezuela",
      },
      {
        label: "Viêt Nam",
        value: "Viêt Nam",
      },
      {
        label: "Yémen",
        value: "Yémen",
      },
      {
        label: "Zambie",
        value: "Zambie",
      },
      {
        label: "Zimbabwe",
        value: "Zimbabwe",
      },
    ],
    required: true,
  },

  {
    id: "tDateDeb",
    label: "date de début mission",
    inputType: "date",
    width: "230px",
    placeholder: "date début mission",
    required: true,
  },
  {
    id: "tDateRet",
    label: "date de fin",
    inputType: "date",
    width: "230px",
    placeholder: "date fin mission",
    required: true,
  },

  {
    id: "lieuDep",
    label: "lieu de départ",
    inputType: "text",
    width: "230px",
    placeholder: "ex: Alger",
    required: false,
  },
  {
    id: "destination",
    label: "Circonscription administrative",
    inputType: "text",
    width: "230px",
    placeholder: "ex: Oran",
    required: true,
  },
  {
    id: "moyenTransport",
    label: "Moyen De Transport (aller)",
    inputType: "select",
    width: "230px",
    placeholder: "ex: Avion",
    options: [
      { label: "Avion", value: "avion" },
      { label: "Route", value: "route" },
    ],
    isMulti: true,
    required: false,
  },
  {
    id: "moyenTransportRet",
    label: "Moyen De Transport (retour) ",
    inputType: "select",
    width: "230px",
    placeholder: "ex: Avion",
    options: [
      { label: "Avion", value: "avion" },
      { label: "Route", value: "route" },
    ],
    isMulti: true,
    required: false,
  },
  {
    id: "employes",
    label: "missionnaires",
    inputType: "select",
    width: "230px",
    placeholder: "missionnaires",
    isMulti: true,
    disabled: true,
    required: true,
  },
  {
    id: "observation",
    label: "Observation",
    inputType: "textarea",
    width: "230px",
    placeholder: "observation",
    required: false,
  },
];
