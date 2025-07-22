import React from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components';

/**
 * Metadata for the login page
 */
export const metadata: Metadata = {
  title: 'Logg inn',
  description: 'Logg inn på din konto',
};

/**
 * Login page component
 * @returns Login form with authentication
 */
export default function LoginPage(): React.ReactElement {
  // Login page uses LoginForm component which handles its own layout
  // This is an exception to BasePage usage since login is a special case
  return <LoginForm />;
}
