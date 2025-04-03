import { render, screen } from '@testing-library/react';
import { TextEncoder } from 'util';
import '@testing-library/jest-dom';

global.TextEncoder = TextEncoder;

import Button from './Button';

describe('Button.tsx', () => {
  it('should render Button component', () => {
    render(<Button el="button" variant="primary" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should have class bg-[var(--sea-blue-100)] when primary variant is selected', () => {
    render(<Button el="button" variant="primary" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-[var(--sea-blue-100)]');
  });

  it('should have class bg-[var(--error-100)] when danger variant is selected', () => {
    render(<Button el="button" variant="danger" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-[var(--error-100)]');
  });

  it('should have class bg-white when secondary variant is selected', () => {
    render(<Button el="button" variant="secondary" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-white');
  });
});
