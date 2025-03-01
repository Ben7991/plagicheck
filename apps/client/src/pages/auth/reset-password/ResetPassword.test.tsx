import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

import { MemoryRouter } from 'react-router-dom';
import ResetPassword from './ResetPassword';

describe('ResetPassword', () => {
  it('should render ResetPassword component', () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>,
    );
    const headingElement = screen.getByRole('heading', {
      name: /reset password/i,
    });
    expect(headingElement).toBeInTheDocument();
  });
});
