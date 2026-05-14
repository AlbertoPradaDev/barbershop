import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

const links = [
  { label: 'Serviços', href: '#services' },
  { label: 'Galeria', href: '#gallery' },
  { label: 'Sobre', href: '#about' },
  { label: 'Agendamento', href: '#booking' },
];

const socials = [
  { label: 'Instagram', href: '#' },
  { label: 'WhatsApp', href: '#' },
  { label: 'TikTok', href: '#' },
];

export default function Footer() {
  const footerRef = useRef(null);
  const logoRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
          },
        },
      );

      gsap.fromTo(
        contentRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
          },
        },
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="relative bg-primary border-t border-text/10 px-6 md:px-16 lg:px-24 pt-24 pb-12"
    >
      {/* Logo grande decorativo de fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[20vw] font-black uppercase text-text/[0.02] select-none leading-none">
          Lorem
        </span>
      </div>

      {/* Logo principal */}
      <div ref={logoRef} className="mb-16">
        <span className="text-4xl md:text-6xl font-black uppercase tracking-tight">
          Lorem<span className="text-accent">.</span>
        </span>
        <p className="text-text/40 text-sm mt-3 max-w-xs leading-relaxed">
          Barbearia & Estúdio de Tatuagem. Arte, estilo e identidade em um só
          lugar.
        </p>
      </div>

      {/* Grid de contenido */}
      <div
        ref={contentRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mb-16"
      >
        {/* Navegación */}
        <div>
          <span className="text-xs tracking-[0.3em] uppercase text-text/30 block mb-6">
            Navegação
          </span>
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-text/60 hover:text-text transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Redes sociales */}
        <div>
          <span className="text-xs tracking-[0.3em] uppercase text-text/30 block mb-6">
            Redes sociais
          </span>
          <ul className="flex flex-col gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="text-sm text-text/60 hover:text-text transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-accent group-hover:w-4 transition-all duration-300" />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <span className="text-xs tracking-[0.3em] uppercase text-text/30 block mb-6">
            Contacto
          </span>
          <ul className="flex flex-col gap-3">
            <li className="text-sm text-text/60">Rua Lorem Ipsum, 123</li>
            <li className="text-sm text-text/60">São Paulo, SP</li>
            <li className="text-sm text-text/60 mt-2">Seg – Sáb: 9h às 20h</li>
            <li>
              <a
                href="tel:+5500000000000"
                className="text-sm text-text/60 hover:text-text transition-colors duration-300"
              >
                +55 (00) 00000-0000
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Línea divisoria + copyright */}
      <div className="border-t border-text/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-text/20 tracking-widest uppercase">
          © 2026 Lorem. Todos os direitos reservados.
        </span>
        <div className="flex flex-col sm:items-end gap-2">
          <a
            href="https://albertopradadev.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text/50 hover:text-text tracking-widest uppercase transition-colors duration-300 flex items-center gap-2 group"
          >
            <span className="w-0 h-px bg-accent group-hover:w-4 transition-all duration-300" />
            Desenvolvido por Alberto Prada
          </a>
          <a
            href="https://skfb.ly/oSnMY"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-text/20 hover:text-text/40 transition-colors duration-300"
          >
            "Skull with Beard" by Vicente Betoret Ferrero — CC BY 4.0
          </a>
        </div>
      </div>
    </footer>
  );
}
