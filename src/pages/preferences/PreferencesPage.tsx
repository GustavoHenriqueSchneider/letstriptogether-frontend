import { useNavigate } from 'react-router-dom';
import { PreferencesScreen } from '@/components/PreferencesScreen';

export default function PreferencesPage() {
  const navigate = useNavigate();

  const handleNavigate = (screen: string) => {
    navigate(`/${screen}`);
  };

  return <PreferencesScreen onNavigate={handleNavigate} />;
}

