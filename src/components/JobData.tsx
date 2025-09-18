import { useEffect, useState } from "react";
import { getCountForQuery } from "../services/popularJobsService";
import { DigiBarChart } from "@digi/arbetsformedlingen-react";
import "../components/JobData.css"

export const JobData = () => {
  const [counts, setCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    (async () => {
      const systemanalytiker = await getCountForQuery("q=systemanalytiker&occupation-group=2511");
      const systemutvecklare = await getCountForQuery("q=systemutvecklare&occupation-group=2512");
      const utvecklare = await getCountForQuery("q=utvecklare&occupation-group=2513");
      const systemtestare = await getCountForQuery("q=systemtestare&occupation-group=2514");

      const systemforvaltare = await getCountForQuery("q=systemförvaltare&occupation-group=2515");
      const itsakerhet = await getCountForQuery("q=it-säkerhet&occupation-group=2516");
      const ovrigaIt = await getCountForQuery("q=it&occupation-group=2519");
      const drifttekniker = await getCountForQuery("q=drifttekniker&occupation-group=3511");
      const supporttekniker = await getCountForQuery("q=supporttekniker&occupation-group=3512");
      const sysadmin = await getCountForQuery("q=systemadministratör&occupation-group=3513");
      const natverk = await getCountForQuery("q=nätverkstekniker&occupation-group=3514");
      const webbmaster = await getCountForQuery("q=webbmaster&occupation-group=3515");

      setCounts({
        systemanalytiker,
        systemutvecklare,
        utvecklare,
        systemtestare,
        systemforvaltare,
        itsakerhet,
        ovrigaIt,
        drifttekniker,
        supporttekniker,
        sysadmin,
        natverk,
        webbmaster,
      });
    })();
  }, []);

  const chartData = {
    data: {
      xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      xValueNames: [
        "Systemanalytiker och IT-arkitekter m.fl.",
        "Mjukvaru- och systemutvecklare m.fl.",
        "Utvecklare inom spel och digitala media",
        "Systemtestare och testledare",
        "Systemförvaltare m.fl.",
        "IT-säkerhetsspecialister",
        "Övriga IT-specialister",
        "Drifttekniker, IT",
        "Supporttekniker, IT",
        "Systemadministratörer",
        "Nätverks- och systemtekniker m.fl.",
        "Webbmaster och webbadministratörer",
      ],
      series: [
        {
          yValues: [
            counts.systemanalytiker || 0,
            counts.systemutvecklare || 0,
            counts.utvecklare || 0,
            counts.systemtestare || 0,
            counts.systemforvaltare || 0,
            counts.itsakerhet || 0,
            counts.ovrigaIt || 0,
            counts.drifttekniker || 0,
            counts.supporttekniker || 0,
            counts.sysadmin || 0,
            counts.natverk || 0,
            counts.webbmaster || 0,
          ],
          title: "Antal lediga jobb",
        },
      ],
    },
    x: "Yrkesgrupp",
    y: "Antal jobb",
    title: "Lediga IT-jobb per yrkesgrupp",
    meta: {
      valueLabels: true,
    },
  };

  return (
    <div style={{ width: "1200px", height: "600px" }}> 
      <DigiBarChart
        afChartData={chartData}
        afHeadingLevel={"H2"}
        afVariation={"horizontal"} 
        style={{ width: "100%", height: "100%" }} 
      />
  </div>
  );
};

  // <div style={{ overflowX: "auto" }}>
  //     <DigiLayoutBlock 
  //       afVerticalPadding 
  //       afMarginTop 
  //       style={{ width: "100%", height: "1000px"}} 
  //       >
  //     <DigiBarChart
  //       afChartData={chartData}
  //       afHeadingLevel={"H2"}
  //       afVariation={"horizontal"} 
  //       style={{ width: "100%", height: "1000px" }} 
  //     >
  //     </DigiBarChart>
  //   </DigiLayoutBlock>
  // </div>