export const getCountFor = (data, type, fileType) => {
  const documents =
    fileType === "tous"
      ? data
          .slice()
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      : data
          .filter((doc) => doc.type === fileType)
          .slice()
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
    Object.values(mostRecentDocuments)
      .filter((el) => el[property] !== "")
      .map((doc) => ({
        label: doc[property],
        circulation_count: doc.circulation_count,
      }));

  switch (type) {
    case "structure":
      // console.log(getGroupedData("structure"));
      return getGroupedData("structure");
    case "etat":
      return getGroupedData("etat");
    case "type":
      return getGroupedData("type");
    case "nature":
      return getGroupedData("nature");
    case "motifDep":
      return getGroupedData("motifDep");
    default:
      throw new Error(`Invalid type: ${type}`);
  }
};

export const getGroupedDataForTime = (data, time, fileType, stack) => {
  let documents =
    fileType === "tous"
      ? data
          .slice()
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      : data
          .slice()
          .filter((doc) => doc.type === fileType)
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  console.log("documents =>", documents);

  let mostRecentDocuments = {};

  for (const document of documents) {
    const { structure, etat, type, nature, motifDep } = document;
    const date = new Date(document.createdAt).toISOString().slice(0, time); // get date in YYYY-MM-DD format
    const key = `${structure}-${etat}-${type}-${nature}-${motifDep}-${date}`;

    if (key in mostRecentDocuments) {
      const mostRecentDocument = mostRecentDocuments[key];
      if (document.createdAt <= mostRecentDocument.createdAt) {
        continue;
      }
      // Merge the documents with the same stack and createdAt and sum their circulation_count
      // if (mostRecentDocument[stack] === document[stack]) {
      //   mostRecentDocument.circulation_count += document.circulation_count;
      //   continue;
      // }
    }

    mostRecentDocuments[key] = document;
  }

  console.log("most recent docs", mostRecentDocuments);

  let groupedDataArray;
  groupedDataArray = Object.values(mostRecentDocuments).reduce((acc, cur) => {
    const yearIndex = acc.findIndex(
      (el) =>
        new Date(el.createdAt).toISOString().slice(0, time) ===
          new Date(cur.createdAt).toISOString().slice(0, time) &&
        el[stack] === cur[stack]
    );
    if (yearIndex === -1) {
      acc.push({
        createdAt: new Date(cur.createdAt).toISOString().slice(0, time),
        stack: cur[stack],
        circulation_count: cur.circulation_count,
      });
    } else {
      acc[yearIndex].circulation_count += cur.circulation_count;
    }
    return acc;
  }, []);

  // console.log("groupedDataArray before merging", groupedDataArray);

  // Merge objects in groupedDataArray with the same stack and createdAt and sum their circulation_count
  groupedDataArray = Object.values(
    groupedDataArray.reduce((acc, cur) => {
      const key =
        cur.stack + "-" + new Date(cur.createdAt).toISOString().slice(0, time);
      // console.log(acc);
      if (key in acc) {
        acc[key].circulation_count += cur.circulation_count;
      } else {
        acc[key] = cur;
      }
      return acc;
    }, {})
  );

  // console.log("groupedDataArray after merging", groupedDataArray);

  return groupedDataArray;
};
