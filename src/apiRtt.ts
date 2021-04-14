export const apiRtt = (method: string) => {
  let performances: any = performance
    .getEntriesByType("resource")
    .filter((item: any) => item.initiatorType === "fetch");
  const performanceRttArray = JSON.parse(
    sessionStorage.getItem("responseTime") || "[]"
  );

  const newArray = [];
  for (let i = 0; i < performances.length; i++) {
    let duplicate = performanceRttArray.find((performanceItem: any) => {
      const performanceTime =
        Math.round(performances[i].responseEnd - performances[i].fetchStart) +
        " ms";
      return (
        performanceItem.Name === performances[i].name &&
        (performanceItem.Time === performanceTime || performanceItem.Time > performanceTime) &&
        performanceItem.URL === performances[i].transferSize + " B"
      );
    });
    if (typeof duplicate == "undefined") {
      let resor = {};
      resor = {
        Name: performances[i].name,
        Status: "200",
        Path: performances[i].name.split(
          "https://bookstore-dev.macrometadev.workers.dev"
        )[1],
        Time:
          Math.round(performances[i].responseEnd - performances[i].fetchStart) +
          " ms",
        Method: method,
        URL: performances[i].transferSize + " B",
      };
      newArray.push(resor);
    } 
  }
  let responseTimeArray = [...performanceRttArray, ...newArray];
  sessionStorage.setItem("responseTime", JSON.stringify(responseTimeArray));
};
