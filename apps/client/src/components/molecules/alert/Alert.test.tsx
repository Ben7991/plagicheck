import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import Alert from './Alert';
import { AlertVariant } from '../../../util/enum/alert-variant.enum';

describe('Alert.tsx', () => {
  it('should render Alert component', () => {
    render(
      <Alert
        message="New member added"
        variant={AlertVariant.SUCCESS}
        onHide={() => {}}
      />,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('should render Alert component with red border when variant is error', () => {
    render(
      <Alert
        message="New member added"
        variant={AlertVariant.ERROR}
        onHide={() => {}}
      />,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-[var(--error-500)]');
  });

  it('should render Alert component with green border when variant is success', () => {
    render(
      <Alert
        message="New member added"
        variant={AlertVariant.SUCCESS}
        onHide={() => {}}
      />,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-[var(--success-700)]');
  });

  it('should render Alert component with svg labelled close when variant is error', () => {
    render(
      <Alert
        message="New member added"
        variant={AlertVariant.ERROR}
        onHide={() => {}}
      />,
    );
    const alert = screen.getByRole('alert');
    const svg = within(alert).getByLabelText(/close/i);
    expect(svg).toBeInTheDocument();
  });

  it('should render Alert component with svg labelled check when variant is success', () => {
    render(
      <Alert
        message="New member added"
        variant={AlertVariant.SUCCESS}
        onHide={() => {}}
      />,
    );
    const alert = screen.getByRole('alert');
    const svg = within(alert).getByLabelText(/check/i);
    expect(svg).toBeInTheDocument();
  });
});
