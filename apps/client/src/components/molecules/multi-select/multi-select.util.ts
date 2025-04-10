export type Item = { id: number; name: string };

export type MultiSelectProps = {
  list: Item[];
  selectedItem?: Item;
  placeholderText: string;
  prefix?: string;
  className?: string;
  onSelectItem: (item: Item) => void;
};
