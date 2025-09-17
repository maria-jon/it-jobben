import { DigiContextMenu } from "@digi/arbetsformedlingen-react";

type HandleSortingProps = {
  onSort: (queryParams: string) => void;
};

export const SortingDropdown = ({ onSort }: HandleSortingProps) => {

const applyDateAsc = import.meta.env.VITE_SORT_APPLYDATE_ASC;
const pubDateAsc = import.meta.env.VITE_SORT_PUBDATE_ASC;
const pubDateDesc  = import.meta.env.VITE_SORT_PUBDATE_DESC;


const menuItems = [
    { id: 0, title: "Ansökningsdatum", onClick: () => onSort(applyDateAsc)},
    { id: 1, title: "Publiceringsdatum (äldst först)", onClick: () => onSort(pubDateAsc)},
    { id: 2, title: "Publiceringsdatum (nyast först)", onClick: () => onSort(pubDateDesc)},
  ];

return (
      <DigiContextMenu
        afTitle="Sortera efter"
        afMenuItems={menuItems}
        onAfChangeItem={(e: CustomEvent) => {
          const clickedItem = e.detail.item;
          clickedItem.onClick?.(); 
        }}>
      </DigiContextMenu>
  )
}