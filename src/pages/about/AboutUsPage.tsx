import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white text-[#01001D] flex flex-col">
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-1 mt-24 mb-16">
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-[#01001D] mb-6 mt-4">
                Sobre Nós
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Planejar uma viagem em grupo é, muitas vezes, mais difícil do que a própria viagem. A parte mais complicada? Decidir o destino.
              </p>
            </div>

            <div className="max-w-4xl mx-auto text-left space-y-12">
              <section className="mb-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  Uma solução
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A Let's Trip Together nasceu exatamente para resolver esse problema. Somos uma plataforma web criada para ajudar grupos de amigos a descobrir destinos de viagem de uma forma simples e democrática: através do match de preferências.
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  Visão
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Nossa visão é um mundo onde o planejamento de viagens em grupo seja tão divertido quanto a própria viagem. Acreditamos que a tecnologia pode ser a ponte que transforma conversas de "um dia a gente podia..." em "a passagem está comprada!". Queremos eliminar o estresse da indecisão para que sobre apenas a expectativa da próxima aventura juntos.
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 space-y-5 ">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  Nossa História
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A Let's Trip Together é mais do que uma plataforma; é o nosso Trabalho de Final de Curso para o Bacharelado em Engenharia de Software na Universidade de Mogi das Cruzes (UMC).
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Nós somos Aline Montório Rossi e Gustavo Henrique Schneider, dois desenvolvedores apaixonados por tecnologia e por resolver problemas do mundo real.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Criamos este projeto com o objetivo de aplicar nosso conhecimento técnico para oferecer uma solução real para um desafio comum, sempre respeitando as melhores práticas de desenvolvimento e a privacidade dos usuários (LGPD).
                </p>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  O nosso objetivo é um só: facilitar o planejamento para que vocês possam focar no mais importante: viajar juntos.
                </p>
                <p className="text-gray-900 text-lg font-semibold">
                  Obrigado por usar o nosso projeto!
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>

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

