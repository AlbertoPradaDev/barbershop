import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

const services = [
  'Corte clássico',
  'Sobranchelas',
  'Barba',
  'Tatuagem',
];

export default function Booking() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Título entra desde abajo
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

      // Formulario entra desde abajo con delay
      gsap.fromTo(
        formRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 85%',
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí conectarás con tu backend más adelante
    console.log('Formulário enviado');
  };

  return (
    <section
      id="booking"
      ref={sectionRef}
      className="relative py-32 px-6 md:px-16 lg:px-24 bg-secondary"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Título */}
        <div ref={titleRef} className="mb-16 text-center md:text-left">
          <div className="w-10 h-px bg-accent mb-6 mx-auto md:mx-0" />
          <span className="text-xs tracking-[0.3em] uppercase text-text/40">
            Reservas
          </span>
          <h2 className="text-5xl md:text-6xl font-black uppercase mt-3 leading-none">
            Agende
            <br />
            sua visita
          </h2>
        </div>

        {/* Formulario */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* Fila — nombre y teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-widest uppercase text-text/40">
                Nome
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                required
                className="bg-transparent border-b border-text/20 py-3 text-sm text-text placeholder:text-text/20 focus:outline-none focus:border-text transition-colors duration-300"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-widest uppercase text-text/40">
                Telefone
              </label>
              <input
                type="tel"
                placeholder="+351 123456789"
                required
                className="bg-transparent border-b border-text/20 py-3 text-sm text-text placeholder:text-text/20 focus:outline-none focus:border-text transition-colors duration-300"
              />
            </div>
          </div>

          {/* Servicio */}
          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest uppercase text-text/40">
              Serviço
            </label>
            <select
              required
              className="bg-secondary border-b border-text/20 py-3 text-sm text-text/60 focus:outline-none focus:border-text transition-colors duration-300 cursor-pointer"
            >
              <option value="" disabled selected>
                Selecione um serviço
              </option>
              {services.map((s) => (
                <option key={s} value={s} className="bg-secondary">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest uppercase text-text/40">
              Data preferida
            </label>
            <input
              type="date"
              required
              className="bg-transparent border-b border-text/20 py-3 text-sm text-text/60 focus:outline-none focus:border-text transition-colors duration-300 cursor-pointer"
            />
          </div>

          {/* Mensaje */}
          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest uppercase text-text/40">
              Observações
            </label>
            <textarea
              rows={3}
              placeholder="Detalhes do corte, referências de tatuagem..."
              className="bg-transparent border-b border-text/20 py-3 text-sm text-text placeholder:text-text/20 focus:outline-none focus:border-text transition-colors duration-300 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-4 px-10 py-5 bg-text text-primary text-xs font-black tracking-widest uppercase hover:bg-accent hover:text-text transition-all duration-300 self-start"
          >
            Confirmar agendamento
          </button>
        </form>
      </div>
    </section>
  );
}