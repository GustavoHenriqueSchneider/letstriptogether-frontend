import React, { useState } from 'react';
import { LoginScreen, RegisterScreen, ResetPasswordScreen } from './components/AuthScreens';
import { Dashboard } from './components/Dashboard';
import { VotingScreen } from './components/VotingScreen';
import { MatchesScreen } from './components/MatchesScreen';
import { MembersScreen } from './components/MembersScreen';
import { PreferencesScreen } from './components/PreferencesScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { ProfileScreen } from './components/ProfileScreen';
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

type Screen = 
  | 'login' 
  | 'register' 
  | 'reset-password' 
  | 'dashboard' 
  | 'group-voting' 
  | 'group-matches' 
  | 'group-members' 
  | 'group-preferences' 
  | 'preferences' 
  | 'notifications'
  | 'create-group'
  | 'group-details'
  | 'trip-planning'
  | 'explore'
  | 'terms-of-use'
  | 'change-password'
  | 'profile';

type PopupState = {
  loading: boolean;
  success: { isOpen: boolean; title?: string; message: string };
  error: { isOpen: boolean; title?: string; message: string };
  confirmation: { isOpen: boolean; title?: string; message: string; onConfirm?: () => void };
  logout: boolean;
  info: { isOpen: boolean; title: string; message: string };
  delete: { isOpen: boolean; title?: string; message?: string; onConfirm?: () => void };
  inviteLink: boolean;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [popups, setPopups] = useState<PopupState>({
    loading: false,
    success: { isOpen: false, message: '' },
    error: { isOpen: false, message: '' },
    confirmation: { isOpen: false, message: '' },
    logout: false,
    info: { isOpen: false, title: '', message: '' },
    delete: { isOpen: false },
    inviteLink: false
  });

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const showSuccess = (message: string, title?: string) => {
    setPopups(prev => ({ 
      ...prev, 
      success: { isOpen: true, message, title } 
    }));
  };

  const showError = (message: string, title?: string) => {
    setPopups(prev => ({ 
      ...prev, 
      error: { isOpen: true, message, title } 
    }));
  };

  const showConfirmation = (message: string, onConfirm?: () => void, title?: string) => {
    setPopups(prev => ({ 
      ...prev, 
      confirmation: { isOpen: true, message, onConfirm, title } 
    }));
  };

  const showInfo = (title: string, message: string) => {
    setPopups(prev => ({ 
      ...prev, 
      info: { isOpen: true, title, message } 
    }));
  };

  const showDeleteConfirmation = (onConfirm?: () => void, title?: string, message?: string) => {
    setPopups(prev => ({ 
      ...prev, 
      delete: { isOpen: true, onConfirm, title, message } 
    }));
  };

  const showInviteLink = () => {
    setPopups(prev => ({ 
      ...prev, 
      inviteLink: true 
    }));
  };

  const handleLogout = () => {
    setPopups(prev => ({ ...prev, logout: true }));
  };

  const confirmLogout = () => {
    setCurrentScreen('login');
    showSuccess('Você foi desconectado com sucesso!');
  };

  const closePopup = (type: keyof PopupState) => {
    setPopups(prev => ({ 
      ...prev, 
      [type]: type === 'success' || type === 'error' || type === 'info' || type === 'confirmation' || type === 'delete'
        ? { ...prev[type], isOpen: false }
        : false
    }));
  };

  // Demo functions for popup examples
  const handleDemoActions = {
    showSuccessExample: () => showSuccess('Preferências salvas com sucesso!', 'Configurações Atualizadas'),
    showErrorExample: () => showError('Não foi possível conectar ao servidor. Verifique sua conexão.', 'Erro de Conexão'),
    showConfirmationExample: () => showConfirmation(
      'Tem certeza que deseja sair deste grupo? Esta ação não pode ser desfeita.',
      () => showSuccess('Você saiu do grupo com sucesso.'),
      'Sair do Grupo'
    ),
    showInfoExample: () => showInfo(
      'Como funciona a votação?', 
      'Deslize para a direita para curtir um destino ou para a esquerda para pular. Quando todos os membros votarem, vocês verão os matches!'
    ),
    showDeleteExample: () => showDeleteConfirmation(
      () => showSuccess('Grupo excluído com sucesso.'),
      'Excluir Grupo',
      'Tem certeza que deseja excluir o grupo "Férias Europa 2024"? Todos os dados serão perdidos permanentemente.'
    )
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onNavigate={navigate} showError={showError} showSuccess={showSuccess} />;
      case 'register':
        return <RegisterScreen onNavigate={navigate} showError={showError} showSuccess={showSuccess} />;
      case 'reset-password':
        return <ResetPasswordScreen onNavigate={navigate} showError={showError} showSuccess={showSuccess} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigate} />;
      case 'group-voting':
        return <VotingScreen onNavigate={navigate} />;
      case 'group-matches':
        return <MatchesScreen onNavigate={navigate} />;
      case 'group-members':
        return <MembersScreen onNavigate={navigate} showInviteLink={showInviteLink} />;
      case 'preferences':
        return <PreferencesScreen onNavigate={navigate} />;
      case 'notifications':
        return <NotificationsScreen onNavigate={navigate} />;
      
      case 'terms-of-use':
        return (
          <div className="min-h-screen bg-white">
            <div className="bg-[#0E0652] text-white p-4">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('profile')} className="p-2 hover:bg-white/10 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1>Termos de Uso</h1>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <p>Bem-vindo ao Let's Trip Together. Ao usar nosso serviço, você concorda com os seguintes termos:</p>
                <h3>1. Uso do Serviço</h3>
                <p>Você pode usar nosso serviço para planejar viagens em grupo através de votação colaborativa.</p>
                <h3>2. Responsabilidades do Usuário</h3>
                <p>Você é responsável por manter a confidencialidade de sua conta e senha.</p>
                <h3>3. Privacidade</h3>
                <p>Respeitamos sua privacidade. Consulte nossa Política de Privacidade para mais detalhes.</p>
                <h3>4. Modificações</h3>
                <p>Podemos modificar estes termos a qualquer momento. Continuando a usar o serviço, você aceita as alterações.</p>
              </div>
            </div>
          </div>
        );
        
      case 'change-password':
        return (
          <div className="min-h-screen bg-white">
            <div className="bg-[#0E0652] text-white p-4">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('profile')} className="p-2 hover:bg-white/10 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1>Alterar Senha</h1>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label>Senha Atual</label>
                <input type="password" className="w-full p-3 border rounded-lg bg-gray-50" placeholder="Digite sua senha atual" />
              </div>
              <div className="space-y-2">
                <label>Nova Senha</label>
                <input type="password" className="w-full p-3 border rounded-lg bg-gray-50" placeholder="Digite a nova senha" />
              </div>
              <div className="space-y-2">
                <label>Confirmar Nova Senha</label>
                <input type="password" className="w-full p-3 border rounded-lg bg-gray-50" placeholder="Confirme a nova senha" />
              </div>
              <button 
                onClick={() => {
                  showSuccess('Senha alterada com sucesso!');
                  navigate('profile');
                }}
                className="w-full bg-[#0E0652] text-white py-3 rounded-lg"
              >
                Alterar Senha
              </button>
            </div>
          </div>
        );
        
      case 'profile':
        return <ProfileScreen onNavigate={navigate} onLogout={handleLogout} showSuccess={showSuccess} showConfirmation={showConfirmation} />;
        
      default:
        return <LoginScreen onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderScreen()}
      
      {/* Demo Button - Apenas para demonstrar os popups */}
      {/* {currentScreen === 'dashboard' && (
        <div className="fixed bottom-20 right-4 space-y-2">
          <button
            onClick={handleDemoActions.showSuccessExample}
            className="block w-full text-xs bg-green-500 text-white px-3 py-2 rounded shadow opacity-70"
          >
            Demo: Sucesso
          </button>
          <button
            onClick={handleDemoActions.showErrorExample}
            className="block w-full text-xs bg-red-500 text-white px-3 py-2 rounded shadow opacity-70"
          >
            Demo: Erro
          </button>
          <button
            onClick={handleDemoActions.showConfirmationExample}
            className="block w-full text-xs bg-yellow-500 text-white px-3 py-2 rounded shadow opacity-70"
          >
            Demo: Confirmação
          </button>
          <button
            onClick={handleDemoActions.showInfoExample}
            className="block w-full text-xs bg-blue-500 text-white px-3 py-2 rounded shadow opacity-70"
          >
            Demo: Info
          </button>
          <button
            onClick={handleDemoActions.showDeleteExample}
            className="block w-full text-xs bg-purple-500 text-white px-3 py-2 rounded shadow opacity-70"
          >
            Demo: Deletar
          </button>
        </div>
      )} */}

      {/* All Popups */}
      
      <SuccessPopup
        isOpen={popups.success.isOpen}
        onClose={() => closePopup('success')}
        title={popups.success.title}
        message={popups.success.message}
      />
      
      <ErrorPopup
        isOpen={popups.error.isOpen}
        onClose={() => closePopup('error')}
        title={popups.error.title}
        message={popups.error.message}
      />
      
      <ConfirmationPopup
        isOpen={popups.confirmation.isOpen}
        onClose={() => closePopup('confirmation')}
        onConfirm={popups.confirmation.onConfirm}
        title={popups.confirmation.title}
        message={popups.confirmation.message}
      />
      
      <LogoutPopup
        isOpen={popups.logout}
        onClose={() => closePopup('logout')}
        onConfirm={confirmLogout}
      />
      
      <InfoPopup
        isOpen={popups.info.isOpen}
        onClose={() => closePopup('info')}
        title={popups.info.title}
        message={popups.info.message}
      />
      
      <DeleteConfirmationPopup
        isOpen={popups.delete.isOpen}
        onClose={() => closePopup('delete')}
        onConfirm={popups.delete.onConfirm}
        title={popups.delete.title}
        message={popups.delete.message}
      />
      
      <InviteLinkPopup
        isOpen={popups.inviteLink}
        onClose={() => closePopup('inviteLink')}
      />
    </div>
  );
}