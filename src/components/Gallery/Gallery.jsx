import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

const items = [
  { id: 1, category: 'Barbearia', label: 'Corte Clássico', aspect: 'tall' },
  { id: 2, category: 'Tatuagem', label: 'Blackwork', aspect: 'wide' },
  { id: 3, category: 'Barbearia', label: 'Fade & Taper', aspect: 'square' },
  { id: 4, category: 'Tatuagem', label: 'Realismo', aspect: 'tall' },
  { id: 5, category: 'Barbearia', label: 'Barba & Perfil', aspect: 'square' },
  { id: 6, category: 'Tatuagem', label: 'Lettering', aspect: 'wide' },
];

// Altura visual de cada card según su aspecto
const aspectMap = {
  tall: 'h-80',
  wide: 'h-48',
  square: 'h-64',
};

export default function Gallery() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ─── Título reveal ────────────────────────────────────
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

      // ─── Scroll horizontal cinematográfico ───────────────
      // El track se mueve hacia la izquierda mientras scrolleas
      const totalWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;

      gsap.to(trackRef.current, {
        x: -(totalWidth - viewportWidth + 96), // 96px de padding final
        ease: 'none', // movimiento lineal — el scroll controla la velocidad
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${totalWidth}`, // la sección dura tanto como el ancho del track
          scrub: 1,
          pin: true, // fija la sección mientras el scroll horizontal ocurre
        },
      });

      // ─── Cards reveal en cascada ──────────────────────────
      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative bg-primary overflow-hidden"
    >
      {/* Header — visible antes del scroll horizontal */}
      <div className="px-6 md:px-16 lg:px-24 pt-32 pb-16">
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

      {/* Track horizontal — contiene todas las cards en fila */}
      <div
        ref={trackRef}
        className="flex gap-4 px-6 md:px-16 pb-24"
        style={{ width: 'max-content' }} // ancho determinado por el contenido, no el viewport
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => (cardsRef.current[i] = el)}
            className={`relative flex-shrink-0 w-64 md:w-80 ${aspectMap[item.aspect]} bg-secondary border border-text/10 overflow-hidden group`}
          >
            {/* Placeholder visual mientras no hay imágenes reales */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl opacity-10 font-black">
                  {item.id.toString().padStart(2, '0')}
                </div>
              </div>
            </div>

            {/* Overlay en hover */}
            <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-all duration-500" />

            {/* Info inferior */}
            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
              <span className="text-xs tracking-widest uppercase text-accent block mb-1">
                {item.category}
              </span>
              <span className="text-sm font-bold uppercase">{item.label}</span>
            </div>

            {/* Borde inferior de acento */}
            <div className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}