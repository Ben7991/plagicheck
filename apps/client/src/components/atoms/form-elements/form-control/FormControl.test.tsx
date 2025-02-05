import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import FormControl from './FormControl';

describe('FormControl.tsx', () => {
  it('should render FormControl component', () => {
    render(<FormControl type="text" placeholder="Enter your email" />);
    expect(screen.getByPlaceholderText('Enter your email')).toBeDefined();
  });
});
