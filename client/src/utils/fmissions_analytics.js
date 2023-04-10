export const getMissionGroupedDataForTime = (data, time, stack) => {
  const documents = data
    .slice()
    .filter((d) => new Date(d.createdAt) <= new Date())
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  //No need for most recent
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
        el[stack] === cur[stack]
    );
    if (yearIndex === -1) {
      const totalSuccessFail = cur.success_count + cur.fail_count;
      const totalAirlineRoad =
        cur.airline_utilization_count + cur.road_utilization_count;
      acc.push({
        createdAt: new Date(cur.createdAt).toISOString().slice(0, time),
        stack: cur[stack],
        mission_count: cur.mission_count,
        success_count: cur.success_count,
        employee_count: cur.employee_count,
        fail_count: cur.fail_count,
        airline_utilization_count: cur.airline_utilization_count,
        road_utilization_count: cur.road_utilization_count,
        successAvg:
          totalSuccessFail > 0
            ? (cur.success_count * 100) / totalSuccessFail
            : 0,
        failAvg:
          totalSuccessFail > 0 ? (cur.fail_count * 100) / totalSuccessFail : 0,
        airlineAvg:
          totalAirlineRoad > 0
            ? (cur.airline_utilization_count * 100) / totalAirlineRoad
            : 0,
        roadAvg:
          totalAirlineRoad > 0
            ? (cur.road_utilization_count * 100) / totalAirlineRoad
            : 0,
      });
    } else {
      acc[yearIndex].mission_count += cur.mission_count;
      acc[yearIndex].success_count += cur.success_count;
      acc[yearIndex].fail_count += cur.fail_count;
      acc[yearIndex].employee_count += cur.employee_count;
      acc[yearIndex].airline_utilization_count += cur.airline_utilization_count;
      acc[yearIndex].road_utilization_count += cur.road_utilization_count;
      const totalSuccessFail =
        acc[yearIndex].success_count + acc[yearIndex].fail_count;
      const totalAirlineRoad =
        acc[yearIndex].airline_utilization_count +
        acc[yearIndex].road_utilization_count;
      if (totalSuccessFail > 0) {
        acc[yearIndex].successAvg =
          (acc[yearIndex].success_count * 100) / totalSuccessFail;
        acc[yearIndex].failAvg =
          (acc[yearIndex].fail_count * 100) / totalSuccessFail;
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

  return groupedDataArray;
};
export const getMissionCountFor = (data, type) => {
  const documents = data
    .slice()
    .filter((d) => new Date(d.createdAt) <= new Date())

    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  let mostRecentDocuments = {};

  for (const document of documents) {
    const docType = document[type];

    if (docType in mostRecentDocuments) {
      const mostRecentDocument = mostRecentDocuments[docType];
      if (document.createdAt <= mostRecentDocument.createdAt) {
        continue;
      }
    }

    mostRecentDocuments[docType] = document;
  }

  const getGroupedData = (property) =>
    Object.values(mostRecentDocuments).map((doc) => ({
      label: doc[property],
      mission_count: doc.mission_count,
      employee_count: doc.employee_count,
      success_count: doc.success_count,
      fail_count: doc.fail_count,
      successAvg:
        (doc.success_count * 100) / (doc.success_count + doc.fail_count),
      failAvg: (doc.fail_count * 100) / (doc.success_count + doc.fail_count),

      airline_utilization_count: doc.airline_utilization_count,
      road_utilization_count: doc.road_utilization_count,
      airlineAvg:
        (doc.airline_utilization_count * 100) /
        (doc.airline_utilization_count + doc.road_utilization_count),
      roadAvg:
        (doc.road_utilization_count * 100) /
        (doc.airline_utilization_count + doc.road_utilization_count),
    }));

  switch (type) {
    case "structure":
      return getGroupedData("structure");
    case "etat":
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

  return ((A * 100) / (A + B)).toFixed(2);
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
