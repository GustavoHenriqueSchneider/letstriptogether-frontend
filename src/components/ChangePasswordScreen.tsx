import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff, Lock, Check } from 'lucide-react';
import { Header } from './Header';
import { usersApi } from '@/services/api/users';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';

interface ChangePasswordScreenProps {
  onNavigate: (screen: string) => void;
}

interface PasswordCriteria {
  hasMinLength: boolean;
  hasMaxLength: boolean;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const validatePassword = (password: string): PasswordCriteria => {
  return {
    hasMinLength: password.length >= 8,
    hasMaxLength: password.length <= 30,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
};

const isPasswordValid = (criteria: PasswordCriteria): boolean => {
  return Object.values(criteria).every(criterion => criterion === true);
};

const PasswordCriteriaList = ({ criteria, show }: { criteria: PasswordCriteria; show: boolean }) => {
  if (!show) return null;

  const criteriaList = [
    { key: 'hasMinLength', label: 'Mínimo 8 caracteres' },
    { key: 'hasMaxLength', label: 'Máximo 30 caracteres' },
    { key: 'hasLowercase', label: 'Uma letra minúscula' },
    { key: 'hasUppercase', label: 'Uma letra maiúscula' },
    { key: 'hasNumber', label: 'Um número' },
    { key: 'hasSpecialChar', label: 'Um caractere especial' },
  ];

  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs text-gray-600 mb-2">Critérios da senha:</p>
      <div className="grid grid-cols-1 gap-1">
        {criteriaList.map(({ key, label }) => {
          const isValid = criteria[key as keyof PasswordCriteria];
          return (
            <div key={key} className="flex items-center gap-2 text-xs">
              {isValid ? (
                <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
              ) : (
                <div className="h-3 w-3 rounded-full border border-gray-300 flex-shrink-0" />
              )}
              <span className={isValid ? 'text-green-600' : 'text-gray-500'}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function ChangePasswordScreen({ onNavigate }: ChangePasswordScreenProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    hasMinLength: false,
    hasMaxLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const { logout } = useAuthStore();
  const { openModal, closeModal, showError, showSuccess } = useModalStore();

  const isCurrentPasswordValid = formData.currentPassword.trim().length > 0;
  const isNewPasswordValid = isPasswordValid(passwordCriteria);
  const isConfirmPasswordValid = formData.newPassword === formData.confirmPassword && formData.confirmPassword.length > 0;
  const isFormValid = isCurrentPasswordValid && isNewPasswordValid && isConfirmPasswordValid;

  const handleChangePassword = () => {
    openModal('confirmation', {
      title: 'Alterar Senha',
      message: 'Ao alterar sua senha, você será desconectado e precisará fazer login novamente com a nova senha. Deseja continuar?',
      onConfirm: async () => {
        try {
          openModal('loading');
          await usersApi.changePassword({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          });
          closeModal('loading');
          closeModal('confirmation');
          await logout();
          onNavigate('login');
          showSuccess('Senha alterada com sucesso!', 'Faça login novamente com sua nova senha.');
        } catch (error: any) {
          closeModal('loading');
          closeModal('confirmation');
          showError('Erro ao alterar senha', 'Não foi possível alterar sua senha!');
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Configurações"
        onBack={() => onNavigate('profile')}
      />

      <div className="p-6 pb-20 max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#01001D]">
              <Lock className="h-5 w-5 mr-2" />
              Alterar senha
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Senha Atual */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-[#01001D]">Senha atual</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Digite sua senha atual"
                  className="pr-10 border-gray-200 focus:border-[#6496D8] focus:ring-[#6496D8] transition-colors bg-white hover:bg-blue-50"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-3"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
              {!isCurrentPasswordValid && formData.currentPassword.length > 0 && (
                <p className="text-xs text-red-500">A senha atual não pode estar vazia</p>
              )}
            </div>

            {/* Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-[#01001D]">Nova senha</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Digite a nova senha"
                  className="pr-10 border-gray-200 focus:border-[#6496D8] focus:ring-[#6496D8] transition-colors bg-white hover:bg-blue-50"
                  value={formData.newPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, newPassword: value });
                    setPasswordCriteria(validatePassword(value));
                  }}
                  minLength={8}
                  maxLength={30}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
              <PasswordCriteriaList criteria={passwordCriteria} show={formData.newPassword.length > 0} />
            </div>

            {/* Confirmar Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#01001D]">Confirmar nova senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme a nova senha"
                  className="pr-10 border-gray-200 focus:border-[#6496D8] focus:ring-[#6496D8] transition-colors bg-white hover:bg-blue-50"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  minLength={8}
                  maxLength={30}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
              {formData.confirmPassword.length > 0 && !isConfirmPasswordValid && (
                <p className="text-xs text-red-500">As senhas não coincidem</p>
              )}
              {formData.confirmPassword.length > 0 && isConfirmPasswordValid && (
                <p className="text-xs text-green-600">As senhas coincidem</p>
              )}
            </div>

            {/* Botão Alterar Senha */}
            <Button
              onClick={handleChangePassword}
              className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
              disabled={!isFormValid}
            >
              Alterar senha
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

