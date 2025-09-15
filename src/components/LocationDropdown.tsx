import { useEffect, useState } from "react";
import { DigiContextMenu } from "@digi/arbetsformedlingen-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchCounties,
  fetchMunicipalitiesByCounty,
} from "../services/locationService";

type MenuItem = {
  id: number;
  title: string;
  onClick?: () => void;
  group?: string;
};

export const LocationDropdown = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [counties, setCounties] = useState<{ id: string; name: string }[]>([]);
  const [municipalities, setMunicipalities] = useState<
    { id: string; name: string }[]
  >([]);

  // Track selected county to load municipalities
  const [activeCounty, setActiveCounty] = useState<string | null>(null);

  // On mount: fetch counties, select first and fetch its municipalities
  useEffect(() => {
    (async () => {
      const data = await fetchCounties();
      setCounties(data);
      //choose first county by default
      if (data.length) {
        setActiveCounty(data[0].id);
        const muns = await fetchMunicipalitiesByCounty(data[0].id);
        setMunicipalities(muns);
      }
    })();
  }, []);

  // Handlers for menu actions
  const selectCounty = async (countyId: string) => {
    setActiveCounty(countyId);
    const muns = await fetchMunicipalitiesByCounty(countyId);
    setMunicipalities(muns);
  };

  // Navigate with municipality or remote in URL
  const setMunicipality = (municipalityId: string) => {
    const usp = new URLSearchParams(location.search);
    usp.delete("remote");
    usp.set("municipality", municipalityId);
    navigate(`/search?${usp.toString()}`, { replace: true });
  };

  // Clear municipality and remote filters
  const resetAll = () => {
    const usp = new URLSearchParams(location.search);
    usp.delete("municipality");
    usp.delete("remote");
    navigate(`/search?${usp.toString()}`, { replace: true });
  };

  // Set remote=true in URL
  const setRemote = () => {
    const usp = new URLSearchParams(location.search);
    usp.delete("municipality");
    usp.set("remote", "true");
    navigate(`/search?${usp.toString()}`, { replace: true });
  };

  // Build menu items for counties (left) and municipalities + remote (right)
  const left: MenuItem[] = [
    { id: -2, title: "Rensa", onClick: resetAll, group: "left" },
    ...counties.map((c, i) => ({
      id: i,
      title: `${activeCounty === c.id ? "✓ " : ""}${c.name}`,
      onClick: () => selectCounty(c.id),
      group: "left",
    })),
  ];

  const right: MenuItem[] = [
    { id: -1, title: "Distans (remote)", onClick: setRemote, group: "right" },
    ...municipalities.map((m, i) => ({
      id: 1000 + i,
      title: m.name,
      onClick: () => setMunicipality(m.id),
      group: "right",
    })),
  ];

  // Combine left and right with a divider
  const menuItems = [
    ...left,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...[{ id: 99999, title: "——", group: "divider" } as any],
    ...right,
  ];

  // Render context menu
  return (
    <DigiContextMenu
      afTitle="Ort"
      afMenuItems={menuItems}
      onAfChangeItem={(e: CustomEvent) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const item = (e.detail as any)?.item;
        if (item?.onClick) item.onClick();
      }}
    />
  );
};
