import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';

import PasswordToggler from './PasswordToggler';

describe('PasswordToggler.tsx', () => {
  let state = false;
  const toggleState = () => {
    state = !state;
  };

  beforeEach(() => {
    state = false;
  });

  it('should render PasswordToggler component', () => {
    render(<PasswordToggler state={state} toggle={toggleState} />);
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('should change state value when button is clicked', async () => {
    render(<PasswordToggler state={state} toggle={toggleState} />);
    await userEvent.click(screen.getByRole('button'));
    expect(state).toBe(true);
  });
});
