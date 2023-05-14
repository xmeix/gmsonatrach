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

export const validateDB = (db, user, object) => {
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

  if (!db.dateDepart) {
    errors.dateDepart =
      "La date de départ est obligatoire et doit être une date valide";
  }

  if (!db.dateRetour) {
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

  // if (object?.type === "import") {
  //   //we need to verify the employees
  //   if (db.employes.length > 0) {
  //     let employes = db.employes;
  //     let start = new Date(db.dateDepart);
  //     let end = new Date(db.dateRetour);

  //     //verifier s'il existe deja une demande de billetterie pour la meme date
  //     // date depart et de retour ,  et au moins un des employes dans db existe dans cette demande qui se trouve dans objet.demandes
  //     const filteredDemandes = object.demandes
  //       .filter((demande) => {
  //         return verifyInclusion(
  //           new Date(demande.dateDepart),
  //           new Date(demande.dateRetour),
  //           start,
  //           end
  //         );
  //       })
  //       .map((f) => f);

  //     // console.log("____________________________________________________");
  //     // console.log(filteredDemandes);
  //     // Vérifier si l'employé spécifié est affecté à l'une des missions filtrées
  //     const isEmployeeAssignedToMission = filteredDemandes.some((dem) => {
  //       return dem.employes.map((employee) => {
  //         employes.includes(employee);
  //       });
  //     });

  //     // console.log("isEmployeeAssignedToMission", isEmployeeAssignedToMission);

  //     if (isEmployeeAssignedToMission) {
  //       errors.employes =
  //         "Les employées ne doivent pas avoir des demandes entre date de début et date de fin introduites";
  //     }
  //   }
  // }

  return errors;
};

export const verifyInclusionDB = (st, en, start, end) => {
  if (
    (en >= start && st <= start && en <= end) ||
    (st >= start && en <= end && st <= end && en > start) ||
    (st <= end && st > start && en >= end) ||
    (st > start && en > end)
  ) {
    return true;
  }

  return false;
};
export const verifyDuplicates = (data) => {
  const duplicates = [];
  
  // create a new array of objects with necessary properties for sorting
  const sortedData = data.map((reservation, index) => ({
    ...reservation,
    index,
    dateDepart: new Date(reservation.dateDepart).getTime(),
    dateRetour: new Date(reservation.dateRetour).getTime(),
    employeSet: new Set(reservation.employes),
  })).sort((a, b) => a.dateDepart - b.dateDepart);
  
  for (let i = 0; i < sortedData.length; i++) {
    const { dateDepart, dateRetour, employeSet, index } = sortedData[i];

    // find the first reservation with a dateDepart value greater than dateRetour
    const nextIndex = sortedData.findIndex(
      (reservation) => reservation.dateDepart > dateRetour
    );
    const endIndex = nextIndex === -1 ? sortedData.length : nextIndex;
    
    // verify inclusion and employe overlap
    for (let j = i + 1; j < endIndex; j++) {
      const {
        dateDepart: dateDepart2,
        dateRetour: dateRetour2,
        employeSet: employeSet2,
        index: index2,
      } = sortedData[j];

      if (verifyInclusionDB(dateDepart2, dateRetour2, dateDepart, dateRetour)) {
        const employeOverlap = Array.from(new Set([...employeSet].filter(e => employeSet2.has(e))));
        if (employeOverlap.length > 0) {
          duplicates.push(`line ${index} and line ${index2}`);
          break;
        }
      }
    }
  }

  return duplicates;
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
