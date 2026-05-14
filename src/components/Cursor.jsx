import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;

    // Posición actual del mouse
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // El punto sigue el mouse inmediatamente
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out',
      });

      // El anillo sigue con inercia — efecto trail
      gsap.to(ring, {
        x: mouseX,
        y: mouseY,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    // El anillo se agranda al hacer hover sobre links y botones
    const onMouseEnter = () => {
      gsap.to(ring, { scale: 2.5, opacity: 0.5, duration: 0.3 });
      gsap.to(dot, { scale: 0, duration: 0.3 });
    };

    const onMouseLeave = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    window.addEventListener('mousemove', onMouseMove);

    // Aplicar hover a todos los elementos interactivos
    const interactives = document.querySelectorAll(
      'a, button, input, select, textarea',
    );
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Punto central */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-text rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />

      {/* Anillo exterior con trail */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border border-text/60 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
}