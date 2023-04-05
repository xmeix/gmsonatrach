export const getCountFor = (data, Type, fileType) => {
  const documents = data
    .filter((doc) => doc.type === fileType)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  const mostRecentDocuments = {};

  for (const document of documents) {
    const { structure, etat, type, nature, motifDep } = document;
    const key = `${structure}-${etat}-${type}-${nature}-${motifDep}`;

    if (key in mostRecentDocuments) {
      const mostRecentDocument = mostRecentDocuments[key];
      if (document.createdAt <= mostRecentDocument.createdAt) {
        continue;
      }
    }

    mostRecentDocuments[key] = document;
  }

  let groupedDataArray;
  switch (Type) {
    case "structure":
      groupedDataArray = Object.values(mostRecentDocuments).reduce(
        (groupedData, document) => {
          const { structure } = document;
          if (!groupedData[structure]) {
            groupedData[structure] = {
              label: structure,
              circulation_count: 0,
            };
          }
          groupedData[structure].circulation_count +=
            document.circulation_count;
          return groupedData;
        },
        {}
      );

      break;
    case "etat":
      groupedDataArray = Object.values(mostRecentDocuments).reduce(
        (groupedData, document) => {
          const { etat } = document;
          if (!groupedData[etat]) {
            groupedData[etat] = {
              label: etat,
              circulation_count: 0,
            };
          }
          groupedData[etat].circulation_count += document.circulation_count;
          return groupedData;
        },
        {}
      );
      break;
    case "type":
      groupedDataArray = Object.values(mostRecentDocuments).reduce(
        (groupedData, document) => {
          const { type } = document;
          if (!groupedData[type]) {
            groupedData[type] = {
              label: type,
              circulation_count: 0,
            };
          }
          groupedData[type].circulation_count += document.circulation_count;
          return groupedData;
        },
        {}
      );
      break;
    case "nature":
      groupedDataArray = Object.values(mostRecentDocuments).reduce(
        (groupedData, document) => {
          const { nature } = document;
          if (!groupedData[nature]) {
            groupedData[nature] = {
              label: nature,
              circulation_count: 0,
            };
          }
          groupedData[nature].circulation_count += document.circulation_count;
          return groupedData;
        },
        {}
      );
      break;
    case "motifDep":
      groupedDataArray = Object.values(mostRecentDocuments).reduce(
        (groupedData, document) => {
          const { motifDep } = document;
          if (!groupedData[motifDep]) {
            groupedData[motifDep] = {
              label: motifDep,
              circulation_count: 0,
            };
          }
          groupedData[motifDep].circulation_count += document.circulation_count;
          return groupedData;
        },
        {}
      );
      break;
    case 4:
    case 7:
    case 10:
      groupedDataArray = documents.reduce((acc, cur) => {
        const yearIndex = acc.findIndex(
          (el) =>
            new Date(el.createdAt).toISOString().slice(0, Type) ===
            new Date(cur.createdAt).toISOString().slice(0, Type)
        );
        if (yearIndex === -1) {
          acc.push({
            createdAt: new Date(cur.createdAt).toISOString().slice(0, Type),
            circulation_count: cur.circulation_count,
          });
        } else {
          acc[yearIndex].circulation_count = +cur.circulation_count;
        }
        return acc;
      }, []);

      console.log(groupedDataArray);

      break;
    default:
      throw new Error(`Invalid type: ${Type}`);
  }

  return Object.values(groupedDataArray);
};
