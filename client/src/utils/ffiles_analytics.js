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
    Object.values(mostRecentDocuments).map((doc) => ({
      label: doc[property],
      circulation_count: doc.circulation_count,
    }));

  switch (type) {
    case "structure":
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
// export const getCountFor = (data, type, fileType) => {
//   const documents =
//     fileType === "tous"
//       ? data
//           .slice()
//           .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
//       : data
//           .filter((doc) => doc.type === fileType)
//           .slice()
//           .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

//   let mostRecentDocuments = {};

//   for (const document of documents) {
//     const { structure, etat, type, nature, motifDep } = document;
//     const key = `${structure}-${etat}-${type}-${nature}-${motifDep}`;

//     if (key in mostRecentDocuments) {
//       const mostRecentDocument = mostRecentDocuments[key];
//       if (document.createdAt <= mostRecentDocument.createdAt) {
//         continue;
//       }
//     }

//     mostRecentDocuments[key] = document;
//   }
//   const getGroupedData = (property) =>
//     Object.values(mostRecentDocuments).reduce((acc, cur) => {
//       const value = cur[property];
//       const index = acc.findIndex((el) => el.label === value);
//       if (index === -1) {
//         acc.push({
//           label: value,
//           circulation_count: cur.circulation_count,
//         });
//       } else {
//         acc[index].circulation_count += cur.circulation_count;
//       }
//       return acc;
//     }, []);

//   switch (type) {
//     case "structure":
//       return getGroupedData("structure");
//     case "etat":
//       return getGroupedData("etat");
//     case "type":
//       return getGroupedData("type");
//     case "nature":
//       return getGroupedData("nature");
//     case "motifDep":
//       return getGroupedData("motifDep");
//     default:
//       throw new Error(`Invalid type: ${type}`);
//   }
// };

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

  //No need for most recent
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
    }

    mostRecentDocuments[key] = document;
  }

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

  return groupedDataArray;
};
