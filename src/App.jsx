import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Camera, Mic, ChevronDown, Menu, X, ArrowRight, Film } from 'lucide-react';

// Custom Hook for Fade In Animation
const FadeIn = ({ children, delay = 0, direction = 'up', className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: delay }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#FAFAF9]/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <a href="#" className={`text-4xl font-serif font-medium tracking-widest z-50 transition-colors ${isMenuOpen ? 'text-stone-900' : isScrolled ? 'text-stone-900' : 'text-stone-200'}`}>
          標 <span className="text-sm ml-2 tracking-wider font-english opacity-60">SHIRUBE</span>
        </a>

        {/* Desktop Menu */}
        <div className={`hidden md:flex space-x-10 ${isScrolled ? 'text-stone-600' : 'text-stone-300'}`}>
          {[
            { ja: 'コンセプト', en: 'Concept', href: '#concept' },
            { ja: '工程', en: 'Process', href: '#service' },
            { ja: 'フィロソフィー', en: 'philosophy', href: '#philosophy' },
            { ja: 'お問合せ', en: 'Contact', href: '#contact' },
          ].map((item, index) => (
            <a key={index} href={item.href} className={`transition-colors relative group text-center ${isScrolled ? 'hover:text-stone-900' : 'hover:text-white'}`}>
              <span className="block text-base tracking-widest">{item.ja}</span>
              <span className="block text-[10px] tracking-[0.2em] uppercase opacity-60 font-english">{item.en}</span>
              <span className={`absolute -bottom-2 left-0 w-0 h-[1px] transition-all group-hover:w-full ${isScrolled ? 'bg-stone-900' : 'bg-white'}`}></span>
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden z-50 p-2">
          {isMenuOpen ? <X size={24} className="text-stone-900" /> : <Menu size={24} className={isScrolled ? "text-stone-800" : "text-stone-200"} />}
        </button>
      </div>

      {/* Mobile Fullscreen Menu */}
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? "0%" : "-100%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 bg-[#FAFAF9] z-40 flex flex-col items-center justify-center space-y-8"
      >
        {[
          { ja: '概念', en: 'Concept', href: '#concept' },
          { ja: '過程', en: 'Process', href: '#service' },
          { ja: '想い', en: 'Conviction', href: '#philosophy' },
          { ja: '問合せ', en: 'Contact', href: '#contact' },
        ].map((item, index) => (
          <a key={index} href={item.href} onClick={() => setIsMenuOpen(false)} className="text-center">
            <span className="block text-2xl font-serif tracking-widest text-stone-800">{item.ja}</span>
            <span className="block text-xs tracking-[0.2em] uppercase text-stone-400 font-english">{item.en}</span>
          </a>
        ))}
      </motion.div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-stone-950">
      {/* Background Visual - The Watershed Mountain Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero.png"
          alt="分水嶺の夜明け"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-900/50 to-[#FAFAF9]"></div>
      </div>

      <div className="hero-content container mx-auto px-6 relative z-10 h-full flex flex-col md:flex-row items-center justify-center md:justify-between pt-36 md:pt-0 pb-20 md:pb-0">

        {/* Main Copy (Vertical Text) */}
        <div className="hero-vertical-text order-2 md:order-1 flex-1 flex justify-center md:justify-start mt-12 md:mt-0 min-h-[50vh] md:h-auto md:pl-16">
          <div className="flex gap-4 md:gap-8 flex-row-reverse">
            <FadeIn delay={0.2} className="vertical-text text-4xl md:text-6xl font-serif text-stone-100 leading-loose whitespace-nowrap drop-shadow-md">
              人生の岐路に、
            </FadeIn>
            <FadeIn delay={0.4} className="vertical-text text-4xl md:text-6xl font-serif text-stone-200 leading-loose whitespace-nowrap mt-16 md:mt-32 drop-shadow-md">
              一本の標を。
            </FadeIn>
          </div>
        </div>

        {/* Sub Copy & English */}
        <div className="order-1 md:order-2 flex-1 flex flex-col items-center md:items-end text-center md:text-right space-y-6">
          <FadeIn delay={0.6} direction="left">
            <h1 className="text-sm md:text-base tracking-[0.3em] uppercase text-stone-300 mb-4 drop-shadow-sm font-english">
              Private Documentary
            </h1>
            <div className="w-[1px] h-10 bg-stone-400 mx-auto md:mx-0 md:ml-auto mb-6"></div>
            <p className="text-stone-200 leading-relaxed text-base md:text-lg max-w-xs drop-shadow-md">
              迷いも、覚悟も、<br />
              まだ言葉にできない想いも。<br />
              今あなたが立っている、<br />
              その場所を映す。
            </p>
          </FadeIn>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20"
      >
        <span className="text-[10px] tracking-widest uppercase text-stone-400 font-english">Scroll</span>
        <ChevronDown className="text-stone-400 animate-bounce" size={20} />
      </motion.div>
    </section>
  );
};

const Concept = () => {
  return (
    <section id="concept" className="py-[100px] md:py-[160px] bg-[#FAFAF9] relative">
      <div className="container mx-auto px-6 md:px-12">
        {/* Image */}
        <FadeIn className="max-w-[800px] mx-auto relative mb-16 md:mb-20">
          <div className="aspect-[16/9] overflow-hidden rounded-sm relative group">
            <img
              src="/concept.jpg"
              alt="光と影"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-stone-900/10"></div>
          </div>
          <div className="absolute -bottom-8 -right-8 md:-top-8 md:bottom-auto md:-left-8 md:right-auto w-[200px] h-[85px] bg-[#E8E4DF] p-6 flex items-center justify-center">
            <p className="text-base tracking-widest text-stone-600 uppercase font-english">Concept</p>
          </div>
        </FadeIn>

        {/* Text */}
        <FadeIn delay={0.2} className="max-w-[680px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-12 leading-normal text-left">
            流れゆく時間の中に、<br />標を。
          </h2>
          <div className="space-y-8 text-stone-600 leading-loose text-base md:text-lg">
            <p>
              日々の忙しさの中で、<br />
              自分自身と向き合う時間は、どれくらいあるだろう。<br />
            </p>
            <p>
              考えているつもりで、まだ言葉にしていないこと。<br />
              分かっているつもりで、まだ見えていないもの。<br />
            </p>
            <p>
              「標」は、あなたの今を、そのまま映像に残します。<br />
              引き出さない。整えない。結論を作らない。<br />
              迷いも、沈黙も、まだ揺れている言葉も、そのままに。<br />
            </p>
            <p>
              5年後、10年後。<br />
              ふと立ち止まったとき、あの日の自分に会える場所を。
            </p>
          </div>
        </FadeIn>
      </div>
    </section >
  );
};

const ServiceCard = ({ number, title, subtitle, icon: Icon, description }) => (
  <div className="group relative pt-8 border-t border-stone-200 hover:border-stone-400 transition-colors duration-500">
    <div className="absolute top-0 right-0 text-6xl text-stone-100 font-serif -z-10 group-hover:text-stone-200 transition-colors">
      {number}
    </div>
    <div className="mb-6 text-stone-800">
      <Icon strokeWidth={1} size={32} className="mb-4 text-stone-400 group-hover:text-stone-600 transition-colors" />
      <h3 className="text-xl md:text-2xl font-serif mb-1">{title}</h3>
      <p className="text-xs text-stone-400 tracking-widest uppercase font-english">{subtitle}</p>
    </div>
    <p className="text-stone-600 text-base leading-7">
      {description}
    </p>
  </div>
);

const Service = () => {
  return (
    <section id="service" className="py-[100px] md:py-[160px] bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <FadeIn className="mb-24 md:mb-32 relative">
          <div className="w-[200px] h-[85px] bg-[#E8E4DF] flex items-center justify-center mb-8">
            <p className="text-base tracking-widest text-stone-600 uppercase font-english">Process</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900">
            あなたの「今」が映像になるまで
          </h2>
          <p className="text-stone-500 text-base mt-5 max-w-md">
            対話から、撮影、編集まで。<br />
            標は一貫して、あなたをそのまま映します。
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <FadeIn delay={0.1} className="h-full">
            <ServiceCard
              number="01"
              title="対話と探索"
              subtitle="Dialogue"
              icon={Mic}
              description="「標」の対話は、どこかに導くためのものではありません。答えを求めず、結論を急がず、あなた自身の言葉が自然に出てくる時間です。迷いも、沈黙も、まだまとまらない想いも、そのまま受け取ります。"
            />
          </FadeIn>
          <FadeIn delay={0.2} className="h-full">
            <ServiceCard
              number="02"
              title="撮影と記録"
              subtitle="Shooting"
              icon={Camera}
              description="撮影は、想い出の場所でも、自宅でも、オフィスでも。大事なのは、あなたが自分の言葉で語れる場所であること。飾らない佇まいと、映画のようなトーンで、あなたの「今」を記録します。"
            />
          </FadeIn>
          <FadeIn delay={0.3} className="h-full">
            <ServiceCard
              number="03"
              title="編集と昇華"
              subtitle="Editing"
              icon={Film}
              description="言葉だけではなく、沈黙や間、表情の揺れ、そこにあった光。標の編集は、それらに意味を足さず、そのまま残します。何度でも立ち返れる、あなたの現在地としての映像を。"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const Philosophy = () => {
  return (
    <section id="philosophy" className="py-[100px] md:py-[160px] bg-[#1C1917] text-[#FAFAF9] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-left">
          <FadeIn>
            <div className="w-[200px] h-[85px] bg-[#E8E4DF] flex items-center justify-center mb-12">
              <p className="text-base tracking-widest text-stone-600 uppercase font-english">Philosophy</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif leading-relaxed mb-12 text-stone-200">
              テクノロジーが進歩し、<br />
              あらゆることが加速していく時代だからこそ。<br />
              立ち止まり、自分の声に耳を澄ます時間がいる。
            </h2>
            <p className="text-stone-400 leading-loose text-base md:text-lg mb-16">
              私は長く「最先端」と「人間の根源的なもの」の間を行き来してきました。<br />
              その結果、辿り着いたのは、とてもシンプルなことでした。<br /><br />

              人は自分の言葉を聞いたことがないということ。<br /><br />
              <span className="font-serif text-lg md:text-xl font-medium text-stone-300">考えているつもりでも、考えていない。<br />
                わかっているつもりでも、見えていない。<br />
                語れるつもりでも、まだ声にしていない。</span><br /><br />

              「標」は、あなたの今をそのまま映す、プライベート・ドキュメンタリーです。<br />
              「何かを変えるため」ではなく、「ただ見るため」に。<br />
              誰にも公開しない、あなたの人生の現在地を。
            </p>
            <div className="text-right">
              <p className="font-serif text-xl tracking-widest">藤堂 八雲</p>
              <p className="text-sm text-stone-300 tracking-wider mt-2"><span className="font-english">標師 / Your Life Compass Founder</span></p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-[100px] md:py-[160px] bg-[#FAFAF9]">
      <div className="container mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="border border-stone-200 bg-white p-8 md:p-20 max-w-5xl mx-auto shadow-sm text-center">
            <h2 className="text-2xl md:text-3xl font-serif text-stone-900 mb-6">
              まずはお話しませんか。
            </h2>
            <p className="text-stone-500 text-base md:text-lg mb-12">
              サービスに関するご質問、制作のご相談など、<br />
              お気軽にお問い合わせください。
            </p>
            <a href="https://www.yakumo-todo.com/contact" className="inline-flex items-center gap-4 px-12 py-4 bg-stone-900 text-[#FAFAF9] hover:bg-stone-800 transition-colors duration-300 rounded-sm group">
              <span className="tracking-widest text-sm">お問い合わせ</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#FAFAF9] py-12 border-t border-stone-200">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-stone-400 text-sm tracking-wider">
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="mb-4 md:mb-0 hover:text-stone-600 transition-colors cursor-pointer">
          <span className="font-serif text-stone-600 text-base mr-2">標</span> <span className="font-english">SHIRUBE</span>
        </a>
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center gap-2 md:gap-0">
          <span className="font-english">© 2026 Shirube - Your Life Compass.</span>
          <a href="https://www.yakumo-todo.com/" className="md:ml-4 hover:text-stone-600 transition-colors underline decoration-stone-300 underline-offset-4 font-english">Producer: Yakumo Todo</a>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <div className="antialiased selection:bg-stone-200 selection:text-stone-900 text-stone-900 bg-[#FAFAF9] overflow-x-hidden">
      <style>{`
                body {
                    font-family: 'Noto Serif JP', serif;
                    font-weight: 300;
                    letter-spacing: 0.08em;
                    line-height: 2;
                }
                .font-serif {
                    font-family: 'Shippori Mincho', serif;
                    font-weight: 500;
                }
                .font-english {
                    font-family: 'Cormorant Garamond', serif;
                    font-weight: 300;
                    letter-spacing: 0.15em;
                }
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: upright;
                    letter-spacing: 0.15em;
                }
                /* Custom Scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #FAFAF9;
                }
                ::-webkit-scrollbar-thumb {
                    background: #D6D3D1;
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #A8A29E;
                }
                @media (orientation: landscape) and (max-width: 767px) {
                    .hero-content {
                        flex-direction: row !important;
                        align-items: flex-start !important;
                        justify-content: space-between !important;
                        padding-top: 5rem !important;
                        padding-bottom: 1rem !important;
                    }
                    .hero-vertical-text {
                        min-height: 0 !important;
                        margin-top: 0 !important;
                        padding-left: 2rem;
                        overflow: hidden;
                        max-height: calc(100vh - 6rem);
                        order: 1 !important;
                    }
                    .hero-vertical-text .vertical-text {
                        font-size: 1.5rem !important;
                        leading: 1.5 !important;
                    }
                    .hero-vertical-text .flex {
                        gap: 0.5rem !important;
                    }
                    .hero-vertical-text .mt-16 {
                        margin-top: 2rem !important;
                    }
                }
            `}</style>
      <Navigation />
      <Hero />
      <Concept />
      <Service />
      <Philosophy />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;