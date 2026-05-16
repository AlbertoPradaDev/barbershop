import SkullCanvas from './SkullCanvas';
import HeroText from './HeroText';

export default function Hero() {
  return (
    <section id="hero" style={{ height: '200vh' }} className="relative">
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden bg-primary">
        {/* Canvas Three.js — fondo completo siempre */}
        <div className="absolute inset-0 w-full h-full md:left-auto md:right-0 md:w-2/3">
          <SkullCanvas />
        </div>

        {/* Texto — centrado en móvil, izquierda en desktop */}
        <div className="relative z-20 w-full px-8 text-center md:w-1/2 md:px-16 md:text-left lg:px-24">
          <HeroText />
        </div>
      </div>
    </section>
  );
}
