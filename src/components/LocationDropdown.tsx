import { DigiContextMenu } from "@digi/arbetsformedlingen-react";

export const LocationDropdown = () => {
  const menuItems = [
    { id: 0, title: "Alla orter" },
    { id: 1, title: "Distans (remote)" },
    { id: 2, title: "Hybrid" },
  ];

  return (
    <DigiContextMenu
      afTitle="Välj ort"
      afMenuItems={menuItems}
      onAfChangeItem={() => {}}
    ></DigiContextMenu>
  );
};

<div>LocationDropdown</div>;
