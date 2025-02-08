import { renderHook, waitFor } from '@testing-library/react';
import { useAlert } from './useAlert';

describe('useAlert.ts', () => {
  it('should have a state of true when showAlert is called', async () => {
    const { result } = renderHook(useAlert);
    result.current.showAlert();
    await waitFor(() => {
      expect(result.current.alertState).toBeTruthy();
    });
  });

  it('should have a state of false when hideAlert is called', async () => {
    const { result } = renderHook(useAlert);
    result.current.hideAlert();
    await waitFor(() => {
      expect(result.current.alertState).toBeFalsy();
    });
  });
});
