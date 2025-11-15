import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, X, Check } from 'lucide-react';
import backgroundImage from 'figma:asset/9461ca4209b21dd0f47647fbada0c1c80b8c5f4a.png';
import { authApi } from '@/services/api/auth';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';

interface AuthScreensProps {
  onNavigate: (screen: string) => void;
  onLogin?: (email: string, password: string) => Promise<void>;
}

const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  if (email.length > 254) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidName = (name: string): boolean => {
  if (!name) return false;
  if (name.length > 150) return false;
  return name.trim().length > 0;
};

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

export function LoginScreen({ onNavigate, onLogin }: AuthScreensProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const { showError } = useModalStore();

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageLoaded(true);
    };
    img.src = backgroundImage;
    
    if (img.complete) {
      setImageLoaded(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onLogin) {
      setIsLoading(true);
      try {
        await onLogin(formData.email, formData.password);
      } catch (error: any) {
      } finally {
        setIsLoading(false);
      }
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image with Blur */}
      <div 
        className={`absolute inset-0 bg-cover bg-center blur-sm transition-opacity duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(${backgroundImage})`
        }}
      />
      {/* Dark Overlay with Gradient - sempre visível */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0E0652]/90 via-[#130F61]/85 to-[#002F76]/90" />
      
      {/* Content */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Let's Trip Together</h1>
          <p className="text-gray-300 mt-4">Encontre destinos perfeitos com seus amigos.</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader>
            <CardDescription className="text-center">
              Acesse sua conta e comece a planejar!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className={`pl-10 pr-10 ${
                      emailValid === false ? 'border-red-500 focus-visible:border-red-500' : ''
                    }`}
                    value={formData.email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({...formData, email: value});
                      if (value.length > 0) {
                        setEmailValid(isValidEmail(value));
                      } else {
                        setEmailValid(null);
                      }
                      }}
                      required
                      maxLength={254}
                      disabled={isLoading}
                    />
                    {emailValid === false && (
                      <X className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                disabled={isLoading || !emailValid || !formData.password}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="text-center">
              <button 
                onClick={() => onNavigate('reset-password')}
                className="text-sm text-[#6496D8] hover:underline"
                disabled={isLoading}
              >
                Esqueceu sua senha?
              </button>
            </div>

            <Separator />

            <Button 
              variant="outline" 
              className="w-full border-[#6496D8] text-[#6496D8] hover:bg-[#6496D8] hover:text-white"
              onClick={() => onNavigate('register')}
              disabled={isLoading}
            >
              Criar conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function RegisterScreen({ onNavigate }: AuthScreensProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [emailInUse, setEmailInUse] = useState(false);
  const [nameValid, setNameValid] = useState<boolean | null>(null);
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    hasMinLength: false,
    hasMaxLength: true,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0);
  const [emailToken, setEmailToken] = useState<string | null>(null); // Token da etapa 1
  const [registerToken, setRegisterToken] = useState<string | null>(null); // Token da etapa 2
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const { showError, showSuccess, openModal, closeModal } = useModalStore();
  const { login } = useAuthStore();

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageLoaded(true);
    };
    img.src = backgroundImage;
    
    if (img.complete) {
      setImageLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (resendCooldownSeconds > 0) {
      const timer = setTimeout(() => {
        setResendCooldownSeconds(resendCooldownSeconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldownSeconds]);

  useEffect(() => {
    if (currentStep === 1) {
      setResendCooldownSeconds(0);
    }
  }, [currentStep]);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    openModal('loading');

    try {
      const token = await authApi.sendRegisterConfirmationEmail(formData.name, formData.email);
      closeModal('loading');
      setEmailInUse(false);
      setEmailToken(token);
      setCurrentStep(2);
    } catch (error: any) {
      closeModal('loading');
      if (error.response?.status === 409) {
        setEmailInUse(true);
      } else {
        showError('Erro ao enviar código', 'Não foi possível enviar o código de verificação!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailToken) {
      showError('Erro', 'Token de email não encontrado. Por favor, volte e tente novamente.');
      return;
    }

    const code = parseInt(verificationCode, 10);
    if (isNaN(code) || verificationCode.length !== 6) {
      showError('Código inválido', 'Digite um código de 6 dígitos');
      return;
    }

    setIsLoading(true);
    openModal('loading');

    try {
      const token = await authApi.validateRegisterConfirmationCode(code, emailToken);
      closeModal('loading');
      setRegisterToken(token);
      setCurrentStep(3);
    } catch (error: any) {
      closeModal('loading');
      showError('Código inválido', 'O código informado está incorreto!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerToken) {
      showError('Erro', 'Token de registro não encontrado. Por favor, volte e tente novamente.');
      return;
    }

    if (!isPasswordValid(passwordCriteria)) {
      showError('Senha inválida', 'A senha deve atender a todos os critérios!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Senhas não coincidem', 'As senhas informadas não são iguais');
      return;
    }

    if (!formData.termsAccepted) {
      showError('Termos não aceitos', 'Você precisa aceitar os termos de uso para continuar');
      return;
    }

    setIsLoading(true);
    openModal('loading');

    try {
      await authApi.completeRegister(formData.password, formData.termsAccepted, registerToken);
      
      try {
        const loginResponse = await authApi.login(formData.email, formData.password);
        await login(
          loginResponse.user,
          loginResponse.accessToken,
          loginResponse.sessionId,
          loginResponse.refreshToken,
          true
        );
        await useAuthStore.getState().fetchUserPreferences();
        closeModal('loading');
        
        setTimeout(() => {
          if (!window.location.pathname.includes('/preferences')) {
            onNavigate('dashboard');
          }
        }, 2150);
      } catch (loginError: any) {
        closeModal('loading');
        showError('Conta criada', 'Conta criada com sucesso, mas houve um erro ao fazer login automático. Por favor, faça login manualmente.');
        setTimeout(() => {
          onNavigate('login');
        }, 3000);
      }
    } catch (error: any) {
      closeModal('loading');
      showError('Erro ao criar conta', 'Não foi possível completar o registro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldownSeconds > 0) {
      return;
    }

    if (!formData.email || !formData.name) {
      showError('Erro', 'Nome e e-mail são obrigatórios');
      return;
    }

    setIsLoading(true);
    openModal('loading');
    try {
      const token = await authApi.sendRegisterConfirmationEmail(formData.name, formData.email);
      closeModal('loading');
      setEmailToken(token);
      setResendCooldownSeconds(60);
      showSuccess('Código reenviado', 'Verifique seu e-mail novamente!');
    } catch (error: any) {
      closeModal('loading');
      if (error.response?.status === 409) {
        setEmailInUse(true);
      } else {
        showError('Erro ao reenviar código', 'Não foi possível reenviar o código');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image with Blur */}
      <div 
        className={`absolute inset-0 bg-cover bg-center blur-sm transition-opacity duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(${backgroundImage})`
        }}
      />
      {/* Dark Overlay with Gradient - sempre visível */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0E0652]/90 via-[#130F61]/85 to-[#002F76]/90" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Let's Trip Together</h1>
          <p className="text-gray-300 mt-4">Encontre destinos perfeitos com seus amigos.</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="relative">
            <button 
              onClick={() => {
                if (currentStep === 3) {
                  setCurrentStep(1);
                }
                else if (currentStep > 1) {
                  setCurrentStep(currentStep - 1);
                  setVerificationCode('');
                } else {
                  onNavigate('login');
                }
              }}
              className="absolute left-0 top-0 p-6 text-[#01001D] hover:text-[#6496D8]"
              disabled={isLoading}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <CardTitle className="text-center text-[#01001D]">Criar sua conta</CardTitle>
            <CardDescription className="text-center">Junte-se à comunidade de viajantes!</CardDescription>
            <div className="flex justify-center mt-4 space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-1 rounded-full ${
                    step <= currentStep ? 'bg-[#6496D8]' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Step 1: Nome e Email */}
            {currentStep === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      className={`pl-10 pr-10 ${
                        nameValid === false ? 'border-red-500 focus-visible:border-red-500' : ''
                      }`}
                      value={formData.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({...formData, name: value});
                        if (value.length > 0) {
                          setNameValid(isValidName(value));
                        } else {
                          setNameValid(null);
                        }
                      }}
                      required
                      maxLength={150}
                      disabled={isLoading}
                    />
                    {nameValid === false && (
                      <X className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className={`pl-10 pr-10 ${
                        emailValid === false || emailInUse ? 'border-red-500 focus-visible:border-red-500' : ''
                      }`}
                      value={formData.email}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({...formData, email: value});
                        setEmailInUse(false); // Limpar erro quando usuário alterar o email
                        if (value.length > 0) {
                          setEmailValid(isValidEmail(value));
                        } else {
                          setEmailValid(null);
                        }
                      }}
                      required
                      maxLength={254}
                      disabled={isLoading}
                    />
                    {(emailValid === false || emailInUse) && (
                      <X className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {emailInUse && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <X className="h-3 w-3 flex-shrink-0" />
                      Este e-mail já está em uso.
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                  disabled={isLoading || !emailValid || !nameValid || emailInUse}
                >
                  {isLoading ? 'Enviando...' : 'Continuar'}
                </Button>
              </form>
            )}

            {/* Step 2: Código de Verificação */}
            {currentStep === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Enviamos um código de verificação para <strong>{formData.email}</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verification-code">Código de verificação</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="Digite o código de 6 dígitos"
                    className="text-center text-lg tracking-widest"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                  disabled={isLoading || verificationCode.length !== 6}
                >Verificar</Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-[#6496D8] text-[#6496D8] hover:bg-[#6496D8] hover:text-white"
                  onClick={handleResendCode}
                  disabled={isLoading || resendCooldownSeconds > 0}
                >
                  {resendCooldownSeconds > 0 
                      ? `Aguarde ${resendCooldownSeconds}s para reenviar` 
                      : 'Não recebeu? Reenviar código'}
                </Button>
              </form>
            )}

            {/* Step 3: Senha */}
            {currentStep === 3 && (
              <form onSubmit={handleStep3Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({...formData, password: value});
                        setPasswordCriteria(validatePassword(value));
                      }}
                      required
                      minLength={8}
                      maxLength={30}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                  <PasswordCriteriaList criteria={passwordCriteria} show={formData.password.length > 0} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repita sua senha"
                      className={`pl-10 pr-10 ${
                        formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword 
                          ? 'border-red-500 focus-visible:border-red-500' 
                          : ''
                      }`}
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 30) {
                          setFormData({...formData, confirmPassword: value});
                        }
                      }}
                      required
                      maxLength={30}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                  {formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <X className="h-3 w-3 flex-shrink-0" />
                      A senha informada deve ser equivalente à anterior.
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                    className="rounded border-gray-300"
                    required
                    disabled={isLoading}
                  />
                    <Label htmlFor="terms" className="text-sm">
                      Aceito os
                      <a 
                        href="/terms-of-use"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6496D8] hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open('/terms-of-use', '_blank', 'noopener,noreferrer');
                        }}
                      >
                        Termos de Uso
                      </a>.
                    </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                  disabled={isLoading || !formData.termsAccepted || !isPasswordValid(passwordCriteria) || formData.password !== formData.confirmPassword}
                >
                  {isLoading ? 'Criando conta...' : 'Criar conta'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface ResetPasswordScreenProps extends AuthScreensProps {
  initialToken?: string | null;
}

export function ResetPasswordScreen({ onNavigate, initialToken }: ResetPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(initialToken || null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    hasMinLength: false,
    hasMaxLength: true,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const { showError, showSuccess, showInfo, openModal, closeModal } = useModalStore();

  useEffect(() => {
    setResetToken(initialToken || null);
  }, [initialToken]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageLoaded(true);
    };
    img.src = backgroundImage;
    
    if (img.complete) {
      setImageLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => {
        setCooldownSeconds(cooldownSeconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cooldownSeconds > 0) {
      return;
    }

    setIsLoading(true);
    openModal('loading');

    try {
      await authApi.requestResetPassword(email);
      closeModal('loading');
      showInfo(
        'E-mail enviado',
        'Caso o e-mail informado exista em nossa base, você receberá instruções para recuperação de senha.'
      );
      setCooldownSeconds(60);
    } catch (error: any) {
      closeModal('loading');
      showError('Erro ao solicitar reset', 'Não foi possível enviar o e-mail de recuperação!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetToken) {
      showError('Token inválido', 'O token de recuperação não foi encontrado. Por favor, solicite um novo e-mail de recuperação.');
      return;
    }

    if (!isPasswordValid(passwordCriteria)) {
      showError('Senha inválida', 'A senha deve atender a todos os critérios!');
      return;
    }

    if (password !== confirmPassword) {
      showError('Senhas não coincidem', 'As senhas informadas não são iguais!');
      return;
    }

    setIsLoading(true);
    openModal('loading');

    try {
      await authApi.resetPassword(password, resetToken);
      closeModal('loading');
      showSuccess(
        'Senha redefinida com sucesso',
        'A senha foi alterada com sucesso. Você será redirecionado para realizar o login!',
        () => {
          onNavigate('login');
        }
      );
    } catch (error: any) {
      closeModal('loading');
      showError(
        'Não foi possível redefinir a senha',
        error.response?.data?.message || 'Houve um erro ao tentar redefinir a senha, por favor tente novamente.',
        () => {
          onNavigate('login');
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (resetToken) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <div 
          className={`absolute inset-0 bg-cover bg-center blur-sm transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${backgroundImage})`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0E0652]/90 via-[#130F61]/85 to-[#002F76]/90" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Let's Trip Together</h1>
            <p className="text-gray-300 mt-4">Encontre destinos perfeitos com seus amigos.</p>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader className="relative">
              <button 
                onClick={() => onNavigate('login')}
                className="absolute left-0 top-0 p-6 text-[#01001D] hover:text-[#6496D8]"
                disabled={isLoading}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <CardTitle className="text-center text-[#01001D]">Redefina sua senha</CardTitle>
              <CardDescription className="text-center">
                Defina uma nova senha para sua conta!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nova senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua nova senha"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPassword(value);
                        setPasswordCriteria(validatePassword(value));
                      }}
                      required
                      minLength={8}
                      maxLength={30}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                  <PasswordCriteriaList criteria={passwordCriteria} show={password.length > 0} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      className={`pl-10 pr-10 ${
                        confirmPassword.length > 0 && password !== confirmPassword 
                          ? 'border-red-500 focus-visible:border-red-500' 
                          : ''
                      }`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <X className="h-3 w-3 flex-shrink-0" />
                      A senha informada deve ser equivalente à anterior.
                    </p>
                  )}
                </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                    disabled={isLoading || !isPasswordValid(passwordCriteria) || password !== confirmPassword}
                  >
                    {isLoading ? 'Redefinindo...' : 'Redefinir senha'}
                  </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-cover bg-center blur-sm transition-opacity duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(${backgroundImage})`
        }}
      />
      {/* Dark Overlay with Gradient - sempre visível */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0E0652]/90 via-[#130F61]/85 to-[#002F76]/90" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Let's Trip Together</h1>
          <p className="text-gray-300 mt-4">Encontre destinos perfeitos com seus amigos.</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="relative">
            <button 
              onClick={() => onNavigate('login')}
              className="absolute left-0 top-0 p-6 text-[#01001D] hover:text-[#6496D8]"
              disabled={isLoading}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <CardTitle className="text-center text-[#01001D]">Recupere sua senha</CardTitle>
            <CardDescription className="text-center">
              Informe seu e-mail para receber as instruções!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className={`pl-10 pr-10 ${
                      emailValid === false ? 'border-red-500 focus-visible:border-red-500' : ''
                    }`}
                    value={email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEmail(value);
                      if (value.length > 0) {
                        setEmailValid(isValidEmail(value));
                      } else {
                        setEmailValid(null);
                      }
                      }}
                      required
                      maxLength={254}
                      disabled={isLoading || cooldownSeconds > 0}
                    />
                    {emailValid === false && (
                      <X className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>

              <Button
                type="submit" 
                className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                disabled={isLoading || cooldownSeconds > 0 || !emailValid}
              >
                {isLoading 
                  ? 'Enviando...' 
                  : cooldownSeconds > 0 
                    ? `Aguarde ${cooldownSeconds}s para reenviar` 
                    : 'Enviar instruções'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
