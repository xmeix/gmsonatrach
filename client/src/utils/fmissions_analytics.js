export const getMissionGroupedDataForTime = (data, time, stack) => {
  const documents = data
    .slice()
    .filter((d) => new Date(d.createdAt) <= new Date())
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  let mostRecentDocuments = {};

  for (const document of documents) {
    const { structure, etat, type, destination, departure, country } = document;
    const date = new Date(document.createdAt).toISOString().slice(0, time); // get date in YYYY-MM-DD format
    const key = `${structure}-${etat}-${type}-${destination}-${departure}-${country}-${date}`;

    if (key in mostRecentDocuments) {
      const mostRecentDocument = mostRecentDocuments[key];
      if (document.createdAt <= mostRecentDocument.createdAt) {
        continue;
      }
    }

    mostRecentDocuments[key] = document;
  }

  let groupedDataArray = {};
  groupedDataArray = Object.values(mostRecentDocuments).reduce((acc, cur) => {
    const yearIndex = acc.findIndex(
      (el) =>
        new Date(el.createdAt).toISOString().slice(0, time) ===
          new Date(cur.createdAt).toISOString().slice(0, time) &&
        el.stack === cur[stack]
    );
    if (yearIndex === -1) {
      const totalAirlineRoad =
        cur.airline_utilization_count + cur.road_utilization_count;
      acc.push({
        createdAt: new Date(cur.createdAt).toISOString().slice(0, time),
        stack: cur[stack],
        mission_count: cur.mission_count,
        solved_ticket_count: cur.solved_ticket_count,
        total_ticket_count: cur.total_ticket_count,
        unsolved_ticket_count: cur.total_ticket_count - cur.solved_ticket_count,
        done_tasks_count: cur.done_tasks_count,
        undone_tasks_count: cur.total_tasks_count - cur.done_tasks_count,
        total_tasks_count: cur.total_tasks_count,
        employee_count: cur.employee_count,
        airline_utilization_count: cur.airline_utilization_count,
        road_utilization_count: cur.road_utilization_count,
        ticketSuccessAvg:
          cur.total_ticket_count > 0
            ? (cur.solved_ticket_count * 100) / cur.total_ticket_count
            : 0,
        ticketFailAvg:
          cur.total_ticket_count > 0
            ? ((cur.total_ticket_count - cur.solved_ticket_count) * 100) /
              cur.total_ticket_count
            : 0,
        taskSuccessAvg:
          cur.total_tasks_count > 0
            ? (cur.done_tasks_count * 100) / cur.total_tasks_count
            : 0,
        taskFailAvg:
          cur.total_tasks_count > 0
            ? ((cur.total_tasks_count - cur.done_tasks_count) * 100) /
              cur.total_tasks_count
            : 0,
        airlineAvg:
          totalAirlineRoad > 0
            ? (cur.airline_utilization_count * 100) / totalAirlineRoad
            : 0,
        roadAvg:
          totalAirlineRoad > 0
            ? (cur.road_utilization_count * 100) / totalAirlineRoad
            : 0,
        estimated_budget: cur.estimated_budget,
        consumed_budget: cur.consumed_budget,
        time_Estimated: cur.time_Estimated,
        time_Spent: cur.time_Spent,
      });
    } else {
      acc[yearIndex].mission_count += cur.mission_count;
      acc[yearIndex].solved_ticket_count += cur.solved_ticket_count;
      acc[yearIndex].total_ticket_count += cur.total_ticket_count;
      acc[yearIndex].unsolved_ticket_count +=
        cur.total_ticket_count - cur.solved_ticket_count;
      acc[yearIndex].done_tasks_count += cur.done_tasks_count;
      acc[yearIndex].total_tasks_count += cur.total_tasks_count;
      acc[yearIndex].undone_tasks_count +=
        cur.total_tasks_count - cur.done_tasks_count;
      acc[yearIndex].employee_count += cur.employee_count;
      acc[yearIndex].airline_utilization_count += cur.airline_utilization_count;
      acc[yearIndex].road_utilization_count += cur.road_utilization_count;
      acc[yearIndex].estimated_budget += cur.estimated_budget;
      acc[yearIndex].consumed_budget += cur.consumed_budget;
      acc[yearIndex].time_Estimated += cur.time_Estimated;
      acc[yearIndex].time_Spent += cur.time_Spent;

      const totalAirlineRoad =
        acc[yearIndex].airline_utilization_count +
        acc[yearIndex].road_utilization_count;

      if (acc[yearIndex].total_ticket_count > 0) {
        acc[yearIndex].ticketSuccessAvg =
          (acc[yearIndex].solved_ticket_count * 100) /
          acc[yearIndex].total_ticket_count;
        acc[yearIndex].ticketFailAvg =
          ((acc[yearIndex].total_ticket_count -
            acc[yearIndex].solved_ticket_count) *
            100) /
          acc[yearIndex].total_ticket_count;
      }
      if (acc[yearIndex].total_tasks_count > 0) {
        acc[yearIndex].taskSuccessAvg =
          (acc[yearIndex].done_tasks_count * 100) /
          acc[yearIndex].total_tasks_count;
        acc[yearIndex].taskFailAvg =
          ((acc[yearIndex].total_tasks_count -
            acc[yearIndex].done_tasks_count) *
            100) /
          acc[yearIndex].total_tasks_count;
      }

      if (totalAirlineRoad > 0) {
        acc[yearIndex].airlineAvg =
          (acc[yearIndex].airline_utilization_count * 100) / totalAirlineRoad;
        acc[yearIndex].roadAvg =
          (acc[yearIndex].road_utilization_count * 100) / totalAirlineRoad;
      }
    }
    return acc;
  }, []);

  // console.log(JSON.stringify(groupedDataArray));
  return groupedDataArray;
};

export const getMissionCountFor = (data, type) => {
  const documents = data
    .filter((d) => new Date(d.createdAt) <= new Date())
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  const mostRecentDocuments = {};
  for (const document of documents) {
    const {
      structure,
      etat,
      type: docType,
      country,
      departure,
      destination,
      createdAt,
      mission_count,
      employee_count,
      total_ticket_count,
      solved_ticket_count,
      total_tasks_count,
      done_tasks_count,
      airline_utilization_count,
      road_utilization_count,
      estimated_budget,
      consumed_budget,
      time_Estimated,
      time_Spent,
    } = document;
    const key = `${structure}-${etat}-${docType}-${country}-${departure}-${destination}`;

    if (key in mostRecentDocuments) {
      const mostRecentDocument = mostRecentDocuments[key];
      if (new Date(createdAt) <= new Date(mostRecentDocument.createdAt)) {
        continue;
      }
    }

    mostRecentDocuments[key] = {
      ...document,
      mission_count,
      employee_count,
      total_ticket_count,
      solved_ticket_count,
      total_tasks_count,
      done_tasks_count,
      airline_utilization_count,
      road_utilization_count,
      estimated_budget,
      consumed_budget,
      time_Estimated,
      time_Spent,
    };
  }

  // console.log("mostRecentDocuments", mostRecentDocuments);

  const getGroupedData = (prop) => {
    const groupedData = Object.values(mostRecentDocuments).map((doc) => ({
      label: doc[prop],
      mission_count: doc.mission_count,
      employee_count: doc.employee_count,
      solved_ticket_count: doc.solved_ticket_count,
      total_ticket_count: doc.total_ticket_count,
      unsolved_ticket_count: doc.total_ticket_count - doc.solved_ticket_count,
      done_tasks_count: doc.done_tasks_count,
      total_tasks_count: doc.total_tasks_count,
      undone_tasks_count: doc.total_tasks_count - doc.done_tasks_count,
      airline_utilization_count: doc.airline_utilization_count,
      road_utilization_count: doc.road_utilization_count,
      estimated_budget: doc.estimated_budget,
      consumed_budget: doc.consumed_budget,
      time_Estimated: doc.time_Estimated,
      time_Spent: doc.time_Spent,
    }));

    const reducedData = groupedData.reduce((acc, cur) => {
      const key = cur.label;
      // console.log(cur);
      if (key in acc) {
        acc[key].mission_count += cur.mission_count;
        acc[key].solved_ticket_count += cur.solved_ticket_count;
        acc[key].total_ticket_count += cur.total_ticket_count;
        acc[key].unsolved_ticket_count +=
          cur.total_ticket_count - cur.solved_ticket_count;
        acc[key].done_tasks_count += cur.done_tasks_count;
        acc[key].total_tasks_count += cur.total_tasks_count;
        acc[key].undone_tasks_count +=
          cur.total_tasks_count - cur.done_tasks_count;
        acc[key].employee_count += cur.employee_count;
        acc[key].airline_utilization_count += cur.airline_utilization_count;
        acc[key].road_utilization_count += cur.road_utilization_count;
        acc[key].estimated_budget += cur.estimated_budget;
        acc[key].consumed_budget += cur.consumed_budget;
        acc[key].time_Estimated += cur.time_Estimated;
        acc[key].time_Spent += cur.time_Spent;

        const totalAirlineRoad =
          acc[key].airline_utilization_count + acc[key].road_utilization_count;

        if (acc[key].total_ticket_count > 0) {
          acc[key].ticketSuccessAvg =
            (acc[key].solved_ticket_count * 100) / acc[key].total_ticket_count;
          acc[key].ticketFailAvg =
            ((acc[key].total_ticket_count - acc[key].solved_ticket_count) *
              100) /
            acc[key].total_ticket_count;
        }
        if (acc[key].total_tasks_count > 0) {
          acc[key].taskSuccessAvg =
            (acc[key].done_tasks_count * 100) / acc[key].total_tasks_count;
          acc[key].taskFailAvg =
            ((acc[key].total_tasks_count - acc[key].done_tasks_count) * 100) /
            acc[key].total_tasks_count;
        }

        if (totalAirlineRoad > 0) {
          acc[key].airlineAvg =
            (acc[key].airline_utilization_count * 100) / totalAirlineRoad;
          acc[key].roadAvg =
            (acc[key].road_utilization_count * 100) / totalAirlineRoad;
        }
      } else {
        acc[key] = { ...cur };
      }
      return acc;
    }, {});

    return Object.values(reducedData);
  };

  switch (type) {
    case "structure":
      // console.log("getGroupedData", getGroupedData("structure"));
      return getGroupedData("structure");
    case "etat":
      // console.log("getGroupedData", getGroupedData("etat"));
      return getGroupedData("etat");
    case "type":
      return getGroupedData("type");
    case "country":
      return getGroupedData("country");
    case "departure":
      return getGroupedData("departure");
    case "destination":
      return getGroupedData("destination");
    default:
      throw new Error(`Invalid type: ${type}`);
  }
};
//que l etat terminée car il determine les statistiques globales actuelles
// nbmissions terminées / nb mission acceptées
export const missionCompletionRate = (data, option) => {
  const docsCompleted = getMissionGroupedDataForTime(
    data,
    option,
    "etat"
  ).filter((e) => e.stack === "terminée")[0];

  const docsAccepted = getMissionGroupedDataForTime(
    data,
    option,
    "etat"
  ).filter((e) => e.stack === "en-cours")[0];

  if (!docsCompleted || !docsAccepted) {
    return (0).toFixed(2);
  }

  let B = docsCompleted["mission_count"];
  let A = docsAccepted["mission_count"];

  const value = ((A * 100) / B).toFixed(2);
  return isNaN(value) ? (0).toFixed(2) : value;
};

// somme durée missions terminées / nb missions terminées
export const timeToCompletion = (data) => {
  const docs = getMissionGroupedDataForTime(data, 4, "etat").filter(
    (e) => e.stack === "terminée"
  );

  let A = 0;
  let B = 0;
  // console.log(docs);
  docs.reduce((acc, e) => {
    A += e["time_Spent"];
    B += e["mission_count"];
  }, 0);

  const value = ((A * 100) / B).toFixed(2);
  return isNaN(value) ? (0).toFixed(2) : value;
};
export const budgetVariance = (mission) => {
  let A = mission["budget"];
  let B = mission["budgetConsome"];

  const value = (((A - B) * 100) / A).toFixed(2);
  return isNaN(value) ? (0).toFixed(2) : value;
};

// nb tickets resolus / nb tickets total
export const ticketResolutionRate = (mission, tickets) => {
  const mtickets = tickets.filter((t) => t.mission?._id === mission?._id);
  // console.log(tickets.map((e) => e.mission));
  let A = mtickets.length; // Number of tickets for the mission
  let B = mtickets.filter((t) => t.isSolved === true).length; // Number of resolved tickets for the mission
  
  const value =
    isNaN(B) || isNaN(A) ? (0).toFixed(2) : ((B * 100) / A).toFixed(2);
  return isNaN(value) ? (0).toFixed(2) : value;
};
// nb tickets resolus / nb tickets total
export const tasksResolutionRate = (mission) => {
  let A = mission.taches.length; // Number of tickets for the mission
  let B = mission.taches.filter((t) => t.state === "accomplie").length; // Number of resolved tickets for the mission

  const value = ((B * 100) / A).toFixed(2);
  return isNaN(value) ? (0).toFixed(2) : value;
};
export const missionCostPerEmployee = (mission) => {
  let A = mission.budgetConsome; // Number of tickets for the mission
  let B = mission.employes.length; // Number of resolved tickets for the mission

  const value = (A / B).toFixed(2);
  return isNaN(value) ||
    isNaN(mission.budgetConsome) ||
    mission.budgetConsome === 0 ||
    mission.employes.length === 0
    ? (0).toFixed(2)
    : value;
};
export const employeeProductivity = (user, missions) => {
  // Filter missions where user contributed
  const userMissions = missions.filter((m) =>
    m.employes.some((e) => e._id === user._id)
  );

  // Calculate the number of missions contributed by the user
  const A = userMissions.length;

  // Calculate the total duration of missions contributed by the user in days
  const B = userMissions.reduce((acc, mission) => {
    const timeDiff = Math.abs(
      new Date(mission.tDateDeb) - new Date(mission.tDateRet)
    );
    const durationInDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return acc + durationInDays;
  }, 0);

  const value = ((A * 100) / B).toFixed(2);
  return isNaN(value) ? (0).toFixed(2) : value;
};

export const currentSuccessRate = (data, property1, property2) => {
  const docs = getMissionCountFor(data, "etat").filter(
    (e) => e.label === "terminée"
  );

  let A = 0;
  let B = 0;

  docs.reduce((acc, e) => {
    A += e[property1];
    B += e[property2];
  }, 0);

  const value = ((A * 100) / (A + B)).toFixed(2);
  return isNaN(value) ? 0 : value;
};

export const currentCount = (data, property1) => {
  const docs = getMissionCountFor(data, "etat").filter(
    (e) => e.label === "terminée"
  );
  let S = docs.reduce((acc, e) => {
    return acc + e[property1];
  }, 0);

  return S;
};

export const AverageTicketPerMissionPerEmployee = (
  user,
  missions,
  totalTickets
) => {
  const userMissions = missions.filter((m) =>
    m.employes.some((e) => e._id === user._id)
  );

  // Calculate the number of missions contributed by the user
  const A = userMissions.length;
  const value = (totalTickets / A).toFixed(2);
  return isNaN(value) || A === 0 ? (0).toFixed(2) : value;
};
