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
    // Ler o token imediatamente na inicialização
    return searchParams.get('token');
  });

  useEffect(() => {
    // Atualizar quando searchParams mudar
    const token = searchParams.get('token');
    setInitialToken(token);
  }, [searchParams]);

  useEffect(() => {
    // Verificar se o token está expirado quando houver token na URL
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
        // Limpar o token para não renderizar a tela de redefinição
        setInitialToken(null);
      }
    }
  }, [searchParams, navigate, showError]);

  const handleNavigate = (screen: string) => {
    navigate(`/${screen}`);
  };

  return <ResetPasswordScreen onNavigate={handleNavigate} initialToken={initialToken} />;
}

