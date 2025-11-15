import { useNavigate, useParams } from 'react-router-dom';
import { VotingScreen } from '@/components/VotingScreen';
import { groupsApi } from '@/services/api/groups';
import { useState, useEffect } from 'react';

export default function VotingPage() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const [groupName, setGroupName] = useState<string>('');

  if (!groupId) {
    navigate('/dashboard');
    return null;
  }

  useEffect(() => {
    const loadGroupName = async () => {
      try {
        const group = await groupsApi.getById(groupId);
        setGroupName(group.name);
      } catch (error) {
      }
    };
    loadGroupName();
  }, [groupId]);

  const handleNavigate = (screen: string) => {
    if (screen.startsWith('groups/')) {
      navigate(`/${screen}`);
    } else if (screen.startsWith('/')) {
      navigate(screen);
    } else {
      const routeMap: { [key: string]: string } = {
        'group-members': `groups/${groupId}/members`,
        'group-vote': `groups/${groupId}/vote`,
        'group-matches': `groups/${groupId}/matches`,
        'group-settings': `groups/${groupId}/settings`,
        'dashboard': 'dashboard',
        'preferences': 'preferences'
      };
      navigate(`/${routeMap[screen] || screen}`);
    }
  };

  return <VotingScreen groupId={groupId} groupName={groupName} onNavigate={handleNavigate} />;
}

