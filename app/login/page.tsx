import React from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components';

export const metadata: Metadata = {
  title: 'Logg inn - Task Management',
  description: 'Logg inn på din Task Management konto',
};

export default function LoginPage(): JSX.Element {
  // Login page uses LoginForm component which handles its own layout
  // This is an exception to BasePage usage since login is a special case
  return <LoginForm />;
}