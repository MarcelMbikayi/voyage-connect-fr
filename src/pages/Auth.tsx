import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useNavigate, useLocation } from 'react-router-dom';

type AuthMode = 'signin' | 'signup' | 'forgot-password';

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthSuccess = () => {
    // Redirect to the page they were trying to access, or home
    const from = location.state?.from || '/';
    navigate(from, { replace: true });
  };

  const renderForm = () => {
    switch (mode) {
      case 'signin':
        return (
          <SignInForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignUp={() => setMode('signup')}
            onForgotPassword={() => setMode('forgot-password')}
          />
        );
      case 'signup':
        return (
          <SignUpForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignIn={() => setMode('signin')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onBack={() => setMode('signin')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-12 px-4">
          <div className="max-w-md mx-auto">
            {renderForm()}
          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
};

export default AuthPage;