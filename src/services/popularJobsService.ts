import axios from "axios";

const jobURL = import.meta.env.VITE_JOB_URL as string;

export async function getJobCountFor(term: string): Promise<number> {
  const url = `${jobURL}?q=${encodeURIComponent(term)}&limit=0`;
  const { data } = await axios.get(url);
  return data?.total?.value ?? 0;
}

export async function getJobCounts(terms: string[]) {
  const results = await Promise.all(
    terms.map(async (t) => ({
      term: t,
      count: await getJobCountFor(t),
    }))
  );
  return results.sort((a, b) => b.count - a.count);
}
