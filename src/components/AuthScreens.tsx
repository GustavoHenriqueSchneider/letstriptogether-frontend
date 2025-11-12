import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { Header } from './Header';
import backgroundImage from 'figma:asset/9461ca4209b21dd0f47647fbada0c1c80b8c5f4a.png';

interface AuthScreensProps {
  onNavigate: (screen: string) => void;
}

export function LoginScreen({ onNavigate }: AuthScreensProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{
          backgroundImage: `url(${backgroundImage})`
        }}
      />
      {/* Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0E0652]/90 via-[#130F61]/85 to-[#002F76]/90" />
      
      {/* Content */}
      <div className="w-full max-w-md relative z-10">
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
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
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

              <Button 
                type="submit" 
                className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
              >
                Entrar
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

export function RegisterScreen({ onNavigate }: AuthScreensProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('123456'); // Simular código enviado
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envio do código
    setSentCode('123456');
    setCurrentStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode === sentCode) {
      setCurrentStep(3);
    } else {
      alert('Código de verificação incorreto!');
    }
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    onNavigate('dashboard');
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
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                >
                  Continuar
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
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Código para demonstração: 123456
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                >
                  Verificar
                </Button>

                <button
                  type="button"
                  className="text-sm text-[#6496D8] hover:underline w-full text-center"
                  onClick={() => alert('Código reenviado!')}
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
                      placeholder="Mínimo 6 caracteres"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      minLength={6}
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
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
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

                <Button 
                  type="submit" 
                  className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                >
                  Criar conta
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

export function ResetPasswordScreen({ onNavigate }: AuthScreensProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
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
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                >
                  Enviar instruções
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