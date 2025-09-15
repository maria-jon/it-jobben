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
    {
      id: 3,
      title: "Stockholm",
      onClick: () => {
        const usp = new URLSearchParams(location.search);
        usp.delete("remote");
        usp.set("municipality", "Stockholm");
        navigate(`/search?${usp.toString()}`, { replace: true });
      },
    },
    {
      id: 4,
      title: "Göteborg",
      onClick: () => {
        const usp = new URLSearchParams(location.search);
        usp.delete("remote");
        usp.set("municipality", "Göteborg");
        navigate(`/search?${usp.toString()}`, { replace: true });
      },
    },
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
