import { useNavigate } from 'react-router-dom';
import { ProfileScreen } from '@/components/ProfileScreen';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { showSuccess, showConfirmation, openModal } = useModalStore();

  const handleNavigate = (screen: string) => {
    navigate(`/${screen}`);
  };

  const handleLogout = () => {
    openModal('logout');
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
    showSuccess('Você foi desconectado com sucesso!');
  };

  return (
    <ProfileScreen
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      showSuccess={showSuccess}
      showConfirmation={showConfirmation}
    />
  );
}

