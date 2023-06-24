export const verifyProlongement = (miss, objet) => {
  let error = "";
  let { newDate, missions } = objet;
  // verifier si les missionnaires sont libre durant la prolongation , pas d autres missions disponible
  // parcourir les employés et trouver les missions des employés, et vérifier
  // si y aura inclusion entre tdateDeb et de fin de chaque mission ,
  //  et tdateDeb de cette mission et tDateFin de cette mission (tDateFin+ duree)
  // au debut trouver remplacer date de fin par la nouvelle

  if (!newDate) {
    error = "Date Invalide";
  } else if (new Date(newDate) < new Date()) {
    error =
      "la nouvelle date de fin doit etre supérieur ou égale a la date actuelle";
  } else {
    if (miss.employes.length > 0) {
      let employes = miss.employes;
      let start = new Date(miss.tDateDeb);
      let end = new Date(newDate);

      //on doit vérifier si les employées n'ont pas déja des missions entre start et end
      //donc on doit chercher si employes exist dans missions.employes et que mission.etat est en cours ou acceptée et que mission.tDateRet > start et tDateDeb<end dans ce cas on retourne vrai
      //trouver toutes les missions qui ne sont pas la mission en cours et qui se font en parallele avec cette mission
      let filteredMissions = missions
        .filter(
          (m) =>
            m._id !== miss._id &&
            verifyInclusion(
              start,
              end,
              new Date(m.tDateDeb),
              new Date(m.tDateRet)
            ) &&
            (m.etat === "en-cours" ||
              m.etat === "en-attente" ||
              m.etat === "acceptée")
        )
        .map((m) => m);

      // Check if any employee has missions between start and end dates
      let hasEmployeeMissions = employes.some((employee) => {
        // Check if the employee has missions in filteredMissions that overlap with the currentMission
        return filteredMissions.some((mission) => {
          return mission.employes.some((emp) => emp._id === employee._id);
        });
      });
      // console.log("hasEmployeeMissions", hasEmployeeMissions);
      if (hasEmployeeMissions) {
        error =
          "Les employés ne doivent pas avoir de missions entre la date de début et la date de fin des missions introduites.";
      }
    }
  }
  return error;
};
export const validateMission = (mission, user, object) => {
  // console.log(mission);
  const errors = {};

  if (!mission?.objetMission.trim()) {
    errors.objetMission = "obligatoire";
  }

  // if (!mission?.budget) {
  //   errors.budget = "obligatoire";
  // }

  if (mission?.budget < 0) {
    errors.budget = "le budget doit être supérieur à 0";
  }

  if (!mission?.structure && user.role !== "responsable") {
    errors.structure = "obligatoire";
  }

  if (!mission?.type) {
    errors.type = "obligatoire";
  }

  if (!mission?.pays) {
    errors.pays = "obligatoire";
  }

  if (!mission?.employes || mission.employes.length === 0) {
    errors.employes = "obligatoire";
  }

  if (!mission?.tDateDeb) {
    errors.tDateDeb = "obligatoire";
  } else if (
    isNaN(new Date(mission.tDateDeb).getTime()) ||
    new Date(mission.tDateDeb) <= new Date()
  ) {
    errors.tDateDeb =
      "La date de début doit être ultérieure à la date actuelle.";
  }

  if (!mission?.tDateRet) {
    errors.tDateRet = "obligatoire";
  }
  if (!mission?.destination?.trim()) {
    errors.destination = "obligatoire";
  }

  if (!mission?.moyenTransport) {
    errors.moyenTransport = "obligatoire";
  }
  if (!mission?.moyenTransportRet) {
    errors.moyenTransportRet = "obligatoire";
  }

  if (
    new Date(mission?.tDateDeb).getTime() >=
    new Date(mission?.tDateRet).getTime()
  ) {
    errors.tDateRet =
      "Les dates ne doivent pas être identiques, la date de retour doit être postérieure à la date de départ.";
    errors.tDateDeb =
      "Les dates ne doivent pas être identiques, la date de retour doit être postérieure à la date de départ.";
  }
  ///we also need to validate the employees if they are disponible during that time

  if (object?.type === "import") {
    //we need to verify the employees
    if (mission.employes.length > 0) {
      let employes = mission.employes;
      let start = new Date(mission.tDateDeb);
      let end = new Date(mission.tDateRet);

      //on doit vérifier si les employées n'ont pas déja des missions entre start et end
      //donc on doit chercher si employes exist dans missions.employes et que mission.etat est en cours ou acceptée et que mission.tDateRet > start et tDateDeb<end dans ce cas on retourne vrai
      const filteredMissions = object.missions
        .filter((mission) => {
          return (
            (mission.etat === "en-cours" ||
              mission.etat === "en-attente" ||
              mission.etat === "acceptée") &&
            verifyInclusion(
              new Date(mission.tDateDeb),
              new Date(mission.tDateRet),
              start,
              end
            )
          );
        })
        .map((f) => f);

      // console.log("____________________________________________________");
      // console.log(filteredMissions);
      // Vérifier si l'employé spécifié est affecté à l'une des missions filtrées
      const isEmployeeAssignedToMission = filteredMissions.some((mission) => {
        return mission.employes.map((employee) => {
          employes.includes(employee._id);
        });
      });

      // console.log("isEmployeeAssignedToMission", isEmployeeAssignedToMission);

      if (isEmployeeAssignedToMission) {
        errors.employes =
          "Les employées ne doivent pas avoir des missions entre date de début et date de fin de missions introduites";
      }
    }
  }

  return errors;
};

export const validateAIMissionForm = (mission, user) => {
  // console.log(mission);
  const errors = {};

  if (mission?.budget && mission?.budget < 0) {
    errors.budget = "le budget doit être supérieur à 0";
  }

  if (!mission?.structure && user.role !== "responsable") {
    errors.structure = "obligatoire";
  }

  if (!mission?.type) {
    errors.type = "obligatoire";
  }

  if (!mission?.pays) {
    errors.pays = "obligatoire";
  }

  if (!mission?.tDateDeb) {
    errors.tDateDeb = "obligatoire";
  }
  if (
    isNaN(new Date(mission.tDateDeb).getTime()) ||
    new Date(mission.tDateDeb) <= new Date()
  ) {
    errors.tDateDeb =
      "La date de début doit être ultérieure à la date actuelle.";
  }
  if (!mission?.tDateRet) {
    errors.tDateRet = "obligatoire";
  }
  if (!mission?.destination?.trim()) {
    errors.destination = "obligatoire";
  }

  if (
    new Date(mission?.tDateDeb).getTime() >=
    new Date(mission?.tDateRet).getTime()
  ) {
    errors.tDateRet =
      "Les dates ne doivent pas être identiques, la date de retour doit être postérieure à la date de départ.";
    errors.tDateDeb =
      "Les dates ne doivent pas être identiques, la date de retour doit être postérieure à la date de départ.";
  }
  if (!mission?.employes || mission.employes.length === 0) {
    errors.employes = "obligatoire";
  }

  return errors;
};

export const checkEmployeesMission = (users, employees) => {
  // create a function that takes users and employes as arguments
  //  which will check the existence of that employee and also returns the neww employee array orelse itll return an empty array
  let newEmployes = [];

  // for each employes inside employees we will get his _id

  newEmployes = employees
    .map((uid) => {
      const u = users.find((u) => u.uid === uid);
      if (u) {
        return u._id;
      } else return "";
    })
    .filter(Boolean);

  return newEmployes;
  // returns either employees or empty array , if length array < employees.length than error (some users dont exist)
};

export const verifyInclusion = (st, en, start, end) => {
  if (
    (en >= start && st <= start && en <= end) ||
    (st >= start && en <= end && st <= end && en > start) ||
    (st <= end && st >= start && en >= end)
  ) {
    return true;
  }

  return false;
};

export const validateDB = (db, object) => {
  const errors = {};

  if (!db.nature) {
    errors.nature = "La nature de la demande est obligatoire";
  } else if (!["aller-retour", "retour", "aller"].includes(db.nature)) {
    errors.nature =
      "La nature de la demande doit être 'aller-retour', 'retour' ou 'aller'";
  }

  if (!db.depart) {
    errors.depart = "Le lieu de départ est obligatoire";
  }

  if (!db.destination) {
    errors.destination = "Le lieu de destination est obligatoire";
  }

  if (!db.paysDestination) {
    errors.paysDestination = "Le pays de destination est obligatoire";
  }

  if (!db.motifDep) {
    errors.motifDep = "Le motif de la demande est obligatoire";
  } else if (!["travail", "formation"].includes(db.motifDep)) {
    errors.motifDep =
      "Le motif de la demande doit être 'travail' ou 'formation'";
  }

  if (
    !db.dateDepart ||
    isNaN(new Date(db.dateDepart).getTime()) ||
    new Date(db.dateDepart) <= new Date()
  ) {
    errors.dateDepart =
      "La date de départ est obligatoire et doit être ultérieure à la date actuelle.";
  }

  if (!db.dateRetour || isNaN(new Date(db.dateRetour).getTime())) {
    // console.log("true");
    // console.log(db.dateRetour);

    errors.dateRetour =
      "La date de retour est obligatoire et doit être une date valide";
  }

  if (new Date(db.dateDepart).getTime() >= new Date(db.dateRetour).getTime()) {
    errors.dateRetour =
      "Les dates ne doivent pas être identiques, la date de retour doit être postérieure à la date de départ.";
    errors.dateDepart =
      "Les dates ne doivent pas être identiques, la date de retour doit être postérieure à la date de départ.";
  }

  if (!db.employes || db.employes.length === 0) {
    errors.employes =
      "Au moins un employé doit être assigné à la demande de billetterie";
  }

  if (db.montantEngage && db.montantEngage <= 0) {
    errors.montantEngage = "Le montant engagé doit être supérieur à 0";
  }
  // console.log("errs : ", errors);
  if (object.type === "import" && object.user.role === "responsable") {
    // Verify if the employees in data have the same structure as the user; otherwise, set errors.employesStructure to "not the same".
    // Get the data employes structures from the users variable using the id from data.

    const hasSameStructureAndEmployee = object.users.some((u) => {
      const employee = db.employes.find((emp) => emp === u._id);
      return employee && employee.structure !== object.user.structure;
    });
    if (!hasSameStructureAndEmployee) {
      errors.employesStructure = "pas la meme structure";
    }
  }
  return errors;
};

export const verifyInclusionDB = (st, en, start, end) => {
  if (
    (en >= start && st <= start && en <= end) ||
    (st >= start && en <= end && st <= end && en > start) ||
    (st <= end && st > start && en >= end)
    // (st > start && en > end)
  ) {
    return true;
  }

  return false;
};

export const verifyDuplicates = (data) => {
  //First verify duplicates
  const errors = {};

  // create a new array of objects with necessary properties for sorting
  const sortedData = data
    .map((item, index) => ({
      ...item,
      index,
      dateDepart: item.dateDepart,
      dateRetour: item.dateRetour,
      employeSet: item.employes,
    }))
    .sort((a, b) => new Date(a.dateDepart) - new Date(b.dateDepart));
  console.log(sortedData);

  for (let i = 0; i < sortedData.length; i++) {
    const { dateDepart, dateRetour, employeSet, index } = sortedData[i];

    // find the first demand with a dateDepart value greater than dateRetour

    // console.log("next ", nextIndex, "db: ", dateDepart, "dr: ", dateRetour);
    // verify inclusion and employe overlap
    // console.log("i: ", i);
    for (let j = i + 1; j < sortedData.length; j++) {
      const {
        dateDepart: dateDepart2,
        dateRetour: dateRetour2,
        employeSet: employeSet2,
        index: index2,
      } = sortedData[j];
      // console.log(dateDepart, dateRetour, dateDepart2, dateRetour2);
      // console.log("j: ", j);
      // console.log(employeSet, employeSet2);

      if (verifyInclusionDB(dateDepart2, dateRetour2, dateDepart, dateRetour)) {
        console.log(employeSet);
        console.log(employeSet2);
        let employeOverlap = employeSet.some((e) =>
          employeSet2.find((emp) => emp === e)
        );
        // console.log("employeOverlap: ", employeOverlap);
        if (employeOverlap) {
          // console.log("error");
          errors.duplicates = `line ${index} and line ${index2}`;
          return errors;
        }
      }
    }
  }

  return errors;
};

//verifies wheather an employee is already assigned to a demande 'en-attente' or accepted for the same day
export const verifyWithRD = (db, demandes) => {
  let errors = {};
  //we need to verify the employees
  if (db.employes.length > 0) {
    let employes = db.employes;
    let start = db.dateDepart;
    let end = db.dateRetour;

    // console.log(demandes);
    //verifier s'il existe deja une demande de billetterie pour la meme date
    // date depart et de retour ,  et au moins un des employes dans db existe dans cette demande qui se trouve dans objet.demandes
    const filteredDemandes = demandes
      .filter((demande) => {
        return verifyInclusionDB(
          new Date(demande.dateDepart),
          new Date(demande.dateRetour),
          start,
          end
        );
      })
      .map((f) => f);

    // console.log(filteredDemandes);
    // console.log("employee", employes);
    // console.log("____________________________________________________");
    // console.log(filteredDemandes);
    // Vérifier si l'employé spécifié est affecté à l'une des missions filtrées
    // console.log("filteredDEMANDES: ", filteredDemandes);
    const isEmployeeAssignedAlreadyToDemand = filteredDemandes.some((dem) => {
      return dem.employes.some((employee) => employes.includes(employee._id));
    });

    if (isEmployeeAssignedAlreadyToDemand === true) {
      errors.employes =
        "Les employées ne doivent pas avoir des demandes soumises prévues à une même période pour les memes employés.";
      return errors;
    }
  }

  return errors;
};

export const ExcelDateToJSDate = (excelDate) => {
  const utcDays = Math.floor(excelDate - 25569);
  const utcValue = utcDays * 86400;
  const dateInfo = new Date(utcValue * 1000);

  const year = dateInfo.getFullYear();
  const month = dateInfo.getMonth() + 1;
  const day = dateInfo.getDate();

  return new Date(Date.UTC(year, month - 1, day));
};

export const validateUser = (user) => {
  const errors = {};

  if (!user.nom || user.nom === "empty") {
    errors.nom = "obligatoire.";
  }

  if (!user.prenom || user.prenom === "empty") {
    errors.prenom = "obligatoire.";
  }

  if (!user.fonction || user.fonction === "empty") {
    errors.fonction = "obligatoire.";
  }

  if (!user.numTel || user.numTel === "empty") {
    errors.numTel = "obligatoire.";
  } else if (!/^(0)(5|6|7)[0-9]{8}$/.test(user.numTel)) {
    errors.numTel = "Le numéro de téléphone doit être valide.";
  }

  if (!user.email || user.email === "empty") {
    errors.email = "obligatoire.";
  } else if (/\s/.test(user.email)) {
    errors.email = "L'email ne doit pas contenir d'espaces.";
  } else if (
    !/^[a-zA-Z0-9]+([.][a-zA-Z0-9]+)*@sonatrach\.dz$/.test(user.email)
  ) {
    errors.email = "L'email doit être valide.";
  }
  if (!user.password || user.password === "empty") {
    errors.password = "obligatoire.";
  }

  if (user.user?.role !== "secretaire") {
    if (!user.role) {
      errors.role = "obligatoire.";
    }
  }

  if (
    user.user?.role !== "responsable" &&
    user.selectedRole !== "secretaire" &&
    user.selectedRole !== "relex" &&
    !user.structure
  ) {
    errors.structure = "obligatoire.";
  }

  return errors;
};

export const checkRoles = (user, currentUser) => {
  //from the data
  const errors = {};
  if (currentUser.role === "secretaire") {
    if (!["employe"].includes(user.role)) {
      errors.role =
        "Seuls les employés peuvent être ajoutés par un secrétaire.";
    }
  } else if (currentUser.role === "responsable") {
    if (!["employe", "secretaire"].includes(user.role)) {
      errors.role =
        "Seuls les employés, et les secrétaires peuvent être ajoutés par un responsable.";
    } else if (![currentUser.structure].includes(user.structure)) {
      errors.structure =
        "Vous ne pouvez ajouter que des employés appartenant à la même structure.";
    }
  }

  return errors;
};

export const checkUserRD = (user, users) => {
  //from database
  const errors = {};
  //find an object within data that has the same email
  const found = users.find((u) => u.email === user.email);
  console.log(found);

  if (found) {
    errors.email = "l'un des utilisateurs existe déjà.";
  }

  return errors;
};

export const validateDM = (dm) => {
  const errors = {};

  if (!dm.motif) {
    errors.motif = "obligatoire";
  }

  return errors;
};

export const validateDC = (dc) => {
  const errors = {};

  if (!dc.motif) {
    errors.motif = "obligatoire";
  }
  if (!dc?.DateDepart) {
    errors.DateDepart = "obligatoire";
  } else if (new Date(dc.DateDepart) <= new Date()) {
    errors.DateDepart =
      "la date de départ doit etre supérieure a la date actuelle";
  }

  if (!dc?.DateRetour) {
    errors.DateRetour = "obligatoire";
  } else if (
    dc.DateDepart &&
    new Date(dc.DateRetour) <= new Date(dc.DateDepart)
  ) {
    errors.DateDepart =
      "la date de départ doit etre supérieure a la date de retour";
  }

  if (
    new Date(dc?.DateDepart).getTime() >= new Date(dc?.DateRetour).getTime()
  ) {
    errors.DateRetour =
      "Les dates ne doivent pas être identiques, la date de retour doit être postérieure à la date de départ.";
    errors.DateDepart =
      "Les dates ne doivent pas être identiques, la date de retour doit être postérieure à la date de départ.";
  }

  if (!dc?.Nature) {
    errors.Nature = "obligatoire";
  }

  if (!dc?.LieuSejour) {
    errors.LieuSejour = "obligatoire";
  }

  return errors;
};
