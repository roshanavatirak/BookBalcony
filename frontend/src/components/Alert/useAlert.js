import { useState, useCallback } from 'react';

/**
 * Custom Hook to manage alerts
 * 
 * Usage:
 * const { alert, showAlert, hideAlert } = useAlert();
 * 
 * showAlert({
 *   type: 'success',
 *   title: 'Success!',
 *   message: 'Operation completed successfully'
 * });
 */

export const useAlert = () => {
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback(({
    type = 'info',
    title = '',
    message = '',
    duration = 5000,
    position = 'top-right',
    autoClose = true
  }) => {
    setAlert({
      type,
      title,
      message,
      duration,
      position,
      autoClose
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  // Helper methods for different alert types
  const success = useCallback((message, title = 'Success!') => {
    showAlert({
      type: 'success',
      title,
      message
    });
  }, [showAlert]);

  const error = useCallback((message, title = 'Error!') => {
    showAlert({
      type: 'error',
      title,
      message
    });
  }, [showAlert]);

  const warning = useCallback((message, title = 'Warning!') => {
    showAlert({
      type: 'warning',
      title,
      message
    });
  }, [showAlert]);

  const info = useCallback((message, title = 'Info') => {
    showAlert({
      type: 'info',
      title,
      message
    });
  }, [showAlert]);

  return {
    alert,
    showAlert,
    hideAlert,
    success,
    error,
    warning,
    info
  };
};