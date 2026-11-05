'use client';

import { useEffect, useRef } from 'react';

// Mapa-múndi simplificado (projeção equirretangular): 36 linhas de 5° de latitude
// (de 90°N a 90°S) por 72 colunas de 5° de longitude (de 180°W a 180°E).
// Cada linha lista as faixas [colunaInicial, colunaFinal] que são continente.
const FAIXAS = [
  [],
  [[18, 22], [24, 31], [46, 47], [55, 56]],
  [[12, 21], [22, 32], [39, 40], [47, 48], [55, 57]],
  [[4, 7], [11, 19], [20, 22], [25, 31], [40, 41], [45, 71]],
  [[3, 7], [8, 18], [21, 23], [25, 30], [31, 33], [38, 41], [42, 71]],
  [[3, 7], [8, 16], [20, 22], [26, 27], [37, 41], [42, 63], [67, 71]],
  [[4, 5], [9, 16], [20, 23], [35, 35], [37, 39], [40, 63], [67, 68]],
  [[10, 24], [34, 63], [64, 64], [67, 67]],
  [[11, 24], [35, 41], [44, 63], [64, 64]],
  [[11, 23], [34, 37], [39, 39], [41, 48], [50, 61], [63, 64]],
  [[11, 21], [34, 35], [38, 38], [41, 48], [50, 61], [63, 63]],
  [[12, 19], [34, 59], [62, 62]],
  [[13, 16], [19, 19], [33, 46], [48, 60]],
  [[14, 16], [20, 20], [32, 42], [44, 47], [49, 59]],
  [[15, 18], [32, 42], [44, 46], [50, 52], [55, 57], [60, 60]],
  [[17, 19], [32, 45], [51, 51], [55, 57], [60, 60]],
  [[20, 23], [33, 45], [51, 51], [56, 56], [61, 61]],
  [[20, 25], [37, 44], [55, 59]],
  [[20, 28], [37, 44], [56, 57], [59, 60], [62, 63]],
  [[20, 28], [38, 43], [62, 65]],
  [[20, 28], [38, 43], [45, 45], [62, 64]],
  [[21, 27], [38, 43], [45, 45], [60, 65]],
  [[22, 27], [38, 43], [45, 45], [58, 66]],
  [[21, 26], [39, 42], [58, 66]],
  [[21, 25], [39, 41], [59, 61], [64, 66]],
  [[21, 24], [64, 65], [70, 70]],
  [[21, 23], [65, 65], [69, 70]],
  [[21, 23], [69, 69]],
  [[21, 22]],
  [],
  [[24, 24]],
  [[18, 30], [34, 71]],
  [[0, 71]],
  [[0, 71]],
  [[0, 71]],
  [[0, 71]],
];

const COLUNAS_MAPA = 72;
const LINHAS_MAPA = FAIXAS.length;

// Converte as faixas em uma grade de 0 (mar) e 1 (terra) para consulta rápida.
const MAPA = FAIXAS.map((faixas) => {
  const linha = new Uint8Array(COLUNAS_MAPA);
  faixas.forEach(([inicio, fim]) => {
    for (let c = inicio; c <= fim; c++) linha[c] = 1;
  });
  return linha;
});

// Caracteres do mais "leve" ao mais "denso": quanto mais luz, mais denso.
const RAMPA_TERRA = '+*#%@';
const RAMPA_MAR = '.:-=';

const TAMANHO_CARACTERE = 10;    // altura desejada de cada caractere, em px
const PROPORCAO_CARACTERE = 0.6; // caracteres monoespaçados são mais altos que largos
const INCLINACAO_EIXO = 0.41;    // ~23,5° (inclinação real do eixo da Terra)
const INCLINACAO_VISTA = 0.35;   // mostra um pouco do polo norte
const GRAUS_POR_SEGUNDO = 12;    // uma volta completa a cada 30 s

function normalizar(x, y, z) {
  const t = Math.hypot(x, y, z);
  return [x / t, y / t, z / t];
}

// Luz vinda do alto, à esquerda, levemente de frente.
const LUZ = normalizar(-0.55, 0.45, 0.7);

function desenhar(ctx, largura, altura, rotacao, cores) {
  ctx.clearRect(0, 0, largura, altura);
  if (!largura || !altura) return;

  // Quantidade de linhas se adapta ao tamanho, mantendo os caracteres legíveis.
  const linhasTela = Math.max(20, Math.min(48, Math.round(altura / TAMANHO_CARACTERE)));
  const alturaCaractere = altura / linhasTela;
  const larguraCaractere = alturaCaractere * PROPORCAO_CARACTERE;
  const colunasTela = Math.floor(largura / larguraCaractere);
  const margemX = (largura - colunasTela * larguraCaractere) / 2;
  const raio = (Math.min(largura, altura) / 2) * 0.96;
  const cx = largura / 2;
  const cy = altura / 2;

  ctx.font = `600 ${alturaCaractere}px ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const cosE = Math.cos(INCLINACAO_EIXO);
  const senE = Math.sin(INCLINACAO_EIXO);
  const cosV = Math.cos(INCLINACAO_VISTA);
  const senV = Math.sin(INCLINACAO_VISTA);

  for (let j = 0; j < linhasTela; j++) {
    const py = (j + 0.5) * alturaCaractere;
    const ny = (py - cy) / raio;

    for (let i = 0; i < colunasTela; i++) {
      const px = margemX + (i + 0.5) * larguraCaractere;
      const nx = (px - cx) / raio;
      const d = nx * nx + ny * ny;
      if (d > 1) continue; // fora do círculo do planeta

      // Ponto na superfície da esfera, visto pela câmera (y para cima).
      const x0 = nx;
      const y0 = -ny;
      const z0 = Math.sqrt(1 - d);

      // Iluminação: produto escalar entre a normal da superfície e a luz.
      const brilho = Math.max(0, x0 * LUZ[0] + y0 * LUZ[1] + z0 * LUZ[2]);

      // Gira a vista para o referencial do planeta (eixo inclinado).
      const xr = x0 * cosE - y0 * senE;
      const yr = x0 * senE + y0 * cosE;
      const yw = yr * cosV + z0 * senV;
      const zw = -yr * senV + z0 * cosV;

      const lat = (Math.asin(Math.max(-1, Math.min(1, yw))) * 180) / Math.PI;
      let lon = (Math.atan2(xr, zw) * 180) / Math.PI - rotacao;
      lon = (((lon + 180) % 360) + 360) % 360;

      const linha = Math.min(LINHAS_MAPA - 1, Math.max(0, Math.floor((90 - lat) / 5)));
      const coluna = Math.floor(lon / 5) % COLUNAS_MAPA;
      const terra = MAPA[linha][coluna] === 1;

      const rampa = terra ? RAMPA_TERRA : RAMPA_MAR;
      const indice = Math.min(rampa.length - 1, Math.floor(brilho * rampa.length));

      // O lado escuro continua visível bem de leve, para manter o contorno.
      ctx.globalAlpha = 0.18 + 0.82 * brilho;
      ctx.fillStyle = terra ? cores.terra : cores.mar;
      ctx.fillText(rampa[indice], px, py);
    }
  }

  ctx.globalAlpha = 1;
}

// Planeta Terra desenhado com caracteres, girando em tempo real (canvas).
export default function AsciiGlobe({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const cores = { terra: '#00AB39', mar: '#0096C7' };
    let largura = 0;
    let altura = 0;
    let rotacao = 0;
    let ultimoQuadro = 0;
    let quadroId = 0;
    let visivel = true;

    // As cores seguem os tokens do tema (mudam no modo escuro).
    const lerCores = () => {
      const estilo = getComputedStyle(document.documentElement);
      cores.terra = estilo.getPropertyValue('--accent').trim() || cores.terra;
      cores.mar = estilo.getPropertyValue('--primary').trim() || cores.mar;
    };

    const redesenhar = () => desenhar(ctx, largura, altura, rotacao, cores);

    // Ajusta a resolução do canvas ao tamanho real e à densidade da tela.
    const ajustarTamanho = () => {
      const area = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      largura = area.width;
      altura = area.height;
      canvas.width = Math.round(area.width * dpr);
      canvas.height = Math.round(area.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      redesenhar();
    };

    // Laço de animação limitado a ~30 quadros por segundo.
    const animar = (tempo) => {
      quadroId = requestAnimationFrame(animar);
      if (!visivel || tempo - ultimoQuadro < 33) return;
      const delta = ultimoQuadro ? (tempo - ultimoQuadro) / 1000 : 0;
      ultimoQuadro = tempo;
      rotacao = (rotacao + delta * GRAUS_POR_SEGUNDO) % 360;
      redesenhar();
    };

    lerCores();
    ajustarTamanho();

    const observadorTamanho = new ResizeObserver(ajustarTamanho);
    observadorTamanho.observe(canvas);

    const observadorTema = new MutationObserver(() => {
      lerCores();
      redesenhar();
    });
    observadorTema.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Pausa a animação quando o globo sai da tela (economiza processamento).
    const observadorVisibilidade = new IntersectionObserver(([entrada]) => {
      visivel = entrada.isIntersecting;
      ultimoQuadro = 0;
    });
    observadorVisibilidade.observe(canvas);

    // Quem prefere menos movimento vê o globo parado.
    const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!menosMovimento) quadroId = requestAnimationFrame(animar);

    return () => {
      cancelAnimationFrame(quadroId);
      observadorTamanho.disconnect();
      observadorTema.disconnect();
      observadorVisibilidade.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`block h-full w-full ${className}`} />;
}
