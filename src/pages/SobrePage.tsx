
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const SobrePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background bg-stars">
      <NavBar />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-mystical text-accent mb-4">Sobre o Mystical Tarot</h1>
            <p className="text-muted-foreground">
              Conheça nossa missão, visão e a história por trás deste projeto.
            </p>
          </header>
          
          <div className="space-y-10">
            <section className="mystic-border p-6 md:p-8 animate-fade-in">
              <h2 className="text-2xl font-mystical text-accent mb-4">Nossa Missão</h2>
              <p className="text-foreground mb-4">
                O Mystical Tarot Insights nasceu da paixão por unir a sabedoria ancestral do tarô com as tecnologias modernas. Nossa missão é democratizar o acesso ao conhecimento esotérico e oferecer ferramentas intuitivas para autoconhecimento e desenvolvimento pessoal.
              </p>
              <p className="text-foreground">
                Acreditamos que o tarô é uma poderosa ferramenta para reflexão, autoconhecimento e conexão com nossa intuição. Através de interpretações personalizadas e conteúdo educativo de qualidade, buscamos desmistificar o tarô e apresentá-lo como um caminho para compreensão mais profunda de si mesmo e das situações da vida.
              </p>
            </section>
            
            <section className="mystic-border p-6 md:p-8 animate-fade-in">
              <h2 className="text-2xl font-mystical text-accent mb-4">O Tarô Como Ferramenta</h2>
              <p className="text-foreground mb-4">
                Para nós, o tarô vai além da simples adivinhação. É um espelho da psique humana, um mapa do inconsciente coletivo e um sistema simbólico que reflete os arquétipos universais presentes em todas as culturas.
              </p>
              <p className="text-foreground mb-4">
                Nossa abordagem integra conhecimentos de psicologia, mitologia, simbolismo esotérico e filosofia, oferecendo uma visão holística e acessível das cartas de tarô e seus significados.
              </p>
              <p className="text-foreground">
                Acreditamos que o verdadeiro poder do tarô está em sua capacidade de nos ajudar a acessar nossa sabedoria interior, servindo como um catalisador para insights e transformações pessoais.
              </p>
            </section>
            
            <section className="mystic-border p-6 md:p-8 animate-fade-in">
              <h2 className="text-2xl font-mystical text-accent mb-4">Nossa Abordagem</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-mystical text-primary mb-2">Tecnologia a Serviço da Intuição</h3>
                  <p className="text-muted-foreground mb-4">
                    Utilizamos inteligência artificial avançada para oferecer interpretações personalizadas, sempre respeitando a natureza intuitiva e simbólica do tarô.
                  </p>
                  
                  <h3 className="text-lg font-mystical text-primary mb-2">Educação Contínua</h3>
                  <p className="text-muted-foreground">
                    Nosso acervo de estudos é constantemente atualizado com novos conteúdos, promovendo o aprendizado contínuo sobre tarô e temas relacionados.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-mystical text-primary mb-2">Respeito à Diversidade</h3>
                  <p className="text-muted-foreground mb-4">
                    Reconhecemos e respeitamos as diversas tradições esotéricas e espirituais, apresentando múltiplas perspectivas sobre o tarô.
                  </p>
                  
                  <h3 className="text-lg font-mystical text-primary mb-2">Comunidade</h3>
                  <p className="text-muted-foreground">
                    Estamos construindo um espaço onde entusiastas do tarô possam compartilhar experiências, aprender juntos e crescer em sua prática.
                  </p>
                </div>
              </div>
            </section>
            
            <section className="mystic-border p-6 md:p-8 animate-fade-in">
              <h2 className="text-2xl font-mystical text-accent mb-4">Entre em Contato</h2>
              <p className="text-foreground mb-6">
                Estamos sempre abertos a feedbacks, sugestões e parcerias. Se você tem alguma dúvida ou gostaria de entrar em contato conosco, utilize os canais abaixo:
              </p>
              
              <div className="space-y-3">
                <p className="text-primary">📧 E-mail: <a href="mailto:contato@mysticaltarot.com" className="hover:text-accent transition-colors">contato@mysticaltarot.com</a></p>
                <p className="text-primary">📱 Redes Sociais: @mysticaltarotinsights</p>
                <p className="text-primary">💬 Chat: Disponível em horário comercial através do nosso site</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SobrePage;
