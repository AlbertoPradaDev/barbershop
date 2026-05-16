import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap';
import Button from '../Button';

const serviceOptions = [
  { value: 'corte', label: 'Corte de Cabelo' },
  { value: 'tatuagem', label: 'Tatuagem' },
];

function CustomSelect({ value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = serviceOptions.find((o) => o.value === value);

  return (
    <div ref={wrapperRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between border-b border-text/20 py-3 text-sm transition-colors duration-300 focus:outline-none focus:border-text"
      >
        <span className={selected ? 'text-text' : 'text-text/30'}>
          {selected ? selected.label : placeholder}
        </span>

        {/* Chevron — dos líneas que forman ∨ / ∧ */}
        <span className="relative w-4 h-3 shrink-0">
          <span
            className={`absolute left-0 top-1/2 w-2 h-px bg-text/40 origin-right transition-transform duration-300 ${open ? '-rotate-45' : 'rotate-45'}`}
          />
          <span
            className={`absolute right-0 top-1/2 w-2 h-px bg-text/40 origin-left transition-transform duration-300 ${open ? 'rotate-45' : '-rotate-45'}`}
          />
        </span>
      </button>

      {/* Panel */}
      <div
        className={`absolute top-full left-0 right-0 z-20 bg-secondary border-x border-b border-text/10 overflow-hidden transition-all duration-300 ease-out ${
          open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {serviceOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange(option.value);
              setOpen(false);
            }}
            className={`w-full text-left px-2 py-4 text-sm border-b border-text/10 last:border-0 transition-colors duration-200 ${
              value === option.value
                ? 'text-accent'
                : 'text-text/50 hover:text-text'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Booking() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const [service, setService] = useState('');

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
          scrollTrigger: { trigger: titleRef.current, start: 'top 80%' },
        },
      );

      gsap.fromTo(
        formRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: formRef.current, start: 'top 85%' },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!service) return;
    console.log('Mensagem enviada');
  };

  const inputCls =
    'bg-transparent border-b border-text/20 py-3 text-sm text-text placeholder:text-text/20 focus:outline-none focus:border-text transition-colors duration-300';

  return (
    <section
      id="booking"
      ref={sectionRef}
      className="relative py-20 md:py-32 px-8 md:px-16 lg:px-24 bg-secondary"
    >
      <div className="absolute inset-0 bg-linear-to-b from-primary/50 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Título */}
        <div ref={titleRef} className="mb-16 text-center md:text-left">
          <div className="w-10 h-px bg-accent mb-6 mx-auto md:mx-0" />
          <span className="text-xs tracking-[0.3em] uppercase text-text/40">
            Contacto
          </span>
          <h2 className="text-5xl md:text-6xl font-black uppercase mt-3 leading-none">
            Envie uma
            <br />
            mensagem
          </h2>
        </div>

        {/* Formulario */}
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Nome + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-widest uppercase text-text/40">
                Nome
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                required
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-widest uppercase text-text/40">
                Email
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                required
                className={inputCls}
              />
            </div>
          </div>

          {/* Serviço */}
          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest uppercase text-text/40">
              Serviço
            </label>
            <CustomSelect
              value={service}
              onChange={setService}
              placeholder="Selecione um serviço"
            />
          </div>

          {/* Mensagem */}
          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest uppercase text-text/40">
              Mensagem
            </label>
            <textarea
              rows={4}
              placeholder="Escreva a sua mensagem..."
              required
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="self-center md:self-start mt-4"
          >
            Enviar mensagem
          </Button>
        </form>
      </div>
    </section>
  );
}
