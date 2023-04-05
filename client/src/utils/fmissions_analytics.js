export const getMissionsPer = (data, type) => {
  let newData;
  switch (type) {
    case 1: //year
      {
        newData = data?.reduce((acc, cur) => {
          const yearIndex = acc.findIndex(
            (el) =>
              new Date(el.day).toISOString().slice(0, 4) ===
              new Date(cur.day).toISOString().slice(0, 4)
          );
          if (yearIndex === -1) {
            acc.push({
              day: new Date(cur.day).toISOString().slice(0, 4),
              mission_count: 1,
            });
          } else {
            acc[yearIndex].mission_count++;
          }
          return acc;
        }, []);

        return newData.sort((a, b) => Date.parse(a.day) - Date.parse(b.day));
      }
      break;
    case 2: //month
      newData = data?.reduce((acc, cur) => {
        const monthIndex = acc.findIndex(
          (el) =>
            new Date(el.day).toISOString().slice(0, 7) ===
            new Date(cur.day).toISOString().slice(0, 7)
        );
        if (monthIndex === -1) {
          acc.push({
            day: new Date(cur.day).toISOString().slice(0, 7),
            mission_count: 1,
          });
        } else {
          acc[monthIndex].mission_count++;
        }
        return acc;
      }, []);

      return newData.sort((a, b) => Date.parse(a.day) - Date.parse(b.day));
      break;
    case 3: //day
      newData = data?.reduce((acc, cur) => {
        const dayIndex = acc.findIndex(
          (el) =>
            new Date(el.day).toISOString().slice(0, 10) ===
            new Date(cur.day).toISOString().slice(0, 10)
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
       return newData.sort((a, b) => Date.parse(a.day) - Date.parse(b.day));
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
      return newData;
      break;

      return newData.sort((a, b) => Date.parse(a.day) - Date.parse(b.day));
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
      return newData;

      break;
  }
};

const getGroupedData = (data, groupFn) => {
  return data.reduce((acc, cur) => {
    const { day } = cur;
    const index = acc.findIndex((el) => groupFn(el.day) === groupFn(day));
    if (index === -1) {
      acc.push({
        day: groupFn(day),
        accomplishedTask_counts: [cur.accomplishedTask_count],
        success_rate: 0,
      });
    } else {
      acc[index].accomplishedTask_counts.push(cur.accomplishedTask_count);
    }
    return acc;
  }, []);
};

const calculateAverageSuccessRate = (group) => {
   const { accomplishedTask_counts } = group;
  const sum = accomplishedTask_counts?.reduce((acc, count) => acc + count, 0);
  const average = sum / accomplishedTask_counts?.length;
  group.success_rate = average;
  delete group.accomplishedTask_counts;
};

export const groupSuccessRatesByDate = (data, type) => {
  let groupedData;
  switch (type) {
    case 1:
      groupedData = getGroupedData(data, (day) =>
        new Date(day).toISOString().slice(0, 4)
      );
      break;
    case 2:
      groupedData = getGroupedData(data, (day) =>
        new Date(day).toISOString().slice(0, 7)
      );
      break;
    case 3:
      groupedData = getGroupedData(data, (day) =>
        new Date(day).toISOString().slice(0, 10)
      );
      break;
    default:
      break;
  }

  groupedData?.forEach(calculateAverageSuccessRate);
  return groupedData.sort((a, b) => Date.parse(a.day) - Date.parse(b.day));
};

export const getEmployeesCountPerStructure = (data) => {
  const newData = data.reduce((acc, cur) => {
    const structureIndex = acc.findIndex(
      (el) => el.structure === cur.structure
    );

    if (structureIndex === -1) {
      acc.push({
        structure: cur.structure,
        employee_count: cur.employee_count,
      });
    } else {
      acc[structureIndex].employee_count += cur.employee_count;
    }

    return acc;
  }, []);

  return newData;
};

export const getTasksCount = (data, type) => {
  let newData;

  switch (type) {
    case 1:
      newData = data?.reduce((acc, cur) => {
        const dayIndex = acc.findIndex(
          (el) =>
            new Date(el.day).toISOString().slice(0, 4) ===
            new Date(cur.day).toISOString().slice(0, 4)
        );
        if (dayIndex === -1) {
          acc.push({
            day: new Date(cur.day).toISOString().slice(0, 4),
            accomplishedTask_count: cur.accomplishedTask_count,
            nonAccomplishedTask_count: cur.nonAccomplishedTask_count,
          });
        } else {
          acc[dayIndex].accomplishedTask_count += cur.accomplishedTask_count;
          acc[dayIndex].nonAccomplishedTask_count +=
            cur.nonAccomplishedTask_count;
        }

        return acc;
      }, []);
      break;
    case 2:
      newData = data?.reduce((acc, cur) => {
        const dayIndex = acc.findIndex(
          (el) =>
            new Date(el.day).toISOString().slice(0, 7) ===
            new Date(cur.day).toISOString().slice(0, 7)
        );
        if (dayIndex === -1) {
          acc.push({
            day: new Date(cur.day).toISOString().slice(0, 7),
            accomplishedTask_count: cur.accomplishedTask_count,
            nonAccomplishedTask_count: cur.nonAccomplishedTask_count,
          });
        } else {
          acc[dayIndex].accomplishedTask_count += cur.accomplishedTask_count;
          acc[dayIndex].nonAccomplishedTask_count +=
            cur.nonAccomplishedTask_count;
        }

        return acc;
      }, []);
      break;
    case 3:
      newData = data?.reduce((acc, cur) => {
        const dayIndex = acc.findIndex(
          (el) =>
            new Date(el.day).toISOString().slice(0, 10) ===
            new Date(cur.day).toISOString().slice(0, 10)
        );
        if (dayIndex === -1) {
          acc.push({
            day: new Date(cur.day).toISOString().slice(0, 10),
            accomplishedTask_count: cur.accomplishedTask_count,
            nonAccomplishedTask_count: cur.nonAccomplishedTask_count,
          });
        } else {
          acc[dayIndex].accomplishedTask_count += cur.accomplishedTask_count;
          acc[dayIndex].nonAccomplishedTask_count +=
            cur.nonAccomplishedTask_count;
        }

        return acc;
      }, []);
      break;

    default:
      break;
  }

  return newData;
};

const getUGroupedData = (data, groupFn) => {
  return data?.reduce((acc, cur) => {
    const { day } = cur;
    const index = acc.findIndex((el) => groupFn(el.day) === groupFn(day));
    if (index === -1) {
      acc.push({
        day: groupFn(day),
        road_utilization_counts: [cur.road_utilization_count],
        airline_utilization_counts: [cur.airline_utilization_count],
      });
    } else {
      acc[index].road_utilization_counts.push(cur.road_utilization_count);
      acc[index].airline_utilization_counts.push(cur.airline_utilization_count);
    }
    return acc;
  }, []);
};

const calculateAverageUtilRates = (group) => {
  // const totalTransport =
  //   mission.moyenTransport.length + mission.moyenTransportRet.length;
  const { road_utilization_counts, airline_utilization_counts } = group;
  const roadUtilSum = road_utilization_counts?.reduce(
    (acc, rate) => acc + rate,
    0
  );
  const airlineUtilSum = airline_utilization_counts?.reduce(
    (acc, rate) => acc + rate,
    0
  );
  const roadUtilAvg = roadUtilSum / (roadUtilSum + airlineUtilSum);
  const airlineUtilAvg = airlineUtilSum / (roadUtilSum + airlineUtilSum);
  group.road_utilization_rate = roadUtilAvg * 100;
  group.airline_utilization_rate = airlineUtilAvg * 100;
};

export const groupUtilRatesByDate = (data, type) => {
   let groupedData;
  switch (type) {
    case 1:
      groupedData = getUGroupedData(data, (day) =>
        new Date(day).toISOString().slice(0, 4)
      );
      break;
    case 2:
      groupedData = getUGroupedData(data, (day) =>
        new Date(day).toISOString().slice(0, 7)
      );
      break;
    case 3:
      groupedData = getUGroupedData(data, (day) =>
        new Date(day).toISOString().slice(0, 10)
      );
      break;
    default:
      break;
  }
   groupedData?.forEach(calculateAverageUtilRates);
  return groupedData.sort((a, b) => Date.parse(a.day) - Date.parse(b.day));
};

export const getTotalSuccessRate = (data) => {
  const totalAccTasks = data.reduce((acc, el) => {
    return acc + el.accomplishedTask_count;
  }, 0);
  const totalTasks = data.reduce((acc, el) => {
    return acc + el.accomplishedTask_count + el.nonAccomplishedTask_count;
  }, 0);
  const averageSuccessRate = (totalAccTasks / totalTasks) * 100;
  return averageSuccessRate.toFixed(2);
};
export const getTotalTasksCount = (data, type) => {
  let total;
  switch (type) {
    case 1:
      total = data.reduce((acc, el) => {
        return acc + el.accomplishedTask_count;
      }, 0);
      break;
    case 2:
      total = data.reduce((acc, el) => {
        return acc + el.nonAccomplishedTask_count;
      }, 0);
      break;

    default:
      break;
  }

  return total;
};
export const getTotalUtilizationRate = (data, type) => {
  let utilization_counts;
  switch (type) {
    case 1:
      utilization_counts = data.reduce((acc, el) => {
        return acc + el.road_utilization_count;
      }, 0);
      break;
    case 2:
      utilization_counts = data.reduce((acc, el) => {
        return acc + el.airline_utilization_count;
      }, 0);
      break;

    default:
      break;
  }
  let total = data.reduce((acc, el) => {
    return acc + el.airline_utilization_count + el.road_utilization_count;
  }, 0);
  const averageUtilsRate = (utilization_counts / total) * 100;
  return averageUtilsRate.toFixed(1);
};
