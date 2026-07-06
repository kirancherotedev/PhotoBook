'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { PRODUCT_IMAGES, formatProductName } from '@/lib/products';

const PHOTOS = [
<<<<<<< Updated upstream
  '/products/4You & Me  Timeless.png',
  '/products/10Story of Us.png',
  '/products/8You & Me.png',
=======
  '/products/You & Me  Timeless.png',
  '/products/Our Story.png',
>>>>>>> Stashed changes
];

/* ── Taikiru design-system palette ── */
const COLOR = {
  surface: '#fcf9f8',
  surfaceContainerLow: '#f6f3f2',
  surfaceContainer: '#f0eded',
  surfaceContainerHigh: '#eae7e7',
  onSurface: '#1b1c1c',
  onSurfaceVariant: '#454840',
  outline: '#75786f',
  outlineVariant: '#c5c7bd',
  primary: '#434f38',
  onPrimary: '#ffffff',
  primaryContainer: '#5b674e',
  tertiaryContainer: '#5f6553',
  secondaryContainer: '#e5e3d7',
  onSecondaryContainer: '#65655c',
};

<<<<<<< Updated upstream
/* ── Sun-ray mark ── */
function SunMark({ size = 20, color = COLOR.primary }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 0 L13.8 9.2 L23 8 L14.6 12 L23 16 L13.8 14.8 L12 24 L10.2 14.8 L1 16 L9.4 12 L1 8 L10.2 9.2 Z"
        fill={color}
      />
    </svg>
  );
}
=======

>>>>>>> Stashed changes

/* ── Sample "polaroid" slots for the customizer showcase ──
   These are placeholder gradients standing in for a customer's own
   uploaded photos — the point of this section is the customization
   chrome (clip, tilt, caption), not stock imagery. */
const POLAROIDS = [
  { image: '/polaroids/1.png', rotate: -6, caption: 'Summer, 2023' },
  { image: '/polaroids/2.png', rotate: 4,  caption: 'Home' },
  { image: '/polaroids/3.png', rotate: -3, caption: 'The trip' },
  { image: '/polaroids/4.png', rotate: 7,  caption: 'Us, always' },
  { image: '/polaroids/5.png', rotate: -8, caption: 'First snow' },
  { image: '/polaroids/6.png', rotate: 5,  caption: 'Together' },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [defaultTemplateId, setDefaultTemplateId] = useState<string>('');
<<<<<<< Updated upstream

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) setDefaultTemplateId(d.data[0].id);
      })
      .catch(() => {});
  }, []);

  /* ── Intersection Observer (scroll fade-in) ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.fade-in-up').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ── Image sequence background ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const syncSize = () => {
      const el = canvas.parentElement ?? canvas;
      if (canvas.width !== el.clientWidth) canvas.width = el.clientWidth;
      if (canvas.height !== el.clientHeight) canvas.height = el.clientHeight;
    };
    const ro = new ResizeObserver(syncSize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    syncSize();

    let raf: number;
    let isActive = true;

    fetch('/frames.json')
      .then(r => r.json())
      .then((frameFiles: string[]) => {
        if (!isActive) return;
        const frameCount = frameFiles.length;
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        frameFiles.forEach(file => {
          const img = new Image();
          img.src = `/hero-frames/${file}`;
          img.onload = () => loadedCount++;
          images.push(img);
        });

        let frameIndex = 0;
        let lastTime = 0;
        const fps = 30;
        const frameInterval = 1000 / fps;

        const draw = (time: number) => {
          raf = requestAnimationFrame(draw);
          if (!lastTime) lastTime = time;

          const deltaTime = time - lastTime;
          let frameProgress = deltaTime / frameInterval;

          if (deltaTime >= frameInterval) {
            lastTime = time - (deltaTime % frameInterval);
            frameIndex = (frameIndex + 1) % frameCount;
            frameProgress = 0;
          }

          if (loadedCount > 0 && images[frameIndex]?.complete && images[frameIndex]?.naturalWidth > 0) {
            const img = images[frameIndex];
            const nextImg = images[(frameIndex + 1) % frameCount];

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            const drawImg = (image: HTMLImageElement, alpha: number) => {
              if (!image || !image.complete) return;
              const canvasRatio = canvas.width / canvas.height;
              const imgRatio = image.width / image.height;
              let drawWidth = canvas.width;
              let drawHeight = canvas.height;
              let offsetX = 0;
              let offsetY = 0;

              if (canvasRatio > imgRatio) {
                drawHeight = canvas.width / imgRatio;
                offsetY = (canvas.height - drawHeight) / 2;
              } else {
                drawWidth = canvas.height * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
              }

              ctx.globalAlpha = alpha;
              ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
            };

            // Draw current frame
            drawImg(img, 1);
            // Draw next frame faded in
            if (nextImg) {
              drawImg(nextImg, frameProgress * 0.5);
            }
            ctx.globalAlpha = 1;
          }
        };

        raf = requestAnimationFrame(draw);
      })
      .catch(err => console.error('Failed to load frames.json', err));

    return () => {
      isActive = false;
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const go = (path: string) => {
    if (path.startsWith('/templates')) {
      router.push(path);
      return;
    }
    if (!isAuthenticated) { router.push(`/login?redirect=${path}`); return; }
    router.push(path);
  };

  const THEMES = [
    { name: 'Timeless', sub: 'Editorial & Classic', img: PHOTOS[0], span: 'md:col-span-7', aspect: 'aspect-[1.4]' },
    { name: 'You & Me',  sub: 'Romantic & Soft',    img: PHOTOS[1], span: 'md:col-span-5', aspect: 'aspect-[1.1]' },
  ];

=======
  const [dbTemplates, setDbTemplates] = useState<Array<{id:string; name:string; thumbnail:string|null}>>([]);
  const [polaroidIndex, setPolaroidIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPolaroidIndex(prev => (prev + 1) % POLAROIDS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) {
          setDefaultTemplateId(d.data[0].id);
          setDbTemplates(d.data);
        }
      })
      .catch(() => {});
  }, []);

  const getTemplateId = (imgUrl: string) => {
    const match = dbTemplates.find(dbT => dbT.thumbnail === imgUrl);
    return match ? match.id : defaultTemplateId;
  };

  /* ── Intersection Observer (scroll fade-in) ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.fade-in-up').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ── Image sequence background ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const syncSize = () => {
      const el = canvas.parentElement ?? canvas;
      if (canvas.width !== el.clientWidth) canvas.width = el.clientWidth;
      if (canvas.height !== el.clientHeight) canvas.height = el.clientHeight;
    };
    const ro = new ResizeObserver(syncSize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    syncSize();

    let raf: number;
    let isActive = true;

    fetch('/frames.json')
      .then(r => r.json())
      .then((frameFiles: string[]) => {
        if (!isActive) return;
        const frameCount = frameFiles.length;
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        frameFiles.forEach(file => {
          const img = new Image();
          img.src = `/hero-frames/${file}`;
          img.onload = () => loadedCount++;
          images.push(img);
        });

        let frameIndex = 0;
        let lastTime = 0;
        const fps = 30;
        const frameInterval = 1000 / fps;

        const draw = (time: number) => {
          raf = requestAnimationFrame(draw);
          if (!lastTime) lastTime = time;

          const deltaTime = time - lastTime;
          let frameProgress = deltaTime / frameInterval;

          if (deltaTime >= frameInterval) {
            lastTime = time - (deltaTime % frameInterval);
            frameIndex = (frameIndex + 1) % frameCount;
            frameProgress = 0;
          }

          if (loadedCount > 0 && images[frameIndex]?.complete && images[frameIndex]?.naturalWidth > 0) {
            const img = images[frameIndex];
            const nextImg = images[(frameIndex + 1) % frameCount];

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            const drawImg = (image: HTMLImageElement, alpha: number) => {
              if (!image || !image.complete) return;
              const canvasRatio = canvas.width / canvas.height;
              const imgRatio = image.width / image.height;
              let drawWidth = canvas.width;
              let drawHeight = canvas.height;
              let offsetX = 0;
              let offsetY = 0;

              if (canvasRatio > imgRatio) {
                drawHeight = canvas.width / imgRatio;
                offsetY = (canvas.height - drawHeight) / 2;
              } else {
                drawWidth = canvas.height * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
              }

              ctx.globalAlpha = alpha;
              ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
            };

            // Draw current frame
            drawImg(img, 1);
            // Draw next frame faded in
            if (nextImg) {
              drawImg(nextImg, frameProgress * 0.5);
            }
            ctx.globalAlpha = 1;
          }
        };

        raf = requestAnimationFrame(draw);
      })
      .catch(err => console.error('Failed to load frames.json', err));

    return () => {
      isActive = false;
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const go = (path: string) => {
    if (path.startsWith('/templates')) {
      router.push(path);
      return;
    }
    if (!isAuthenticated) { router.push(`/login?redirect=${path}`); return; }
    router.push(path);
  };


  const THEMES = [
    { name: 'Timeless', sub: 'Editorial & Classic', img: PHOTOS[0] },
    { name: 'You & Me', sub: 'Romantic & Soft',     img: PHOTOS[1] },
  ];

  const productColorsList = [
    ['#ffffff'],
    ['#e5e3d7', '#434f38', '#dae7c8', '#f0eded'],
    ['#5b674e'],
    ['#dae7c8', '#1b1c1c', '#434f38', '#c5c7bd', '#f0eded'],
    ['#dae7c8', '#ba1a1a', '#9eb4cc'],
    ['#ffffff', '#f0eded', '#1b1c1c'],
  ];
  const productSizes = ['Medium Photobook', 'Mini PhotoBook', 'Large Photobook', 'Medium Photobook', 'Medium Photobook', 'Large Photobook'];


>>>>>>> Stashed changes
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: COLOR.surface, color: COLOR.onSurface }}>
      <Navbar />

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section
        className="grid grid-cols-1 lg:grid-cols-2"
        style={{
          width: '100%',
          minHeight: '100svh',
          overflow: 'hidden',
          backgroundColor: COLOR.surface,
        }}
      >
        {/* Left Side — Content */}
        <div
          className="fade-in-up flex flex-col justify-center items-start"
          style={{
            zIndex: 10,
            padding: 'clamp(80px, 12vh, 140px) clamp(32px, 5vw, 80px)',
            textAlign: 'left',
          }}
        >
          {/* Badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-hanken)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: COLOR.onSurfaceVariant,
              border: `1px solid ${COLOR.outlineVariant}`,
              backgroundColor: 'transparent',
              borderRadius: 999,
              padding: '6px 16px',
              marginBottom: 24,
            }}
          >
<<<<<<< Updated upstream
            <SunMark size={12} />
=======
>>>>>>> Stashed changes
            Heirloom Quality
          </span>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: COLOR.onSurface,
              marginBottom: 24,
            }}
          >
            Photobooks & polaroids,<br />made to keep forever.
          </h1>

          {/* Sub-paragraph */}
          <p
            style={{
              fontFamily: 'var(--font-hanken)',
              fontSize: 'clamp(16px, 1.8vw, 20px)',
              color: COLOR.onSurfaceVariant,
              lineHeight: 1.7,
              maxWidth: 520,
              marginBottom: 40,
              fontWeight: 400,
            }}
          >
            Turn your digital memories into tactile keepsakes — heirloom-quality photobooks and custom instant-style polaroid prints, designed for those who appreciate the art of the physical page.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 12,
              marginBottom: 48,
            }}
          >
            <button
              onClick={() => go('/templates')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: COLOR.primary,
                color: COLOR.onPrimary,
                fontFamily: 'var(--font-hanken)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '16px 32px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Start Creating
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </button>
            <Link
              href="/templates?category=polaroid"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'transparent',
                fontFamily: 'var(--font-hanken)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '16px 32px',
                borderRadius: 8,
                border: `1px solid ${COLOR.outlineVariant}`,
                color: COLOR.onSurface,
                cursor: 'pointer',
              }}
            >
              Customize Polaroids
            </Link>
          </div>

          {/* Trust indicators */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '12px 24px',
            }}
          >
            {['Premium Paper', 'Hand-Bound', 'Ships in 7 Days', '100% Satisfaction'].map(label => (
              <span
                key={label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'var(--font-hanken)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: COLOR.onSurfaceVariant,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 14, color: COLOR.primary, fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side — WebGL canvas container, organic arch radius */}
        <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '50svh', padding: 'clamp(16px, 3vw, 40px)' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              borderRadius: 'clamp(2rem, 6vw, 5rem) 0.5rem clamp(2rem, 6vw, 5rem) 0.5rem',
              backgroundColor: COLOR.surfaceContainerLow,
            }}
          >
            <canvas
              ref={canvasRef}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CURATED THEMES — Bento Grid
      ════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', backgroundColor: COLOR.surfaceContainerLow }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          {/* Section header */}
          <div className="fade-in-up" style={{ textAlign: 'center', marginBottom: 56 }}>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-hanken)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: COLOR.outline,
                marginBottom: 16,
              }}
            >
              Our Collections
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(26px, 4vw, 40px)',
                fontWeight: 400,
                color: COLOR.onSurface,
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              Curated Themes
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: 16,
                color: COLOR.onSurfaceVariant,
                lineHeight: 1.7,
                maxWidth: 520,
                margin: '0 auto',
                textAlign: 'center',
              }}
            >
              Minimalist layouts designed to let your photography take center stage. Select a theme and customize it effortlessly.
            </p>
          </div>

<<<<<<< Updated upstream
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 fade-in-up">
=======
          {/* 2 Hero Theme Cards in a single row on desktop so all fit in one page view */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 fade-in-up" style={{ marginBottom: 40 }}>
>>>>>>> Stashed changes
            {THEMES.map((t) => (
              <div
                key={t.name}
                className="group cursor-pointer"
<<<<<<< Updated upstream
                onClick={() => router.push(defaultTemplateId ? `/templates/${defaultTemplateId}?name=${encodeURIComponent(t.name)}&img=${encodeURIComponent(t.img)}` : '/templates')}
=======
                onClick={() => {
                  const fileName = t.img.split('/').pop() || '';
                  router.push(`/editor/guest?themeFileName=${encodeURIComponent(fileName)}`);
                }}
>>>>>>> Stashed changes
              >
                <div
                  className="relative overflow-hidden aspect-[1.2] mb-3.5 transition-all duration-300 group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.07)]"
                  style={{ backgroundColor: COLOR.surface, borderRadius: '1.5rem 0.5rem 1.5rem 0.5rem' }}
                >
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 p-1"
                  />
                </div>
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[18px] lg:text-[20px] font-normal mb-1 truncate" style={{ fontFamily: 'var(--font-playfair)', color: COLOR.onSurface }}>
                      {t.name}
                    </h3>
                    <p className="text-[16px]" style={{ fontFamily: 'var(--font-hanken)', color: COLOR.onSurfaceVariant }}>
                      {t.sub}
                    </p>
                  </div>
                  <span className="text-[15px] lg:text-[16px] font-medium whitespace-nowrap pt-0.5" style={{ fontFamily: 'var(--font-hanken)', color: COLOR.primary }}>
                    ₹1,499
                  </span>
                </div>
              </div>
            ))}
          </div>

<<<<<<< Updated upstream
          {/* Product grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 mt-8">
            {PRODUCT_IMAGES.slice(0, 4).map((img, i) => {
              const sizes = ["Medium Photobook", "Mini PhotoBook", "Large Photobook", "Medium Photobook", "Medium Photobook", "Large Photobook"];
              const size = sizes[i % sizes.length];
              const price = size === "Mini PhotoBook" ? "1,599" : size === "Medium Photobook" ? "1,799" : "1,999";
              const oldPrice = size === "Mini PhotoBook" ? "1,799" : size === "Medium Photobook" ? "2,099" : "2,299";

              const colorsList = [
                ['#ffffff'],
                ['#e5e3d7', '#434f38', '#dae7c8', '#f0eded'],
                ['#5b674e'],
                ['#dae7c8', '#1b1c1c', '#434f38', '#c5c7bd', '#f0eded'],
                ['#dae7c8', '#ba1a1a', '#9eb4cc'],
                ['#ffffff', '#f0eded', '#1b1c1c']
              ];
              const colors = colorsList[i % colorsList.length];
=======
          {/* 4 Smaller Product Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {PRODUCT_IMAGES.filter(img => !PHOTOS.includes(img)).slice(0, 4).map((img, i) => {
              const size = productSizes[i % productSizes.length];
              const price = size === 'Mini PhotoBook' ? '1,599' : size === 'Medium Photobook' ? '1,799' : '1,999';
              const oldPrice = size === 'Mini PhotoBook' ? '1,799' : size === 'Medium Photobook' ? '2,099' : '2,299';
              const colors = productColorsList[i % productColorsList.length];
>>>>>>> Stashed changes

              return (
                <div
                  key={img}
                  className="group cursor-pointer fade-in-up"
<<<<<<< Updated upstream
                  onClick={() => router.push(defaultTemplateId ? `/templates/${defaultTemplateId}?name=${encodeURIComponent(formatProductName(img))}&img=${encodeURIComponent(img)}` : '/templates')}
=======
                  onClick={() => {
                    const fileName = img.split('/').pop() || '';
                    router.push(`/editor/guest?themeFileName=${encodeURIComponent(fileName)}`);
                  }}
>>>>>>> Stashed changes
                >
                  {/* Image Container */}
                  <div
                    className="relative overflow-hidden aspect-[1.25] mb-4 flex items-center justify-center transition-shadow duration-300 group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
                    style={{ backgroundColor: COLOR.surface, borderRadius: '0.5rem' }}
                  >
                    <img
                      src={img}
                      alt={formatProductName(img)}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 p-4"
                    />
                  </div>

                  {/* Details Container */}
                  <div className="text-center w-full px-1">
                    <h3 className="font-semibold text-[15px] leading-tight mb-1 truncate" style={{ fontFamily: 'var(--font-hanken)', color: COLOR.onSurface }}>
                      {formatProductName(img)}
                    </h3>
                    <p className="text-[13px] mb-2" style={{ color: COLOR.outline }}>{size}</p>

                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="font-semibold text-[14px]" style={{ color: COLOR.onSurface }}>Rs. {price}</span>
                      <span className="text-[12px] line-through px-1 font-medium" style={{ backgroundColor: COLOR.secondaryContainer, color: COLOR.onSurface }}>Rs. {oldPrice}</span>
                    </div>

                    {/* Colors */}
                    <div className="flex items-center justify-center gap-1.5">
                      {colors.map((c, idx) => (
                        <div key={idx} className="w-4 h-4 rounded-full border" style={{ backgroundColor: c, borderColor: COLOR.outlineVariant }} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
            <button
              onClick={() => router.push('/templates')}
              className="group"
              style={{
                border: `1px solid ${COLOR.outlineVariant}`,
                borderRadius: 8,
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 24px',
                transition: 'background-color 0.2s',
                color: COLOR.primary,
                fontFamily: 'var(--font-hanken)',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              <span>View All Templates</span>
              <span className="material-symbols-outlined group-hover:translate-x-1" style={{ fontSize: 18, transition: 'transform 0.2s' }}>arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CUSTOM POLAROIDS
      ════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', backgroundColor: COLOR.surface }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text side */}
            <div className="fade-in-up" style={{ order: 1 }}>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-hanken)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: COLOR.outline,
                  marginBottom: 16,
                }}
              >
                New — Instant Style
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 'clamp(26px, 4vw, 40px)',
                  fontWeight: 400,
                  color: COLOR.onSurface,
                  marginBottom: 20,
                }}
              >
                Custom polaroids,<br />clipped and ready to hang
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-hanken)',
                  fontSize: 16,
                  color: COLOR.onSurfaceVariant,
                  lineHeight: 1.7,
                  marginBottom: 32,
                  maxWidth: 460,
                }}
              >
                Pick any photo, choose a border tint, and add a handwritten-style caption. We print each one on true polaroid stock and ship them ready to pin, clip, or frame.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32, maxWidth: 460 }}>
                {[
                  { icon: 'upload', title: 'Upload any photo' },
                  { icon: 'edit_note', title: 'Add a caption' },
                  { icon: 'palette', title: 'Choose a frame tint' },
                  { icon: 'local_shipping', title: 'Ships in 7 days' },
                ].map(item => (
                  <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: COLOR.primary }}>{item.icon}</span>
                    <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, color: COLOR.onSurface, fontWeight: 500 }}>{item.title}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    router.push('/editor/guest?type=polaroid');
                  } else {
                    fetch('/api/projects', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name: 'My Polaroids', projectType: 'polaroid' }),
                    })
                      .then(res => res.json())
                      .then(data => {
                        if (data.success) router.push(`/editor/${data.data.id}`);
                        else router.push('/editor/guest?type=polaroid');
                      })
                      .catch(() => router.push('/editor/guest?type=polaroid'));
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: COLOR.primary,
                  color: COLOR.onPrimary,
                  fontFamily: 'var(--font-hanken)',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '16px 32px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Customize Your Polaroids
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </button>
            </div>

            {/* Polaroid strip mockup */}
            <div
              className="fade-in-up"
              style={{
                order: 2,
                position: 'relative',
                padding: '48px 24px',
                backgroundColor: COLOR.surfaceContainerLow,
                borderRadius: '0.5rem 4rem 0.5rem 4rem',
              }}
            >
              {/* string */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 40,
                  left: 32,
                  right: 32,
                  borderTop: `1.5px dashed ${COLOR.outline}`,
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '32px 20px',
                  position: 'relative',
                }}
              >
                {POLAROIDS.map((p, i) => (
                  <div
                    key={p.caption}
                    style={{
                      transform: `rotate(${p.rotate}deg)`,
                      backgroundColor: '#ffffff',
                      padding: '10px 10px 20px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      position: 'relative',
                    }}
                  >
                    {/* clip */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        top: -14,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 10,
                        height: 16,
                        borderRadius: 3,
                        backgroundColor: COLOR.primary,
                      }}
                    />
                    <div
                      style={{
                        aspectRatio: '1',
                        width: '100%',
                        position: 'relative',
                        backgroundColor: '#eee'
                      }}
                    >
                      <img src={p.image} alt={p.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <p
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: 11,
                        color: COLOR.onSurface,
                        textAlign: 'center',
                        marginTop: 8,
                        fontStyle: 'italic',
                      }}
                    >
                      {p.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          THREE STEPS
      ════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', backgroundColor: COLOR.surfaceContainer }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          {/* Header */}
          <div className="fade-in-up" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-hanken)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: COLOR.outline,
                marginBottom: 16,
              }}
            >
              Simple Process
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(26px, 4vw, 40px)',
                fontWeight: 400,
                color: COLOR.onSurface,
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              Three steps to your perfect keepsake
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: 16,
                color: COLOR.onSurfaceVariant,
                lineHeight: 1.7,
                maxWidth: 480,
                margin: '0 auto',
                textAlign: 'center',
              }}
            >
              A seamless process designed for ease and elegance — for photobooks and polaroids alike.
            </p>
          </div>

          {/* Steps */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '40px 32px',
            }}
          >
            {[
              { icon: 'upload_file', step: '01', title: 'Upload', desc: 'Select your favorite moments from your phone, computer, or cloud storage. Our intelligent uploader handles the rest.' },
              { icon: 'auto_awesome', step: '02', title: 'Curate', desc: 'Let our smart auto-fill design your initial layout, or take control with our intuitive editor. Adjust, refine, perfect.' },
              { icon: 'local_shipping', step: '03', title: 'Receive', desc: 'Printed on premium Mohawk Superfine paper and true polaroid stock, then hand-checked. Your keepsake arrives beautifully packaged in days.' },
            ].map((item, i) => (
              <div
                key={item.step}
                className="fade-in-up"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: COLOR.surface,
                    border: `1px solid ${COLOR.outlineVariant}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 34, color: COLOR.primary }}>{item.icon}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: COLOR.outline, textTransform: 'uppercase', marginBottom: 8 }}>{item.step}</p>
                <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 22, fontWeight: 400, color: COLOR.onSurface, marginBottom: 12, textAlign: 'center' }}>{item.title}</h3>
                <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 14, color: COLOR.onSurfaceVariant, lineHeight: 1.7, maxWidth: 260, textAlign: 'center' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="fade-in-up" style={{ textAlign: 'center', marginTop: 56 }}>
            <button
              onClick={() => go('/templates')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: COLOR.primary,
                color: COLOR.onPrimary,
                fontFamily: 'var(--font-hanken)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '14px 32px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Start Your Book
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          THE CRAFT SECTION
      ════════════════════════════════════════ */}
      <section style={{ backgroundColor: COLOR.surface, padding: '80px 24px' }}>
        <div
          className="fade-in-up"
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 60,
            alignItems: 'center',
          }}
        >
          {/* Image stack */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1', maxWidth: 500, margin: '0 auto' }}>
            <img
<<<<<<< Updated upstream
              src="/products/2Medium Photobook.png"
=======
              src="/products/Our Story.png"
>>>>>>> Stashed changes
              alt="Medium Photobook"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4rem 0.5rem 0.5rem 0.5rem', boxShadow: '0 4px 30px rgba(0,0,0,0.06)' }}
            />
            <img
<<<<<<< Updated upstream
              className="hidden md:block"
              src="/products/3Large Photobook.png"
              alt="Large Photobook"
=======
              className="hidden md:block transition-all duration-700"
              src={POLAROIDS[polaroidIndex].image}
              alt="Polaroid Preview"
>>>>>>> Stashed changes
              style={{
                position: 'absolute',
                bottom: -40,
                right: -40,
                width: '70%',
                aspectRatio: '16/9',
                objectFit: 'cover',
                borderRadius: '0.5rem 0.5rem 3rem 0.5rem',
                border: `12px solid ${COLOR.surface}`,
                boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
              }}
            />
          </div>

          {/* Text side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 400, color: COLOR.onSurface }}>
              The craft behind every page and print
            </h2>
            <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 16, color: COLOR.onSurfaceVariant, lineHeight: 1.7 }}>
              We believe that some moments are too precious to stay trapped on a screen. Every book we bind and every polaroid we print is a tribute to your most cherished experiences, using archival-grade materials meant to withstand the test of time.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-hanken)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLOR.primary, marginBottom: 12 }}>
                  Archival Grade
                </h4>
                <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 14, color: COLOR.outline, lineHeight: 1.6 }}>
                  Acid-free papers and non-fading inks ensure colors stay vibrant for over 100 years.
                </p>
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-hanken)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLOR.primary, marginBottom: 12 }}>
                  Hand-Inspected
                </h4>
                <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 14, color: COLOR.outline, lineHeight: 1.6 }}>
                  Every single page and print is checked by our team before shipping.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          VALUE PROPS — Digital Craftsmanship
      ════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', backgroundColor: COLOR.surfaceContainerLow }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="fade-in-up" style={{ textAlign: 'center', marginBottom: 56 }}>
<<<<<<< Updated upstream
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <SunMark size={30} color={COLOR.outline} />
            </div>
=======
>>>>>>> Stashed changes
            <h2
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 400,
                color: COLOR.onSurface,
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              Digital Craftsmanship
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: 16,
                color: COLOR.onSurfaceVariant,
                lineHeight: 1.7,
                maxWidth: 520,
                margin: '0 auto',
                textAlign: 'center',
              }}
            >
              We believe your photographs are not just images, but artifacts of time. Our platform treats every page and every print with the care of a master craftsperson.
            </p>
          </div>

          <div
            className="fade-in-up"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16,
            }}
          >
            {[
              { icon: 'menu_book',      title: 'Archival Quality',       desc: 'Papers built to last a century' },
              { icon: 'photo_camera',   title: 'Instant-Style Prints',   desc: 'True polaroid stock, custom captions' },
              { icon: 'local_shipping', title: 'Fast Delivery',          desc: 'Ships within 7 business days' },
              { icon: 'verified',       title: 'Satisfaction Guarantee', desc: '100% love it or we reprint' },
            ].map(item => (
              <div
                key={item.title}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '24px 16px',
                  backgroundColor: COLOR.surface,
                  borderRadius: 8,
                  gap: 12,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 32, color: COLOR.primary }}>{item.icon}</span>
                <div>
                  <p style={{ fontFamily: 'var(--font-hanken)', fontWeight: 600, fontSize: 14, color: COLOR.onSurface, marginBottom: 4, textAlign: 'center' }}>{item.title}</p>
                  <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 12, color: COLOR.onSurfaceVariant, lineHeight: 1.6, textAlign: 'center' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════ */}
      <section
        className="fade-in-up"
        style={{
          backgroundColor: COLOR.primary,
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(26px, 4vw, 44px)',
              fontWeight: 400,
              color: COLOR.onPrimary,
              marginBottom: 16,
              textAlign: 'center',
              lineHeight: 1.15,
            }}
          >
            Ready to preserve your memories?
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-hanken)',
              fontSize: 16,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.7,
              marginBottom: 36,
              textAlign: 'center',
            }}
          >
            Join thousands of families who have trusted PhotoBook Studio with their most cherished moments — bound in a book, or clipped as a polaroid.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={() => go('/templates')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: COLOR.onPrimary,
                color: COLOR.primary,
                fontFamily: 'var(--font-hanken)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '14px 32px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Create Your First Book
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </button>
            <button
              onClick={() => go('/templates?category=polaroid')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'transparent',
                color: COLOR.onPrimary,
                fontFamily: 'var(--font-hanken)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '14px 32px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.4)',
                cursor: 'pointer',
              }}
            >
              Customize Polaroids
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
