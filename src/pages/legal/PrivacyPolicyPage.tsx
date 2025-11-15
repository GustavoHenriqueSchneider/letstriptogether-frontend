import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
              <h1 className="text-4xl font-bold text-[#01001D] mb-4 mt-4">
                Política de Privacidade
              </h1>
            </div>

            <div className="max-w-4xl mx-auto text-left space-y-12">
              <section className="mb-4 space-y-4">
                <p className="text-gray-700 text-lg leading-relaxed">

                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  1. Quem Somos (O Controlador dos Dados) 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Como a Let's Trip Together é um projeto acadêmico sem fins comerciais, a responsabilidade pelo controle e processamento dos seus dados pessoais ("Controlador de Dados") é dos desenvolvedores e orientadores responsáveis pelo projeto. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Para qualquer dúvida sobre seus dados, consulte a Seção 11 ("Como Entrar em Contato Conosco"). 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  2. A que esta Política de Privacidade se Aplica 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Esta Política de Privacidade se aplica à plataforma, site ou aplicativo ("Serviço") operado pela Let's Trip Together. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  3. Dados que coletamos 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Para que o serviço funcione, precisamos de algumas informações básicas. Nós não coletamos dados sensíveis (como religião, orientação política ou sexual), não coletamos sua localização precisa (GPS) e não permitimos o upload de fotos ou o uso de chat. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Os dados que coletamos são: 
                </p>
                <div className="space-y-3">
                  <p className="text-[#01001D] text-xl font-semibold">Dados que Você nos Fornece</p>
                  <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="w-full border-collapse text-left text-gray-800 text-base">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-[#01001D] border-b border-gray-200 w-1/3">
                          Categoria de Dados
                        </th>
                        <th className="px-6 py-4 font-semibold text-[#01001D] border-b border-gray-200">
                          Descrição
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-6 py-4 border-b border-gray-200 align-top font-medium" style={{ width: '33.333%' }}>
                          Dados da Conta
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          Ao criar sua conta, você nos fornece seu Nome Completo, Email e uma Senha (que é armazenada de forma criptografada). 
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 border-b border-gray-200 align-top font-medium" style={{ width: '33.333%' }}>
                          Conteúdo Gerado pelo Usuário
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          Nomes dos grupos, descrições e demais informações que você cadastra para organizar viagens.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[#01001D] text-xl font-semibold">Dados Coletados Automaticamente</p>
                  <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="w-full border-collapse text-left text-gray-800 text-base">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-[#01001D] border-b border-gray-200 w-1/3">
                          Categoria de Dados
                        </th>
                        <th className="px-6 py-4 font-semibold text-[#01001D] border-b border-gray-200">
                          Descrição
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-6 py-4 border-b border-gray-200 align-top font-medium" style={{ width: '33.333%' }}>
                          Dados Técnicos e de Uso
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          Mesmo sem você nos fornecer ativamente, nós coletamos informações técnicas necessárias para a segurança e operação da plataforma. Isso inclui seu endereço IP, tipo de navegador e dispositivo, registros de data e hora de acesso, e informações sobre como você interage com o Serviço (quais recursos usa, por exemplo). 
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
                </div>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  4. Como (e Por Que) Usamos Seus Dados 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Usamos seus dados exclusivamente para os seguintes propósitos, com base nas permissões da LGPD: 
                </p>
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="w-full border-collapse text-left text-gray-800 text-base">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-[#01001D] border-b border-gray-200">
                          Finalidade do Processamento
                        </th>
                        <th className="px-6 py-4 font-semibold text-[#01001D] border-b border-gray-200">
                          Fundamento Legal (LGPD)
                        </th>
                        <th className="px-6 py-4 font-semibold text-[#01001D] border-b border-gray-200">
                          Categorias de Dados Utilizadas
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-6 py-4 border-b border-gray-200 align-top font-semibold">
                          Para Criar e Manter sua Conta
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          Execução de Contrato (Nossos Termos de Uso)
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          Dados da Conta (Nome completo, Email e Senha)
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 border-b border-gray-200 align-top font-semibold">
                          Para Fornecer o Serviço
                          <span className="block text-sm text-gray-500">
                            (Permitir a criação de grupos e o matching de destinos no Brasil)
                          </span>
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          Execução de Contrato (Nossos Termos de Uso)
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          Dados da Conta (nome visível para o grupo) e Conteúdo Gerado pelo Usuário (nomes dos grupos)
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 border-b border-gray-200 align-top font-semibold">
                          Para Proteger e Melhorar o Serviço
                          <span className="block text-sm text-gray-500">
                            (Garantir segurança, corrigir bugs e entender como a plataforma é usada para fins acadêmicos)
                          </span>
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          Legítimo Interesse
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          Dados Técnicos e de Uso
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 border-b border-gray-200 align-top font-semibold">
                          Para Cumprir a Lei
                          <span className="block text-sm text-gray-500">
                            (Responder a ordem judicial ou requisições legais, como as do Marco Civil da Internet)
                          </span>
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          Obrigação Legal
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          Todos os dados necessários, conforme legalmente exigido
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  5. Como Compartilhamos os Dados 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A sua privacidade é fundamental para nós. Nós não vendemos seus dados pessoais e não compartilhamos seus dados com empresas de publicidade.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  O compartilhamento de dados ocorre apenas nas seguintes circunstâncias: 
                </p>
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="w-full border-collapse text-left text-gray-800 text-base">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-[#01001D] border-b border-gray-200" style={{ width: '33.333%' }}>
                          Destinatários
                        </th>
                        <th className="px-6 py-4 font-semibold text-[#01001D] border-b border-gray-200">
                          Motivos para o Compartilhamento
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-6 py-4 border-b border-gray-200 align-top font-semibold" style={{ width: '33.333%' }}>
                          Outros Membros do Seu Grupo
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          Seu <span className="font-semibold">Nome</span> ficará visível para os outros usuários que estiverem no mesmo grupo que você dentro da plataforma.
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 border-b border-gray-200 align-top font-semibold" style={{ width: '33.333%' }}>
                          Prestadores de Serviços Técnicos
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          Podemos usar serviços de terceiros essenciais para operar a plataforma (por exemplo, hospedagem em nuvem onde os dados ficam armazenados). Esses provedores são proibidos de usar seus dados para qualquer outra finalidade.
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 border-b border-gray-200 align-top font-semibold" style={{ width: '33.333%' }}>
                          Autoridades Judiciais
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          Podemos divulgar seus dados se formos obrigados por lei ou por uma ordem judicial válida no Brasil.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  6. Transferências de Dados Internacionais 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Embora nosso serviço seja focado em destinos no Brasil, os dados que coletamos (como seu nome e email) podem ser armazenados em servidores de nuvem localizados fora do território brasileiro (por exemplo, em servidores de hospedagem nos Estados Unidos ou Europa). 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Caso isso ocorra, garantimos que essa transferência será feita apenas para países que ofereçam um nível adequado de proteção de dados ou através de mecanismos contratuais que estejam em conformidade com as exigências da LGPD. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  7. Seus Direitos (De Acordo com a LGPD) 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Você, como titular dos dados, possui total controle sobre suas informações. A LGPD (Art. 18) garante a você os seguintes direitos: 
                </p>
                <ul className="text-gray-700 text-lg leading-relaxed space-y-2" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                  <li>
                    Confirmação e Acesso: O direito de saber se processamos seus dados e de pedir uma cópia do que temos sobre você. 
                  </li>
                  <li>
                    Correção: O direito de corrigir dados incompletos, inexatos ou desatualizados. 
                  </li>
                  <li>
                    Anonimização, Bloqueio ou Eliminação: O direito de pedir que seus dados sejam anonimizados, bloqueados ou excluídos se forem desnecessários, excessivos ou tratados em desconformidade com a LGPD. 
                  </li>
                  <li>
                    Portabilidade: O direito de solicitar a transferência dos seus dados a outro fornecedor de serviço (o que pode não se aplicar totalmente a um projeto acadêmico). 
                  </li>
                  <li>
                    Eliminação: O direito de ter seus dados pessoais excluídos após o término do tratamento (exceto nos casos em que a lei permite a conservação). 
                  </li>
                  <li>
                    Informação sobre Compartilhamento: O direito de saber com quais entidades públicas ou privadas nós compartilhamos seus dados. 
                  </li>
                  <li>
                    Revogação do Consentimento: O direito de retirar seu consentimento a qualquer momento (embora nosso processamento principal se baseie na "Execução de Contrato", e não em consentimento). 
                  </li>
                </ul>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Para exercer qualquer um desses direitos, por favor, entre em contato conosco (veja a Seção 11). 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  8. Por Quanto Tempo Ficamos com Seus Dados 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Nós manteremos seus dados pessoais (Nome, Email, Nomes de Grupos) apenas pelo tempo necessário para fornecer o Serviço a você. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Se você decidir encerrar sua conta, seus dados pessoais identificáveis serão permanentemente excluídos ou anonimizados. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Poderemos reter alguns dados (como registros de acesso) pelo prazo exigido por lei (por exemplo, 6 meses, conforme o Marco Civil da Internet) ou dados técnicos anonimizados para fins de pesquisa acadêmica e estatística. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  9. Privacidade de Menores de Idade 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Nossos serviços são restritos a indivíduos que tenham, no mínimo, 18 anos de idade, conforme definido em nossos Termos de Uso. Não permitimos intencionalmente indivíduos menores de 18 anos na nossa plataforma. Se você suspeitar que um usuário é menor de idade, por favor, use os mecanismos de denúncia disponíveis ou entre em contato conosco. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  10. Alterações da Política de Privacidade 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Esta política poderá ser alterada ao longo do tempo. Como este é um projeto acadêmico, as mudanças podem ocorrer para adaptar o Serviço aos requisitos do trabalho. Se fizermos alterações significativas, faremos o possível para notificá-lo (por exemplo, por um aviso na plataforma ou por email) para que você possa revisar as mudanças. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  11. Como Entrar em Contato Conosco 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Se você tiver qualquer dúvida sobre esta Política de Privacidade ou sobre seus direitos segundo a LGPD, entre em contato conosco através do canal oficial do projeto: <a href="mailto:letstriptogether2025@outlook.com" className="text-blue-500 hover:text-blue-600">letstriptogether2025@outlook.com</a>.
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
