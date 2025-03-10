import { useState } from 'react';

import { MultiSelectProps } from './multi-select.util';
import CaretDown from '../../atoms/icons/CaretDown';
import CaretUp from '../../atoms/icons/CaretUp';

export default function MultiSelect({
  list,
  selectedItem,
  onSelectItem,
}: MultiSelectProps) {
  const [showList, setShowList] = useState(false);

  return (
    <div className="relative">
      <button
        className="w-full border border-[var(--gray-700)] flex items-center justify-between px-4 py-[10px] rounded-lg cursor-pointer text-start"
        type="button"
        onClick={() => setShowList(!showList)}
      >
        <span className={`${!selectedItem && 'text-[var(--gray-700)]'}`}>
          {selectedItem
            ? selectedItem.name
            : 'Assign department to a faculty here'}
        </span>
        {showList ? <CaretUp /> : <CaretDown />}
      </button>
      {showList && (
        <ul className="absolute bg-white border border-[var(--gray-800)] rounded-lg shadow-lg p-4 w-full mt-1 left-0 space-y-2 max-h-[176px] overflow-y-auto">
          {list.map((item) => (
            <li key={item.id}>
              <label
                className={`flex gap-2 items-center ${selectedItem?.id === item.id && 'text-[var(--sea-blue-100)] font-medium'}`}
              >
                <input
                  type="radio"
                  name="multi-select"
                  checked={item.id === selectedItem?.id}
                  onChange={() => {
                    onSelectItem(item);
                    setShowList(false);
                  }}
                />
                {item.name}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
