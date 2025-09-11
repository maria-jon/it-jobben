import { get } from "./serviceBase";

const TAXONOMY_BASE = "https://taxonomy.api.jobtechdev.se/v1";

export type OccupationGroup = {
  concept_id: string;
  label: string;
};

//Just get all occupation fields
export async function getOccupationGroupsForField(
  fieldId: string
): Promise<OccupationGroup[]> {
  //API example: https://taxonomy.api.jobtechdev.se/v1/occupation-groups?occupation-field=3&size=100
  const url = `${TAXONOMY_BASE}/occupation-groups?occupation-field=${encodeURIComponent(
    fieldId
  )}&size=100`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await get<any>(url);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hits: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.hits)
    ? data.hits
    : [];
  return hits
    .map((x) => ({
      concept_id: String(x.concept_id ?? x.id ?? ""),
      label: String(x.label ?? x.preferred_label ?? ""),
    }))
    .filter((g) => g.concept_id && g.label);
}
