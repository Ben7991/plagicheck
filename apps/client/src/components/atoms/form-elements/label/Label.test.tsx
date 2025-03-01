import { render, screen } from '@testing-library/react';
import '@testing-library/react';

import Label from './Label';

describe('Label.tsx', () => {
  it('should render Label component', () => {
    render(<Label htmlFor="email">Email</Label>);
    expect(screen.getByText('Email')).toBeDefined();
  });
});
