import { useNavigate, useParams } from 'react-router-dom';
import { MembersScreen } from '@/components/MembersScreen';
import { useModalStore } from '@/store/modalStore';
import { groupsApi } from '@/services/api/groups';
import { useState, useEffect, useRef } from 'react';

export default function MembersPage() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { openModal, showError } = useModalStore();
  const [groupName, setGroupName] = useState<string>('');
  const [has404, setHas404] = useState(false);
  const hasHandled404 = useRef(false);

  if (!groupId) {
    navigate('/dashboard');
    return null;
  }

  if (has404) {
    navigate('/dashboard');
    return null;
  }

  useEffect(() => {
    let isMounted = true;
    hasHandled404.current = false;
    const loadGroupName = async () => {
      try {
        const group = await groupsApi.getById(groupId);
        if (isMounted) {
          setGroupName(group.name);
        }
      } catch (error: any) {
        if (isMounted && error.response?.status === 404 && !hasHandled404.current) {
          hasHandled404.current = true;
          setHas404(true);
          showError(
            'Grupo não encontrado',
            'O grupo que você está tentando acessar não foi encontrado.',
            () => {
              navigate('/dashboard');
            }
          );
        }
      }
    };
    loadGroupName();
    
    return () => {
      isMounted = false;
    };
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
        'dashboard': 'dashboard'
      };
      navigate(`/${routeMap[screen] || screen}`);
    }
  };

  const showInviteLink = () => {
    openModal('inviteLink', { groupId });
  };

  return <MembersScreen groupId={groupId} groupName={groupName} onNavigate={handleNavigate} showInviteLink={showInviteLink} />;
}

