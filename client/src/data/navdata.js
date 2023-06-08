export const titles = [
  { id: 1, title: "Tableau de bord", path: "/" },
  { id: 2, title: "Planification", path: "/planification" },
  { id: 3, title: "Employés", path: "/gestion-des-employes" }, // Tableau utilisateur + formulaire
  { id: 4, title: "Service Relex", path: "/gestion-service-relex" }, //Tableau de billetterie + formulaire
  { id: 5, title: "Missions", path: "/gestion-des-mission" }, // Tableau des missions + formulaire
  { id: 6, title: "Congé et Rapports", path: "/gestion-c-m-rfm" }, //Tableaux de RFM et Congé, formulaires de modification
 ];
export const secTitles = [
  { id: 2, title: "Planification", path: "/" },
  { id: 3, title: "Employés", path: "/gestion-des-employes" }, // Tableau utilisateur + formulaire
  { id: 4, title: "Service Relex", path: "/gestion-service-relex" }, //Tableau de billetterie + formulaire
  { id: 5, title: "Missions", path: "/gestion-des-mission" }, // Tableau des missions + formulaire
  { id: 6, title: "Congé et Rapports", path: "/gestion-c-m-rfm" }, //Tableaux de RFM et Congé, formulaires de modification
  { id: 6, title: "profile", path: "/profile" },
];

export const employeTitles = [
  { id: 1, title: "Planification", path: "/" },
  { id: 2, title: "Missions", path: "/gestion-des-mission" }, // Tableau des missions
  { id: 3, title: "Rapports de modification", path: "/gestion-modification" }, //Tableaux et formulaires
  { id: 4, title: "Demandes de congé", path: "/gestion-conge" }, //Tableaux et formulaires
  { id: 6, title: "Tickets", path: "/gestion-tickets" }, //Tableaux de RFM et Congé, formulaires de modification
  { id: 6, title: "profile", path: "/profile" },
];

export const relexTitles = [
  { id: 1, title: "Service Relex", path: "/" }, //Tableau de billetterie
];

export const notific = [
  { id: 1, type: "DM", path: "/gestion-c-m-rfm" },
  { id: 2, type: "DC", path: "/gestion-c-m-rfm" },
  { id: 3, type: "RFM", path: "/gestion-c-m-rfm" }, // Tableau utilisateur + formulaire
  { id: 4, type: "DB", path: "/gestion-service-relex" }, //Tableau de billetterie + formulaire
  { id: 5, type: "mission", path: "/gestion-des-mission" }, // Tableau des missions + formulaire
];
export const employeNotific = [
  { id: 1, type: "DM", path: "/gestion-modification" },
  { id: 2, type: "DC", path: "/gestion-conge" },
  { id: 3, type: "RFM", path: "/gestion-des-mission" }, // Tableau utilisateur + formulaire
  { id: 4, type: "mission", path: "/gestion-des-mission" }, // Tableau des missions + formulaire
];
export const relexNotific = [{ id: 1, type: "DB", path: "/" }];

export const dashTitles = [
  { id: 1, title: "missions", path: "/" },
  { id: 2, title: "fichiers", path: "/files-analytics" },
  { id: 3, title: "coûts", path: "/cost-analytics" },
  { id: 4, title: "utilisateurs", path: "/users-analytics" },
];
