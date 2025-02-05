import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import AuthDescriptor from './AuthDescriptor';

describe('AuthDescriptor', () => {
  it('should render AuthDescriptor component', () => {
    render(<AuthDescriptor title="Login" info="Getting started" />);
    expect(screen.getByRole('paragraph')).toHaveTextContent('Getting started');
  });
});
