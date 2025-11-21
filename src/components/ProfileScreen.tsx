import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  ArrowLeft,
  User,
  Save,
  LogOut,
  Edit3,
  Shield,
  Key,
  FileText,
  UserX,
  Trash2,
  Settings,
  Compass,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { Header } from './Header';
import { usersApi } from '@/services/api/users';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  showSuccess: (title: string, message?: string) => void;
  showConfirmation?: (message: string, onConfirm: () => void, title?: string) => void;
}

export function ProfileScreen({ onNavigate, onLogout, showSuccess, showConfirmation }: ProfileScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [originalData, setOriginalData] = useState({
    name: '',
    email: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuthStore();
  const { openModal, closeModal, showError } = useModalStore();
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (isInitialized) {
      loadUserData();
    }
  }, [isInitialized]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await usersApi.getCurrentUser();
      const data = {
        name: userData.name,
        email: userData.email
      };
      setFormData(data);
      setOriginalData(data);
    } catch (error: any) {
      showError('Erro ao carregar dados', error.response?.data?.message || 'Não foi possível carregar seus dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    if (value.length <= 150) {
      setFormData(prev => ({
        ...prev,
        name: value
      }));
    }
  };

  const handleSave = async () => {
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      showError('Nome inválido', 'O nome não pode estar vazio');
      return;
    }

    if (trimmedName.length > 150) {
      showError('Nome inválido', 'O nome não pode ter mais de 150 caracteres');
      return;
    }

    try {
      openModal('loading');
      await usersApi.updateCurrentUser({ name: trimmedName });
      closeModal('loading');
      
      setFormData(prev => ({ ...prev, name: trimmedName }));
      setOriginalData(prev => ({ ...prev, name: trimmedName }));
      
      const { updateUser } = useAuthStore.getState();
      updateUser({ name: trimmedName });
      
      showSuccess('Alterações Salvas', 'Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error: any) {
      closeModal('loading');
      showError('Erro ao salvar', error.response?.data?.message || 'Não foi possível atualizar seu perfil');
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  const handleAnonymizeAccount = () => {
    openModal('confirmation', {
      title: 'Anonimizar conta',
      message: 'Tem certeza que deseja anonimizar sua conta? Esta ação não pode ser desfeita.',
      onConfirm: async () => {
        try {
          await usersApi.anonymizeAccount();
          closeModal('confirmation');
          await logout();
          onNavigate('login');
          showSuccess('Conta anonimizada com sucesso!');
        } catch (error: any) {
          closeModal('confirmation');
          showError('Erro ao anonimizar conta', error.response?.data?.message || 'Não foi possível anonimizar sua conta');
        }
      }
    });
  };

  const handleDeleteAccount = () => {
    openModal('delete', {
      title: 'Excluir conta',
      message: 'Tem certeza que deseja excluir definitivamente sua conta? Todos os seus dados, votos e participação em grupos serão perdidos permanentemente. Esta ação não pode ser desfeita.',
      onConfirm: async () => {
        try {
          await usersApi.deleteAccount();
          closeModal('delete');
          await logout();
          onNavigate('login');
          showSuccess('Conta excluída com sucesso!');
        } catch (error: any) {
          closeModal('delete');
          showError('Erro ao excluir conta', error.response?.data?.message || 'Não foi possível excluir sua conta');
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        title="Meu Perfil"
        onBack={() => onNavigate('dashboard')}
      />

      <div className="p-6 pb-20 max-w-7xl mx-auto space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader className="relative">
            <CardTitle className="text-[#0E0652] flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informações pessoais
            </CardTitle>
            <button
              onClick={() => {
                if (isEditing) {
                  setFormData(originalData);
                }
                setIsEditing(!isEditing);
              }}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <Edit3 className="h-5 w-5 text-[#0E0652]" />
            </button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Form Fields */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0E0652]"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#01001D]">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange(e.target.value)}
                    disabled={!isEditing}
                    maxLength={150}
                    className={`${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-blue-50'} border-gray-200 focus:border-[#6496D8] focus:ring-[#6496D8] transition-colors`}
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#01001D]">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled={true}
                    className="bg-gray-50 cursor-not-allowed border-gray-200"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
            )}

            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={() => {
                    setFormData(originalData);
                    setIsEditing(false);
                  }}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:border-[#6496D8] hover:bg-white hover:text-gray-900"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-[#0E0652] hover:bg-[#130F61] text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar alterações
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#01001D]">
              <Settings className="h-5 w-5 mr-2" />
              Configurações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-gray-200 text-[#01001D] hover:border-[#6496D8] hover:bg-white hover:text-[#01001D]"
              onClick={() => onNavigate('change-password')}
            >
              <Key className="h-4 w-4 mr-3" />
              Alterar senha
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-gray-200 text-[#01001D] hover:border-[#6496D8] hover:bg-white hover:text-[#01001D]"
              onClick={() => onNavigate('preferences')}
            >
              <Compass className="h-4 w-4 mr-3" />
              Alterar preferências de viagem
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#01001D]">
              <HelpCircle className="h-5 w-5 mr-2" />
              Suporte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-gray-200 text-[#01001D] hover:border-[#6496D8] hover:bg-white hover:text-[#01001D]"
              onClick={() => window.open('/terms-of-use', '_blank')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Termos de uso
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-gray-200 text-[#01001D] hover:border-[#6496D8] hover:bg-white hover:text-[#01001D]"
              onClick={() => window.open('/privacy-policy', '_blank')}
            >
              <Shield className="h-4 w-4 mr-2" />
              Política de privacidade
            </Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#01001D]">
              <AlertCircle className="h-5 w-5 mr-2" />
              Ações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-600"
              onClick={handleAnonymizeAccount}
            >
              <UserX className="h-4 w-4 mr-2" />
              Anonimizar conta
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir conta
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <div className="pb-6">
          <Button 
            onClick={handleLogout}
            variant="destructive" 
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        <p className="text-center text-xs text-gray-500 pb-6">
          Let's Trip Together v1.0.0
        </p>
      </div>
    </div>
  );
}