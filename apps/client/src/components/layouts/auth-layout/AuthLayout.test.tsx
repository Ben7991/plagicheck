import { render, screen } from '@testing-library/react';
import { TextEncoder } from 'util';
import '@testing-library/jest-dom';

global.TextEncoder = TextEncoder;

import AuthLayout from './AuthLayout';

describe('AuthLayout', () => {
  it('should render AuthLayout component', () => {
    render(<AuthLayout />);
    expect(screen.getByRole('main')).toBeDefined();
  });
});
