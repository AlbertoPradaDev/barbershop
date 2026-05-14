import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

const links = ['Services', 'Gallery', 'About', 'Booking']

export default function Nav() {
  const navRef = useRef(null)

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
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      style={{
        backdropFilter: 'blur(12px)',
        background: 'rgba(10,10,10,0.6)',
        borderBottom: '1px solid rgba(245,240,232,0.06)',
      }}
    >
      {/* Logo */}
      <span className="text-xl font-black tracking-widest uppercase">
        Lorem<span className="text-accent">.</span>
      </span>

      {/* Links */}
      <ul className="hidden md:flex items-center gap-10">
        {links.map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              className="text-sm tracking-widest uppercase text-text/60 hover:text-text transition-colors duration-300"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="#booking"
        className="hidden md:block text-xs tracking-widest uppercase px-6 py-3 border border-text/20 hover:border-text hover:bg-text hover:text-primary transition-all duration-300"
      >
        Book Now
      </a>
    </nav>
  )
}