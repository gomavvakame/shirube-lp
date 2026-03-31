import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactGA from 'react-ga4';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
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
            { ja: 'フィロソフィー', en: 'Philosophy', href: '#philosophy' },
            { ja: 'お問い合せ', en: 'Contact', href: '#contact' },
          ].map((item, index) => (
            <a key={index} href={item.href} className={`transition-colors relative group text-center ${isScrolled ? 'hover:text-stone-900' : 'hover:text-white'}`}>
              <span className="block text-xl tracking-widest">{item.ja}</span>
              <span className="block text-base tracking-[0.2em] opacity-60 font-english">{item.en}</span>
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
          { ja: 'コンセプト', en: 'Concept', href: '#concept' },
          { ja: '工程', en: 'Process', href: '#service' },
          { ja: 'フィロソフィー', en: 'Philosophy', href: '#philosophy' },
          { ja: 'お問い合せ', en: 'Contact', href: '#contact' },
        ].map((item, index) => (
          <a key={index} href={item.href} onClick={() => setIsMenuOpen(false)} className="text-center">
            <span className="block text-4xl font-serif tracking-widest text-stone-800">{item.ja}</span>
            <span className="block text-lg tracking-[0.2em] text-stone-400 font-english">{item.en}</span>
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
            <h1 className="text-sm md:text-base tracking-[0.3em] text-stone-300 mb-4 drop-shadow-sm font-english">
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
        <span className="text-xs tracking-widest text-stone-400 font-english">Scroll</span>
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
            <p className="text-base tracking-widest text-stone-600 font-english">Concept</p>
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
  <div className="group relative isolate pt-8">
    <div className="absolute top-0 left-0 right-0 md:right-4 h-[1px] bg-stone-200 group-hover:bg-stone-400 transition-colors duration-500"></div>
    <div className="absolute top-8 right-0 md:right-4 text-5xl text-stone-200 font-serif -z-10 group-hover:text-stone-300 transition-colors">
      {number}
    </div>
    <div className="mb-6 text-stone-800">
      <Icon strokeWidth={1} size={32} className="mb-4 text-stone-400 group-hover:text-stone-600 transition-colors" />
      <h3 className="text-xl md:text-2xl font-serif mb-1">{title}</h3>
      <p className="text-xs text-stone-400 tracking-widest font-english">{subtitle}</p>
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
            <p className="text-base tracking-widest text-stone-600 font-english">Process</p>
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
            <div className="w-[200px] h-[85px] bg-[#A8A29E] flex items-center justify-center mb-12">
              <p className="text-base tracking-widest text-stone-100 font-english">Philosophy</p>
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

const voicesData = [
  {
    id: 1,
    attribute: '30代・女性・スタートアップ創業2年目',
    hook: 'その沈黙の時間が\n一番よかった。',
    image: '/images/voice-startup.jpg',
    body: [
      '起業してから1年間ずっと突っ走ってきて、「なんで始めたんだっけ？」って思う瞬間が増えてた。\n事業計画書を見返すことばかりで、そこにあるのは数字だけ。もちろん起業したときの温度感はそこにはない。',
      '撮影は、思ってたのと全然違った。\n聞かれる質問が、ビジネスの話じゃなかった。「最近、何してるときに一番静かな気持ちになりますか」とか、「この仕事を続けていて、一番怖いことは何ですか」とか。',
      '途中、少し黙ってしまった場面があって、「すみません、うまく言えなくて」と言ったら、「それもそのまま残しますね」と言われた。',
      'あとで映像を観たとき、その沈黙の時間が一番よかった。自分がこんな顔するんだって初めて知った。',
      'これは誰かに見せるためのものじゃない。\n未来の自分が、原点に戻れるための映像。そう思ったら、急にこの映像がすごく大事なものに感じられた。',
    ],
  },
  {
    id: 2,
    attribute: '50代・男性・上場企業の役員就任直後',
    hook: '自分のことなのに、\n他人を見てるみたい。\nそう思った。',
    image: '/images/voice-executive.jpg',
    body: [
      '役員になったとき、周囲のみんなは「おめでとう」と言ってくれた。\nでも自分の中にあったのは、達成感よりも「ここから先、自分はどう在りたいんだろう」という自分への問いだった。誰にも言えなかった。言ったら弱く見えると思ったから。',
      '何かを教えてもらえるわけでもない。アドバイスもない。ただ、自分が話して、それがそのまま映像になる。',
      '正直、撮影しているときは物足りなかった。\nでも、納品されたUSBを自宅で観たとき、自分の声が静かに流れてきて、画面の中の自分が、少し目を伏せている場面があって、そこで気づいた。',
      'ああ、この人は迷ってるんだな、と。自分のことなのに、他人を見るみたいにそう思った。',
      'あの映像は今、書斎の引き出しにしまってある。たぶん任期満了を迎えたときに、もう一度観ると思う。',
    ],
  },
  {
    id: 3,
    attribute: '30代・女性・結婚を控えたタイミングで',
    hook: '飾ってない自分。',
    image: '/images/voice-marriage.jpg',
    body: [
      '結婚式の映像は、もちろん撮る予定だった。\nでも「標」はそれとは違う。\n「今の自分」を残すものです、と言われて、最初はピンとこなかった。',
      'でもカメラの前で聞かれたのは、結婚のことじゃなかった。\n「今、この瞬間で一番大切にしていることは？」「5年前の自分に会えたら、何て言いますか？」',
      '話しているうちに、結婚するということが、自分の人生の中でどういう位置にあるのかが、なんとなく見えてきた気がした。',
      '結婚式の映像は「あの日」の記録。\nでもこの映像は、あの日を迎える前の「私そのもの」の記録。まだ何も始まっていない、期待と不安が混ざったままの、飾ってない自分。',
      '10年後、この映像を観て泣くかもしれないし、笑うかもしれない。今はどっちかわからないけど、残しておいてよかったって思う気がする。',
    ],
  },
  {
    id: 4,
    attribute: '50代・男性・人気四川料理店オーナーシェフ',
    hook: '全部、「人」の話に\nなっていた。',
    image: '/images/voice-chef.jpg',
    body: [
      '料理人って、自分のことを語る機会がほとんどない。',
      '毎日厨房に立って、仕入れて、仕込んで、お客さんに提供して。その繰り返しの日々の中に自分の全部がある。でもそれを誰かにちゃんと話したことがあるかって言われたら、なかった。',
      'カメラの前に座ったとき、最初は何を話せばいいかわからなかった。\nでも不思議なもので、話し始めたら止まらなかった。\nなんでこの道に進んだのか、四川で勉強しているときに何を感じていたのか、一人で追求することの苦悩やをどこで感じたのか。普段、お客さんにも、スタッフにも、家族にも話さないようなことが、するすると出てきた。',
      '自分でも驚いたのは、料理の話をしているつもりなのに、結局ぜんぶ「人」の話になっていたこと。共に食材を探求する友人との関係、一緒に働く仲間、家族との時間。追いかけているものは料理なんだけど、その根っこにはいつも誰かがいたんだなと。それを、自分の声で、自分の言葉で聞いたのは初めてだった。',
      '撮影が終わって「どうでしたか」と聞かれたとき、うまく言えなかったけど、すごくよかった。何がよかったのか、正直まだ言葉にできない。ただ、自分が何を大事にして生きてきたのかが、映像の中にはちゃんとあった。それだけで十分だった。',
    ],
  },
];

const VoiceModal = ({ voice, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 md:p-12 rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2"
          aria-label="閉じる"
        >
          <X size={20} />
        </button>
        <p className="text-xs text-stone-400 tracking-wide mb-6">{voice.attribute}</p>
        <div className="space-y-6 text-base md:text-lg leading-loose font-light text-gray-700">
          {voice.body.map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line">{paragraph}</p>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const VoiceCard = ({ voice, onClick }) => (
  <button
    onClick={onClick}
    className="relative overflow-hidden rounded-lg w-72 md:w-80 h-64 flex-shrink-0 cursor-pointer group scroll-snap-align-start focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
    style={{ scrollSnapAlign: 'start' }}
  >
    <img
      src={voice.image}
      alt=""
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/25 transition-colors duration-300" />
    <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-8 text-left">
      <div className="pt-2">
        <p className="text-xs text-white/70 tracking-wide mb-2">{voice.attribute}</p>
        <p className="text-lg md:text-xl font-light text-white leading-relaxed whitespace-pre-line">{voice.hook}</p>
      </div>
      <p className="text-xs text-white/50 self-end">読む →</p>
    </div>
  </button>
);

const Voices = () => {
  const [activeVoice, setActiveVoice] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  const handleClose = useCallback(() => setActiveVoice(null), []);

  return (
    <>
      <section id="voices" ref={sectionRef} className="py-20 md:py-28 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="container mx-auto px-6 md:px-12 mb-16 md:mb-20">
            <div className="w-[200px] h-[85px] bg-[#E8E4DF] flex items-center justify-center mb-8">
              <p className="text-base tracking-widest text-stone-600 font-english">Impressions</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900">
              自分を見つめた人たちの、それぞれの言葉。
            </h2>
          </div>
          <div
            className="voices-scroll flex gap-6 overflow-x-auto px-6 md:px-12 pb-4 md:justify-center"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {voicesData.map((voice) => (
              <VoiceCard
                key={voice.id}
                voice={voice}
                onClick={() => setActiveVoice(voice)}
              />
            ))}
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {activeVoice && (
          <VoiceModal voice={activeVoice} onClose={handleClose} />
        )}
      </AnimatePresence>
    </>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-[100px] md:py-[160px] bg-[#FAFAF9]">
      <div className="container mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="border border-stone-200 bg-white p-8 md:p-20 max-w-5xl mx-auto shadow-sm text-center">
            <h2 className="text-2xl md:text-3xl font-serif text-stone-900 mb-6">
              その眼差しが、鮮明なうちに。
            </h2>
            <p className="text-stone-500 text-base md:text-lg mb-12">
              撮影のご相談、ご質問などは、<br />
              こちらからお問い合わせください。
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
          <span className="font-english">© 2026 SHIRUBE - Your Life Compass.</span>
          <a href="https://www.yakumo-todo.com/" className="md:ml-4 hover:text-stone-600 transition-colors underline decoration-stone-300 underline-offset-4 font-english">Produced by Yakumo Todo, TY Creative Office</a>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  useEffect(() => {
    const sectionIds = ['concept', 'service', 'philosophy', 'voices', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ReactGA.event({
              category: 'Section View',
              action: 'viewed',
              label: entry.target.id,
            });
          }
        });
      },
      { threshold: 0.3 }
    );
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

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
                .voices-scroll::-webkit-scrollbar {
                    display: none;
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
      <Voices />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;