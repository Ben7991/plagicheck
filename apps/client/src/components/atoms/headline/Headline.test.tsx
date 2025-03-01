import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Headline from './Headline';

describe('Headline', () => {
  it('should render Headline component', () => {
    render(<Headline type="h4">Testing</Headline>);
    expect(screen.getByRole('heading')).toHaveTextContent('Testing');
  });
});
