import { useEffect, useRef } from 'react';
import { gsap, SplitText } from '../../lib/gsap';
import Button from '../Button';

export default function HeroText() {
  const containerRef = useRef(null);
  const taglineRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // SplitText divide cada elemento en caracteres individuales
      const splitTagline = new SplitText(taglineRef.current, { type: 'chars' });
      const splitTitle = new SplitText(titleRef.current, {
        type: 'chars, words',
      });

      const tl = gsap.timeline({ delay: 0.8 });

      // 1. Tagline — caracteres entran desde abajo uno a uno
      tl.fromTo(
        splitTagline.chars,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: 'power2.out',
        },
      );

      // 2. Título — caracteres caen desde arriba con peso
      tl.fromTo(
        splitTitle.chars,
        { y: -60, opacity: 0, rotationX: -90 },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: 'back.out(1.4)',
        },
        '-=0.2', // empieza 0.2s antes de que termine lo anterior
      );

      // 3. Subtítulo — fade simple
      tl.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.2',
      );

      // 4. Botones — entran desde abajo
      tl.fromTo(
        buttonsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.3',
      );
    }, containerRef);

    // Limpieza: cuando el componente se desmonta, GSAP libera memoria
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col gap-6 items-center md:items-start">
      {/* Tagline pequeña arriba */}
      <span
        ref={taglineRef}
        className="text-xs tracking-[0.3em] uppercase text-accent"
      >
        Barbearia Profissional
      </span>

      {/* Título principal */}
      <h1
        ref={titleRef}
        className="text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-none tracking-tight"
        style={{ perspective: '400px' }}
      >
        Rio
        <br />
        Concept Hair
      </h1>

      {/* Subtítulo */}
      <p
        ref={subtitleRef}
        className="text-sm md:text-base text-text/60 max-w-sm leading-relaxed"
      >
        Cortes precisos, estilo inconfundível. Onde cada detalhe faz a diferença.
      </p>

      {/* Botones */}
      <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center md:items-start gap-4 mt-2">
        <Button href="https://chat.inbarberapp.com/Pablomendes" variant="primary" target="_blank" rel="noopener noreferrer">
          Book Now
        </Button>
        <Button href="#gallery" variant="outline">
          Our Work
        </Button>
      </div>
    </div>
  );
}
