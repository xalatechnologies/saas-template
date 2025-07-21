'use client';

import React from 'react';
import { LoginForm } from '@/components';

/**
 * Login page component
 * @returns Login form with authentication
 */
export default function LoginPage(): React.ReactElement {
  // Login page uses LoginForm component which handles its own layout
  // This is an exception to BasePage usage since login is a special case
  return <LoginForm />;
}