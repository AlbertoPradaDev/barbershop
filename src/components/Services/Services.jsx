import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

const services = [
  {
    id: 'barber',
    label: 'Barbería',
    icon: '✦',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cortes que definen tu estilo.',
    items: [
      'Corte clásico',
      'Fade & taper',
      'Barba & perfilado',
      'Afeitado navaja',
    ],
    price: 'Desde $25',
  },
  {
    id: 'tattoo',
    label: 'Tatuajes',
    icon: '◈',
    description:
      'Lorem ipsum dolor sit amet. Tinta que cuenta tu historia, arte que dura para siempre.',
    items: ['Blackwork', 'Realismo', 'Tradicional', 'Lettering'],
    price: 'Desde $80',
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Título entra desde abajo cuando la sección entra al viewport
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
            start: 'top 80%', // dispara cuando el título está al 80% del viewport
          },
        },
      );

      // Cada card entra con un pequeño retraso entre sí
      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
            delay: i * 0.15, // cada card espera 150ms más que la anterior
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Efecto tilt 3D en hover — puro JS, sin librerías extra
  const handleMouseMove = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // posición X del mouse dentro de la card
    const y = e.clientY - rect.top; // posición Y del mouse dentro de la card
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8; // máximo 8° de inclinación
    const rotateY = ((x - centerX) / centerX) * 8;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800,
    });
  };

  const handleMouseLeave = (card) => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.6)', // rebote elástico al volver al centro
    });
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-32 px-6 md:px-16 lg:px-24 bg-primary"
    >
      {/* Línea decorativa superior */}
      <div className="w-16 h-px bg-accent mb-8" />

      {/* Título */}
      <div ref={titleRef} className="mb-20">
        <span className="text-xs tracking-[0.3em] uppercase text-text/40">
          Lo que hacemos
        </span>
        <h2 className="text-5xl md:text-6xl font-black uppercase mt-3 leading-none">
          Nuestros
          <br />
          Servicios
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, i) => (
          <div
            key={service.id}
            ref={(el) => (cardsRef.current[i] = el)}
            onMouseMove={(e) => handleMouseMove(e, cardsRef.current[i])}
            onMouseLeave={() => handleMouseLeave(cardsRef.current[i])}
            className="relative p-8 md:p-10 border border-text/10 bg-secondary cursor-default"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Icono */}
            <span className="text-3xl text-accent mb-6 block">
              {service.icon}
            </span>

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
                Precio
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