/// <reference path="../vite-env.d.ts" />
import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { authService } from '../services';
import { useApiError } from '../hooks/useApiError';

interface AuthScreensProps {
  onNavigate: (screen: string) => void;
  showError?: (message: string, title?: string) => void;
  showSuccess?: (message: string, title?: string) => void;
}

export function LoginScreen({ onNavigate, showError, showSuccess }: AuthScreensProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { error, handleError, clearError } = useApiError();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      await authService.login({
        email: formData.email,
        password: formData.password,
      });
      
      showSuccess?.('Login realizado com sucesso!');
      onNavigate('dashboard');
    } catch (err: any) {
      handleError(err);
      const errorMessage = err?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      showError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0652] via-[#130F61] to-[#002F76] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Let's Trip Together</h1>
          <p className="text-gray-300 mt-4">Encontre destinos perfeitos com seus amigos</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader>
            <CardTitle className="text-center text-[#01001D]">Entrar</CardTitle>
            <CardDescription className="text-center">
              Acesse sua conta e comece a planejar
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
                    className="pl-10"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFormData({...formData, email: e.target.value});
                      clearError();
                    }}
                    required
                  />
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="text-center">
              <button 
                onClick={() => onNavigate('reset-password')}
                className="text-sm text-[#6496D8] hover:underline"
              >
                Esqueceu sua senha?
              </button>
            </div>

            <Separator />

            <Button 
              variant="outline" 
              className="w-full border-[#6496D8] text-[#6496D8] hover:bg-[#6496D8] hover:text-white"
              onClick={() => onNavigate('register')}
            >
              Criar conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function RegisterScreen({ onNavigate, showError, showSuccess }: AuthScreensProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [step1Token, setStep1Token] = useState<string | null>(null); // Token da etapa 1
  const [step2Token, setStep2Token] = useState<string | null>(null); // Token da etapa 2
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { error, handleError, clearError } = useApiError();

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      const response = await authService.sendRegisterConfirmationEmail({
        name: formData.name,
        email: formData.email,
      });
      
      if (response?.token) {
        setStep1Token(response.token);
        setCurrentStep(2);
        showSuccess?.('Código de verificação enviado para seu e-mail!');
      } else {
        throw new Error('Token não recebido da API');
      }
    } catch (err: any) {
      handleError(err);
      const errorMessage = err?.message || 'Erro ao enviar código de verificação. Tente novamente.';
      showError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!verificationCode || verificationCode.length !== 6) {
      showError?.('Por favor, digite o código de 6 dígitos!');
      return;
    }

    if (!step1Token) {
      showError?.('Erro: token de validação não encontrado. Por favor, volte ao passo anterior.');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.validateRegisterConfirmationCode(verificationCode, step1Token!);
      if (response?.token) {
        setStep2Token(response.token);
        setCurrentStep(3);
      } else {
        throw new Error('Token não recebido da validação');
      }
    } catch (err: any) {
      handleError(err);
      const errorMessage = err?.message || 'Código de verificação incorreto!';
      showError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (formData.password !== formData.confirmPassword) {
      showError?.('As senhas não coincidem!');
      return;
    }

    if (formData.password.length < 8) {
      showError?.('A senha deve ter no mínimo 8 caracteres!');
      return;
    }

    if (!step2Token) {
      showError?.('Erro: token de registro não encontrado. Por favor, volte ao passo anterior.');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        password: formData.password,
        hasAcceptedTermsOfUse: true,
      }, step2Token);
      
      showSuccess?.('Conta criada com sucesso! Faça login para continuar.');
      onNavigate('login');
    } catch (err: any) {
      handleError(err);
      // Tenta extrair mensagem de erro mais detalhada
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.error) {
        errorMessage = err.error;
      } else if (err?.details) {
        errorMessage = `Erro: ${err.details}`;
      }
      console.error('Erro ao registrar:', err);
      showError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0652] via-[#130F61] to-[#002F76] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <button 
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onNavigate('login')}
            className="flex items-center text-white hover:text-[#6496D8] mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {currentStep === 1 && 'Criar Conta'}
              {currentStep === 2 && 'Verificar E-mail'}
              {currentStep === 3 && 'Definir Senha'}
            </h1>
            <p className="text-gray-300">
              {currentStep === 1 && 'Junte-se à comunidade de viajantes'}
              {currentStep === 2 && 'Digite o código enviado para seu e-mail'}
              {currentStep === 3 && 'Crie uma senha segura para sua conta'}
            </p>
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
          </div>
        </div>

        <Card className="shadow-2xl border-0">
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
                      className="pl-10"
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                      required
                    />
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
                      className="pl-10"
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                  disabled={loading}
                >
                  {loading ? 'Enviando código...' : 'Continuar'}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                  disabled={loading}
                >
                  {loading ? 'Verificando...' : 'Verificar'}
                </Button>

                <button
                  type="button"
                  className="text-sm text-[#6496D8] hover:underline w-full text-center disabled:opacity-50"
                  onClick={async () => {
                    if (!formData.email || !formData.name) {
                      showError?.('Por favor, volte ao passo anterior e preencha nome e email.');
                      return;
                    }
                    try {
                      const response = await authService.sendRegisterConfirmationEmail({
                        name: formData.name,
                        email: formData.email,
                      });
                      setStep1Token(response.token);
                      showSuccess?.('Código reenviado! Verifique seu e-mail.');
                    } catch (err: any) {
                      handleError(err);
                      showError?.('Erro ao reenviar código. Tente novamente.');
                    }
                  }}
                  disabled={loading}
                >
                  Não recebeu? Reenviar código
                </button>
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
                      placeholder="Mínimo 8 caracteres"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, password: e.target.value})}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repita sua senha"
                      className="pl-10 pr-10"
                      value={formData.confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                  disabled={loading}
                >
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Ao criar uma conta, você concorda com nossos Termos de Uso e Política de Privacidade
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ResetPasswordScreen({ onNavigate, showError, showSuccess }: AuthScreensProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError } = useApiError();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      await authService.resetPassword({ email });
      setSent(true);
      showSuccess?.('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (err: any) {
      handleError(err);
      const errorMessage = err?.message || 'Erro ao enviar e-mail de recuperação.';
      showError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0652] via-[#130F61] to-[#002F76] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <button 
            onClick={() => onNavigate('login')}
            className="flex items-center text-white hover:text-[#6496D8] mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {sent ? 'E-mail Enviado!' : 'Recuperar Senha'}
            </h1>
            <p className="text-gray-300">
              {sent 
                ? 'Verifique sua caixa de entrada e spam'
                : 'Informe seu e-mail para receber as instruções'
              }
            </p>
          </div>
        </div>

        <Card className="shadow-2xl border-0">
          <CardContent className="p-6">
            {!sent ? (
              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar instruções'}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600">
                  Enviamos um link de recuperação para <strong>{email}</strong>
                </p>
                <Button 
                  onClick={() => onNavigate('login')}
                  className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                >
                  Voltar ao login
                </Button>
                <button
                  onClick={() => setSent(false)}
                  className="text-sm text-[#6496D8] hover:underline"
                >
                  Não recebeu? Tentar novamente
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}