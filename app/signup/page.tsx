'use client';

import React from 'react';
import { AuthLayout, SignupFormContent, GuestGuard } from '@/components';

/**
 * Signup page component
 * @returns Signup form with authentication
 */
export default function SignupPage(): React.ReactElement {
  return (
    <GuestGuard>
      <AuthLayout
        title="Create an account"
        subtitle="Start managing your tasks efficiently today"
        type="signup"
      >
        <SignupFormContent />
      </AuthLayout>
    </GuestGuard>
  );
}