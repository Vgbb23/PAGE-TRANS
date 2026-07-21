import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  Check,
  Droplets,
  FlaskConical,
  Gem,
  Heart,
  Menu,
  Package,
  Pill,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  X,
  BadgeCheck,
  CircleCheck,
  Dna,
  Leaf,
  Zap,
  Microscope,
  Award,
} from 'lucide-react';
import { BRAND, SEO, OFFERS, type Offer } from '../config/product';
import { OptimizedImage } from './OptimizedImage';
import { BrandLogo } from './BrandLogo';

const AMBIENT = [
  { id: 1, left: '8%', top: '18%', delay: '0s', duration: '12s' },
  { id: 2, left: '72%', top: '12%', delay: '2s', duration: '15s' },
  { id: 3, left: '55%', top: '68%', delay: '4s', duration: '14s' },
];

const scrollToOffers = (e?: React.MouseEvent) => {
  e?.preventDefault();
  document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

type FadeInProps = React.ComponentProps<typeof motion.div> & {
  delay?: number;
};

const FadeIn = ({ children, className = '', delay = 0, ...rest }: FadeInProps) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-70px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: '#o-que-e', label: 'O que é' },
    { href: '#diferenciais', label: 'Diferenciais' },
    { href: '#comparativo', label: 'Comparativo' },
    { href: '#faq', label: 'Dúvidas' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav py-3">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <a href="#" className="flex items-center">
          <BrandLogo variant="dark" className="text-lg md:text-xl" />
        </a>

        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 hover:text-slate-900 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#oferta"
            onClick={scrollToOffers}
            className="btn-cta text-xs py-2.5 px-5 !rounded-lg normal-case tracking-normal"
          >
            Comprar
          </a>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-slate-800"
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col gap-2">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-medium text-slate-700 text-sm py-2.5"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#oferta"
                onClick={(e) => {
                  setIsMenuOpen(false);
                  scrollToOffers(e);
                }}
                className="btn-cta text-center mt-2 normal-case"
              >
                Comprar Agora
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const bullets = [
    'Alta pureza',
    'Forma biologicamente ativa (Trans)',
    '60 cápsulas',
    'Suplementação premium',
    'Qualidade Quantum Nutrition',
  ];

  return (
    <section className="relative min-h-[100dvh] flex items-end md:items-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <OptimizedImage
          src={BRAND.heroImage}
          alt={`${BRAND.name} — frasco do suplemento Trans Resveratrol`}
          className="absolute inset-0 h-full w-full object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0A0C] via-[#1A0A0C]/82 to-[#1A0A0C]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0A0C]/90 via-[#1A0A0C]/50 to-transparent" />
      </div>

      <div className="particles">
        {AMBIENT.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.duration }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-14 pt-24 md:py-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight mb-5"
        >
          Quantum<span className="text-red-300"> Nutrition</span>
          <span className="block text-sm sm:text-base font-sans font-medium tracking-[0.22em] uppercase text-white/70 mt-2">
            Trans Resveratrol
          </span>
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.55 }}
          className="font-display text-[1.85rem] sm:text-4xl md:text-5xl lg:text-[3.35rem] font-bold leading-[1.12] text-white max-w-3xl mb-5"
        >
          {SEO.h1}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl mb-7"
        >
          O <strong className="text-white font-semibold">Trans Resveratrol</strong> é reconhecido por sua ação antioxidante
          e faz parte da rotina de pessoas que buscam envelhecimento saudável, vitalidade e qualidade de vida — com a
          pureza e o rigor que você espera de um suplemento premium.
        </motion.p>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.26 }}
          className="flex flex-wrap gap-x-4 gap-y-2 mb-8 max-w-2xl"
        >
          {bullets.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-white/90">
              <CircleCheck size={16} className="text-red-300 shrink-0" />
              {item}
            </li>
          ))}
        </motion.ul>

        <motion.a
          href="#oferta"
          onClick={scrollToOffers}
          className="btn-cta btn-cta-pulse normal-case tracking-normal w-full sm:w-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Quero começar agora <ArrowRight size={18} />
        </motion.a>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
          className="mt-4 text-xs text-white/55 flex items-center gap-2"
        >
          <ShieldCheck size={14} className="text-red-300" />
          Suplemento alimentar • Não é medicamento
        </motion.p>
      </div>
    </section>
  );
};

const Marquee = () => (
  <div className="bg-white py-3.5 overflow-hidden border-y border-slate-200">
    <div className="flex whitespace-nowrap animate-marquee">
      {[1, 2].map((g) => (
        <div key={g} className="flex items-center">
          {[
            'FORMA TRANS ATIVA',
            'ALTA PUREZA',
            '60 CÁPSULAS',
            'ANTIOXIDANTE PREMIUM',
            'QUANTUM NUTRITION',
            'LONGEVIDADE & BEM-ESTAR',
          ].map((t) => (
            <span
              key={`${g}-${t}`}
              className="mx-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2"
            >
              <Leaf size={12} className="text-quantum" /> {t}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const WhatIsResveratrol = () => (
  <section id="o-que-e" className="py-16 md:py-24 bg-white">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <FadeIn>
          <OptimizedImage
            src={BRAND.productImage}
            alt={`${BRAND.name} — embalagem do produto`}
            className="w-full max-w-md mx-auto product-float object-contain"
          />
        </FadeIn>

        <FadeIn delay={0.08}>
          <p className="text-quantum text-xs font-semibold uppercase tracking-[0.22em] mb-3">Entenda o ativo</p>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-slate-900 mb-5 leading-tight">
            O que é o Trans Resveratrol?
          </h2>
          <div className="space-y-4 text-slate-600 text-base leading-relaxed">
            <p>
              O <strong className="text-slate-900 font-semibold">Resveratrol</strong> é um polifenol natural, encontrado
              principalmente na casca das uvas escuras e em outras plantas. Ele faz parte do grupo de compostos
              reconhecidos por sua ação antioxidante — ou seja, por ajudar o organismo a lidar com os radicais livres
              produzidos no dia a dia.
            </p>
            <p>
              Nem toda forma de Resveratrol é igual. A variante{' '}
              <strong className="text-slate-900 font-semibold">TRANS</strong> é considerada a forma biologicamente ativa
              e mais estável da molécula, com maior biodisponibilidade em comparação a outras formas.
            </p>
            <p>
              Por isso, o <strong className="text-slate-900 font-semibold">Trans Resveratrol Quantum Nutrition</strong>{' '}
              foi desenvolvido com foco na matéria-prima certa, alta pureza e praticidade — para quem leva a sério a
              suplementação e busca um produto que se destaque dos comuns.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

const REASONS = [
  {
    icon: Shield,
    title: 'Ação antioxidante',
    desc: 'Um composto reconhecido por fazer parte da rotina de quem busca incluir antioxidantes de qualidade na alimentação.',
  },
  {
    icon: Heart,
    title: 'Suporte ao envelhecimento saudável',
    desc: 'Muito procurado por pessoas que desejam investir em vitalidade, longevidade e bem-estar ao longo do tempo.',
  },
  {
    icon: Zap,
    title: 'Mais vitalidade para o dia a dia',
    desc: 'Ideal para quem mantém uma rotina intensa e quer complementar hábitos saudáveis com suplementação premium.',
  },
  {
    icon: Leaf,
    title: 'Rotina de autocuidado',
    desc: 'Um aliado para quem prioriza prevenção, qualidade de vida e consistência nos cuidados com a saúde.',
  },
  {
    icon: Dna,
    title: 'Saúde celular',
    desc: 'Antioxidantes fazem parte de uma abordagem equilibrada voltada ao cuidado com as células e o organismo como um todo.',
  },
  {
    icon: Gem,
    title: 'Qualidade Premium',
    desc: 'Para quem não aceita menos — e busca um suplemento com padrão superior ao que encontra nas prateleiras comuns.',
  },
];

const WhyResveratrol = () => (
  <section className="py-16 md:py-24 bg-section-dark">
    <div className="max-w-6xl mx-auto px-4">
      <FadeIn className="max-w-2xl mb-12">
        <p className="text-quantum text-xs font-semibold uppercase tracking-[0.22em] mb-3">Na prática</p>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-slate-900 mb-4">
          Por que tantas pessoas incluem o Trans Resveratrol na rotina?
        </h2>
        <p className="text-slate-600 text-base leading-relaxed">
          Não se trata de promessas milagrosas. Trata-se de escolher um suplemento sério, com ativo reconhecido e
          qualidade comprovada — para complementar uma vida ativa e consciente.
        </p>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {REASONS.map((item, i) => (
          <FadeIn key={item.title} delay={i * 0.05}>
            <article className="card-premium h-full p-6">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-quantum/8 text-quantum">
                <item.icon size={20} strokeWidth={1.75} />
              </span>
              <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </article>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const DIFFERENTIALS = [
  'Matéria-prima premium',
  'Alta pureza',
  'Forma biologicamente ativa',
  'Excelente absorção',
  'Cápsulas práticas',
  'Marca reconhecida',
  'Controle de qualidade',
];

const Differentials = () => (
  <section id="diferenciais" className="py-16 md:py-24 bg-white">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <FadeIn>
          <p className="text-quantum text-xs font-semibold uppercase tracking-[0.22em] mb-3">Quantum Nutrition</p>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-slate-900 mb-5">
            Diferenciais da Quantum Nutrition
          </h2>
          <p className="text-slate-600 text-base leading-relaxed mb-8">
            Uma marca criada para quem exige mais da suplementação — com ciência, tecnologia e um compromisso real com
            qualidade em cada detalhe, da matéria-prima à embalagem final.
          </p>
          <ul className="space-y-3.5">
            {DIFFERENTIALS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-800">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-quantum/10 text-quantum">
                  <Check size={14} strokeWidth={2.5} />
                </span>
                <span className="text-sm md:text-base font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="relative rounded-3xl overflow-hidden bg-section-dark border border-slate-200/80 p-6 md:p-10">
            <OptimizedImage
              src={BRAND.capsuleImage}
              alt="Cápsula Trans Resveratrol Quantum Nutrition"
              className="w-full max-w-sm mx-auto object-contain drop-shadow-lg"
            />
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Trans', sub: 'forma ativa' },
                { label: '60', sub: 'cápsulas' },
                { label: '100%', sub: 'premium' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white border border-slate-200/80 py-3 px-2">
                  <p className="font-display text-xl font-bold text-quantum">{stat.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

const AntioxidantSection = () => (
  <section className="py-16 md:py-24 bg-white">
    <div className="max-w-4xl mx-auto px-4">
      <FadeIn className="text-center mb-10">
        <p className="text-quantum text-xs font-semibold uppercase tracking-[0.22em] mb-3">Ciência & bem-estar</p>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-slate-900 mb-5">
          Antioxidantes e qualidade de vida
        </h2>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="space-y-5 text-slate-600 text-base leading-relaxed">
          <p>
            Ao longo da vida, o organismo está exposto a diversos fatores — como estresse, poluição, alimentação
            desequilibrada e envelhecimento natural — que contribuem para a produção de{' '}
            <strong className="text-slate-900 font-semibold">radicais livres</strong>. Esse processo, conhecido como
            estresse oxidativo, faz parte do funcionamento natural do corpo.
          </p>
          <p>
            Os <strong className="text-slate-900 font-semibold">antioxidantes</strong> desempenham um papel importante
            nesse equilíbrio, ajudando a neutralizar esses radicais livres. Por isso, incluir fontes de antioxidantes —
            seja pela alimentação ou pela suplementação — é uma prática adotada por muitas pessoas que buscam uma rotina
            mais saudável e consciente.
          </p>
          <p className="text-sm text-slate-500 border-l-2 border-quantum/30 pl-4">
            O Trans Resveratrol Quantum Nutrition é um suplemento alimentar. Não substitui uma alimentação equilibrada,
            não diagnostica, não trata e não previne doenças.
          </p>
        </div>
      </FadeIn>
    </div>
  </section>
);

const QUALITY_POINTS = [
  {
    icon: FlaskConical,
    title: 'Matéria-prima',
    desc: 'Trans Resveratrol selecionado com rigor, priorizando pureza e estabilidade molecular.',
  },
  {
    icon: BadgeCheck,
    title: 'Controle de qualidade',
    desc: 'Cada lote passa por verificações que reforçam confiança e consistência no produto final.',
  },
  {
    icon: Droplets,
    title: 'Pureza',
    desc: 'Alta pureza como diferencial — porque a qualidade do ativo faz toda a diferença na suplementação.',
  },
  {
    icon: Package,
    title: 'Processo de fabricação',
    desc: 'Produção orientada a padrões rigorosos de suplementação alimentar, com atenção a cada etapa.',
  },
  {
    icon: ShieldCheck,
    title: 'Segurança',
    desc: 'Desenvolvido para uso adulto, com embalagem que preserva a integridade do produto.',
  },
  {
    icon: Microscope,
    title: 'Tecnologia',
    desc: 'Formulação pensada para entregar a forma Trans — biologicamente ativa e de excelente absorção.',
  },
];

const QualitySection = () => (
  <section className="py-16 md:py-24 bg-navy text-white overflow-hidden relative">
    <div className="absolute inset-0 opacity-30 pointer-events-none">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-red-400/15 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
    </div>

    <div className="max-w-6xl mx-auto px-4 relative z-10">
      <FadeIn className="max-w-2xl mb-12">
        <p className="text-red-300 text-xs font-semibold uppercase tracking-[0.22em] mb-3">Padrão Quantum</p>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-4">
          Qualidade em cada cápsula
        </h2>
        <p className="text-white/70 text-base leading-relaxed">
          Da seleção da matéria-prima ao controle final: um produto pensado para transmitir autoridade, confiança e o
          padrão premium que você merece.
        </p>
      </FadeIn>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-10">
        {QUALITY_POINTS.map((item, i) => (
          <FadeIn key={item.title} delay={i * 0.06}>
            <article className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 h-full">
              <item.icon size={22} className="text-red-300 mb-4" strokeWidth={1.75} />
              <h3 className="font-display text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/65 leading-relaxed">{item.desc}</p>
            </article>
          </FadeIn>
        ))}
      </div>

      <FadeIn>
        <OptimizedImage
          src={BRAND.qualityImage}
          alt="Informações de qualidade Trans Resveratrol Quantum Nutrition"
          className="w-full max-w-3xl mx-auto rounded-2xl border border-white/10 shadow-2xl object-contain bg-white"
        />
      </FadeIn>
    </div>
  </section>
);

const HowToUse = () => (
  <section id="como-consumir" className="py-16 md:py-24 bg-white">
    <div className="max-w-3xl mx-auto px-4 text-center">
      <FadeIn>
        <p className="text-quantum text-xs font-semibold uppercase tracking-[0.22em] mb-3">Modo de uso</p>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-slate-900 mb-8">Como consumir</h2>

        <div className="card-premium p-8 md:p-12 text-left md:text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-quantum/10 text-quantum mb-6 mx-auto">
            <Pill size={26} strokeWidth={1.75} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-3">
            Recomendação de uso
          </p>
          <p className="font-display text-xl md:text-2xl font-semibold text-slate-900 leading-snug mb-5">
            Consumir conforme recomendação presente na embalagem ou orientação de profissional habilitado.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
            Conservar em local seco, ao abrigo da luz e do calor. Mantenha o frasco bem fechado após o uso. Este produto
            é um suplemento alimentar e não substitui uma alimentação equilibrada.
          </p>
        </div>
      </FadeIn>
    </div>
  </section>
);

const SPECS = [
  { label: 'Marca', value: 'Quantum Nutrition' },
  { label: 'Produto', value: 'Trans Resveratrol' },
  { label: 'Categoria', value: 'Suplemento Alimentar' },
  { label: 'Quantidade', value: '60 cápsulas' },
  { label: 'Forma', value: 'Cápsulas' },
  { label: 'Uso', value: 'Adulto' },
];

const SpecsSection = () => (
  <section className="py-16 md:py-24 bg-section-dark">
    <div className="max-w-3xl mx-auto px-4">
      <FadeIn className="text-center mb-10">
        <p className="text-quantum text-xs font-semibold uppercase tracking-[0.22em] mb-3">Transparência</p>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-slate-900">Especificações</h2>
      </FadeIn>

      <FadeIn>
        <div className="card-premium overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {SPECS.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'}>
                  <th className="text-left font-semibold text-slate-500 px-5 md:px-7 py-4 w-[42%] border-b border-slate-100">
                    {row.label}
                  </th>
                  <td className="text-left font-medium text-slate-900 px-5 md:px-7 py-4 border-b border-slate-100">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeIn>

      <FadeIn className="mt-8">
        <OptimizedImage
          src={BRAND.nutritionImage}
          alt={`Tabela nutricional do ${BRAND.name}`}
          className="w-full rounded-2xl border border-slate-200 shadow-sm object-contain bg-white"
        />
      </FadeIn>
    </div>
  </section>
);

const COMPARE_ROWS = [
  { label: 'Qualidade', common: false, quantum: true },
  { label: 'Pureza', common: false, quantum: true },
  { label: 'Quantidade', common: '30 cápsulas', quantum: '60 cápsulas' },
  { label: 'Forma ativa (Trans)', common: false, quantum: true },
  { label: 'Confiabilidade', common: false, quantum: true },
  { label: 'Matéria-prima', common: 'Padrão básico', quantum: 'Premium selecionada' },
  { label: 'Controle de qualidade', common: false, quantum: true },
];

const CompareCell = ({ value }: { value: boolean | string }) => {
  if (typeof value === 'string') {
    return <span className="text-slate-700 font-medium">{value}</span>;
  }
  return value ? (
    <Check size={18} className="compare-check mx-auto" strokeWidth={2.5} />
  ) : (
    <X size={18} className="compare-x mx-auto" strokeWidth={2} />
  );
};

const ComparisonSection = () => (
  <section id="comparativo" className="py-16 md:py-24 bg-white">
    <div className="max-w-4xl mx-auto px-4">
      <FadeIn className="text-center mb-10">
        <p className="text-quantum text-xs font-semibold uppercase tracking-[0.22em] mb-3">Compare</p>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-slate-900 mb-4">
          Por que escolher a Quantum Nutrition?
        </h2>
        <p className="text-slate-600 text-base max-w-xl mx-auto">
          Veja a diferença entre um suplemento comum e o padrão premium que a Quantum Nutrition entrega.
        </p>
      </FadeIn>

      <FadeIn>
        <div className="card-premium overflow-hidden">
          <table className="compare-table w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left font-semibold text-slate-500 w-[34%]">Critério</th>
                <th className="text-center font-semibold text-slate-400 w-[33%]">Suplemento comum</th>
                <th className="text-center font-semibold text-quantum w-[33%] bg-quantum/5">
                  Quantum Nutrition
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="font-medium text-slate-800 border-b border-slate-100">{row.label}</td>
                  <td className="text-center border-b border-slate-100">
                    <CompareCell value={row.common} />
                  </td>
                  <td className="text-center border-b border-slate-100 bg-quantum/[0.03]">
                    <CompareCell value={row.quantum} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeIn>
    </div>
  </section>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const questions = [
    {
      q: 'O que é Trans Resveratrol?',
      a: 'Trans Resveratrol é a forma biologicamente ativa e mais estável do composto Resveratrol, um polifenol natural encontrado principalmente na casca das uvas escuras. É reconhecido por sua ação antioxidante e amplamente utilizado em suplementação alimentar.',
    },
    {
      q: 'Qual a diferença entre Resveratrol e Trans Resveratrol?',
      a: 'O Resveratrol pode existir em diferentes formas moleculares. A forma TRANS é considerada a biologicamente ativa, com maior estabilidade e biodisponibilidade. Por isso, suplementos premium como o da Quantum Nutrition utilizam especificamente a forma Trans.',
    },
    {
      q: 'Como consumir?',
      a: 'Consuma conforme a recomendação presente na embalagem ou orientação de profissional habilitado. Em geral, suplementos em cápsulas são ingeridos com água, preferencialmente junto a uma refeição.',
    },
    {
      q: 'Pode ser utilizado diariamente?',
      a: 'Sim, o produto foi desenvolvido para uso contínuo como parte de uma rotina de suplementação alimentar. Siga sempre a dosagem indicada na embalagem e, em caso de dúvidas, consulte um profissional habilitado.',
    },
    {
      q: 'Quem pode consumir?',
      a: 'O Trans Resveratrol Quantum Nutrition é indicado para adultos que desejam incluir antioxidantes na rotina de suplementação. Gestantes, lactantes, crianças e pessoas em tratamento médico devem consultar um profissional antes do uso.',
    },
    {
      q: 'Quanto dura um frasco?',
      a: 'Cada frasco contém 60 cápsulas. A duração depende da dosagem diária recomendada na embalagem. Consulte as instruções do produto para calcular quanto tempo um frasco irá durar na sua rotina.',
    },
    {
      q: 'Existe contraindicação?',
      a: 'Gestantes, lactantes, crianças e pessoas sob acompanhamento médico ou nutricional devem consultar um profissional habilitado antes do uso. Este produto é um suplemento alimentar e não substitui orientação profissional.',
    },
    {
      q: 'Posso consumir junto com outros suplementos?',
      a: 'Em muitos casos, o Trans Resveratrol pode compor uma rotina com outros suplementos. A combinação ideal depende do seu contexto individual. Se você utiliza medicamentos ou outros produtos, oriente-se com um profissional habilitado.',
    },
    {
      q: 'Como armazenar?',
      a: 'Conserve em local seco, ao abrigo da luz e do calor. Após aberto, mantenha o frasco bem fechado. Evite umidade excessiva e temperaturas elevadas para preservar a qualidade do produto.',
    },
    {
      q: 'Qual o diferencial da Quantum Nutrition?',
      a: 'A Quantum Nutrition se destaca pela matéria-prima premium, alta pureza, uso da forma Trans biologicamente ativa, controle rigoroso de qualidade e padrão de fabricação superior — tudo pensado para quem não aceita suplementos comuns.',
    },
    {
      q: 'O que significa forma Trans?',
      a: 'A forma Trans é a configuração molecular biologicamente ativa do Resveratrol. Ela apresenta maior estabilidade e biodisponibilidade em comparação a outras formas, o que a torna a escolha preferida em suplementação de qualidade.',
    },
    {
      q: 'Por que a pureza é importante?',
      a: 'A pureza do ativo impacta diretamente a eficácia e a segurança do suplemento. Matérias-primas com alta pureza garantem que você está consumindo o composto desejado, sem contaminantes ou substâncias indesejadas — um diferencial essencial em suplementação premium.',
    },
  ];

  return (
    <section id="faq" className="py-16 md:py-24 bg-section-dark">
      <div className="max-w-2xl mx-auto px-4">
        <FadeIn className="text-center mb-10">
          <p className="text-quantum text-xs font-semibold uppercase tracking-[0.22em] mb-3">Tire suas dúvidas</p>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-slate-900">Perguntas frequentes</h2>
        </FadeIn>

        <div className="space-y-3">
          {questions.map((item, i) => (
            <FadeIn key={item.q} delay={i * 0.03}>
              <div className="card-premium overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm text-slate-900"
                >
                  {item.q}
                  <ChevronDown
                    size={18}
                    className={`text-quantum transition-transform shrink-0 ml-3 ${openIndex === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 faq-answer">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const REVIEWS = [
  {
    name: 'Patricia M.',
    location: 'São Paulo, SP',
    text: 'Produto excelente. Qualidade visível desde a embalagem.',
    images: ['/feedbacks/feedback-01.png', '/feedbacks/feedback-02.png'],
  },
  {
    name: 'Roberto C.',
    location: 'Rio de Janeiro, RJ',
    text: 'Marca muito confiável. Já é a terceira vez que compro.',
    images: ['/feedbacks/feedback-03.png', '/feedbacks/feedback-04.png'],
  },
  {
    name: 'Fernanda L.',
    location: 'Belo Horizonte, MG',
    text: 'Gostei bastante da qualidade. Cápsulas fáceis de consumir.',
    images: ['/feedbacks/feedback-05.png', '/feedbacks/feedback-06.png'],
  },
  {
    name: 'Marcos A.',
    location: 'Curitiba, PR',
    text: 'Entrega rápida e produto muito bem embalado.',
    images: ['/feedbacks/feedback-07.png', '/feedbacks/feedback-08.png'],
  },
  {
    name: 'Camila R.',
    location: 'Porto Alegre, RS',
    text: 'Voltarei a comprar. Parece muito superior aos comuns.',
    images: ['/feedbacks/feedback-09.png', '/feedbacks/feedback-10.png'],
  },
];

const ReviewsSection = () => (
  <section className="py-16 md:py-24 bg-white">
    <div className="max-w-6xl mx-auto px-4">
      <FadeIn className="text-center mb-10 md:mb-12">
        <p className="text-quantum text-xs font-semibold uppercase tracking-[0.22em] mb-3">Avaliações</p>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-slate-900 mb-3">
          O que dizem sobre o Trans Resveratrol
        </h2>
        <div className="inline-flex items-center gap-2 text-sm text-slate-600">
          <span className="flex gap-0.5 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={16} fill="currentColor" />
            ))}
          </span>
          <span className="font-semibold text-slate-900">5.0</span>
          <span className="text-slate-400">•</span>
          <span>Avaliações de quem já experimentou</span>
        </div>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REVIEWS.map((item, i) => (
          <FadeIn key={item.name} delay={i * 0.05}>
            <blockquote className="card-premium h-full p-6 flex flex-col">
              <div className="flex gap-0.5 text-amber-400 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={13} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-4">&ldquo;{item.text}&rdquo;</p>
              <footer className="mb-4">
                <p className="font-display text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.location}</p>
              </footer>
              <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                {item.images.map((src) => (
                  <OptimizedImage
                    key={src}
                    src={src}
                    alt={`Foto do produto — ${item.name}`}
                    className="h-[62px] w-[62px] rounded-lg object-cover border border-slate-200"
                  />
                ))}
              </div>
            </blockquote>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const PricingSection = ({ onSelectOffer }: { onSelectOffer: (offer: Offer) => void }) => (
  <section id="oferta" className="py-16 md:py-24 bg-mesh">
    <div className="max-w-6xl mx-auto px-4">
      <FadeIn className="text-center mb-12">
        <p className="text-quantum text-xs font-semibold uppercase tracking-[0.22em] mb-3">Escolha seu kit</p>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-slate-900 mb-3">
          Comece sua rotina com Trans Resveratrol
        </h2>
        <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto">
          60 cápsulas por frasco • Forma Trans ativa • Pagamento seguro via PIX
        </p>
      </FadeIn>

      <div className="flex flex-col md:flex-row gap-5 md:items-stretch">
        {OFFERS.map((offer) => (
          <FadeIn key={offer.id} className="flex-1">
            <div
              className={`card-premium p-6 h-full flex flex-col relative ${
                offer.popular ? 'border-quantum/40 ring-2 ring-quantum/15 md:scale-[1.02] z-10' : ''
              }`}
            >
              {offer.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-quantum text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                  Mais escolhido
                </span>
              )}

              <h3 className="font-display text-lg font-bold text-slate-900 text-center mb-4">{offer.name}</h3>
              <OptimizedImage
                src={offer.image}
                alt={offer.name}
                className="mx-auto object-contain mb-4 h-40 md:h-44"
              />

              <div className="text-center mb-6">
                <p className="text-slate-400 line-through text-sm">De R$ {offer.originalPrice}</p>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-lg text-quantum font-semibold">R$</span>
                  <span className="font-display text-5xl font-bold text-slate-900">{offer.price.split(',')[0]}</span>
                  <span className="text-2xl font-bold text-slate-900">,{offer.price.split(',')[1]}</span>
                </div>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                <li className="flex items-center gap-2 text-xs text-slate-600">
                  <Check size={14} className="text-quantum shrink-0" /> {offer.capsules}
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-600">
                  <Check size={14} className="text-quantum shrink-0" /> Envio para todo o Brasil
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-600">
                  <Check size={14} className="text-quantum shrink-0" /> Garantia de 30 dias
                </li>
              </ul>

              <button type="button" onClick={() => onSelectOffer(offer)} className="btn-cta w-full normal-case tracking-normal">
                Comprar Agora
              </button>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn className="mt-8 text-center">
        <p className="text-slate-500 text-xs flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-quantum" />
          Pagamento 100% seguro • Dados protegidos
        </p>
      </FadeIn>
    </div>
  </section>
);

const FinalCta = () => (
  <section className="py-16 md:py-24 bg-navy relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-red-400/12 blur-3xl" />
    </div>
    <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
      <FadeIn>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-5">
          Invista hoje em uma suplementação premium.
        </h2>
        <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          O Trans Resveratrol Quantum Nutrition foi desenvolvido para pessoas que valorizam qualidade, tecnologia e uma
          rotina voltada ao bem-estar.
        </p>
        <a
          href="#oferta"
          onClick={scrollToOffers}
          className="btn-cta btn-cta-pulse normal-case tracking-normal w-full sm:w-auto !bg-white !text-quantum-dark hover:opacity-95"
        >
          Comprar Agora <ArrowRight size={18} />
        </a>
        <p className="mt-5 text-xs text-white/45">
          Quantum Nutrition Trans Resveratrol • Suplemento alimentar • Não é medicamento
        </p>
      </FadeIn>
    </div>
  </section>
);

const GuaranteeSection = () => (
  <section className="py-14 md:py-16 bg-white border-y border-slate-200">
    <div className="max-w-4xl mx-auto px-4">
      <FadeIn>
        <div className="card-premium p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-quantum/10 text-quantum">
            <Award size={40} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="text-quantum text-xs font-semibold uppercase tracking-[0.22em] mb-2">Compra protegida</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Garantia incondicional de 30 dias
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-5 max-w-xl">
              Se por qualquer motivo o Trans Resveratrol Quantum Nutrition não atender às suas expectativas, basta
              entrar em contato conosco em até 30 dias após o recebimento. Devolvemos seu investimento — sem burocracia
              e sem letras miúdas.
            </p>
            <ul className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-x-6 text-sm text-slate-700 justify-center md:justify-start">
              {['30 dias para testar', 'Processo simples e rápido', 'Suporte Quantum Nutrition'].map((item) => (
                <li key={item} className="flex items-center gap-2 justify-center md:justify-start">
                  <Check size={15} className="text-quantum shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FadeIn>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white py-12 border-t border-slate-200">
    <div className="max-w-6xl mx-auto px-4 text-center">
      <BrandLogo variant="dark" className="text-xl md:text-2xl justify-center mb-3" />
      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-6">{BRAND.company}</p>
      <p className="text-[10px] text-slate-500 leading-relaxed max-w-lg mx-auto tracking-wide">
        Este produto não é um medicamento e não substitui orientação médica ou nutricional. Não diagnostica, não trata e
        não cura doenças. Resultados podem variar. Suplemento alimentar.
      </p>
      <p className="text-[10px] text-slate-400 mt-6">
        © {new Date().getFullYear()} {BRAND.company}. Todos os direitos reservados.
      </p>
    </div>
  </footer>
);

const StickyCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="sticky-cta"
        >
          <a
            href="#oferta"
            onClick={scrollToOffers}
            className="btn-cta w-full text-center text-sm py-3.5 normal-case tracking-normal"
          >
            Quero começar agora
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface LandingPageProps {
  onSelectOffer: (offer: Offer) => void;
}

export default function LandingPage({ onSelectOffer }: LandingPageProps) {
  useEffect(() => {
    document.title = SEO.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', SEO.description);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Marquee />
      <WhatIsResveratrol />
      <WhyResveratrol />
      <Differentials />
      <AntioxidantSection />
      <QualitySection />
      <HowToUse />
      <SpecsSection />
      <ComparisonSection />
      <ReviewsSection />
      <PricingSection onSelectOffer={onSelectOffer} />
      <GuaranteeSection />
      <FAQSection />
      <FinalCta />
      <Footer />
      <StickyCTA />
    </div>
  );
}
