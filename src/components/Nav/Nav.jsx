import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import Button from '../Button'

const links = [
  { label: 'Serviços', href: '#services' },
  { label: 'Galeria', href: '#gallery' },
  { label: 'Sobre', href: '#about' },
]

export default function Nav() {
  const navRef = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    )
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backdropFilter: 'blur(12px)',
        background: 'rgba(10,10,10,0.6)',
        borderBottom: '1px solid rgba(245,240,232,0.06)',
      }}
    >
      <div className="flex items-center justify-between px-8 md:px-12 lg:px-16 py-6">
        {/* Logo */}
        <span className="text-xl font-black tracking-widest uppercase">
          Rio Concept<span className="text-accent">.</span>
        </span>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm tracking-widest uppercase text-text/60 hover:text-text transition-colors duration-300"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA desktop */}
        <div className="max-md:hidden">
          <Button href="https://chat.inbarberapp.com/Pablomendes" variant="outline" size="sm" target="_blank" rel="noopener noreferrer">
            Agendar
          </Button>
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 w-10 h-10"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          <span className={`block w-6 h-px bg-text transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-1.75' : ''}`} />
          <span className={`block w-6 h-px bg-text transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-text transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-1.75' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <ul className="flex flex-col px-8 pb-8 pt-2 gap-6 border-t border-text/10">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base tracking-widest uppercase text-text/60 hover:text-text transition-colors duration-300"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Button href="https://chat.inbarberapp.com/Pablomendes" variant="outline" size="sm" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              Agendar
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
