import SkullCanvas from './SkullCanvas';
import HeroText from './HeroText';

export default function Hero() {
  return (
    <section id="hero" style={{ height: '300vh' }} className="relative">
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden bg-primary">
        {/* Canvas Three.js — fondo completo siempre */}
        <div className="absolute inset-0 w-full h-full md:left-auto md:right-0 md:w-2/3">
          <SkullCanvas />
        </div>

        {/* 
          Gradiente (en mobile cubre mas, en desktop menos para que se vea la calavera)
        */}
        <div
          className="
          absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40 md:from-primary via-primary/70 md:to-transparent"
        />

        {/* Texto — centrado en móvil, izquierda en desktop */}
        <div className="relative z-20 w-full px-6 text-center md:w-1/2 md:px-16 md:text-left lg:px-24  ">
          <HeroText />
        </div>
      </div>
    </section>
  );
}
