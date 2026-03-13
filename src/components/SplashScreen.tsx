"use client";

import { useEffect, useRef } from 'react';

export default function SplashScreen() {
  const sparkCanvasRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!sparkCanvasRef.current) return;

    const canvas = sparkCanvasRef.current;
    const NS = 'http://www.w3.org/2000/svg';
    const SCALE = 220 / 512;

    const SPARKLE_POINTS: [number, number, 'A' | 'B' | 'C', number, number, number][] = [
      [256, 122, 'B', 14, 0.55, 3.1],
      [230, 135, 'A', 10, 0.80, 3.7],
      [282, 132, 'A', 10, 0.95, 4.1],
      [256, 160, 'A',  8, 1.10, 3.4],
      [210, 158, 'C',  7, 1.25, 4.8],
      [302, 156, 'C',  7, 1.35, 4.3],
      [174, 180, 'C',  6, 1.55, 5.2],
      [338, 178, 'C',  6, 1.65, 4.9],
      [148, 224, 'C',  7, 1.80, 5.6],
      [364, 218, 'C',  7, 1.90, 5.3],
      [162, 172, 'C',  6, 2.00, 6.1],
      [348, 165, 'C',  6, 2.10, 5.8],
      [240, 318, 'A',  9, 0.70, 2.8],
      [256, 320, 'B', 11, 0.75, 2.5],
      [272, 318, 'A',  9, 0.80, 2.9],
      [248, 310, 'B',  7, 0.90, 3.2],
      [264, 310, 'B',  7, 0.95, 3.5],
      [160, 322, 'A', 10, 1.00, 3.8],
      [160, 360, 'A',  9, 1.15, 4.2],
      [100, 360, 'A',  9, 1.30, 4.6],
      [100, 400, 'A',  8, 1.45, 5.0],
      [352, 322, 'A', 10, 1.05, 3.9],
      [352, 360, 'A',  9, 1.20, 4.3],
      [412, 360, 'A',  9, 1.35, 4.7],
      [412, 400, 'A',  8, 1.50, 5.1],
      [256, 380, 'A',  9, 1.20, 4.0],
      [120, 340, 'C',  7, 1.60, 5.5],
      [120, 380, 'C',  6, 1.75, 6.0],
      [392, 340, 'C',  7, 1.65, 5.6],
      [392, 380, 'C',  6, 1.80, 6.1],
      [220, 380, 'C',  6, 1.85, 5.8],
      [292, 380, 'C',  6, 1.90, 5.9],
      [140, 358, 'C',  5, 2.00, 6.3],
      [200, 358, 'C',  5, 2.05, 6.5],
      [312, 358, 'C',  5, 2.10, 6.4],
      [372, 358, 'C',  5, 2.15, 6.6],
    ];

    const COLORS = {
      B: { stroke:'#fffbe8', glow:'rgba(255,245,200,0.9)',  glow2:'rgba(255,200,80,0.5)'  },
      A: { stroke:'#ffaa33', glow:'rgba(255,150,30,0.85)',  glow2:'rgba(255,80,0,0.4)'   },
      C: { stroke:'#ff6600', glow:'rgba(255,90,0,0.7)',     glow2:'rgba(180,50,0,0.3)'   },
    };

    const defs = document.createElementNS(NS, 'defs');
    canvas.appendChild(defs);

    SPARKLE_POINTS.forEach((pt, i) => {
      const [sx, sy, col, sz, delay, period] = pt;
      const x = sx * SCALE;
      const y = sy * SCALE;
      const c = COLORS[col];
      const filterId = `sf${i}`;

      const filt = document.createElementNS(NS, 'filter');
      filt.setAttribute('id', filterId);
      filt.setAttribute('x', '-150%'); filt.setAttribute('y', '-150%');
      filt.setAttribute('width', '400%'); filt.setAttribute('height', '400%');
      const blur1 = document.createElementNS(NS, 'feGaussianBlur');
      blur1.setAttribute('stdDeviation', col === 'B' ? '2.5' : '2');
      blur1.setAttribute('result', 'b1');
      const blur2 = document.createElementNS(NS, 'feGaussianBlur');
      blur2.setAttribute('stdDeviation', col === 'B' ? '5' : '4');
      blur2.setAttribute('result', 'b2');
      const merge = document.createElementNS(NS, 'feMerge');
      ['b2','b1','SourceGraphic'].forEach(n => {
        const mn = document.createElementNS(NS, 'feMergeNode');
        mn.setAttribute('in', n);
        merge.appendChild(mn);
      });
      filt.appendChild(blur1);
      filt.appendChild(blur2);
      filt.appendChild(merge);
      defs.appendChild(filt);

      const g = document.createElementNS(NS, 'g');
      g.setAttribute('filter', `url(#${filterId})`);

      const arm1 = document.createElementNS(NS, 'line');
      arm1.setAttribute('x1', String(x - sz/2)); arm1.setAttribute('y1', String(y));
      arm1.setAttribute('x2', String(x + sz/2)); arm1.setAttribute('y2', String(y));
      arm1.setAttribute('stroke', c.stroke);
      arm1.setAttribute('stroke-width', col === 'B' ? '1.4' : '1.1');
      arm1.setAttribute('stroke-linecap', 'round');

      const arm2 = document.createElementNS(NS, 'line');
      arm2.setAttribute('x1', String(x)); arm2.setAttribute('y1', String(y - sz/2));
      arm2.setAttribute('x2', String(x)); arm2.setAttribute('y2', String(y + sz/2));
      arm2.setAttribute('stroke', c.stroke);
      arm2.setAttribute('stroke-width', col === 'B' ? '1.4' : '1.1');
      arm2.setAttribute('stroke-linecap', 'round');

      const d = sz * 0.28;
      const arm3 = document.createElementNS(NS, 'line');
      arm3.setAttribute('x1', String(x-d)); arm3.setAttribute('y1', String(y-d));
      arm3.setAttribute('x2', String(x+d)); arm3.setAttribute('y2', String(y+d));
      arm3.setAttribute('stroke', c.stroke); arm3.setAttribute('stroke-width', '0.7');
      arm3.setAttribute('stroke-linecap', 'round'); arm3.setAttribute('opacity', '0.5');

      const arm4 = document.createElementNS(NS, 'line');
      arm4.setAttribute('x1', String(x+d)); arm4.setAttribute('y1', String(y-d));
      arm4.setAttribute('x2', String(x-d)); arm4.setAttribute('y2', String(y+d));
      arm4.setAttribute('stroke', c.stroke); arm4.setAttribute('stroke-width', '0.7');
      arm4.setAttribute('stroke-linecap', 'round'); arm4.setAttribute('opacity', '0.5');

      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', String(x)); dot.setAttribute('cy', String(y));
      dot.setAttribute('r', col === 'B' ? '1.5' : '1.1');
      dot.setAttribute('fill', c.stroke);

      g.appendChild(arm1); g.appendChild(arm2);
      g.appendChild(arm3); g.appendChild(arm4);
      g.appendChild(dot);

      const opAnim = document.createElementNS(NS, 'animate');
      opAnim.setAttribute('attributeName', 'opacity');
      opAnim.setAttribute('values', `0;0;1;0.85;0;0;1;0.7;0`);
      opAnim.setAttribute('keyTimes', `0;0.05;0.2;0.4;0.7;0.72;0.8;0.9;1`);
      opAnim.setAttribute('dur', `${period}s`);
      opAnim.setAttribute('begin', `${delay}s`);
      opAnim.setAttribute('repeatCount', 'indefinite');
      opAnim.setAttribute('calcMode', 'spline');
      opAnim.setAttribute('keySplines', '0 0 1 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0 0 1 1; 0 0 1 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0 0 1 1');

      const scaleAnim = document.createElementNS(NS, 'animateTransform');
      scaleAnim.setAttribute('attributeName', 'transform');
      scaleAnim.setAttribute('type', 'scale');
      scaleAnim.setAttribute('values', `0;0;1.3;1;0;0;1.1;0.9;0`);
      scaleAnim.setAttribute('keyTimes', `0;0.05;0.2;0.4;0.7;0.72;0.8;0.9;1`);
      scaleAnim.setAttribute('dur', `${period}s`);
      scaleAnim.setAttribute('begin', `${delay}s`);
      scaleAnim.setAttribute('repeatCount', 'indefinite');
      scaleAnim.setAttribute('additive', 'sum');
      scaleAnim.setAttribute('calcMode', 'spline');
      scaleAnim.setAttribute('keySplines', '0 0 1 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0 0 1 1; 0 0 1 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0 0 1 1');
      scaleAnim.setAttribute('transformOrigin', `${x} ${y}`);

      const rotAnim = document.createElementNS(NS, 'animateTransform');
      rotAnim.setAttribute('attributeName', 'transform');
      rotAnim.setAttribute('type', 'rotate');
      rotAnim.setAttribute('from', `0 ${x} ${y}`);
      rotAnim.setAttribute('to',   `45 ${x} ${y}`);
      rotAnim.setAttribute('dur',  `${period * 0.8}s`);
      rotAnim.setAttribute('begin', `${delay}s`);
      rotAnim.setAttribute('repeatCount', 'indefinite');
      rotAnim.setAttribute('additive', 'sum');

      g.appendChild(opAnim);
      g.appendChild(scaleAnim);
      g.appendChild(rotAnim);
      g.setAttribute('opacity', '0');
      canvas.appendChild(g);
    });

    // Pulse Rings
    const PULSE_NODES = [
      [256, 320, 14, 0.75, 2.6, '#ffcc44'],
      [160, 322, 12, 1.00, 3.2, '#ff8833'],
      [352, 322, 12, 1.05, 3.3, '#ff8833'],
      [160, 360, 10, 1.40, 3.8, '#ff6600'],
      [352, 360, 10, 1.45, 3.9, '#ff6600'],
      [412, 360, 10, 1.60, 4.2, '#ff5500'],
      [100, 360, 10, 1.55, 4.1, '#ff5500'],
    ];

    PULSE_NODES.forEach((p, i) => {
      const [sx, sy, sz, delay, period, col] = p as [number, number, number, number, number, string];
      const x = sx * SCALE, y = sy * SCALE;
      const filtId2 = `pf${i}`;
      const f2 = document.createElementNS(NS, 'filter');
      f2.setAttribute('id', filtId2);
      f2.setAttribute('x','-200%'); f2.setAttribute('y','-200%');
      f2.setAttribute('width','500%'); f2.setAttribute('height','500%');
      const fb = document.createElementNS(NS, 'feGaussianBlur'); fb.setAttribute('stdDeviation', '3');
      f2.appendChild(fb); defs.appendChild(f2);

      const ring = document.createElementNS(NS, 'circle');
      ring.setAttribute('cx', String(x)); ring.setAttribute('cy', String(y));
      ring.setAttribute('r', String(sz * 0.5));
      ring.setAttribute('fill', 'none'); ring.setAttribute('stroke', col);
      ring.setAttribute('stroke-width', '1.2'); ring.setAttribute('opacity', '0');
      ring.setAttribute('filter', `url(#${filtId2})`);

      const rOp = document.createElementNS(NS, 'animate');
      rOp.setAttribute('attributeName','opacity'); rOp.setAttribute('values','0;0.9;0');
      rOp.setAttribute('dur',`${period * 0.35}s`); rOp.setAttribute('begin',`${delay}s`);
      rOp.setAttribute('repeatCount','indefinite'); rOp.setAttribute('keyTimes','0;0.25;1');

      const rR = document.createElementNS(NS, 'animate');
      rR.setAttribute('attributeName','r'); rR.setAttribute('values',`${sz * 0.4};${sz * 1.4}`);
      rR.setAttribute('dur',`${period * 0.35}s`); rR.setAttribute('begin',`${delay}s`);
      rR.setAttribute('repeatCount','indefinite');

      ring.appendChild(rOp); ring.appendChild(rR);
      canvas.appendChild(ring);
    });
  }, []);

  return (
    <div className="splash-container">
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Fira+Code:wght@500&display=swap" rel="stylesheet" />
      <div className="bg-glow"></div>
      <div className="grain"></div>

      <div className="lockup">
        <div className="icon-shell">
          <svg className="spark-canvas" ref={sparkCanvasRef} viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg"></svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="220" height="220">
            <defs>
              <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#ffffff"/>
                <stop offset="100%" stopColor="#f5f1ea"/>
              </linearGradient>
              <radialGradient id="canopyGrad" cx="50%" cy="60%" r="55%">
                <stop offset="0%"   stopColor="#ff6b1a"/>
                <stop offset="55%"  stopColor="#e8520a"/>
                <stop offset="100%" stopColor="#c43d00"/>
              </radialGradient>
              <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#8b3d00"/>
                <stop offset="40%"  stopColor="#c45800"/>
                <stop offset="100%" stopColor="#7a3400"/>
              </linearGradient>
              <radialGradient id="circuitGlow" cx="50%" cy="100%" r="60%">
                <stop offset="0%"   stopColor="#ff7722" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#ff7722" stopOpacity="0"/>
              </radialGradient>
              <linearGradient id="groundGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#ff6b1a" stopOpacity="0"/>
                <stop offset="20%"  stopColor="#ff6b1a" stopOpacity="0.6"/>
                <stop offset="50%"  stopColor="#ff8833" stopOpacity="0.9"/>
                <stop offset="80%"  stopColor="#ff6b1a" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#ff6b1a" stopOpacity="0"/>
              </linearGradient>
              <filter id="traceGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.8" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="canopyGlow" x="-15%" y="-15%" width="130%" height="130%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <clipPath id="iconClip">
                <rect width="512" height="512" rx="110" ry="110"/>
              </clipPath>
            </defs>
            <g clipPath="url(#iconClip)">
              <rect width="512" height="512" fill="url(#bgGrad)"/>
              <g opacity="0.12" stroke="#8a7c6a" strokeWidth="0.5">
                <line x1="64"  y1="0" x2="64"  y2="512"/>
                <line x1="128" y1="0" x2="128" y2="512"/>
                <line x1="192" y1="0" x2="192" y2="512"/>
                <line x1="256" y1="0" x2="256" y2="512"/>
                <line x1="320" y1="0" x2="320" y2="512"/>
                <line x1="384" y1="0" x2="384" y2="512"/>
                <line x1="448" y1="0" x2="448" y2="512"/>
                <line x1="0" y1="64"  x2="512" y2="64"/>
                <line x1="0" y1="128" x2="512" y2="128"/>
                <line x1="0" y1="192" x2="512" y2="192"/>
                <line x1="0" y1="256" x2="512" y2="256"/>
                <line x1="0" y1="320" x2="512" y2="320"/>
                <line x1="0" y1="384" x2="512" y2="384"/>
                <line x1="0" y1="448" x2="512" y2="448"/>
              </g>
              <ellipse cx="256" cy="490" rx="220" ry="80" fill="url(#circuitGlow)"/>
              <g filter="url(#traceGlow)">
                <line x1="240" y1="322" x2="160" y2="322" stroke="#ff6600" strokeWidth="2.8" strokeLinecap="round"/>
                <line x1="160" y1="322" x2="160" y2="360" stroke="#ff6600" strokeWidth="2.8" strokeLinecap="round"/>
                <line x1="160" y1="360" x2="100" y2="360" stroke="#ff6600" strokeWidth="2.8" strokeLinecap="round"/>
                <line x1="100" y1="360" x2="100" y2="400" stroke="#ff6600" strokeWidth="2.2" strokeLinecap="round"/>
                <line x1="100" y1="400" x2="64"  y2="400" stroke="#ff6600" strokeWidth="2.2" strokeLinecap="round"/>
                <line x1="160" y1="340" x2="120" y2="340" stroke="#cc5500" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="120" y1="340" x2="120" y2="380" stroke="#cc5500" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="120" y1="380" x2="80"  y2="380" stroke="#cc5500" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="80"  y1="380" x2="80"  y2="430" stroke="#cc5500" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="80"  y1="430" x2="50"  y2="430" stroke="#cc5500" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="200" y1="338" x2="200" y2="358" stroke="#cc5500" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="200" y1="358" x2="140" y2="358" stroke="#cc5500" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="140" y1="358" x2="140" y2="395" stroke="#cc5500" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="140" y1="395" x2="90"  y2="395" stroke="#aa4400" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="90"  y1="395" x2="90"  y2="450" stroke="#aa4400" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="100" y1="400" x2="100" y2="460" stroke="#883300" strokeWidth="1" strokeLinecap="round"/>
                <line x1="64"  y1="400" x2="64"  y2="470" stroke="#883300" strokeWidth="1" strokeLinecap="round"/>
                <line x1="64"  y1="440" x2="40"  y2="440" stroke="#883300" strokeWidth="1" strokeLinecap="round"/>
                <line x1="272" y1="322" x2="352" y2="322" stroke="#ff6600" strokeWidth="2.8" strokeLinecap="round"/>
                <line x1="352" y1="322" x2="352" y2="360" stroke="#ff6600" strokeWidth="2.8" strokeLinecap="round"/>
                <line x1="352" y1="360" x2="412" y2="360" stroke="#ff6600" strokeWidth="2.8" strokeLinecap="round"/>
                <line x1="412" y1="360" x2="412" y2="400" stroke="#ff6600" strokeWidth="2.2" strokeLinecap="round"/>
                <line x1="412" y1="400" x2="448" y2="400" stroke="#ff6600" strokeWidth="2.2" strokeLinecap="round"/>
                <line x1="352" y1="340" x2="392" y2="340" stroke="#cc5500" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="392" y1="340" x2="392" y2="380" stroke="#cc5500" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="392" y1="380" x2="432" y2="380" stroke="#cc5500" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="432" y1="380" x2="432" y2="430" stroke="#cc5500" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="432" y1="430" x2="462" y2="430" stroke="#cc5500" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="312" y1="338" x2="312" y2="358" stroke="#cc5500" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="312" y1="358" x2="372" y2="358" stroke="#cc5500" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="372" y1="358" x2="372" y2="395" stroke="#cc5500" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="372" y1="395" x2="422" y2="395" stroke="#aa4400" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="422" y1="395" x2="422" y2="450" stroke="#aa4400" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="412" y1="400" x2="412" y2="460" stroke="#883300" strokeWidth="1" strokeLinecap="round"/>
                <line x1="448" y1="400" x2="448" y2="470" stroke="#883300" strokeWidth="1" strokeLinecap="round"/>
                <line x1="448" y1="440" x2="472" y2="440" stroke="#883300" strokeWidth="1" strokeLinecap="round"/>
                <line x1="256" y1="322" x2="256" y2="380" stroke="#cc5500" strokeWidth="2"   strokeLinecap="round"/>
                <line x1="256" y1="380" x2="220" y2="380" stroke="#cc5500" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="256" y1="380" x2="292" y2="380" stroke="#cc5500" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="220" y1="380" x2="220" y2="420" stroke="#883300" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="292" y1="380" x2="292" y2="420" stroke="#883300" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="220" y1="420" x2="190" y2="420" stroke="#883300" strokeWidth="1"   strokeLinecap="round"/>
                <line x1="292" y1="420" x2="322" y2="420" stroke="#883300" strokeWidth="1"   strokeLinecap="round"/>
                <circle cx="160" cy="322" r="4.5" fill="#ff8833"/>
                <circle cx="160" cy="360" r="4.5" fill="#ff8833"/>
                <circle cx="100" cy="360" r="4.5" fill="#ff8833"/>
                <circle cx="100" cy="400" r="4"   fill="#ff8833"/>
                <circle cx="352" cy="322" r="4.5" fill="#ff8833"/>
                <circle cx="352" cy="360" r="4.5" fill="#ff8833"/>
                <circle cx="412" cy="360" r="4.5" fill="#ff8833"/>
                <circle cx="412" cy="400" r="4"   fill="#ff8833"/>
                <circle cx="256" cy="380" r="4"   fill="#ff8833"/>
                <circle cx="120" cy="340" r="3.2" fill="#dd6611"/>
                <circle cx="120" cy="380" r="3.2" fill="#dd6611"/>
                <circle cx="200" cy="358" r="3.2" fill="#dd6611"/>
                <circle cx="140" cy="358" r="3.2" fill="#dd6611"/>
                <circle cx="140" cy="395" r="3"   fill="#dd6611"/>
                <circle cx="392" cy="340" r="3.2" fill="#dd6611"/>
                <circle cx="392" cy="380" r="3.2" fill="#dd6611"/>
                <circle cx="312" cy="358" r="3.2" fill="#dd6611"/>
                <circle cx="372" cy="358" r="3.2" fill="#dd6611"/>
                <circle cx="372" cy="395" r="3"   fill="#dd6611"/>
                <circle cx="220" cy="380" r="3"   fill="#dd6611"/>
                <circle cx="292" cy="380" r="3"   fill="#dd6611"/>
                <circle cx="220" cy="420" r="2.5" fill="#dd6611"/>
                <circle cx="292" cy="420" r="2.5" fill="#dd6611"/>
                <circle cx="80"  cy="380" r="2.5" fill="#aa4400"/>
                <circle cx="80"  cy="430" r="2"   fill="#aa4400"/>
                <circle cx="64"  cy="400" r="2.5" fill="#aa4400"/>
                <circle cx="432" cy="380" r="2.5" fill="#aa4400"/>
                <circle cx="432" cy="430" r="2"   fill="#aa4400"/>
                <circle cx="448" cy="400" r="2.5" fill="#aa4400"/>
              </g>
              <line x1="40" y1="320" x2="472" y2="320" stroke="url(#groundGrad)" strokeWidth="1.5" opacity="0.7"/>
              <path d="M238,320 C236,290 232,265 228,245 C224,225 222,210 224,200 C226,190 230,185 236,182 C240,180 244,180 248,182 C252,184 255,188 256,195 C257,188 260,184 264,182 C268,180 272,180 276,182 C282,185 286,190 288,200 C290,210 288,225 284,245 C280,265 276,290 274,320Z" fill="url(#trunkGrad)"/>
              <path d="M244,320 C242,295 240,270 238,245 C236,225 237,210 240,200" stroke="#7a3400" strokeWidth="1.2" fill="none" opacity="0.6"/>
              <path d="M268,320 C270,295 272,270 274,245 C276,225 275,210 272,200" stroke="#7a3400" strokeWidth="1.2" fill="none" opacity="0.6"/>
              <path d="M234,248 C225,242 210,235 192,228 C175,222 158,220 148,222 C140,224 136,228 138,232 C140,236 146,238 154,237 C145,240 138,244 137,248 C136,252 140,256 150,255" stroke="#c45800" strokeWidth="8" strokeLinecap="round" fill="none"/>
              <path d="M192,228 C182,220 170,210 162,198 C155,188 152,178 156,172 C160,166 168,167 174,173" stroke="#c45800" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
              <path d="M170,210 C162,202 154,192 150,182 C146,172 148,165 154,163" stroke="#a84500" strokeWidth="4" strokeLinecap="round" fill="none"/>
              <path d="M278,242 C288,236 303,228 320,221 C337,214 355,212 365,215 C373,218 377,222 374,226 C371,230 364,232 356,231 C365,234 372,238 373,243 C374,248 370,252 360,251" stroke="#c45800" strokeWidth="8" strokeLinecap="round" fill="none"/>
              <path d="M320,221 C330,213 342,203 350,191 C357,180 360,170 356,164 C352,158 344,158 337,165" stroke="#c45800" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
              <path d="M342,203 C350,195 358,185 362,175 C366,165 364,157 358,155" stroke="#a84500" strokeWidth="4" strokeLinecap="round" fill="none"/>
              <path d="M254,200 C252,185 250,170 250,158 C250,148 252,140 256,138 C260,136 264,140 266,150 C268,162 266,176 264,188" stroke="#c45800" strokeWidth="5" strokeLinecap="round" fill="none"/>
              <path d="M252,172 C244,165 235,158 228,152 C222,147 220,142 224,140" stroke="#a84500" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
              <path d="M260,168 C268,161 277,154 284,148 C290,143 292,138 288,136" stroke="#a84500" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
              <path d="M82,240 C75,230 72,218 78,208 C84,198 96,193 110,196 C104,186 106,175 115,170 C124,165 136,168 144,176 C146,162 154,153 165,152 C176,151 185,158 188,168 C192,155 202,148 215,149 C228,150 236,160 237,172 C240,158 248,150 258,150 C268,150 276,158 278,172 C280,160 288,150 300,149 C312,148 322,156 324,168 C328,158 338,152 349,153 C360,154 368,163 370,176 C376,168 388,165 398,170 C408,175 412,186 406,196 C420,194 432,199 437,209 C442,219 438,231 428,238 C434,246 433,258 425,265 C417,272 405,272 398,266 C393,275 382,280 370,278 C358,276 350,268 348,259 C340,270 326,276 312,272 C298,268 292,257 293,246 C282,256 268,260 255,258 C242,256 232,248 230,238 C222,250 208,256 194,252 C180,248 173,237 174,226 C164,234 150,238 138,234 C126,230 120,220 122,210 C110,218 96,220 86,214Z" fill="#b83d00" opacity="0.7" filter="url(#canopyGlow)"/>
              <path d="M105,225 C98,213 100,200 110,193 C105,181 108,170 118,165 C128,160 140,165 146,175 C150,162 160,154 173,154 C186,154 195,163 196,175 C200,163 211,156 224,157 C237,158 245,168 245,180 C248,167 256,159 266,159 C276,159 284,167 285,180 C286,168 296,158 309,157 C322,156 332,163 334,175 C338,165 349,159 361,160 C373,161 381,170 380,182 C388,173 400,171 410,177 C420,183 422,196 415,206 C425,212 428,226 420,234 C412,242 400,242 393,235 C388,244 376,250 363,247 C350,244 343,233 345,222 C334,233 319,238 304,234 C289,230 283,218 285,207 C274,218 259,223 244,219 C229,215 222,203 224,192 C213,204 198,209 183,205 C168,201 161,188 165,176 C154,184 140,186 129,180 C118,174 114,161 120,151 C110,158 102,170 102,183 C100,196 106,212 112,220Z" fill="url(#canopyGrad)" opacity="0.85"/>
              <path d="M160,195 C155,182 158,169 168,163 C163,151 167,140 177,136 C187,132 198,137 202,148 C207,136 217,129 229,130 C241,131 249,140 249,152 C252,140 260,132 270,132 C280,132 288,140 289,152 C292,140 302,132 314,131 C326,130 335,137 337,149 C342,139 353,133 364,137 C375,141 379,153 374,164 C384,168 389,180 384,190 C379,200 367,204 357,200 C353,210 341,217 328,214 C315,211 308,200 310,190 C299,201 284,206 269,202 C254,198 247,186 249,175 C240,187 226,193 212,190 C198,187 191,175 193,164 C183,173 169,175 160,169Z" fill="#ff6b1a" opacity="0.9"/>
              <path d="M210,168 C208,156 213,145 222,140 C215,130 218,120 227,116 C236,112 246,117 249,127 C252,117 260,111 269,112 C278,113 284,121 283,131 C290,122 301,118 311,122 C321,126 325,137 320,147 C330,143 341,146 346,155 C351,164 347,176 337,181 C340,192 333,203 321,205 C309,207 299,199 298,188 C287,199 272,204 257,201 C242,198 234,186 236,175 C226,185 212,188 201,183 C190,178 187,165 193,156Z" fill="#ff8833" opacity="0.75"/>
              <path d="M230,142 C235,134 243,129 252,130 C261,131 268,137 270,145 C277,136 287,132 297,135 C307,138 312,147 309,156 C318,150 328,150 334,157 C340,164 337,174 328,178" stroke="#ffaa44" strokeWidth="2.5" fill="none" opacity="0.6" strokeLinecap="round"/>
              <ellipse cx="148" cy="224" rx="22" ry="14" fill="#e85500" opacity="0.8" transform="rotate(-15 148 224)"/>
              <ellipse cx="138" cy="234" rx="16" ry="10" fill="#ff7722" opacity="0.7" transform="rotate(10 138 234)"/>
              <ellipse cx="162" cy="172" rx="18" ry="12" fill="#e85500" opacity="0.8" transform="rotate(-20 162 172)"/>
              <ellipse cx="364" cy="218" rx="22" ry="14" fill="#e85500" opacity="0.8" transform="rotate(15 364 218)"/>
              <ellipse cx="374" cy="228" rx="16" ry="10" fill="#ff7722" opacity="0.7" transform="rotate(-10 374 228)"/>
              <ellipse cx="348" cy="165" rx="18" ry="12" fill="#e85500" opacity="0.8" transform="rotate(20 348 165)"/>
              <ellipse cx="256" cy="137" rx="20" ry="13" fill="#ff8833" opacity="0.85"/>
              <ellipse cx="244" cy="142" rx="14" ry="9"  fill="#ff6b1a" opacity="0.7"/>
              <ellipse cx="268" cy="142" rx="14" ry="9"  fill="#ff6b1a" opacity="0.7"/>
              <ellipse cx="224" cy="142" rx="14" ry="9"  fill="#e05000" opacity="0.75" transform="rotate(-25 224 142)"/>
              <ellipse cx="288" cy="138" rx="14" ry="9"  fill="#e05000" opacity="0.75" transform="rotate(25 288 138)"/>
              <circle cx="240" cy="318" r="3.5" fill="#ff9944" opacity="0.9"/>
              <circle cx="256" cy="320" r="3.5" fill="#ff9944" opacity="0.9"/>
              <circle cx="272" cy="318" r="3.5" fill="#ff9944" opacity="0.9"/>
              <circle cx="248" cy="310" r="2.5" fill="#ffbb55" opacity="0.7"/>
              <circle cx="264" cy="310" r="2.5" fill="#ffbb55" opacity="0.7"/>
              <rect x="6" y="6" width="500" height="500" rx="106" ry="106" fill="none" stroke="#8a7c6a" strokeWidth="1.5" opacity="0.12"/>
              <rect x="14" y="14" width="484" height="484" rx="100" ry="100" fill="none" stroke="#8a7c6a" strokeWidth="0.75" opacity="0.07"/>
            </g>
          </svg>
        </div>

        <div className="divider"></div>

        <div className="text-block">
          <div className="word-gump">Gump</div>
          <div className="word-wiser">Wiser</div>
          <div className="tagline">Civic Intelligence · Montgomery AL</div>
        </div>
      </div>

      <div className="bottom-tag">Montgomery, Alabama · Est. 2025</div>
      <div className="load-track"><div className="load-fill"></div></div>

      <style jsx>{`
        .splash-container {
          position: fixed; inset: 0; overflow: hidden; background: #ffffff;
          display: flex; align-items: center; justify-content: center; z-index: 9999;
          font-family: 'Fraunces', serif;
        }
        .bg-glow {
          position: fixed; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 55% 45% at 42% 50%, rgba(255,90,10,0.11) 0%, transparent 65%),
            radial-gradient(ellipse 35% 25% at 20% 80%, rgba(200,60,0,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 30% 20% at 80% 75%, rgba(200,60,0,0.05) 0%, transparent 50%);
          animation: bgBreathe 5s ease-in-out infinite alternate;
        }
        @keyframes bgBreathe { from{opacity:.7} to{opacity:1} }
        .grain {
          position: fixed; inset: 0; pointer-events: none; opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E");
        }
        .lockup { position: relative; z-index: 10; display: flex; align-items: center; gap: 0; }
        .icon-shell {
          position: relative; flex-shrink: 0; opacity: 0;
          transform: scale(0.78) translateY(20px);
          animation: iconIn 1s cubic-bezier(0.16,1,0.3,1) 0.25s forwards;
        }
        @keyframes iconIn { to { opacity:1; transform:scale(1) translateY(0); } }
        .icon-shell svg {
          display: block; border-radius: 48px;
          filter: drop-shadow(0 0 32px rgba(255,100,20,0.15)) drop-shadow(0 0 80px rgba(255,60,0,0.05)) drop-shadow(0 4px 12px rgba(0,0,0,0.08));
        }
        .icon-shell::before {
          content: ''; position: absolute; inset: -16px; border-radius: 56px; border: 1px solid rgba(255,120,40,0.2);
          opacity: 0; animation: ringPulse 3.2s ease-out 1.4s infinite;
        }
        .icon-shell::after {
          content: ''; position: absolute; inset: -32px; border-radius: 64px; border: 1px solid rgba(255,100,20,0.08);
          opacity: 0; animation: ringPulse 3.2s ease-out 1.9s infinite;
        }
        @keyframes ringPulse { 0% { opacity:0; transform:scale(0.94); } 25% { opacity:1; } 100% { opacity:0; transform:scale(1.07); } }
        .spark-canvas { position: absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:20; overflow:visible; }
        .divider {
          width: 1.5px; height: 88px; margin: 0 40px;
          background: linear-gradient(to bottom, transparent 0%, #ebe6dc 30%, #ddd8ce 50%, #ebe6dc 70%, transparent 100%);
          opacity: 0; flex-shrink: 0; align-self: center; animation: fadeIn 0.5s ease 1.35s forwards;
        }
        .text-block { display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
        .word-gump {
          font-family: 'Fraunces', serif; font-size: 88px; font-weight: 700; color: #1c1409;
          letter-spacing: -5px; line-height: 0.86; opacity: 0; transform: translateX(-32px);
          animation: wordIn 0.8s cubic-bezier(0.16,1,0.3,1) 1.1s forwards;
        }
        .word-wiser {
          font-family: 'Fraunces', serif; font-size: 88px; font-weight: 900; color: #ff5511;
          letter-spacing: -5px; line-height: 0.86; opacity: 0; transform: translateX(-32px);
          animation: wordIn 0.8s cubic-bezier(0.16,1,0.3,1) 1.28s forwards;
        }
        @keyframes wordIn { to { opacity:1; transform:translateX(0); } }
        .tagline {
          margin-top: 16px; font-family: 'Fira Code', monospace; font-size: 10.5px; font-weight: 500;
          letter-spacing: 3.5px; text-transform: uppercase; color: #8a7c6a; opacity: 0;
          animation: fadeIn 0.7s ease 1.75s forwards;
        }
        @keyframes fadeIn { to { opacity:1; } }
        .bottom-tag {
          position: fixed; bottom: 40px; left: 0; right: 0; text-align: center;
          font-family: 'Fira Code', monospace; font-size: 9.5px; letter-spacing: 4px;
          text-transform: uppercase; color: rgba(28,20,9,0.15); opacity: 0;
          animation: fadeIn 0.8s ease 2.3s forwards;
        }
        .load-track { position: fixed; bottom: 0; left: 0; right: 0; height: 3px; background: #f5f1ea; }
        .load-fill {
          height: 100%; width: 0; background: linear-gradient(to right, transparent, #ff6600 20%, #ffaa44 50%, #ff6600 80%, transparent);
          animation: loadFill 2.4s cubic-bezier(0.4,0,0.2,1) 0.15s forwards;
        }
        @keyframes loadFill { 0% { width:0%; opacity:1; } 80% { width:100%; opacity:1; } 100% { width:100%; opacity:0; } }
      `}</style>
    </div>
  );
}
