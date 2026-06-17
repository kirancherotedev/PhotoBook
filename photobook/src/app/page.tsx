'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Palette, Layers, CreditCard, Truck, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { TemplateItem } from '@/lib/types';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateItem[]>([]);

  useEffect(() => {
    fetch('/api/templates?featured=true')
      .then(r => r.json())
      .then(d => { if (d.success) setTemplates(d.data.slice(0, 3)); });
  }, []);

  const handleStartDesigning = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/templates');
      return;
    }
    router.push('/templates');
  };

  return (
    <>
      <Navbar />

      {/* ── Hero Section ── */}
      <section style={{
        padding: '100px 0 80px',
        background: 'var(--blush-50)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'center',
        }}>
          <motion.div {...fadeInUp}>
            <p style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--blush-600)',
              marginBottom: 16,
            }}>
              Premium Photo Books
            </p>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '3.2rem',
              fontWeight: 600,
              color: 'var(--blush-900)',
              lineHeight: 1.15,
              marginBottom: 20,
            }}>
              Your stories,<br />
              beautifully bound.
            </h1>
            <p style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: 'var(--blush-600)',
              maxWidth: 440,
              marginBottom: 32,
            }}>
              Design custom photobooks with complete creative freedom. Drag, resize, and layer
              every element on a free-form canvas — then we print and ship your masterpiece.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleStartDesigning} className="btn btn-primary btn-lg">
                Start Designing
                <ArrowRight size={16} />
              </button>
              <Link href="/templates" className="btn btn-outline btn-lg">
                Browse Templates
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              padding: 24,
            }}
          >
            {/* Decorative book mockups */}
            <div style={{
              background: 'var(--blush-100)',
              border: '0.5px solid var(--blush-400)',
              borderRadius: 8,
              aspectRatio: '3/4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 8,
            }}>
              <BookOpen size={32} color="var(--blush-600)" />
              <span style={{ fontSize: 11, color: 'var(--blush-600)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Wedding</span>
            </div>
            <div style={{
              background: 'var(--blush-200)',
              border: '0.5px solid var(--blush-400)',
              borderRadius: 8,
              aspectRatio: '3/4',
              marginTop: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 8,
            }}>
              <Palette size={32} color="var(--blush-900)" />
              <span style={{ fontSize: 11, color: 'var(--blush-900)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Travel</span>
            </div>
            <div style={{
              background: 'var(--blush-200)',
              border: '0.5px solid var(--blush-400)',
              borderRadius: 8,
              aspectRatio: '3/4',
              marginTop: -32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 8,
            }}>
              <Star size={32} color="var(--blush-900)" />
              <span style={{ fontSize: 11, color: 'var(--blush-900)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Portfolio</span>
            </div>
            <div style={{
              background: 'var(--blush-100)',
              border: '0.5px solid var(--blush-400)',
              borderRadius: 8,
              aspectRatio: '3/4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 8,
            }}>
              <Layers size={32} color="var(--blush-600)" />
              <span style={{ fontSize: 11, color: 'var(--blush-600)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Baby</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section" style={{ background: 'var(--blush-100)' }}>
        <div className="container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <motion.p variants={fadeInUp} style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--blush-600)',
              marginBottom: 12,
            }}>
              How It Works
            </motion.p>
            <motion.h2 variants={fadeInUp} style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--blush-900)',
            }}>
              Three steps to your perfect book
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 32,
            }}
          >
            {[
              {
                icon: <Palette size={24} />,
                step: '01',
                title: 'Design',
                description: 'Start from a template or blank canvas. Drag, resize, and rotate photos and text freely — no fixed slots, no limits.',
              },
              {
                icon: <CreditCard size={24} />,
                step: '02',
                title: 'Order',
                description: 'Choose your cover, paper, and size. See the price update live as you customize, then checkout securely.',
              },
              {
                icon: <Truck size={24} />,
                step: '03',
                title: 'Receive',
                description: 'We print at 300dpi on premium paper and ship your beautifully bound book straight to your door.',
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                className="card-surface"
                style={{ padding: 32, textAlign: 'center' }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--blush-200)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: 'var(--blush-900)',
                }}>
                  {item.icon}
                </div>
                <p style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: 'var(--blush-600)',
                  marginBottom: 8,
                }}>
                  STEP {item.step}
                </p>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.3rem',
                  color: 'var(--blush-900)',
                  marginBottom: 12,
                }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--blush-600)', lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Templates ── */}
      {templates.length > 0 && (
        <section className="section" style={{ background: 'var(--blush-50)' }}>
          <div className="container">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 40,
            }}>
              <div>
                <p style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--blush-600)',
                  marginBottom: 12,
                }}>
                  Featured Templates
                </p>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--blush-900)' }}>
                  Start with a beautiful foundation
                </h2>
              </div>
              <Link href="/templates" className="btn btn-outline btn-sm">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
            }}>
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: 'var(--blush-100)',
                    border: '0.5px solid var(--blush-400)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() => router.push(`/templates`)}
                >
                  <div style={{
                    aspectRatio: '4/3',
                    background: 'var(--blush-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 8,
                  }}>
                    <BookOpen size={32} color="var(--blush-900)" />
                    <span style={{
                      fontSize: 11,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--blush-900)',
                      fontWeight: 500,
                    }}>
                      {template.category}
                    </span>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <h4 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 16,
                      fontWeight: 600,
                      color: 'var(--blush-900)',
                      marginBottom: 6,
                    }}>
                      {template.name}
                    </h4>
                    <p style={{ fontSize: 13, color: 'var(--blush-600)', lineHeight: 1.5 }}>
                      {template.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Pricing Preview ── */}
      <section className="section" style={{ background: 'var(--blush-100)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 600 }}>
          <p style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--blush-600)',
            marginBottom: 12,
          }}>
            Transparent Pricing
          </p>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--blush-900)',
            marginBottom: 16,
          }}>
            Starting from ₹999
          </h2>
          <p style={{ fontSize: 15, color: 'var(--blush-600)', lineHeight: 1.7, marginBottom: 32 }}>
            Every book includes 20 pages. Add more pages, upgrade your cover, or choose premium paper.
            The price updates live as you customize — no surprises at checkout.
          </p>
          <Link href="/pricing" className="btn btn-primary">
            See Full Pricing <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: 'var(--blush-50)',
        borderTop: '0.5px solid var(--blush-400)',
        padding: '48px 0 24px',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 40,
            marginBottom: 40,
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
              }}>
                <BookOpen size={20} color="var(--blush-900)" />
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'var(--blush-900)',
                }}>
                  PhotoBook Studio
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--blush-600)', lineHeight: 1.6, maxWidth: 280 }}>
                Premium custom photo books designed with love.
                Every page is a canvas for your stories.
              </p>
            </div>
            <div>
              <h4 style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--blush-900)',
                marginBottom: 16,
              }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href="/templates" style={{ fontSize: 13, color: 'var(--blush-600)' }}>Templates</Link>
                <Link href="/pricing" style={{ fontSize: 13, color: 'var(--blush-600)' }}>Pricing</Link>
              </div>
            </div>
            <div>
              <h4 style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--blush-900)',
                marginBottom: 16,
              }}>Account</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href="/login" style={{ fontSize: 13, color: 'var(--blush-600)' }}>Sign In</Link>
                <Link href="/register" style={{ fontSize: 13, color: 'var(--blush-600)' }}>Register</Link>
              </div>
            </div>
            <div>
              <h4 style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--blush-900)',
                marginBottom: 16,
              }}>Support</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--blush-600)' }}>help@photobook.studio</span>
              </div>
            </div>
          </div>
          <hr className="divider" />
          <p style={{
            fontSize: 12,
            color: 'var(--blush-600)',
            textAlign: 'center',
            marginTop: 24,
          }}>
            © {new Date().getFullYear()} PhotoBook Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
