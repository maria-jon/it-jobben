import { useEffect, useState } from "react";
import { getCountForQuery } from "../services/popularJobsService";

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

    return (
    <>
        <p>Systemanalytiker: {counts.systemanalytiker}</p>
        <p>Systemutvecklare: {counts.systemutvecklare}</p>
        <p>Utvecklare inom spel och digitala media: {counts.utvecklare}</p>
        <p>Systemtestare och testledare: {counts.systemtestare}</p>
        <p>Systemförvaltare m.fl.: {counts.systemforvaltare}</p>
        <p>IT-säkerhetsspecialister: {counts.itsakerhet}</p>
        <p>Övriga IT-specialister: {counts.ovrigaIt}</p>
        <p>Drifttekniker, IT: {counts.drifttekniker}</p>
        <p>Supporttekniker, IT: {counts.supporttekniker}</p>
        <p>Systemadministratörer: {counts.sysadmin}</p>
        <p>Nätverks- och systemtekniker m.fl.: {counts.natverk}</p>
        <p>Webbmaster och webbadministratörer: {counts.webbmaster}</p>
    </>
    )
}