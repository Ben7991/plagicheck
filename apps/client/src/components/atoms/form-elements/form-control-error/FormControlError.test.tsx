import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import FormControlError from './FormControlError';

describe('FormControlError.tsx', () => {
  it('should render FormControlError component', () => {
    render(<FormControlError message="Name is required" />);
    const element = screen.getByText(/name/i);
    expect(element).toBeInTheDocument();
  });

  it('should have a class of text-[var(--error-100)]', () => {
    render(<FormControlError message="Name is required" />);
    const element = screen.getByText(/name/i);
    expect(element).toHaveClass('text-[var(--error-100)]');
  });
});
