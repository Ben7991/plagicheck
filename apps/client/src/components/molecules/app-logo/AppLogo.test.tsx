import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import AppLogo from './AppLogo';

describe('AppLogo.tsx', () => {
  it('should render AppLogo component', () => {
    render(<AppLogo />);
    expect(screen.getByRole('heading')).toHaveTextContent('Plagicheck');
  });
});
