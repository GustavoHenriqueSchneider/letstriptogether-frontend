import { useNavigate } from 'react-router-dom';
import { LoginScreen } from '@/components/AuthScreens';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/api/auth';
import { useModalStore } from '@/store/modalStore';
import { usersApi } from '@/services/api/users';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showError, openModal, closeModal } = useModalStore();

  const handleNavigate = (screen: string) => {
    navigate(`/${screen}`);
  };

  const handleLogin = async (email: string, password: string) => {
    openModal('loading');
    
    try {
      const response = await authApi.login(email, password);
      
      await login(
        response.user,
        response.accessToken,
        response.sessionId,
        response.refreshToken,
        true
      );

      await useAuthStore.getState().fetchUserPreferences();
      
      closeModal('loading');
      
      setTimeout(() => {
        if (!window.location.pathname.includes('/preferences')) {
          navigate('/dashboard');
        }
      }, 150);
    } catch (error: any) {
      closeModal('loading');
      showError('Erro ao fazer login', 'Credenciais inválidas, por favor, tente novamente!');
    }
  };

  return <LoginScreen onNavigate={handleNavigate} onLogin={handleLogin} />;
}

