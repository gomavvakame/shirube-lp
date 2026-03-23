import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Camera, Mic, PenTool, ChevronDown, Menu, X, ArrowRight, Play, Film } from 'lucide-react';

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
        <a href="#" className={`text-2xl font-serif font-medium tracking-widest z-50 transition-colors ${isMenuOpen ? 'text-stone-900' : 'text-stone-200 md:text-stone-800'} ${isScrolled ? 'text-stone-900' : ''}`}>
          標 <span className="text-xs ml-2 tracking-wider font-sans opacity-60">SHIRUBE</span>
        </a>

        {/* Desktop Menu */}
        <div className={`hidden md:flex space-x-12 text-sm tracking-widest font-light ${isScrolled ? 'text-stone-600' : 'text-stone-300'}`}>
          {['概念', '過程', '想い', '対話'].map((item, index) => {
            const hrefs = ['#concept', '#service', '#philosophy', '#contact'];
            return (
              <a key={index} href={hrefs[index]} className="hover:text-stone-900 transition-colors relative group">
                {item}
                <span className={`absolute -bottom-2 left-0 w-0 h-[1px] transition-all group-hover:w-full ${isScrolled ? 'bg-stone-900' : 'bg-stone-200'}`}></span>
              </a>
            );
          })}
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
        {['概念', '過程', '想い', '対話'].map((item, index) => {
          const hrefs = ['#concept', '#service', '#philosophy', '#contact'];
          return (
            <a key={index} href={hrefs[index]} onClick={() => setIsMenuOpen(false)} className="text-2xl font-serif tracking-widest text-stone-800">
              {item}
            </a>
          );
        })}
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
          src="http://googleusercontent.com/image_generation_content/3"
          alt="シックな雰囲気の分水嶺の夜明け"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-900/50 to-[#FAFAF9]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 h-full flex flex-col md:flex-row items-center justify-center md:justify-between pb-20 md:pb-0">

        {/* Main Copy (Vertical Text) */}
        <div className="order-2 md:order-1 flex-1 flex justify-center md:justify-start mt-12 md:mt-0 min-h-[50vh] md:h-auto">
          <div className="flex gap-8 md:gap-16 flex-row-reverse">
            <FadeIn delay={0.2} className="vertical-text text-4xl md:text-6xl font-serif text-stone-100 leading-loose whitespace-nowrap drop-shadow-md">
              人生の分水嶺に、
            </FadeIn>
            <FadeIn delay={0.4} className="vertical-text text-4xl md:text-6xl font-serif text-stone-200 leading-loose whitespace-nowrap mt-16 md:mt-32 drop-shadow-md">
              確かなる標を。
            </FadeIn>
          </div>
        </div>

        {/* Sub Copy & English */}
        <div className="order-1 md:order-2 flex-1 flex flex-col items-center md:items-end text-center md:text-right space-y-6">
          <FadeIn delay={0.6} direction="left">
            <h1 className="text-sm md:text-base tracking-[0.3em] uppercase text-stone-300 mb-4 drop-shadow-sm">
              Personal Life Marker
            </h1>
            <div className="w-[1px] h-16 bg-stone-400 mx-auto md:mx-0 md:ml-auto mb-6"></div>
            <p className="text-stone-200 font-light leading-relaxed text-sm md:text-base max-w-xs drop-shadow-md">
              重なり合う決断の果てに<br />
              今、あなたが立つ場所。<br />
              その揺るぎない軌跡を映像に刻む。
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
        <span className="text-[10px] tracking-widest uppercase text-stone-400">Scroll</span>
        <ChevronDown className="text-stone-400 animate-bounce" size={20} />
      </motion.div>
    </section>
  );
};

const Concept = () => {
  return (
    <section id="concept" className="py-24 md:py-40 bg-[#FAFAF9] relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          {/* Left: Image/Visual */}
          <FadeIn className="w-full md:w-5/12 relative">
            <div className="aspect-[3/4] overflow-hidden rounded-sm relative group">
              <img
                src="https://images.unsplash.com/photo-1505238680356-667803448bb6?q=80&w=2070&auto=format&fit=crop"
                alt="光と影"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-stone-900/10"></div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white p-6 shadow-sm hidden md:flex items-center justify-center">
              <div className="text-center">
                <p className="font-serif text-2xl text-stone-300">01</p>
                <p className="text-xs tracking-widest text-stone-500 mt-1 uppercase">Concept</p>
              </div>
            </div>
          </FadeIn>

          {/* Right: Text */}
          <div className="w-full md:w-7/12 md:pt-20 md:pl-12">
            <FadeIn delay={0.2}>
              <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-12 leading-normal">
                流れる時間を、<br />
                確かな道標へ。
              </h2>
              <div className="space-y-8 text-stone-600 font-light leading-loose text-sm md:text-base text-justify">
                <p>
                  人は誰しも、語り尽くせぬ物語を抱えて生きています。<br />
                  日々の忙しさの中に埋もれてしまう、<br />
                  あなたの決断、葛藤、そして希望。
                </p>
                <p>
                  「標（しるべ）」は、単なる記録映像ではありません。<br />
                  それは、コーチングの対話を通じてあなたの内面深くに潜り、<br />
                  本質的な「想い」を映像として結晶化させるプロセスです。
                </p>
                <p>
                  迷ったとき、立ち止まったとき。<br />
                  この映像が、あなたの原点に立ち返るための<br />
                  静かな灯火となりますように。
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
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
      <p className="text-xs text-stone-400 tracking-widest uppercase">{subtitle}</p>
    </div>
    <p className="text-stone-600 font-light text-sm leading-7">
      {description}
    </p>
  </div>
);

const Service = () => {
  return (
    <section id="service" className="py-24 md:py-40 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <FadeIn className="mb-24 md:mb-32 flex flex-col md:flex-row justify-between items-end">
          <div>
            <span className="text-xs tracking-[0.2em] text-stone-400 uppercase block mb-4">Process</span>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900">
              想いを形にする旅路
            </h2>
          </div>
          <p className="text-stone-500 text-sm mt-6 md:mt-0 font-light max-w-md text-right md:text-left">
            内面を掘り下げる対話から、映像としての昇華まで。<br />
            一貫した美意識で伴走します。
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <FadeIn delay={0.1} className="h-full">
            <ServiceCard
              number="01"
              title="対話と探索"
              subtitle="Dialogue"
              icon={Mic}
              description="コーチングの手法を用いた深い対話を通じて、あなたの人生の核となる価値観や、映像に残すべき「想い」を言語化します。"
            />
          </FadeIn>
          <FadeIn delay={0.2} className="h-full">
            <ServiceCard
              number="02"
              title="撮影と記録"
              subtitle="Shooting"
              icon={Camera}
              description="那須の自然の中や、あなたの想い出の場所で。ドキュメンタリーのような自然な佇まいと、映画のような美しさで「今」を切り取ります。"
            />
          </FadeIn>
          <FadeIn delay={0.3} className="h-full">
            <ServiceCard
              number="03"
              title="編集と昇華"
              subtitle="Editing"
              icon={Film}
              description="言葉、音、光を紡ぎ合わせ、あなたの人生の指針となるような映像作品へ。何度も見返したくなる、魂のショートフィルムを制作します。"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const Philosophy = () => {
  return (
    <section id="philosophy" className="py-24 md:py-40 bg-[#1C1917] text-[#FAFAF9] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <div className="w-12 h-12 border border-stone-700 rounded-full flex items-center justify-center mx-auto mb-12">
              <PenTool size={16} className="text-stone-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif leading-relaxed mb-12 text-stone-200">
              テクノロジーが進歩し、<br />
              すべてが加速する時代だからこそ。<br />
              立ち止まり、内なる声に耳を澄ませる時間を。
            </h2>
            <p className="text-stone-400 font-light leading-loose text-sm md:text-base mb-16">
              私は映像作家として、またAI研究者として、<br />
              最先端と根源的な人間性の間を行き来してきました。<br />
              そこで辿り着いたのは、「人の想いこそが、最強のアルゴリズムである」という真理。<br /><br />

              「標」は、私の映像技術とコーチングへの情熱を注ぎ込んだ、<br />
              あなただけのためのプライベート・ドキュメンタリー制作サービスです。<br />
              あなたの人生という唯一無二の物語に、美しい栞を挟ませてください。
            </p>
            <div className="text-right">
              <p className="font-serif text-lg tracking-widest">藤堂 八雲</p>
              <p className="text-xs text-stone-500 tracking-wider mt-2 uppercase">Videoographer / Life Marker Founder</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 md:py-32 bg-[#FAFAF9]">
      <div className="container mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="border border-stone-200 bg-white p-8 md:p-20 max-w-5xl mx-auto shadow-sm text-center">
            <h2 className="text-2xl md:text-3xl font-serif text-stone-900 mb-6">
              まずは、あなたの物語を聞かせてください。
            </h2>
            <p className="text-stone-500 font-light mb-12">
              サービスに関するご質問、制作のご相談など、<br />
              お気軽にお問い合わせください。
            </p>
            <a href="mailto:contact@shirube-life.com" className="inline-flex items-center gap-4 px-12 py-4 bg-stone-900 text-[#FAFAF9] hover:bg-stone-800 transition-colors duration-300 rounded-sm group">
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
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-stone-400 text-xs tracking-wider">
        <div className="mb-4 md:mb-0">
          <span className="font-serif text-stone-600 text-sm mr-2">標</span> SHIRUBE
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-stone-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-stone-600 transition-colors">Terms of Service</a>
        </div>
        <div className="mt-4 md:mt-0">
          © 2026 Shirube Life Marker. <a href="https://www.yakumo-todo.com/" className="ml-4 hover:text-stone-600 transition-colors underline decoration-stone-300 underline-offset-4">Producer: Yakumo Todo</a>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <div className="antialiased selection:bg-stone-200 selection:text-stone-900 font-sans text-stone-900 bg-[#FAFAF9] overflow-x-hidden">
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500&family=Shippori+Mincho:wght@400;500;600&display=swap');
                
                body {
                    font-family: 'Noto Sans JP', sans-serif;
                }
                .font-serif {
                    font-family: 'Shippori Mincho', serif;
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