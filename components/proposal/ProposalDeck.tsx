"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./proposal.module.css";

type NavigationSource = "button" | "keyboard";

const slideMeta = [
  "Abertura",
  "Oportunidade",
  "Product Design",
  "Consciência",
  "Segmentação",
  "Mensagens",
  "Estrutura",
  "Funil",
  "Escada de valor",
  "Medição",
  "Performance",
  "Evidências",
  "Valor comparável",
  "Proposta",
] as const;

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d={direction === "right" ? "M5 12h14M13 6l6 6-6 6" : "M19 12H5m6-6-6 6 6 6"} />
    </svg>
  );
}

function Source({ children }: { children: React.ReactNode }) {
  return <p className={styles.source}>{children}</p>;
}

export function ProposalDeck() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [instant, setInstant] = useState(false);
  const [motionKey, setMotionKey] = useState(0);
  const total = slideMeta.length;

  const move = useCallback(
    (step: -1 | 1, source: NavigationSource = "button") => {
      setDirection(step > 0 ? "next" : "previous");
      setInstant(source === "keyboard");
      setIndex((current) => Math.max(0, Math.min(total - 1, current + step)));
      setMotionKey((current) => current + 1);
    },
    [total],
  );

  const goToBoundary = useCallback((target: "first" | "last") => {
    setDirection(target === "last" ? "next" : "previous");
    setInstant(true);
    setIndex(target === "last" ? total - 1 : 0);
    setMotionKey((current) => current + 1);
  }, [total]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest("input, textarea, select")) return;

      if (["ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        move(1, "keyboard");
      }
      if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        move(-1, "keyboard");
      }
      if (event.key === "Home") {
        event.preventDefault();
        goToBoundary("first");
      }
      if (event.key === "End") {
        event.preventDefault();
        goToBoundary("last");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToBoundary, move]);

  const slides = useMemo(
    () => [
      <section className={`${styles.slide} ${styles.cover}`} aria-labelledby="proposal-cover" key="cover">
        <div className={styles.coverMark} aria-hidden="true">
          <Image src="/brand/priscilla-castao-mark.svg" alt="" width={180} height={180} priority />
        </div>
        <div className={styles.coverCopy}>
          <p className={styles.kicker}>Proposta estratégica · 2026</p>
          <h1 id="proposal-cover" aria-label="Da descoberta ao agendamento.">Da descoberta<br /><em>ao agendamento.</em></h1>
          <p className={styles.lead}>Produto digital, posicionamento e medição para transformar interesse em aulas.</p>
        </div>
        <div className={styles.coverFooter}>
          <strong>Antônio Júnior</strong>
          <span>Product Designer</span>
        </div>
      </section>,

      <section className={styles.slide} aria-labelledby="opportunity-title" key="opportunity">
        <p className={styles.kicker}>O ponto de partida</p>
        <h2 id="opportunity-title">O site organiza o caminho até a aula.</h2>
        <p className={styles.slideIntro}>Uma pessoa pode chegar pelo Instagram, pelo Google ou por indicação. Em todos os casos, ela precisa entender a proposta, confiar e saber como agendar.</p>
        <div className={styles.journeyGrid}>
          <div><b>01</b><strong>Descobrir</strong><span>Encontrar Priscilla no momento certo.</span></div>
          <div><b>02</b><strong>Entender</strong><span>Reconhecer qual aula atende ao seu objetivo.</span></div>
          <div><b>03</b><strong>Confiar</strong><span>Perceber método, cuidado e acompanhamento.</span></div>
          <div><b>04</b><strong>Agendar</strong><span>Chegar ao WhatsApp sabendo o próximo passo.</span></div>
        </div>
      </section>,

      <section className={styles.slide} aria-labelledby="product-title" key="product">
        <p className={styles.kicker}>O escopo do trabalho</p>
        <h2 id="product-title">Product Design amplia a pergunta.</h2>
        <div className={styles.disciplineGrid}>
          <div><span>Identidade visual</span><p>Como a marca aparece e passa a ser reconhecida.</p></div>
          <div><span>Web design</span><p>Como a informação ganha hierarquia, forma e navegação.</p></div>
          <div className={styles.disciplineFocus}><span>Product Design</span><p>Quem queremos atender, qual jornada construir, o que medir e como evoluir.</p></div>
        </div>
        <blockquote>“A interface é a parte visível de uma hipótese sobre público, oferta e comportamento.”</blockquote>
      </section>,

      <section className={styles.slide} aria-labelledby="awareness-title" key="awareness">
        <div className={styles.titleRow}>
          <div>
            <p className={styles.kicker}>Eugene Schwartz</p>
            <h2 id="awareness-title">Uma pessoa não chega pronta para comprar.</h2>
          </div>
          <p className={styles.sideNote}>A mensagem muda conforme aquilo que a pessoa já sabe.</p>
        </div>
        <ol className={styles.awarenessRail}>
          <li><strong>Inconsciente</strong><span>Ainda não reconhece uma necessidade.</span></li>
          <li><strong>Consciente do problema</strong><span>Sente dificuldade ou desejo, mas não conhece o caminho.</span></li>
          <li><strong>Consciente da solução</strong><span>Já considera aulas, prática ou acompanhamento.</span></li>
          <li><strong>Consciente do produto</strong><span>Conhece Priscilla e avalia se a aula serve para si.</span></li>
          <li><strong>Mais consciente</strong><span>Precisa de condição, horário e um próximo passo claro.</span></li>
        </ol>
        <Source>Referência: Eugene M. Schwartz, <em>Breakthrough Advertising</em> (1966). Adaptação aplicada às aulas.</Source>
      </section>,

      <section className={styles.slide} aria-labelledby="matrix-title" key="matrix">
        <p className={styles.kicker}>A comunicação muda com o objetivo</p>
        <h2 id="matrix-title">Três públicos. Três conversas mais claras.</h2>
        <div className={styles.audiencePaths}>
          <article>
            <span>Quem nunca dançou</span>
            <strong>Quer segurança para começar.</strong>
            <p>Mostramos acolhimento, acompanhamento individual e primeiros passos.</p>
            <b>V1 · Agendar aula</b>
          </article>
          <article>
            <span>Quem já dança</span>
            <strong>Quer mais fluidez e repertório.</strong>
            <p>Falamos de musicalidade, conexão, movimentos e evolução.</p>
            <b>V2 · Agendar aula</b>
          </article>
          <article>
            <span>Quem busca Roots</span>
            <strong>Quer aprofundar uma linguagem corporal.</strong>
            <p>Destacamos jogo de pernas, tronco, quadril e identidade do Roots.</p>
            <b>V3 · Agendar aula de Roots</b>
          </article>
        </div>
      </section>,

      <section className={styles.slide} aria-labelledby="messages-title" key="messages">
        <p className={styles.kicker}>Evidência de segmentação</p>
        <h2 id="messages-title">Três desejos pedem três mensagens.</h2>
        <div className={styles.messageStack}>
          <article><span>/</span><h3>Aprenda forró do zero com acompanhamento individualizado.</h3><a href="/" target="_blank">Abrir V1</a></article>
          <article><span>/evolua-no-forro</span><h3>Dê mais fluidez ao forró que você já dança.</h3><a href="/evolua-no-forro" target="_blank">Abrir V2</a></article>
          <article><span>/forro-roots</span><h3>Forró Roots para começar, continuar e aprofundar.</h3><a href="/forro-roots" target="_blank">Abrir V3</a></article>
        </div>
        <Source>Prova disponível: três rotas implementadas com mensagem, CTA e navegação próprios.</Source>
      </section>,

      <section className={styles.slide} aria-labelledby="structure-title" key="structure">
        <div className={styles.titleRow}>
          <div><p className={styles.kicker}>Arquitetura da landing</p><h2 id="structure-title">Cada trecho responde uma dúvida.</h2></div>
          <p className={styles.sideNote}>A página prepara a conversa antes do WhatsApp.</p>
        </div>
        <div className={styles.pageAnatomy}>
          <div><b>01</b><strong>Reconhecimento</strong><span>“Essa aula é para mim?”</span></div>
          <div><b>02</b><strong>Promessa</strong><span>“O que vou desenvolver?”</span></div>
          <div><b>03</b><strong>Mecanismo</strong><span>“Como a aula funciona?”</span></div>
          <div><b>04</b><strong>Confiança</strong><span>“Quem vai me acompanhar?”</span></div>
          <div><b>05</b><strong>Condição</strong><span>“Formato, local e dúvidas.”</span></div>
          <div><b>06</b><strong>Ação</strong><span>“Como agendar?”</span></div>
        </div>
        <Source>Método comercial aplicado: característica → mecanismo → benefício → prova → condição.</Source>
      </section>,

      <section className={`${styles.slide} ${styles.darkSlide}`} aria-labelledby="funnel-title" key="funnel">
        <p className={styles.kicker}>Russell Brunson</p>
        <h2 id="funnel-title">O funil conecta atenção a uma próxima ação.</h2>
        <div className={styles.funnelFlow}>
          <div><small>Origem</small><strong>Instagram<br />Google<br />Indicação</strong></div>
          <i />
          <div><small>Mensagem</small><strong>Landing adequada ao interesse</strong></div>
          <i />
          <div><small>Conversa</small><strong>WhatsApp com contexto</strong></div>
          <i />
          <div><small>Conversão</small><strong>Aula confirmada</strong></div>
        </div>
        <p className={styles.darkFootnote}>Adaptação do conceito de funil e Value Ladder apresentado por Russell Brunson em <em>DotCom Secrets</em>. O funil organiza etapas; não garante que todas as pessoas avancem.</p>
      </section>,

      <section className={styles.slide} aria-labelledby="ladder-title" key="ladder">
        <div className={styles.titleRow}>
          <div><p className={styles.kicker}>Escada de valor</p><h2 id="ladder-title">Cada etapa aprofunda a relação.</h2></div>
          <p className={styles.sideNote}>Mais valor exige mais entrega e mais proximidade.</p>
        </div>
        <div className={styles.valueLadder}>
          <div><span>Descoberta</span><strong>Conteúdo e indicação</strong><small>Contato inicial</small></div>
          <div><span>Primeira experiência</span><strong>Aula individual</strong><small>R$ 120</small></div>
          <div><span>Continuidade</span><strong>Pacote de 4 aulas</strong><small>R$ 440</small></div>
          <div className={styles.hypothesis}><span>Aprofundamento</span><strong>Aulas de Roots</strong><small>Oferta já disponível</small></div>
        </div>
        <Source>Referência: Value Ladder, Russell Brunson. A escada organiza as formas atuais de conhecer e continuar o trabalho com Priscilla.</Source>
      </section>,

      <section className={styles.slide} aria-labelledby="measurement-title" key="measurement">
        <p className={styles.kicker}>O ciclo de aprendizagem</p>
        <h2 id="measurement-title">O site mostra interesse. A agenda mostra resultado.</h2>
        <div className={styles.measurementLoop}>
          <div><b>01</b><strong>Visita</strong><span>Por onde a pessoa chegou.</span></div>
          <div><b>02</b><strong>Interesse</strong><span>Qual página e chamada despertaram ação.</span></div>
          <div><b>03</b><strong>Agendamento</strong><span>Quem marcou um horário pelo WhatsApp.</span></div>
          <div><b>04</b><strong>Aula</strong><span>Quem realmente compareceu ou pagou.</span></div>
        </div>
        <p className={styles.measurementSummary}>Assim descobrimos quais mensagens trazem conversas e quais conversas realmente viram alunas.</p>
      </section>,

      <section className={styles.slide} aria-labelledby="performance-title" key="performance">
        <p className={styles.kicker}>Performance</p>
        <div className={styles.performanceGrid}>
          <div>
            <h2 id="performance-title">Velocidade preserva a atenção conquistada.</h2>
            <p>Se a página demora para aparecer, parte das pessoas desiste antes mesmo de conhecer as aulas.</p>
          </div>
          <div className={styles.metric}><strong>até 2,5 s</strong><span>Referência de uma boa experiência para o carregamento principal da página.</span></div>
        </div>
        <div className={styles.performanceEvidence}><span><b>Imagens leves</b> para abrir mais rápido</span><span><b>Fontes locais</b> sem espera desnecessária</span><span><b>Hospedagem adequada</b> para manter estabilidade</span></div>
        <Source>Referência: web.dev. A velocidade real será conferida depois da publicação, em celular e computador.</Source>
      </section>,

      <section className={styles.slide} aria-labelledby="evidence-title" key="evidence">
        <p className={styles.kicker}>O que é prova hoje</p>
        <h2 id="evidence-title">O que já está pronto e o que vem a seguir.</h2>
        <div className={styles.statusTable}>
          <div><b>Já construído</b><ul><li>Identidade aplicada</li><li>Três páginas de venda</li><li>Versões para celular e computador</li><li>Chamadas específicas para cada aula</li></ul></div>
          <div><b>Próxima configuração</b><ul><li>Medição das visitas e cliques</li><li>Links identificando a origem</li><li>Página com links úteis</li><li>Publicação no endereço definitivo</li></ul></div>
          <div><b>Decisões com Priscilla</b><ul><li>Quais aulas priorizar</li><li>Quantas alunas consegue atender</li><li>Como organizar os contatos</li><li>Quais evoluções vêm depois</li></ul></div>
        </div>
        <p className={styles.evidenceRule}>A estratégia cresce de acordo com a capacidade real de atendimento.</p>
      </section>,

      <section className={styles.slide} aria-labelledby="partnership-title" key="partnership">
        <p className={styles.kicker}>Antes do preço, o valor comparável</p>
        <h2 id="partnership-title">Quanto custaria montar essas partes separadamente?</h2>
        <div className={styles.marketStack}>
          <div><span>Landing personalizada, responsiva e orientada à conversão</span><strong>R$ 1.500</strong></div>
          <div><span>Identidade visual aplicada: monograma, cor e tipografia</span><strong>R$ 800</strong></div>
          <div><span>Pesquisa, estratégia, arquitetura e copy das 3 mensagens</span><strong>R$ 600</strong></div>
          <div><span>Tracking, eventos e preparação para análise</span><strong>R$ 400</strong></div>
          <div><span>Página de links + configuração do Perfil da Empresa</span><strong>R$ 350</strong></div>
          <div className={styles.marketTotal}><span>Referência de contratação avulsa</span><strong>R$ 3.650</strong></div>
        </div>
        <Source>Referências públicas consultadas em 2026: <a href="https://duopus.com.br/blog/quanto-custa-landing-page" target="_blank" rel="noreferrer">landing pages de R$ 800 a R$ 4.000 entre freelancer e agência</a>; <a href="https://vitoracdesign.com.br/blog/2026/05/30/quanto-custa-identidade-visual-2026/" target="_blank" rel="noreferrer">identidade visual a partir de R$ 800</a>. Os demais itens são estimativas de escopo, não cotações de terceiros.</Source>
      </section>,

      <section className={`${styles.slide} ${styles.offerReveal}`} aria-labelledby="offer-title" key="offer">
        <div className={styles.offerHalo} aria-hidden="true" />
        <p className={styles.kicker}>Condição desta parceria</p>
        <div className={styles.offerRevealGrid}>
          <div>
            <h2 id="offer-title">Implementar o sistema completo.</h2>
            <ul>
              <li>Três landings para públicos e intenções diferentes</li>
              <li>Identidade visual aplicada e experiência responsiva</li>
              <li>Estratégia, copy, tracking e publicação</li>
              <li>Página de links e apoio no Perfil da Empresa</li>
            </ul>
          </div>
          <div className={styles.pricePanel}>
            <span>Investimento de implantação</span>
            <del>R$ 3.650</del>
            <strong>R$ 997</strong>
            <p>Valor único para colocar a estrutura em operação.</p>
          </div>
        </div>
        <div className={styles.optionalCare}>
          <span>Acompanhamento opcional</span>
          <strong>R$ 440/mês</strong>
          <p>Equivalente ao pacote de 4 aulas: análise, correções e pequenas evoluções dentro do limite combinado.</p>
        </div>
        <Source>Domínio, hospedagem e ferramentas pagas são aprovados antes e permanecem no nome de Priscilla.</Source>
      </section>,

    ],
    [],
  );

  return (
    <main id="conteudo" className={styles.page}>
      <div className={styles.stage}>
        <div className={styles.atmosphere} aria-hidden="true">
          <span className={styles.auroraOne} />
          <span className={styles.auroraTwo} />
          <span className={styles.auroraThree} />
          <span className={styles.gridTexture} />
          <span className={styles.grainTexture} />
        </div>
        <div
          key={`${index}-${motionKey}`}
          className={`${styles.slideMotion} ${instant ? styles.instant : ""}`}
          data-direction={direction}
        >
          {slides[index]}
        </div>

        <div className={styles.chrome}>
          <div className={styles.progress} aria-hidden="true">
            <span style={{ transform: `scaleX(${(index + 1) / total})` }} />
          </div>
          <p><span>{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")} · {slideMeta[index]}</p>
          <div className={styles.controls}>
            <button type="button" onClick={() => move(-1)} disabled={index === 0} aria-label="Voltar para a tela anterior">
              <ArrowIcon direction="left" />
            </button>
            <button type="button" onClick={() => move(1)} disabled={index === total - 1} aria-label="Avançar para a próxima tela">
              <ArrowIcon direction="right" />
            </button>
          </div>
          <div className={styles.dotNav} aria-label="Navegação da apresentação">
            {slideMeta.map((label, slideIndex) => (
              <button
                key={label}
                type="button"
                className={slideIndex === index ? styles.dotActive : ""}
                onClick={() => {
                  setDirection(slideIndex > index ? "next" : "previous");
                  setInstant(false);
                  setIndex(slideIndex);
                  setMotionKey((current) => current + 1);
                }}
                aria-label={`Ir para a tela ${slideIndex + 1}: ${label}`}
                aria-current={slideIndex === index ? "step" : undefined}
              />
            ))}
          </div>
        </div>
        <p className={styles.srOnly} aria-live="polite">Tela {index + 1} de {total}: {slideMeta[index]}</p>
      </div>
    </main>
  );
}
