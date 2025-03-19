import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Backdrop from './Backdrop';

const mockOnHide = jest.fn();

describe('Backdrop.tsx', () => {
  it('should render the Backdrop component', () => {
    const { container } = render(<Backdrop onHide={mockOnHide} />);
    const element = container.querySelector('.w-full');
    expect(element).toBeInTheDocument();
  });

  it("should ensure mockedOnHide get's called when clicked upon", async () => {
    const { container } = render(<Backdrop onHide={mockOnHide} />);
    const element = container.querySelector('.w-full');
    await userEvent.click(element!);
    expect(mockOnHide).toHaveBeenCalled();
  });
});
