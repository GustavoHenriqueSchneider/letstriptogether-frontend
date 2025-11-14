import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfUsePage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Voltar para a página anterior ou para register se não houver histórico
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0E0652] text-white p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
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
}

