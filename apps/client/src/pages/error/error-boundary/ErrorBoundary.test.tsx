import { render, screen } from '@testing-library/react';
import { TextEncoder } from 'util';
import '@testing-library/jest-dom';

global.TextEncoder = TextEncoder;

import ErrorBoundary from './ErrorBoundary';

describe('ErrorBoundary.tsx', () => {
  it('should render ErrorBoundary component', () => {
    render(<ErrorBoundary message="testing" />);
    const paragraphElement = screen.getByRole('paragraph');
    expect(paragraphElement).toBeInTheDocument();
  });
});
