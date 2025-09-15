import { DigiContextMenu } from "@digi/arbetsformedlingen-react";
import { useLocation, useNavigate } from "react-router-dom";

// Define type for menu items
type MenuItem = {
  id: number;
  title: string;
  onClick?: () => void;
};

// Dropdown for selecting job location filters
export const LocationDropdown = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Mapping of municipality names to their codes
  const MUNICIPALITY_CODE: Record<string, string> = {
    Stockholm: "0180",
    Göteborg: "1480",
    Malmö: "1280",
    Uppsala: "0380",
    Västerås: "1980",
  };

  // Function to set municipality filter in URL
  const setMunicipality = (city: keyof typeof MUNICIPALITY_CODE) => {
    const usp = new URLSearchParams(location.search);
    usp.delete("remote");
    usp.set("municipality", MUNICIPALITY_CODE[city]);
    navigate(`/search?${usp.toString()}`, { replace: true });
  };

  // Define menu items with corresponding URL updates
  const menuItems: MenuItem[] = [
    {
      id: 0,
      title: "Alla orter",
      onClick: () => {
        const usp = new URLSearchParams(location.search);
        usp.delete("municipality");
        usp.delete("remote");
        navigate(`/search?${usp.toString()}`, { replace: true });
      },
    },
    {
      id: 1,
      title: "Distans (remote)",
      onClick: () => {
        const usp = new URLSearchParams(location.search);
        usp.delete("municipality");
        usp.set("remote", "true");
        navigate(`/search?${usp.toString()}`, { replace: true });
      },
    },
    {
      id: 2,
      title: "Hybrid",
      onClick: () => {
        const usp = new URLSearchParams(location.search);
        usp.delete("municipality");
        usp.set("remote", "hybrid");
        navigate(`/search?${usp.toString()}`, { replace: true });
      },
    },
    { id: 3, title: "Stockholm", onClick: () => setMunicipality("Stockholm") },
    { id: 4, title: "Göteborg", onClick: () => setMunicipality("Göteborg") },
  ];

  // Render the context menu with location options
  return (
    <DigiContextMenu
      afTitle="Efter stad"
      afMenuItems={menuItems}
      onAfChangeItem={(e: CustomEvent) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const item = (e.detail as any)?.item;
        item?.onClick?.();
      }}
    />
  );
};
