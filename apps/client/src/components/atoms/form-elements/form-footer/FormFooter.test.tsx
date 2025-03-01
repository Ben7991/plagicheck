import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import FormFooter from './FormFooter';

describe('FormFooter.tsx', () => {
  it('should render FormFooter component', () => {
    render(<FormFooter>Testing</FormFooter>);
    expect(screen.getByText('Testing')).toBeDefined();
  });
});
