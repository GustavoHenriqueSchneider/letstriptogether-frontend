import { useNavigate } from 'react-router-dom';
import { RegisterScreen } from '@/components/AuthScreens';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleNavigate = (screen: string) => {
    navigate(`/${screen}`);
  };

  return <RegisterScreen onNavigate={handleNavigate} />;
}

