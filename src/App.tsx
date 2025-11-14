import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { 
  LoadingPopup, 
  SuccessPopup, 
  ErrorPopup, 
  ConfirmationPopup, 
  LogoutPopup,
  InfoPopup,
  DeleteConfirmationPopup,
  InviteLinkPopup
} from './components/Popups';
import { useModalStore } from './store/modalStore';
import { useAuthStore } from './store/authStore';
import { useWebSocket } from './hooks/useWebSocket';

function ModalProvider() {
  // No Zustand, acessamos o estado diretamente do hook
  const loading = useModalStore((state) => state.loading);
  const success = useModalStore((state) => state.success);
  const error = useModalStore((state) => state.error);
  const confirmation = useModalStore((state) => state.confirmation);
  const logout = useModalStore((state) => state.logout);
  const info = useModalStore((state) => state.info);
  const deleteModal = useModalStore((state) => state.delete);
  const inviteLinkModal = useModalStore((state) => state.inviteLink);
  const closeModal = useModalStore((state) => state.closeModal);

  const handleConfirmation = () => {
    if (confirmation.onConfirm) {
      confirmation.onConfirm();
    }
    closeModal('confirmation');
  };

  const handleLogout = () => {
    const { logout: logoutAction } = useAuthStore.getState();
    logoutAction();
    closeModal('logout');
  };

  const handleDelete = () => {
    // Executar a confirmação primeiro, depois fechar
    if (deleteModal.onConfirm) {
      deleteModal.onConfirm();
    }
    // Fechar o modal imediatamente após a confirmação
    closeModal('delete');
  };

  const handleDeleteClose = () => {
    // Quando o usuário fecha sem confirmar, apenas fechar
    closeModal('delete');
  };

  return (
    <>
      <LoadingPopup isOpen={loading} />
      <SuccessPopup 
        isOpen={success.show} 
        title={success.title}
        message={success.message}
        onClose={() => closeModal('success')}
        onConfirm={success.onClose || undefined}
      />
      <ErrorPopup 
        isOpen={error.show} 
        title={error.title}
        message={error.message}
        onClose={() => closeModal('error')}
        onConfirm={error.onClose || undefined}
      />
      <ConfirmationPopup 
        isOpen={confirmation.show} 
        title={confirmation.title}
        message={confirmation.message}
        onClose={() => closeModal('confirmation')}
        onConfirm={handleConfirmation}
      />
      <LogoutPopup 
        isOpen={logout} 
        onClose={() => closeModal('logout')}
        onConfirm={handleLogout}
      />
      <InfoPopup 
        isOpen={info.show} 
        title={info.title}
        message={info.message}
        onClose={() => closeModal('info')}
      />
      <DeleteConfirmationPopup 
        isOpen={deleteModal.show} 
        title={deleteModal.title}
        message={deleteModal.message}
        onClose={handleDeleteClose}
        onConfirm={handleDelete}
      />
      <InviteLinkPopup 
        isOpen={inviteLinkModal.show} 
        groupId={inviteLinkModal.groupId || ''}
        onClose={() => closeModal('inviteLink')}
      />
    </>
  );
}

function WebSocketProvider() {
  useWebSocket();
  return null;
}

export default function App() {
  console.log('[App] Component rendering');
  // Usar o hook do Zustand para reagir a mudanças no estado
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // Log para depuração
  React.useEffect(() => {
    console.log('[App] useEffect - State changed:');
    console.log('  - isInitialized:', isInitialized);
    console.log('  - isAuthenticated:', isAuthenticated);
  }, [isInitialized, isAuthenticated]);
  
  // Garantir que a inicialização foi concluída antes de renderizar
  React.useEffect(() => {
    console.log('[App] useEffect - Checking initialization status:', isInitialized);
    // Se ainda não foi inicializado, chamar init
    // (o init() já foi chamado no main.tsx, mas garantimos aqui também)
    if (!isInitialized) {
      console.log('[App] Not initialized, calling init()...');
      useAuthStore.getState().init();
    } else {
      console.log('[App] Already initialized');
    }
  }, [isInitialized]);

  // Mostrar loading enquanto não estiver inicializado
  if (!isInitialized) {
    console.log('[App] Rendering: Loading screen (waiting for initialization)');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E0652]"></div>
      </div>
    );
  }

  console.log('[App] Rendering: Main app (router, modals, websocket)');
  console.log('[App] Current pathname:', window.location.pathname);
  return (
    <div className="min-h-screen bg-gray-50">
      <RouterProvider router={router} />
      <ModalProvider />
      <WebSocketProvider />
    </div>
  );
}
