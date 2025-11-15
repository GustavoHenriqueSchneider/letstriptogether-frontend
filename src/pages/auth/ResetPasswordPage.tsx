import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ResetPasswordScreen } from '@/components/AuthScreens';
import { isTokenExpired } from '@/utils/jwt';
import { useModalStore } from '@/store/modalStore';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showError } = useModalStore();
  const [initialToken, setInitialToken] = useState<string | null>(() => {
    return searchParams.get('token');
  });

  useEffect(() => {
    const token = searchParams.get('token');
    setInitialToken(token);
  }, [searchParams]);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      if (isTokenExpired(token)) {
        showError(
          'Token expirado',
          'Por favor, solicite um novo e-mail de recuperação!',
          () => {
            navigate('/login');
          }
        );
        setInitialToken(null);
      }
    }
  }, [searchParams, navigate, showError]);

  const handleNavigate = (screen: string) => {
    navigate(`/${screen}`);
  };

  return <ResetPasswordScreen onNavigate={handleNavigate} initialToken={initialToken} />;
}

