import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import Button from '../Button';

const stats = [
  { value: '8+', label: 'Anos de experiência' },
  { value: '2k+', label: 'Clientes satisfeitos' },
  { value: '500+', label: 'Cortes por mês' },
];

export default function About() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const statsRef = useRef([]);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ─── Línea decorativa se expande con el scroll ────────
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        },
      );

      // ─── Imagen entra desde la izquierda ─────────────────
      gsap.fromTo(
        imageRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        },
      );

      // ─── Contenido entra desde la derecha ────────────────
      gsap.fromTo(
        contentRef.current,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        },
      );

      // ─── Stats cuentan hacia arriba ───────────────────────
      statsRef.current.forEach((stat, i) => {
        gsap.fromTo(
          stat,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stat,
              start: 'top 85%',
            },
          },
        );
      });

      // ─── Parallax sutil en la imagen al scrollear ─────────
      gsap.to(imageRef.current, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true, // parallax 1:1 con el scroll
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-20 md:py-32 px-8 md:px-16 lg:px-24 bg-primary overflow-hidden"
    >
      {/* Línea decorativa superior */}
      <div ref={lineRef} className="w-full h-px bg-text/10 mb-12 md:mb-24 origin-left" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Lado izquierdo — imagen */}
        <div
          ref={imageRef}
          className="relative aspect-3/4 bg-secondary border border-text/10 overflow-hidden"
        >
          {/* Placeholder hasta tener foto real */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl opacity-5 font-black uppercase">
              Foto
            </span>
          </div>

          {/* Marco decorativo desplazado */}
          <div className="absolute -bottom-4 -right-4 w-full h-full border border-accent/30 -z-10" />

          {/* Badge sobre la imagen */}
          <div className="absolute top-6 right-6 bg-primary/80 backdrop-blur-sm border border-text/10 px-4 py-2">
            <span className="text-xs tracking-widest uppercase text-accent">
              Est. 2016
            </span>
          </div>
        </div>

        {/* Lado derecho — contenido */}
        <div ref={contentRef} className="flex flex-col gap-8">
          <div>
            <div className="w-10 h-px bg-accent mb-6" />
            <span className="text-xs tracking-[0.3em] uppercase text-text/40">
              Sobre nós
            </span>
            <h2 className="text-5xl md:text-6xl font-black uppercase mt-3 leading-none">
              Tradição &<br />
              Estilo
            </h2>
          </div>

          <p className="text-text/60 leading-relaxed">
            Na Rio Concept, somos mais do que uma barbearia — somos um espaço
            onde tradição e modernidade se encontram. Cada corte é pensado para
            realçar a sua identidade.
          </p>

          <p className="text-text/60 leading-relaxed">
            Com anos de experiência e técnicas refinadas, nossa equipe combina
            o clássico da barbearia tradicional com as tendências atuais para
            entregar resultados que superam expectativas.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 pt-4 border-t border-text/10">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                ref={(el) => (statsRef.current[i] = el)}
                className="flex flex-col gap-1"
              >
                <span className="text-3xl font-black text-text">
                  {stat.value}
                </span>
                <span className="text-xs text-text/40 leading-tight">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button href="#booking" variant="outline" className="self-start">
            Agendar agora
          </Button>
        </div>
      </div>
    </section>
  );
}