import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Avatar from './Avatar';

describe('Avatar.tsx', () => {
  it('should render Avatar component', () => {
    render(<Avatar name="James Smith" imagePath="image.jpg" />);
    const element = screen.getByRole('paragraph');
    expect(element).toBeInTheDocument();
  });

  it('should have img tag in the DOM when the imagePath is provided', () => {
    render(<Avatar name="James Smith" imagePath="image.jpg" />);
    const element = screen.getByRole('img');
    expect(element).toBeInTheDocument();
  });

  it('should have img tag in the DOM when the imagePath is null', () => {
    render(<Avatar name="James Smith" imagePath={null} />);
    const element = screen.queryByRole('img');
    expect(element).not.toBeInTheDocument();
  });
});
