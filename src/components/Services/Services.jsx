import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

const services = [
  {
    id: 'corte',
    label: 'Corte',
    description:
      'Cortes modernos e clássicos adaptados ao seu estilo. Precisão em cada detalhe para um resultado impecável.',
    items: [
      'Corte clássico',
      'Fade & taper',
      'Corte navalhado',
      'Acabamento completo',
    ],
    price: 'Desde €15',
  },
  {
    id: 'barba',
    label: 'Barba',
    description:
      'Tratamento e modelagem de barba com técnicas tradicionais. Do perfil ao acabamento, cuidado total.',
    items: ['Barba completa', 'Aparagem & perfil', 'Hidratação de barba', 'Afeitado navaja'],
    price: 'Desde €10',
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
        },
      );

      // Timeline con entrada y salida automática al invertir
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          end: 'bottom 20%',
          toggleActions: 'play reverse play reverse',
        },
      });

      tl.fromTo(
        cardsRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-20 md:py-32 px-8 md:px-16 lg:px-24 bg-primary"
    >
      {/* Línea decorativa superior */}
      <div className="w-16 h-px bg-accent mb-8" />

      {/* Título */}
      <div ref={titleRef} className="mb-12 md:mb-20">
        <span className="text-xs tracking-[0.3em] uppercase text-text/40">
          O que fazemos
        </span>
        <h2 className="text-5xl md:text-6xl font-black uppercase mt-3 leading-none">
          Nossos
          <br />
          Serviços
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, i) => (
          <div
            key={service.id}
            ref={(el) => (cardsRef.current[i] = el)}
            className="relative p-8 md:p-10 border border-text/10 bg-secondary"
          >
            {/* Label */}
            <h3 className="text-3xl font-black uppercase mb-4">
              {service.label}
            </h3>

            {/* Descripción */}
            <p className="text-text/50 text-sm leading-relaxed mb-8">
              {service.description}
            </p>

            {/* Lista de servicios */}
            <ul className="flex flex-col gap-2 mb-8">
              {service.items.map((item) => (
                <li
                  key={item}
                  className="text-sm text-text/70 flex items-center gap-3"
                >
                  <span className="w-1 h-1 rounded-full bg-accent inline-block" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Precio */}
            <div className="flex items-center justify-between border-t border-text/10 pt-6">
              <span className="text-xs tracking-widest uppercase text-text/40">
                Preço
              </span>
              <span className="text-lg font-bold">{service.price}</span>
            </div>

            {/* Línea de acento inferior — aparece en hover con CSS */}
            <div className="absolute bottom-0 left-0 w-0 h-px bg-accent transition-all duration-500 group-hover:w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}