import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

const items = [
  { id: 1, category: 'Corte', label: 'Corte Clássico', aspect: 'tall' },
  { id: 2, category: 'Barba', label: 'Barba Completa', aspect: 'wide' },
  { id: 3, category: 'Corte', label: 'Fade & Taper', aspect: 'square' },
  { id: 4, category: 'Corte', label: 'Corte Navalhado', aspect: 'tall' },
  { id: 5, category: 'Barba', label: 'Perfil & Acabamento', aspect: 'square' },
  { id: 6, category: 'Corte', label: 'Degradê', aspect: 'wide' },
];

const desktopAspectMap = {
  tall: 'h-80',
  wide: 'h-48',
  square: 'h-64',
};

export default function Gallery() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const titleRef = useRef(null);
  const mobileCardsRef = useRef([]);

  useEffect(() => {
    let ctx;

    const setup = () => {
      if (ctx) ctx.revert();

      const isDesktop = window.innerWidth >= 768;

      ctx = gsap.context(() => {
        gsap.fromTo(
          titleRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: titleRef.current, start: 'top 80%' },
          },
        );

        if (isDesktop) {
          gsap.to(trackRef.current, {
            x: () => -(trackRef.current.scrollWidth - window.innerWidth + 96),
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: () => `+=${trackRef.current.scrollWidth}`,
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        } else {
          mobileCardsRef.current.forEach((card, i) => {
            if (!card) return;
            gsap.fromTo(
              card,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                delay: i * 0.07,
                ease: 'power2.out',
                scrollTrigger: { trigger: card, start: 'top 88%' },
              },
            );
          });
        }
      }, sectionRef);
    };

    setup();

    // Recrear el contexto al cruzar el breakpoint de 768px
    let lastIsDesktop = window.innerWidth >= 768;
    const onResize = () => {
      const isDesktop = window.innerWidth >= 768;
      if (isDesktop !== lastIsDesktop) {
        lastIsDesktop = isDesktop;
        setup();
      }
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative bg-primary overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 md:px-16 lg:px-24 pt-20 md:pt-32 pb-12 md:pb-16">
        <div className="w-16 h-px bg-accent mb-8" />
        <div ref={titleRef}>
          <span className="text-xs tracking-[0.3em] uppercase text-text/40">
            Nosso trabalho
          </span>
          <h2 className="text-5xl md:text-6xl font-black uppercase mt-3 leading-none">
            Galeria
          </h2>
        </div>
      </div>

      {/* Mobile — grid 2 columnas con scroll vertical normal */}
      <div className="md:hidden px-8 pb-20 grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => (mobileCardsRef.current[i] = el)}
            className="relative aspect-square bg-secondary border border-text/10 overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl opacity-10 font-black">
                {item.id.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-primary/80 to-transparent">
              <span className="text-[10px] tracking-widest uppercase text-accent block mb-0.5">
                {item.category}
              </span>
              <span className="text-xs font-bold uppercase">{item.label}</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-accent/30" />
          </div>
        ))}
      </div>

      {/* Desktop — track horizontal con GSAP pin */}
      <div
        ref={trackRef}
        className="hidden md:flex gap-4 px-16 pb-24"
        style={{ width: 'max-content' }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={`relative shrink-0 w-80 ${desktopAspectMap[item.aspect]} bg-secondary border border-text/10 overflow-hidden group`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl opacity-10 font-black">
                {item.id.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <span className="text-xs tracking-widest uppercase text-accent block mb-1">
                {item.category}
              </span>
              <span className="text-sm font-bold uppercase">{item.label}</span>
            </div>
            <div className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}
