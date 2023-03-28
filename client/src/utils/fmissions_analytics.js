export const getMissionsPer = (data, type) => {
  const newData = data.reduce((acc, cur) => {
    const monthIndex = acc.findIndex((el) => el.year === cur.year);
    if (monthIndex === -1) {
      acc.push({ year: cur.year, mission_count: 1 });
    } else {
      acc[monthIndex].mission_count++;
    }
    return acc;
  }, []);

  console.log(newData);
  return newData.sort((a, b) => a.year - b.year);
  switch (type) {
    case "day":
      break;
    case "month":
      break;
    case "year":
      break;
  }
};
