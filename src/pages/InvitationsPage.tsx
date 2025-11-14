import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { invitationsApi } from '@/services/api/invitations';
import { useModalStore } from '@/store/modalStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import backgroundImage from 'figma:asset/9461ca4209b21dd0f47647fbada0c1c80b8c5f4a.png';

type InvitationState =
  | { status: 'loading' }
  | { status: 'expired' }
  | { status: 'ready'; groupName: string; createdBy: string };

export default function InvitationsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const { showError } = useModalStore();

  const token = useMemo(() => new URLSearchParams(location.search).get('token')?.trim(), [location.search]);
  const [invitationState, setInvitationState] = useState<InvitationState>({ status: 'loading' });
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Sem token -> volta pra landing
  useEffect(() => {
    if (token === undefined) return;
    if (!token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  // Usuário precisa estar logado
  useEffect(() => {
    if (!token || !isInitialized) return;
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [token, isAuthenticated, isInitialized, navigate]);

  // Carregar informações do convite
  useEffect(() => {
    const fetchInvitation = async () => {
      if (!token || !isAuthenticated || !isInitialized) return;

      try {
        const invitation = await invitationsApi.getInvitation(token);
        if (!invitation.isActive) {
          setInvitationState({ status: 'expired' });
          return;
        }
        setInvitationState({
          status: 'ready',
          groupName: invitation.groupName,
          createdBy: invitation.createdBy,
        });
      } catch (error: any) {
        console.error('[InvitationsPage] Failed to load invitation:', error);
        setInvitationState({ status: 'expired' });
      }
    };

    fetchInvitation();
  }, [token, isAuthenticated, isInitialized]);

  const handleAction = async (action: 'accept' | 'refuse') => {
    if (!token) return;
    setIsActionLoading(true);
    try {
      if (action === 'accept') {
        await invitationsApi.acceptInvitation(token);
      } else {
        await invitationsApi.refuseInvitation(token);
      }
    } catch (error: any) {
      console.error('[InvitationsPage] Failed to process invitation:', error);
      showError(
        'Erro no convite',
        'Houve um erro ao processar o convite. Tente novamente mais tarde!'
      );
    } finally {
      setIsActionLoading(false);
      navigate('/dashboard', { replace: true });
    }
  };

  if (!token || !isInitialized || (!isAuthenticated && token)) {
    return null;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm transition-opacity duration-500 opacity-100"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0E0652]/90 via-[#130F61]/85 to-[#002F76]/90" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 text-white space-y-2">
          <h1 className="text-4xl font-bold">Let's Trip Together</h1>
          <p className="text-gray-300 mt-4">Encontre destinos perfeitos com seus amigos.</p>
        </div>

        <Card className="shadow-2xl border-0">
          {invitationState.status === 'ready' && (
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#01001D]">Convite de Grupo</CardTitle>
            </CardHeader>
          )}
          <CardContent>
            {invitationState.status === 'loading' && (
              <div className="flex flex-col items-center gap-4 py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E0652]" />
                <p className="text-gray-600 text-sm text-center">Carregando convite...</p>
              </div>
            )}

            {invitationState.status === 'expired' && (
              <div className="text-center space-y-4 py-6">
                <p className="text-lg font-semibold text-[#01001D]">Convite expirado</p>
                <p className="text-gray-600 text-sm">
                  O link deste convite não está mais ativo. Solicite um novo convite ao administrador do grupo.
                </p>
                <Button
                  className="bg-[#0E0652] hover:bg-[#130F61] text-white px-8 py-3 text-sm"
                  onClick={() => navigate('/dashboard', { replace: true })}
                >
                  Voltar
                </Button>
              </div>
            )}

            {invitationState.status === 'ready' && (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-bold text-[#01001D]">{invitationState.groupName}</h2>
                  <p className="text-gray-600 text-sm">
                    Você foi convidado por <span className="font-semibold text-[#0E0652]">{invitationState.createdBy}</span>.
                  </p>
                  <p className="text-gray-600 text-sm">Deseja aceitar este convite?</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={isActionLoading}
                    onClick={() => handleAction('refuse')}
                  >
                    Não
                  </Button>
                  <Button
                    className="flex-1 bg-[#0E0652] hover:bg-[#130F61]"
                    disabled={isActionLoading}
                    onClick={() => handleAction('accept')}
                  >
                    Sim
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

