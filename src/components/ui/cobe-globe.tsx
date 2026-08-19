import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

export interface Marker {
  id: string;
  location: [number, number];
  label: string;
}

export interface Arc {
  id: string;
  from: [number, number];
  to: [number, number];
  label: string;
}

interface GlobeProps {
  markers?: Marker[];
  arcs?: Arc[];
  markerColor?: [number, number, number];
  baseColor?: [number, number, number];
  arcColor?: [number, number, number];
  glowColor?: [number, number, number];
  dark?: number;
  mapBrightness?: number;
  markerSize?: number;
  markerElevation?: number;
  className?: string;
}

export function Globe({
  markers = [],
  arcs = [],
  markerColor = [0.3, 0.45, 0.85],
  baseColor = [0.93, 0.94, 0.96],
  glowColor = [0.88, 0.9, 0.95],
  dark = 0,
  mapBrightness = 8,
  markerSize = 0.03,
  markerElevation = 0.01,
  className = "",
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    let phi = 0;
    let width = 0;

    // Interpolate arc paths into additional dense points along great circles
    const arcPoints: { location: [number, number]; size: number }[] = [];
    arcs.forEach((arc) => {
      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = arc.from[0] + (arc.to[0] - arc.from[0]) * t;
        const lon = arc.from[1] + (arc.to[1] - arc.from[1]) * t;
        arcPoints.push({
          location: [lat, lon],
          size: 0.015,
        });
      }
    });

    const formattedMarkers = [
      ...markers.map((m) => ({
        location: m.location,
        size: markerSize,
      })),
      ...arcPoints,
    ];

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    if (width === 0) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.2,
      dark,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness,
      baseColor,
      markerColor,
      glowColor,
      opacity: 0.9,
      markers: formattedMarkers,
      onRender: (state: { phi?: number; width?: number; height?: number }) => {
        if (!pointerInteracting.current) {
          phi += 0.004;
        }
        state.phi = phi + pointerInteractionMovement.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    } as unknown as Parameters<typeof createGlobe>[1]);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [mounted, markers, arcs, baseColor, markerColor, glowColor, dark, mapBrightness, markerSize]);

  if (!mounted) {
    return <div className="w-full aspect-square bg-transparent" />;
  }

  return (
    <div className={`relative w-full aspect-square flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grabbing";
          }
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grab";
          }
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grab";
          }
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.005;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.005;
          }
        }}
        className="w-full h-full cursor-grab transition-opacity duration-500"
        style={{
          width: "100%",
          height: "100%",
          contain: "layout paint size",
          opacity: mounted ? 1 : 0,
        }}
      />
    </div>
  );
}
