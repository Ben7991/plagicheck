export type Item = { id: number; name: string };

export type MultiSelectProps = {
  list: Item[];
  selectedItem?: Item;
  onSelectItem: (item: Item) => void;
};
