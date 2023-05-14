export const validateMission = (mission, user, object) => {
  // console.log(mission);
  const errors = {};

  if (!mission?.objetMission.trim()) {
    errors.objetMission = "obligatoire";
  }

  if (!mission?.budget) {
    errors.budget = "obligatoire";
  } else if (mission?.budget <= 0) {
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

  //   if (!mission.taches || mission.taches.length === 0) {
  //     errors.taches = "La mission doit avoir au moins une tâche à accomplir.";
  //   }

  if (!mission?.tDateDeb) {
    errors.tDateDeb = "obligatoire";
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
          return verifyInclusion(
            new Date(mission.tDateDeb),
            new Date(mission.tDateRet),
            start,
            end
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

export const verifyInclusion = (st, en, start, end) => {
  if (
    (en >= start && st <= start && en <= end) ||
    (st >= start && en <= end && st <= end && en > start) ||
    (st <= end && st > start && en >= end)
  ) {
    return true;
  }

  return false;
};

export const validateDB = (db) => {
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

  if (!db.dateDepart || isNaN(new Date(db.dateDepart).getTime())) {
    // console.log("true");
    // console.log(db.dateDepart);

    errors.dateDepart =
      "La date de départ est obligatoire et doit être une date valide";
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

  // console.log(data);
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
        // console.log("here index = ", index2, index);
        const employeOverlap = employeSet.some((e) => employeSet2.includes(e));
        // console.log("employeOverlap: ", employeOverlap);
        if (employeOverlap) {
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

    console.log(filteredDemandes);
    console.log("employee", employes);
    // console.log("____________________________________________________");
    // console.log(filteredDemandes);
    // Vérifier si l'employé spécifié est affecté à l'une des missions filtrées
    // console.log("filteredDEMANDES: ", filteredDemandes);
    const isEmployeeAssignedAlreadyToDemand = filteredDemandes.some((dem) => {
      return dem.employes.some((employee) => employes.includes(employee._id));
    });

    console.log(
      "isEmployeeAssignedAlreadyToDemand: ",
      isEmployeeAssignedAlreadyToDemand
    );
    if (isEmployeeAssignedAlreadyToDemand === true) {
      errors.employes =
        "Les employées ne doivent pas avoir des demandes entre date de début et date de fin introduites";
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