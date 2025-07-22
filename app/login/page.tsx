import React from 'react';
import { AuthLayout, LoginFormContent, GuestGuard } from '@/components';

/**
 * Login page component
 * @returns Login form with authentication
 */
export default function LoginPage(): React.ReactElement {
  return (
    <GuestGuard>
      <AuthLayout
        title="Welcome back"
        subtitle="Enter your credentials to access your account"
        type="login"
      >
        <LoginFormContent />
      </AuthLayout>
    </GuestGuard>
  );
}
