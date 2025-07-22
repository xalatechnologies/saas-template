'use client';

import React from 'react';
import { AuthLayout, SignupFormContent } from '@/components';

/**
 * Signup page component
 * @returns Signup form with authentication
 */
export default function SignupPage(): React.ReactElement {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start managing your tasks efficiently today"
      type="signup"
    >
      <SignupFormContent />
    </AuthLayout>
  );
}