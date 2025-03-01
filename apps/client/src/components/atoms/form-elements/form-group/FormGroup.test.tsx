import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import FormGroup from './FormGroup';

describe('FormGroup.tsx', () => {
  it('should render FormGroup component', () => {
    render(<FormGroup>Testing</FormGroup>);
    expect(screen.getByText('Testing')).toBeDefined();
  });
});
