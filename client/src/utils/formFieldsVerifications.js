const validateMission = (mission, user) => {
  console.log(mission);
  const errors = {};

  if (!mission.objetMission) {
    errors.objetMission = "obligatoire";
  }
  if (mission.budget <= 0) {
    errors.budget = "le budget doit être supérieur à 0";
  }
  if (!mission.structure && user.role !== "responsable") {
    errors.structure = "obligatoire";
  }

  if (!mission.type) {
    errors.type = "obligatoire";
  }

  if (!mission.budget) {
    errors.budget = "obligatoire";
  }

  if (!mission.pays) {
    errors.pays = "obligatoire";
  }

  if (!mission.employes || mission.employes.length === 0) {
    errors.employes = "obligatoire";
  }

  //   if (!mission.taches || mission.taches.length === 0) {
  //     errors.taches = "La mission doit avoir au moins une tâche à accomplir.";
  //   }

  if (!mission.tDateDeb) {
    errors.tDateDeb = "obligatoire";
  }

  if (!mission.tDateRet) {
    errors.tDateRet = "obligatoire";
  }
  if (!mission.destination) {
    errors.destination = "obligatoire";
  }

  if (
    new Date(mission.tDateDeb).getTime() >= new Date(mission.tDateRet).getTime()
  ) {
    errors.tDateRet =
      "Les dates ne doivent pas être identiques, la date de retour doit être postérieure à la date de départ.";
    errors.tDateDeb =
      "Les dates ne doivent pas être identiques, la date de retour doit être postérieure à la date de départ.";
  }

  return errors;
};

export default validateMission;
