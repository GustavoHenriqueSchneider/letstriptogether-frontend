import { useNavigate } from 'react-router-dom';
import { NotificationsScreen } from '@/components/NotificationsScreen';

export default function NotificationsPage() {
  const navigate = useNavigate();

  const handleNavigate = (screen: string) => {
    navigate(`/${screen}`);
  };

  return <NotificationsScreen onNavigate={handleNavigate} />;
}

