import { useNavigate } from 'react-router-dom';
import { ChangePasswordScreen } from '@/components/ChangePasswordScreen';

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const handleNavigate = (screen: string) => {
    navigate(`/${screen}`);
  };

  return <ChangePasswordScreen onNavigate={handleNavigate} />;
}

