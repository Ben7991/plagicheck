import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextEncoder } from 'util';
import '@testing-library/jest-dom';

global.TextEncoder = TextEncoder;

import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { FormEvent } from 'react';

afterEach(cleanup);

describe('Login.tsx', () => {
  let isCalled = false;
  const mockHandleSubmit = jest
    .fn()
    .mockImplementation((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData);

      if (data.username !== ' ' && data.password !== ' ') {
        isCalled = true;
      }
    });

  beforeEach(() => (isCalled = false));

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

  it('should ensure that the password can be viewed when the eye button is clicked', async () => {
    const { container } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const eyeButton = container.querySelector(
      'div > form > div:nth-child(2) > div > button',
    )!;
    await userEvent.click(eyeButton);
    const passwordInput = screen.getByPlaceholderText(
      /type your password/i,
    ) as HTMLInputElement;

    expect(passwordInput.type).toBe('text');
  });

  it('should not submit the form when the input fields are empty', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const emailInput = screen.getByPlaceholderText(/your email/i);
    await userEvent.click(emailInput);
    await userEvent.keyboard(' ');

    const passwordInput = screen.getByPlaceholderText(/type your password/i);
    await userEvent.click(passwordInput);
    await userEvent.keyboard(' ');

    const submitButton = screen.getByRole('button', {
      name: /login/i,
    });
    const formElement = screen.getByRole('login-form');
    formElement.onsubmit = mockHandleSubmit;

    await userEvent.click(submitButton);
    expect(isCalled).toBeFalsy();
  });

  it('should submit the form when the input fields are not empty', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const emailInput = screen.getByPlaceholderText(/your email/i);
    await userEvent.click(emailInput);
    await userEvent.keyboard('test@gmail.com');

    const passwordInput = screen.getByPlaceholderText(/type your password/i);
    await userEvent.click(passwordInput);
    await userEvent.keyboard('test123@');

    const submitButton = screen.getByRole('button', {
      name: /login/i,
    });

    const form = screen.getByRole('login-form');
    form.onsubmit = mockHandleSubmit;

    await userEvent.click(submitButton);

    expect(isCalled).toBeTruthy();
  });
});
