import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  ArrowLeft,
  User,
  Save,
  LogOut,
  Camera,
  Edit3,
  Shield,
  Key,
  FileText,
  UserX,
  Trash2
} from 'lucide-react';
import { Header } from './Header';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  showSuccess: (message: string, title?: string) => void;
  showConfirmation?: (message: string, onConfirm: () => void, title?: string) => void;
}

export function ProfileScreen({ onNavigate, onLogout, showSuccess, showConfirmation }: ProfileScreenProps) {
  const [formData, setFormData] = useState({
    name: 'João Silva',
    email: 'joao@email.com'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value
    }));
  };

  const handleSave = () => {
    // Aqui você salvaria os dados no backend
    showSuccess('Perfil atualizado com sucesso!', 'Alterações Salvas');
    setIsEditing(false);
  };

  const handleLogout = () => {
    onLogout();
  };

  const handleAnonymizeAccount = () => {
    if (showConfirmation) {
      showConfirmation(
        'Tem certeza que deseja anonimizar sua conta? Suas informações pessoais serão removidas permanentemente, mas seus votos e participação em grupos serão mantidos de forma anônima.',
        () => showSuccess('Conta anonimizada com sucesso!'),
        'Anonimizar Conta'
      );
    } else {
      // Fallback se showConfirmation não estiver disponível
      if (confirm('Tem certeza que deseja anonimizar sua conta?')) {
        showSuccess('Conta anonimizada com sucesso!');
      }
    }
  };

  const handleDeleteAccount = () => {
    if (showConfirmation) {
      showConfirmation(
        'Tem certeza que deseja excluir definitivamente sua conta? Todos os seus dados, votos e participação em grupos serão perdidos permanentemente. Esta ação não pode ser desfeita.',
        () => showSuccess('Conta excluída com sucesso!'),
        'Excluir Conta Permanentemente'
      );
    } else {
      // Fallback se showConfirmation não estiver disponível
      if (confirm('Tem certeza que deseja excluir definitivamente sua conta?')) {
        showSuccess('Conta excluída com sucesso!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        title="Meu Perfil"
        onBack={() => onNavigate('dashboard')}
        rightContent={
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Edit3 className="h-6 w-6 text-[#0E0652]" />
          </button>
        }
      />

      <div className="p-4 space-y-6">
        {/* Profile Information with Photo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#0E0652] flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Photo */}
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-[#6496D8] text-white text-2xl">
                    {formData.name.split(' ').map(n => n.charAt(0)).slice(0, 2).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 h-8 w-8 bg-[#0E0652] text-white rounded-full flex items-center justify-center hover:bg-[#130F61] transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#01001D]">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange(e.target.value)}
                  disabled={!isEditing}
                  className={`${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'} border-gray-200 focus:border-[#6496D8] focus:ring-[#6496D8]`}
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

            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-[#0E0652] hover:bg-[#130F61] text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#01001D]">
              <Shield className="h-5 w-5 mr-2" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-gray-200 text-[#01001D] hover:bg-gray-50"
              onClick={() => onNavigate('change-password')}
            >
              <Key className="h-4 w-4 mr-3" />
              Alterar Senha
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#01001D]">
              <FileText className="h-5 w-5 mr-2" />
              Suporte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-gray-200 text-[#01001D] hover:bg-gray-50"
              onClick={() => onNavigate('terms-of-use')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Termos de Uso
            </Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#01001D]">
              <UserX className="h-5 w-5 mr-2" />
              Ações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50"
              onClick={handleAnonymizeAccount}
            >
              <UserX className="h-4 w-4 mr-2" />
              Anonimizar Conta
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Conta
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="border-red-200">
          <CardContent className="p-4">
            <Button 
              onClick={handleLogout}
              variant="destructive" 
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair da Conta
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 pb-6">
          Let's Trip Together v1.0.0
        </p>
      </div>
    </div>
  );
}