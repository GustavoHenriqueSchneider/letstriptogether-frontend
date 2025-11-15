import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Users, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Plane,
  Star,
  ChevronRight,
  MapPin
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0E0652] to-[#6496D8] flex items-center justify-center group-hover:scale-105 transition-transform">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#0E0652] to-[#002F76] bg-clip-text text-transparent">
                Let's Trip Together
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button 
                asChild
                className="bg-gradient-to-r from-[#0E0652] to-[#002F76] hover:opacity-90 text-white"
              >
                <Link to="/login">Entrar</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#0E0652] via-[#130F61] to-[#002F76] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#6496D8] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#002F76] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6">
              <div className="inline-block">
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                  ✨ Viagens em Grupo Reinventadas
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Dê Match no Destino
                <span className="block text-[#6496D8]">Perfeito</span>
              </h1>
              
              <p className="text-xl text-blue-100 leading-relaxed">
                Reúna seus amigos, votem nos destinos favoritos e descubram o lugar ideal para a próxima aventura. 
                Simples como dar swipe!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg"
                  asChild
                  className="bg-white text-[#0E0652] hover:bg-gray-100 text-lg px-8 py-6 group"
                >
                  <Link to="/register" className="flex items-center">
                    Criar uma conta
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Content - Mock Desktop Monitor */}
            <div className="relative hidden md:block">
              <div
                className="relative mx-auto w-[500px]"
                style={{ aspectRatio: '16 / 9' }}
              >
                {/* Monitor Frame */}
                <div className="bg-gray-900 h-full rounded-2xl shadow-2xl p-3 border-8 border-gray-800 flex flex-col">
                  {/* Screen */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg overflow-hidden flex-1 flex items-center justify-center p-8 pb-16">
                  {/* Mock Card */}
                  <div className="relative w-full max-w-sm">
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                      <div className="h-72 bg-gradient-to-br from-[#0E0652] via-[#002F76] to-[#6496D8] flex flex-col items-center justify-center px-8 text-center text-white">
                        <div className="text-6xl mb-4">🏖️</div>
                        <h3 className="text-2xl font-bold mb-2">Jericoacoara</h3>
                        <p className="text-xs opacity-80 mt-2">
                          Lagoas cristalinas, dunas e pôr do sol inesquecível já curtidos por 87% do grupo.
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons - Only 2 options */}
                    <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-6">
                    <div className="h-16 w-16 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                      <span className="text-3xl text-[#ec4c6a]">✕</span>
                    </div>
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#0E0652] to-[#6496D8] shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                      <Heart className="h-10 w-10 text-white fill-white" />
                    </div>
                    </div>
                  </div>
                  </div>
                </div>
                
                {/* Monitor Stand */}
                <div className="flex justify-center">
                  <div className="w-32 h-4 bg-gray-800 rounded-b-lg"></div>
                </div>
                <div className="flex justify-center">
                  <div className="w-48 h-3 bg-gray-700 rounded-lg"></div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-6 -left-12 bg-white rounded-2xl shadow-xl p-4 animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">Novo Match!</p>
                      <p className="text-xs text-gray-500">Gramado 🎄</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#01001D] mb-4">
              Por que Let's Trip Together?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A forma mais divertida e democrática de escolher o próximo destino do seu grupo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#0E0652] to-[#6496D8] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#01001D] mb-3">Votação por Swipe</h3>
                <p className="text-gray-600 leading-relaxed">
                  Deslize para a direita nos destinos que você ama e para a esquerda nos que não te interessam. 
                  Rápido e intuitivo!
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#01001D] mb-3">Matches Automáticos</h3>
                <p className="text-gray-600 leading-relaxed">
                  Quando todos do grupo curtem um destino, é match! Receba notificações e comece a planejar juntos.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#01001D] mb-3">Grupos Ilimitados</h3>
                <p className="text-gray-600 leading-relaxed">
                  Crie quantos grupos quiser! Família, amigos da faculdade, trabalho... Cada turma tem suas preferências.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#01001D] mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Em 3 passos simples, encontre o destino perfeito para seu grupo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="relative">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#0E0652] to-[#6496D8] flex items-center justify-center mx-auto shadow-lg">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-[#6496D8] text-white flex items-center justify-center font-bold shadow ring-4 ring-white">
                    1
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#01001D] mb-3">Crie um Grupo</h3>
                <p className="text-gray-600 leading-relaxed">
                  Convide seus amigos para fazer parte do grupo de viagem. Quanto mais, melhor!
                </p>
              </div>
              {/* Arrow */}
              <div className="hidden md:block absolute top-10 -right-6 text-[#6496D8]">
                <ChevronRight className="h-8 w-8" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold shadow ring-4 ring-white">
                    2
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#01001D] mb-3">Vote nos Destinos</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dê swipe nos destinos sugeridos. Curta os que você ama, dispense os demais.
                </p>
              </div>
              {/* Arrow */}
              <div className="hidden md:block absolute top-10 -right-6 text-green-500">
                <ChevronRight className="h-8 w-8" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center mx-auto shadow-lg">
                    <Plane className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 text-white flex items-center justify-center font-bold shadow ring-4 ring-white">
                    3
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#01001D] mb-3">Viajem Juntos!</h3>
                <p className="text-gray-600 leading-relaxed">
                  Receba os matches e comece a planejar a viagem dos sonhos com seus amigos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#01001D] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#0E0652] to-[#6496D8] flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg">Let's Trip Together</span>
              </div>
              <p className="text-gray-400 text-sm">
                A forma mais fácil de planejar viagens em grupo.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/about-us" className="hover:text-white transition">Sobre Nós</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/terms-of-use" className="hover:text-white transition">Termos de Uso</a></li>
                <li><a href="/privacy-policy" className="hover:text-white transition">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Let's Trip Together. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
