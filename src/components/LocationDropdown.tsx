import { DigiContextMenu } from "@digi/arbetsformedlingen-react";
import { useLocation, useNavigate } from "react-router-dom";

export const LocationDropdown = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 0, title: "Alla orter" },
    { id: 1, title: "Distans (remote)" },
    { id: 2, title: "Hybrid" },
  ];

  return (
    <DigiContextMenu
      afTitle="Välj ort"
      afMenuItems={menuItems}
      onAfChangeItem={() => {
        console.log("clicked item", location, navigate);
      }}
    ></DigiContextMenu>
  );
};

<div>LocationDropdown</div>;
