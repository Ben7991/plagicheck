import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';

import MultiSelect from './MultiSelect';
import { Item } from './multi-select.util';

const mockList = [
  { id: 1, name: 'Faculty of Law' },
  { id: 2, name: 'Faculty of Arts' },
  { id: 3, name: 'Faculty of Business' },
];

let mockSelectedItem: Item | undefined;

const mockOnSelectItem = jest.fn((value: Item) => {
  mockSelectedItem = { ...value };
});

describe('MultiSelect.tsx', () => {
  beforeEach(() => {
    mockSelectedItem = undefined;
  });

  it('should render MultiSelect component', () => {
    render(
      <MultiSelect
        placeholderText="Testing..."
        list={mockList}
        selectedItem={mockSelectedItem}
        onSelectItem={mockOnSelectItem}
      />,
    );
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should not show the list when the button is not clicked', async () => {
    render(
      <MultiSelect
        placeholderText="Testing..."
        list={mockList}
        selectedItem={mockSelectedItem}
        onSelectItem={mockOnSelectItem}
      />,
    );

    const element = screen.queryByText('Faculty of Law');

    expect(element).not.toBeInTheDocument();
  });

  it('should show the list when the button is clicked', async () => {
    render(
      <MultiSelect
        placeholderText="Testing..."
        list={mockList}
        selectedItem={mockSelectedItem}
        onSelectItem={mockOnSelectItem}
      />,
    );
    const button = screen.getByRole('button');
    await userEvent.click(button);
    const element = screen.getByText('Faculty of Law');

    expect(element).toBeInTheDocument();
  });

  it('should select an item when a label is clicked', async () => {
    render(
      <MultiSelect
        placeholderText="Testing..."
        list={mockList}
        selectedItem={mockSelectedItem}
        onSelectItem={mockOnSelectItem}
      />,
    );

    const button = screen.getByRole('button');
    await userEvent.click(button);

    const element = screen.getByLabelText('Faculty of Law');
    await userEvent.click(element);

    expect(mockSelectedItem).not.toBeUndefined();
    expect(mockSelectedItem?.name).toBe('Faculty of Law');
  });
});
