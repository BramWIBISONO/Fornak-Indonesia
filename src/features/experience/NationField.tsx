import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function NationField() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const count = window.innerWidth < 700 ? 420 : 760;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const red = new THREE.Color('#d31118');
    const charcoal = new THREE.Color('#26292f');

    for (let index = 0; index < count; index += 1) {
      const angle = index * 2.399963;
      const radius = 0.25 + Math.sqrt(index / count) * 3.4;
      const wave = Math.sin(angle * 1.8) * 0.38 + Math.cos(radius * 2.2) * 0.2;
      positions[index * 3] = Math.cos(angle) * radius * 1.08;
      positions[index * 3 + 1] = Math.sin(angle) * radius * 0.78;
      positions[index * 3 + 2] = wave;
      const color = index % 11 === 0 ? red : charcoal;
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.68,
      sizeAttenuation: true,
    });
    const field = new THREE.Points(geometry, material);
    field.rotation.z = -0.18;
    scene.add(field);

    const pointer = new THREE.Vector2(0, 0);
    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    host.addEventListener('pointermove', onPointerMove, { passive: true });

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    let frame = 0;
    const render = (time: number) => {
      if (!reducedMotion) {
        field.rotation.y += (pointer.x * 0.12 - field.rotation.y) * 0.025;
        field.rotation.x += (-pointer.y * 0.08 - field.rotation.x) * 0.025;
        field.position.y = Math.sin(time * 0.00035) * 0.08;
      }
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      host.removeEventListener('pointermove', onPointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="nation-field" aria-hidden="true" />;
}
