export const getMissionGroupedDataForTime = (data, time, stack) => {
  // Filter the data for documents with a createdAt date before or equal to the current date
  // and sort them in descending order of createdAt date
  let documents = data
    .slice()
    .filter((d) => {
      return new Date(d.createdAt) <= new Date();
    })
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  // console.log("documents", documents);

  // Create an object to store the most recent document for each combination of stack, date, and other properties
  // Sum the mission_counts for combinations with the same stack and date
  let mostRecentDocuments = {};

  for (const document of documents) {
    // Extract the properties needed to create the key
    const { structure, etat, type, country, departure, destination } = document;
    // Get the date in YYYY-MM-DD format
    const date = new Date(document.createdAt).toISOString().slice(0, time);
    // Create the key using the stack, date, and other properties
    const key = `${date}-${structure}-${etat}-${type}-${country}-${departure}-${destination}`;

    // If the key already exists in mostRecentDocuments, check if the current document is more recent
    // If it is not more recent, skip to the next iteration
    if (key in mostRecentDocuments) {
      const mostRecentDocument = mostRecentDocuments[key];
      if (document.createdAt <= mostRecentDocument.createdAt) {
        continue; // Go to the next iteration
      }
    }

    // If the key does not exist in mostRecentDocuments or the current document is more recent,
    // add the document to mostRecentDocuments using the key
    mostRecentDocuments[key] = document;
  }

  console.log("mostRecentDocuments", JSON.stringify(mostRecentDocuments));

  //we need for each element in mostRecentDocuments to look for all the previous elements that has the same stack but not the same object
  //and each time we summ their mission counts and then we replace that current element ( in another array of course to not mess up the data we already have)
  console.log("-----------------------------------------");

  const groupedData = {};
  const mostRecentDocumentsValues = Object.values(mostRecentDocuments);
  const mostRecentDocumentsKeys = Object.keys(mostRecentDocuments);

  for (let i = 0; i < mostRecentDocumentsValues.length; i++) {
    const currentElement = mostRecentDocumentsValues[i];
    const remainingElements = mostRecentDocumentsValues
      .slice(i + 1)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    const date = new Date(currentElement.createdAt)
      .toISOString()
      .slice(0, time);
    const { structure, etat, type, country, departure, destination } =
      currentElement;
    const key = `${date}-${structure}-${etat}-${type}-${country}-${departure}-${destination}`;

    if (!(key in groupedData)) {
      groupedData[key] = {
        createdAt: date,
        stack: currentElement[stack],
        structure: currentElement.structure,
        etat: currentElement.etat,
        type: currentElement.type,
        departure: currentElement.departure,
        destination: currentElement.destination,
        country: currentElement.country,
        mission_count: currentElement.mission_count,
      };
    }

    remainingElements.forEach((currentElement2) => {
      if (
        currentElement.structure === currentElement2.structure &&
        currentElement.etat === currentElement2.etat &&
        currentElement.type === currentElement2.type &&
        currentElement.departure === currentElement2.departure &&
        currentElement.destination === currentElement2.destination &&
        currentElement.country === currentElement2.country
      ) {
        return; // skip this iteration if the elements match
      } else if (currentElement[stack] !== currentElement2[stack]) {
        return;
      } else if (currentElement2.mission_count > 0) {
        groupedData[key].mission_count += currentElement2.mission_count;
      }
    });
  }

  console.log(groupedData);

  // console.log(groupedData);
  return Object.values(groupedData);
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
      success_count,
      fail_count,
      airline_utilization_count,
      road_utilization_count,
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
      success_count,
      fail_count,
      airline_utilization_count,
      road_utilization_count,
    };
  }

  // console.log("mostRecentDocuments", mostRecentDocuments);

  const getGroupedData = (prop) => {
    const groupedData = Object.values(mostRecentDocuments).map((doc) => ({
      label: doc[prop],
      mission_count: doc.mission_count,
      employee_count: doc.employee_count,
      success_count: doc.success_count,
      fail_count: doc.fail_count,
      airline_utilization_count: doc.airline_utilization_count,
      road_utilization_count: doc.road_utilization_count,
    }));

    const reducedData = groupedData.reduce((acc, cur) => {
      const key = cur.label;
      // console.log(cur);
      if (key in acc) {
        acc[key].mission_count += cur.mission_count;
        acc[key].employee_count += cur.employee_count;
        acc[key].success_count += cur.success_count;
        acc[key].fail_count += cur.fail_count;
        acc[key].airline_utilization_count += cur.airline_utilization_count;
        acc[key].road_utilization_count += cur.road_utilization_count;
        const totalSuccessFail = acc[key].success_count + acc[key].fail_count;
        const totalAirlineRoad =
          acc[key].airline_utilization_count + acc[key].road_utilization_count;
        if (totalSuccessFail > 0) {
          acc[key].successAvg =
            (acc[key].success_count * 100) / totalSuccessFail;
          acc[key].failAvg = (acc[key].fail_count * 100) / totalSuccessFail;
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
