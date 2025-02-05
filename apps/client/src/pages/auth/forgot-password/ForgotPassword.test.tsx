import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

import { MemoryRouter } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';

describe('ForgotPassword', () => {
  it('should render ForgotPassword component', () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>,
    );
    const headingElement = screen.getByRole('heading', {
      name: /forgot password/i,
    });
    expect(headingElement).toBeInTheDocument();
  });
});
