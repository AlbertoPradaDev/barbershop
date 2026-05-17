import { lazy, Suspense } from 'react';
import HeroText from './HeroText';

const BarberPole = lazy(() => import('./BarberPole'));

export default function Hero() {
  return (
    <section id="hero" style={{ height: '200vh' }} className="relative">
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden bg-primary">
        {/* Canvas Three.js — carga diferida para no bloquear el render inicial */}
        <div className="absolute inset-0 w-full h-full md:left-auto md:right-0 md:w-2/3">
          <Suspense fallback={null}>
            <BarberPole />
          </Suspense>
        </div>

        {/* Overlay oscuro solo en mobile para contraste del texto */}
        <div className="md:hidden absolute inset-0 bg-primary/60 pointer-events-none z-10" />

        {/* Texto — centrado en móvil, izquierda en desktop */}
        <div className="relative z-20 w-full px-8 text-center md:w-1/2 md:px-16 md:text-left lg:px-24">
          <HeroText />
        </div>
      </div>
    </section>
  );
}
