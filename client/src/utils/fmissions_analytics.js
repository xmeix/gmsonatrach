export const getMissionsPer = (data, type) => {
  let newData;
  switch (type) {
    case 1: //year
      {
        newData = data?.reduce((acc, cur) => {
          const yearIndex = acc.findIndex((el) => el.year === cur.year);
          if (yearIndex === -1) {
            acc.push({ year: cur.year, mission_count: 1 });
          } else {
            acc[yearIndex].mission_count++;
          }
          return acc;
        }, []);

        return newData.sort((a, b) => a.year - b.year);
      }
      break;
    case 2: //month
      newData = data?.reduce((acc, cur) => {
        const monthIndex = acc.findIndex(
          (el) => el.month === new Date(cur.day).toISOString().slice(0, 7)
        );
        if (monthIndex === -1) {
          acc.push({
            month: new Date(cur.day).toISOString().slice(0, 7),
            mission_count: 1,
          });
        } else {
          acc[monthIndex].mission_count++;
        }
        return acc;
      }, []);

      return newData.sort((a, b) => a.month - b.month);
      break;
    case 3: //day
      newData = data?.reduce((acc, cur) => {
        const dayIndex = acc.findIndex(
          (el) => el.day === new Date(cur.day).toISOString().slice(0, 10)
        );
        if (dayIndex === -1) {
          acc.push({
            day: new Date(cur.day).toISOString().slice(0, 10),
            mission_count: 1,
          });
        } else {
          acc[dayIndex].mission_count++;
        }
        return acc;
      }, []);

      return newData.sort((a, b) => a.day - b.day);
      break;
    case 4: //structure
      newData = data?.reduce((acc, cur) => {
        const dayIndex = acc.findIndex((el) => el.structure === cur.structure);
        if (dayIndex === -1) {
          acc.push({
            structure: cur.structure,
            mission_count: 1,
          });
        } else {
          acc[dayIndex].mission_count++;
        }
        return acc;
      }, []);
      console.log(newData);
      return newData;
      break;
    case 5: //type
      newData = data?.reduce((acc, cur) => {
        const dayIndex = acc.findIndex((el) => el.type === cur.type);
        if (dayIndex === -1) {
          acc.push({
            type: cur.type,
            mission_count: 1,
          });
        } else {
          acc[dayIndex].mission_count++;
        }
        return acc;
      }, []);
      console.log(newData);
      return newData;
      break;

      return newData.sort((a, b) => a.day - b.day);
      break;
    case 6: //state
      newData = data?.reduce((acc, cur) => {
        const dayIndex = acc.findIndex((el) => el.state === cur.state);
        if (dayIndex === -1) {
          acc.push({
            state: cur.state,
            mission_count: 1,
          });
        } else {
          acc[dayIndex].mission_count++;
        }
        return acc;
      }, []);
      console.log(newData);
      return newData;

      break;
  }
};
