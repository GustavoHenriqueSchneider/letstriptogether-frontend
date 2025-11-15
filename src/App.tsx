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
    if (deleteModal.onConfirm) {
      deleteModal.onConfirm();
    }
    closeModal('delete');
  };

  const handleDeleteClose = () => {
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
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  React.useEffect(() => {
  }, [isInitialized, isAuthenticated]);
  
  React.useEffect(() => {
    if (!isInitialized) {
      useAuthStore.getState().init();
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E0652]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RouterProvider router={router} />
      <ModalProvider />
      {isAuthenticated && <WebSocketProvider />}
    </div>
  );
}
