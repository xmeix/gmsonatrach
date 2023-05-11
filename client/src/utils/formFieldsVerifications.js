export const validateMission = (mission, user, object) => {
  console.log(mission);
  const errors = {};

  if (!mission?.objetMission.trim()) {
    errors.objetMission = "obligatoire";
  }
  if (mission?.budget <= 0) {
    errors.budget = "le budget doit être supérieur à 0";
  }
  if (!mission?.structure && user.role !== "responsable") {
    errors.structure = "obligatoire";
  }

  if (!mission?.type) {
    errors.type = "obligatoire";
  }

  if (!mission?.budget) {
    errors.budget = "obligatoire";
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

      console.log("____________________________________________________");
      // console.log(filteredMissions);
      // Vérifier si l'employé spécifié est affecté à l'une des missions filtrées
      const isEmployeeAssignedToMission = filteredMissions.some((mission) => {
        return mission.employes.map((employee) => {
          employes.includes(employee._id);
        });
      });

      console.log("isEmployeeAssignedToMission", isEmployeeAssignedToMission);

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
