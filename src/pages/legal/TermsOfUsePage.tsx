import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export default function TermsOfUsePage() {
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
                Termos de Uso
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Conheça os termos e condições que regem o uso do Let's Trip Together.
              </p>
            </div>

            <div className="max-w-4xl mx-auto text-left space-y-12">
              <section className="mb-4 space-y-4">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Bem-vindo à Let's Trip Together. Estes Termos de Uso ("Termos") regem a relação entre você ("Usuário") e a plataforma Let's Trip Together ("Plataforma", "Serviço", "nós").
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A Let's Trip Together é um projeto acadêmico desenvolvido para fins educacionais (Projeto de Final de Curso). O serviço é fornecido "no estado em que se encontra", sem fins comerciais.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Este documento rege seu acesso e uso de nossa plataforma, aplicativo ou site ("Serviço"), projetados para facilitar a descoberta e o matching de destinos turísticos para grupos de amigos.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Entendemos que você nos confia seus dados e zelamos por essa confiança. Por isso, em nossa Política de Privacidade, explicamos os dados que coletamos, o motivo pelo qual os coletamos, como são usados e os seus direitos em relação a esses dados, em conformidade com a Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018).
                </p>
                <p className="text-gray-500 text-base">
                  Data da última atualização: 14 de novembro de 2025.
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  1. Qualificação e Aceitação dos Termos
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Você deve ter, no mínimo, 18 anos de idade e plena capacidade legal na forma da lei civil brasileira para celebrar um contrato vinculativo com a Let's Trip Together. Ao utilizar o Serviço, você declara que pode firmar um contrato conosco, que não está impedido por lei e que cumprirá todas as normas aplicáveis.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Ao acessar ou utilizar o Serviço, você declara e garante que: 
                </p>
                <ul className="text-gray-700 text-lg leading-relaxed space-y-2" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                  <li>
                    Você pode firmar um contrato vinculativo conosco.
                  </li>
                  <li>
                    Você não está impedido de utilizar o Serviço nos termos das leis da República Federativa do Brasil.
                  </li>
                  <li>
                    Você cumprirá este Contrato e todas as leis, normas e regulamentos municipais, estaduais, nacionais e internacionais aplicáveis.
                  </li>
                </ul>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  2. Sua Conta
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Para usar a Let's Trip Together, você deve se cadastrar para uma conta de usuário. Você concorda em fornecer informações precisas, completas e atuais durante o registro. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Você é responsável por manter a confidencialidade de suas credenciais de login (como seu e-mail e senha) e é o único responsável por todas as atividades que ocorrem usando sua conta. Se você acredita que alguém obteve acesso não autorizado à sua conta, entre em contato conosco imediatamente. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  3. Alterações do Serviço e Rescisão 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A Let's Trip Together está empenhada em melhorar o Serviço e a oferecer funcionalidades adicionais. Isso significa que podemos incluir novos recursos ou funcionalidades, alterar ou aprimorar os existentes, ou remover recursos ao longo do tempo. Se fizermos uma alteração significativa que afete adversamente seu uso, faremos o possível para notificar com antecedência razoável. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Podemos suspender totalmente o Serviço, caso em que você será notificado com antecedência, a menos que circunstâncias atenuantes, como questões de segurança, nos impeçam de fazê-lo.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Você pode encerrar sua conta ou solicitar a anonimização dos seus dados a qualquer momento, seguindo as instruções na Plataforma. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A Let's Trip Together poderá suspender ou cancelar seu acesso ao Serviço a qualquer momento, sem aviso prévio, se acreditar que você violou este Contrato ou usou o Serviço de forma que possa prejudicar a Plataforma ou nossos outros usuários. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  4. Segurança e Interações com Outros Usuários 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Embora a Let's Trip Together forneça a infraestrutura de tecnologia para o matching de destinos, não somos responsáveis pela conduta dos usuários dentro ou fora da Plataforma. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Você concorda em agir com cautela em todas as interações com outros usuários, especialmente ao decidir se comunicar fora do Serviço ou organizar viagens e encontros pessoalmente. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  VOCÊ É O ÚNICO RESPONSÁVEL POR SUAS INTERAÇÕES COM OUTROS USUÁRIOS. VOCÊ COMPREENDE QUE A LET'S TRIP TOGETHER NÃO INVESTIGA OS ANTECEDENTES CRIMINAIS DOS USUÁRIOS. A LET'S TRIP TOGETHER NÃO MANIFESTA DECLARAÇÕES OU GARANTIAS EM RELAÇÃO À CONDUTA DOS USUÁRIOS. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  5. Direitos Concedidos a Você (Licença de Uso) 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A Let's Trip Together concede a você uma licença pessoal, mundial, gratuita, intransferível, não exclusiva e revogável para acessar e utilizar o Serviço. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Essa licença é para o propósito exclusivo de permitir que você use e desfrute dos benefícios do Serviço, conforme a intenção da Let's Trip Together e autorização prevista neste Contrato. Portanto, você concorda em não: 
                </p>
                <ul className="text-gray-700 text-lg leading-relaxed space-y-2" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                  <li>
                    Usar o Serviço, ou qualquer conteúdo contido nele, para fins comerciais sem nossa autorização por escrito. 
                  </li>
                  <li>
                    Copiar, modificar, transmitir, criar trabalhos derivados, fazer uso ou reproduzir materiais protegidos por direitos autorais, imagens, marcas comerciais ou outros direitos de propriedade intelectual acessíveis através do Serviço. 
                  </li>
                  <li>
                    Utilizar robô, bot, spider, rastreador, scraper, ou outro dispositivo ou processo automático para acessar, recuperar, indexar, ou de outra forma, reproduzir ou contornar a estrutura de navegação ou apresentação do Serviço. 
                  </li>
                  <li>
                    Utilizar o Serviço de forma que possa interferir, interromper ou afetar negativamente o Serviço, os servidores ou redes conectadas. 
                  </li>
                  <li>
                    Enviar vírus ou outro código malicioso ou, de outra forma, comprometer a segurança do Serviço. 
                  </li>
                  <li>
                    Modificar, adaptar, sublicenciar, traduzir, vender, promover engenharia reversa, decifrar, descompilar ou desmontar qualquer parte do Serviço. 
                  </li>
                  <li>
                    Incentivar ou promover qualquer atividade que viole este Contrato. 
                  </li>
                </ul>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A Let's Trip Together pode investigar e tomar todas as medidas legalmente disponíveis em resposta a usos ilegais e/ou não autorizados do Serviço, inclusive o cancelamento da sua conta. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  6. Direitos Concedidos por Você (Seu Conteúdo) 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Ao criar uma conta, você concede à Let's Trip Together uma licença universal, transferível, sublicenciável e gratuita, e o direito de hospedar, armazenar, utilizar, copiar, exibir, reproduzir, adaptar, editar, publicar e distribuir informações e conteúdos que você publicar, fizer upload, exibir ou, de outra forma, disponibilizar (coletivamente, "Conteúdo") no Serviço. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Esta licença está sujeita aos seus direitos de acordo com a lei aplicável (principalmente a LGPD) e é concedida com o propósito exclusivo de operar, desenvolver, fornecer (incluindo a execução do matching de destinos) e melhorar o Serviço, bem como para fins de análise e pesquisa (desde que de forma agregada e anonimizada). 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Você declara e garante que todas as informações e Conteúdo que você fornece são corretos e verdadeiros, e que você tem o direito de publicar o Conteúdo no Serviço e conceder a licença acima descrita à Let's Trip Together. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Você compreende e concorda que podemos monitorar ou revisar qualquer Conteúdo que você publicar. Podemos remover qualquer Conteúdo, no todo ou em parte, que, a nosso critério exclusivo, viole este Contrato ou possa prejudicar a reputação do Serviço. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Ao enviar sugestões ou comentários à Let's Trip Together sobre o nosso Serviço, você concorda que podemos utilizar e compartilhar as sugestões para qualquer finalidade, sem compensação. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Você está ciente de que a Let's Trip Together poderá acessar, armazenar e divulgar as informações da sua conta e Conteúdo se exigido por lei ou se acreditar, de boa-fé, que o acesso, armazenamento ou divulgação satisfaçam um interesse legítimo, incluindo: (i) cumprir com um processo judicial; (ii) fazer cumprir o Contrato; (iii) responder a reivindicações de qualquer Conteúdo que viole os direitos de terceiros; (iv) responder a solicitações de autoridades (como a ANPD); ou (v) proteger os direitos, bens ou segurança pessoal da Plataforma ou de qualquer outra pessoa. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  7. Regras da Comunidade e Conduta 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Ao utilizar o Serviço, você concorda em não: 
                </p>
                <ul className="text-gray-700 text-lg leading-relaxed space-y-2" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                  <li>
                    Utilizar o Serviço para qualquer finalidade que seja ilegal ou proibida por este Contrato. 
                  </li>
                  <li>
                    Usar o Serviço para qualquer fim prejudicial ou desonesto, como espalhar desinformação ou difamar. 
                  </li>
                  <li>
                    Fazer spam, solicitar dinheiro ou fraudar qualquer usuário. 
                  </li>
                  <li>
                    Personificar qualquer pessoa ou entidade. 
                  </li>
                  <li>
                    Publicar qualquer Conteúdo que viole ou infrinja os direitos de outra pessoa, inclusive direitos de publicidade, privacidade, direitos autorais ou marca comercial. 
                  </li>
                  <li>
                    Publicar qualquer Conteúdo de ódio, ameaçador, sexualmente explícito ou pornográfico. 
                  </li>
                  <li>
                    Publicar qualquer Conteúdo que incite a violência, promova racismo, fanatismo, ódio ou danos físicos de qualquer natureza. 
                  </li>
                  <li>
                    Solicitar senhas ou informações de identificação pessoal de outros usuários para fins comerciais ou ilegais. 
                  </li>
                </ul>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A Let's Trip Together reserva-se o direito de investigar e/ou cancelar sua conta se você violar este Contrato ou utilizar o Serviço de forma inadequada ou ilegal, e pode, a nosso critério exclusivo, remover ou modificar Conteúdo que viole estes termos. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  8. Conteúdo de Outros Usuários 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A Plataforma exibirá Conteúdo gerado por outros usuários. Embora a Let's Trip Together se reserve o direito de revisar e remover o Conteúdo que viola este Contrato, o referido Conteúdo é de exclusiva responsabilidade do usuário que o publica, e não podemos garantir que todo o Conteúdo estará em conformidade. Se você se deparar com algum Conteúdo que viole este Contrato, informe-nos. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  9. Isenção de Responsabilidade 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A LET'S TRIP TOGETHER OFERECE O SERVIÇO "NO ESTADO EM QUE SE ENCONTRA" E "CONFORME DISPONÍVEL". NA EXTENSÃO PERMITIDA PELA LEI APLICÁVEL, NÃO CONCEDEMOS GARANTIAS DE QUALQUER TIPO, EXPRESSAS, IMPLÍCITAS OU ESTATUTÁRIAS, COM RELAÇÃO AO SERVIÇO (INCLUINDO TODO O CONTEÚDO CONTIDO NO MESMO), INCLUSIVE, ENTRE OUTRAS, GARANTIAS IMPLÍCITAS DE QUALIDADE SATISFATÓRIA, ADEQUAÇÃO A UM DETERMINADO FIM OU NÃO VIOLAÇÃO. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A LET'S TRIP TOGETHER NÃO DECLARA OU GARANTE QUE (A) O SERVIÇO SERÁ ININTERRUPTO, SEGURO OU LIVRE DE ERROS, (B) QUAISQUER DEFEITOS OU ERROS NO SERVIÇO SERÃO CORRIGIDOS, OU (C) QUE QUALQUER CONTEÚDO OU INFORMAÇÃO QUE VOCÊ OBTENHA NO OU ATRAVÉS DO SERVIÇO SERÃO PRECISOS. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A LET'S TRIP TOGETHER NÃO ASSUME NENHUMA RESPONSABILIDADE POR QUALQUER CONTEÚDO QUE VOCÊ, OUTROS USUÁRIOS OU TERCEIROS PUBLICAM, ENVIAM OU RECEBEM ATRAVÉS DO SERVIÇO. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  10. Serviços Terceirizados 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  O Serviço pode conter anúncios ou links para outros sites ou recursos de terceiros (como sites de reserva de hotéis ou passagens). A Let's Trip Together não é responsável pela disponibilidade desses sites ou recursos externos. Se optar por interagir com terceiros, os termos desse terceiro controlarão a relação deles com você. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  11. Limitação de Responsabilidade 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  EM TODA A EXTENSÃO PERMITIDA PELA LEI APLICÁVEL, EM NENHUMA CIRCUNSTÂNCIA, A LET'S TRIP TOGETHER, seus desenvolvedores ou representantes SERÃO RESPONSÁVEIS POR QUAISQUER DANOS INDIRETOS, CONSEQUENTES, EXEMPLARES, INCIDENTAIS, ESPECIAIS OU PUNITIVOS, INCLUSIVE, ENTRE OUTROS, PERDA DE LUCROS, INCORRIDA INDIRETAMENTE, OU PERDA DE DADOS, USO OU OUTRAS PERDAS INTANGÍVEIS, RESULTANTES DO SEGUINTE: (I) O SEU ACESSO, UTILIZAÇÃO OU INCAPACIDADE DE ACESSO OU UTILIZAÇÃO DOS SERVIÇOS, (II) A CONDUTA OU CONTEÚDO DE OUTROS USUÁRIOS OU TERCEIROS; OU (III) ACESSO, USO OU ALTERAÇÃO NÃO AUTORIZADA DO SEU CONTEÚDO, AINDA QUE A LET'S TRIP TOGETHER TENHA SIDO AVISADA DA POSSIBILIDADE DOS REFERIDOS DANOS. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  12. Indenização por Você 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Você concorda, na extensão permitida pela lei aplicável, em indenizar, defender e isentar a Let's Trip Together e seus respectivos desenvolvedores e representantes de e contra quaisquer e todas as reclamações, demandas, danos, perdas, custos, responsabilidades e despesas, inclusive honorários advocatícios decorrentes, resultantes ou relacionados, de qualquer forma, com o seu acesso ou uso do Serviço, seu Conteúdo, ou sua violação deste Contrato. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  13. Renúncia de Ação Coletiva 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  AO UTILIZAR O SERVIÇO SOB QUALQUER FORMA, E NA MÁXIMA EXTENSÃO PERMITIDA PELA LEI, VOCÊ ABRE MÃO DO SEU DIREITO DE BUSCAR UM TRIBUNAL para resolver ou defender quaisquer reivindicações entre você e a Plataforma (exceto para assuntos que possam ser levados ao juizado de pequenas causas). VOCÊ IGUALMENTE ABRE MÃO DO SEU DIREITO DE PARTICIPAR DE UMA AÇÃO COLETIVA OU OUTRO PROCESSO COLETIVO CONTRA A LET'S TRIP TOGETHER. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  14. Custos e Licença Gratuita 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A plataforma Let's Trip Together é fornecida a você gratuitamente, conforme a licença descrita na Seção 5. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A Let's Trip Together reserva-se o direito de, a qualquer momento e com aviso prévio razoável, alterar esta política de gratuidade, introduzir planos pagos ou limitar o acesso gratuito. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  15. Contrato Integral 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Este Contrato, juntamente com a Política de Privacidade, constitui o contrato integral entre você e a Let's Trip Together sobre a utilização do Serviço. Se qualquer disposição deste Contrato for considerada inválida, as demais disposições permanecerão em pleno vigor e efeito. 
                </p>
              </section>

              <section className="border-t border-gray-200 pt-10 mb-4 space-y-4">
                <h2 className="text-2xl font-semibold text-[#01001D] mt-4 mb-4">
                  16. Legislação Aplicável e Foro 
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Este Contrato será regido, interpretado e executado de acordo com as leis da República Federativa do Brasil, incluindo, mas não se limitando, à Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018) e ao Código de Defesa do Consumidor (Lei nº 8.078/1990). 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Fica eleito o foro da Comarca de Mogi Das Cruzes/SP, Brasil, para dirimir quaisquer litígios ou controvérsias oriundas deste Contrato, com expressa renúncia a qualquer outro, por mais privilegiado que seja. 
                </p>
                <p className="text-gray-700 text-lg leading-relaxed font-semibold">
                  Let's Trip Together – 2025.
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

