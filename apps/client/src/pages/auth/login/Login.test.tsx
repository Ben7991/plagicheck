import { render, screen } from '@testing-library/react';
// import { UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

import Login from './Login';
import { MemoryRouter } from 'react-router-dom';

describe('Login.tsx', () => {
  it('should render Login component', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const appNameElement = screen.getByRole('heading', {
      name: /login/i,
    });
    expect(appNameElement).toBeInTheDocument();
  });
});
