import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Modal from './Modal';

describe('Modal.tsx', () => {
  it('should render Modal component', () => {
    render(
      <Modal onHide={() => {}} title="Test">
        Testing
      </Modal>,
    );
    const element = screen.getByRole('heading', { name: 'Test' });
    expect(element).toBeInTheDocument();
  });

  it('should have called onHide from button event click', async () => {
    const mockOnHide = jest.fn();
    render(
      <Modal onHide={mockOnHide} title="Test">
        Testing
      </Modal>,
    );
    const element = screen.getByRole('button');
    await userEvent.click(element);

    expect(mockOnHide).toHaveBeenCalled();
  });
});
