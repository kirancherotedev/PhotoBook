'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import type { TemplateItem } from '@/lib/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const PLACEHOLDER_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDOLR65wso_o4TY89sKcTvBRS193yQKwCfh3VcfL6u-8BHdb7dwiCOopFCsSXNh9xeXiugDIYcTfwH8DjBzbtDgt9OhlxD3fwuSBWg89-qw7DEpMW8bdGYRtyk85NyOiIILDnjb2UFi0mRBEHsWlL2-IeyDzgat-UhBjFt9_2Hbx2r_Cq2ShTGOR93DNRS4KEA2rsyC_uib9zOhSX9tqlS_GjtZNExas-PYQvqVAOpBDnwZYMSankhaYjIJCjd3kpbhR1v0uwoW0Tw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAbDcPr_TLc6Dr9BVFSXMWc8YqQKj1VkzmqX6PuNXwPssSAYwf8bITtoPzdoGy46MP6gGMXXLGxhiRb2uYBlXGVLmH6F6EdYFiPnRbkzXYZU74K8__RBMmFbiJiacfKEJPgRJiosh4whaQ1zyQ7t5llIt1j-RjFuyyiHnSTT0cXbg2Q61NLCtKwIcu_BhxhSlatq8_LMWX76j8ZIRplp2v2ulcyOpKQgyf8cjlA5onGGLmPs8MZEiCF-OQxT8g9O7oo9Es5ANf1v1I',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCthSw5P0ea9Rcyg23xyfVL67MR3pBvp9rWvZ3T7n58E2UkvNgKNHTJv7MKKZMGv5yytPtUIGVXPt6NxRlLOWDGbHcCQjC6AlzjlmFvaY0y9CrRA7KNXUqStdYcs_emmoAkRH7wGuT16zPt7PuPkQ7Rs6FZEQbLRu5o_4xH5-c61yZVSeqTVh23fo09bjUdOIJfv1XsGxXu37g14t74CEERYk-mdCp9eSsZzYyZKMK_660w-a7MXWGb8r59UkBT3_5uuNpwiO3cFd4',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCf2dAXStWKwl9TL9Twv0-lZnAiMkQvFUNMHMk9417xEeG1u61SLn-MRK2ehIDnaURksH12Pp7dG6IVPqj5VcHVQ080Qd_jezAtcL52h8KJwMzd3exLZKgmIxNWr5_B77W94_QLZDP8IhaeEe3Okv2J4k7MAltBklTFhXws0NCT7gzNDGgUzgznZroYQMf5fMisSwrIK305sNXcLzofTrxiiTPNjemt3TBm8Qn8HiUrVPQ7Es1u5ZTqKzyr5pdBe_OMRhVqIFVcqYc',
];

function TemplateDetailContent({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  
  const [template, setTemplate] = useState<TemplateItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  // Configurator state
  const [selectedSize, setSelectedSize] = useState('10x10');
  const [selectedPaper, setSelectedPaper] = useState('lustre');
  const [selectedCover, setSelectedCover] = useState('natural');

  useEffect(() => {
    fetch(`/api/templates/${params.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setTemplate(d.data);
        else showToast(d.error || 'Failed to load template', 'error');
        setLoading(false);
      })
      .catch(() => { showToast('Network error loading template', 'error'); setLoading(false); });
  }, [params.id, showToast]);

  const handleStartDesigning = async () => {
    if (!isAuthenticated) { router.push(`/login?redirect=/templates/${params.id}`); return; }
    setCreating(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: params.id }),
      });
      const data = await res.json();
      if (data.success) { router.push(`/editor/${data.data.id}`); }
      else { showToast(data.error || 'Failed to create project', 'error'); setCreating(false); }
    } catch { showToast('Network error', 'error'); setCreating(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff8f0]">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4 text-[#173124]">
            <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm text-[#424844]">Loading template...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-[#fff8f0]">
        <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
          <span className="material-symbols-outlined text-5xl text-[#c2c8c2]">photo_library</span>
          <p className="text-[#173124] font-medium">Template not found</p>
          <Link href="/templates" className="text-sm text-[#424844] hover:text-[#173124] underline">← Back to templates</Link>
        </div>
      </div>
    );
  }

  // Override with query params if they exist
  const queryName = searchParams.get('name');
  const queryImg = searchParams.get('img');
  
  const displayName = queryName || template.name;
  
  // Prepare images array
  let imgs = [template.thumbnail, ...PLACEHOLDER_IMAGES].filter(Boolean) as string[];
  if (queryImg) {
    imgs = [queryImg, ...PLACEHOLDER_IMAGES];
  }

  return (
    <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-20 pt-12 pb-24">
      {/* Breadcrumb could go here if wanted */}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-20 items-start">
        {/* ── Left Column: Product Imagery ── */}
        <div className="lg:col-span-7 flex flex-col gap-2 sticky top-24">
          <div className="w-full aspect-[1.25] bg-[#f9f3eb] rounded shadow-[inset_0_0_0_1px_#c2c8c2] overflow-hidden relative">
            <img 
              alt={displayName} 
              className={`w-full h-full ${queryImg ? 'object-contain p-6 drop-shadow-lg' : 'object-cover'}`} 
              src={imgs[activeImg]} 
            />
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full flex gap-2 items-center text-[#1d1b17] font-semibold text-[12px] tracking-widest uppercase" style={{ fontFamily: 'var(--font-hanken)' }}>
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>photo_library</span>
              VIEW GALLERY
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {imgs.slice(0, 3).map((img, i) => (
              <div 
                key={i} 
                onClick={() => setActiveImg(i)}
                className={`aspect-square bg-[#f3ede5] rounded shadow-[inset_0_0_0_1px_#c2c8c2] cursor-pointer overflow-hidden transition-all ${activeImg === i ? 'opacity-100 ring-2 ring-[#173124]' : 'opacity-70 hover:opacity-100'}`}
              >
                <img className={`w-full h-full ${queryImg ? 'object-contain p-2' : 'object-cover'}`} src={img} alt="Thumbnail" />
              </div>
            ))}
            {/* Video Thumbnail Placeholder */}
            <div className="aspect-square bg-[#e7e2da] text-[#424844] rounded shadow-[inset_0_0_0_1px_#c2c8c2] cursor-pointer overflow-hidden opacity-70 hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-1">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>play_circle</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ fontFamily: 'var(--font-hanken)' }}>Video</span>
            </div>
          </div>
        </div>

        {/* ── Right Column: Product Details & Configuration ── */}
        <div className="lg:col-span-5 flex flex-col pt-8 lg:pt-0">
          
          <div className="border-b border-[#e7e2da] pb-8 mb-8">
            <div className="flex items-center gap-2 mb-4 text-[#424844] text-[12px] font-semibold uppercase tracking-widest" style={{ fontFamily: 'var(--font-hanken)' }}>
              <span>Heirloom Quality</span>
              <span className="w-1 h-1 rounded-full bg-[#c2c8c2]"></span>
              <span>Layflat Binding</span>
            </div>
            
            <h1 className="text-[#173124] mb-4" style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {displayName}
            </h1>
            
            <p className="text-[#424844] mb-6 max-w-md" style={{ fontFamily: 'var(--font-hanken)', fontSize: 18, lineHeight: 1.6 }}>
              A modern heirloom crafted to preserve your most cherished memories. Featuring museum-quality archival paper and a hand-bound linen cover, designed to be passed down through generations.
            </p>
            
            <div className="flex items-baseline gap-4">
              <span className="text-[#173124]" style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 500 }}>From ₹1,499</span>
              <span className="text-[#424844] line-through" style={{ fontFamily: 'var(--font-hanken)', fontSize: 16 }}>₹1,999</span>
            </div>
          </div>

          {/* Configurator */}
          <div className="flex flex-col gap-8">
            
            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="text-[#173124] font-semibold" style={{ fontFamily: 'var(--font-hanken)', fontSize: 18 }}>Size</label>
                <span className="text-[#424844]" style={{ fontFamily: 'var(--font-hanken)', fontSize: 16 }}>
                  {selectedSize === '8x8' ? '8 x 8" Square' : selectedSize === '10x10' ? '10 x 10" Square' : '12 x 12" Square'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <button onClick={() => setSelectedSize('8x8')} className={`rounded py-4 px-2 flex flex-col items-center justify-center gap-2 transition-all ${selectedSize === '8x8' ? 'border-2 border-[#173124] bg-[#ccead6]/20' : 'border border-[#e7e2da] hover:border-[#173124] hover:bg-[#f9f3eb]'}`}>
                  <div className="w-8 h-8 border-2 border-[#c2c8c2] rounded-sm flex items-center justify-center"></div>
                  <span className={`text-[#1d1b17] ${selectedSize === '8x8' ? 'font-semibold' : ''}`} style={{ fontFamily: 'var(--font-hanken)', fontSize: 16 }}>8 x 8"</span>
                </button>
                <button onClick={() => setSelectedSize('10x10')} className={`rounded py-4 px-2 flex flex-col items-center justify-center gap-2 transition-all relative ${selectedSize === '10x10' ? 'border-2 border-[#173124] bg-[#ccead6]/20' : 'border border-[#e7e2da] hover:border-[#173124] hover:bg-[#f9f3eb]'}`}>
                  {selectedSize === '10x10' && (
                    <div className="absolute top-2 right-2">
                      <span className="material-symbols-outlined text-[#173124] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                  <div className={`w-10 h-10 border-2 ${selectedSize === '10x10' ? 'border-[#173124]' : 'border-[#c2c8c2]'} rounded-sm flex items-center justify-center`}></div>
                  <span className={`text-[#1d1b17] ${selectedSize === '10x10' ? 'font-semibold' : ''}`} style={{ fontFamily: 'var(--font-hanken)', fontSize: 16 }}>10 x 10"</span>
                </button>
                <button onClick={() => setSelectedSize('12x12')} className={`rounded py-4 px-2 flex flex-col items-center justify-center gap-2 transition-all ${selectedSize === '12x12' ? 'border-2 border-[#173124] bg-[#ccead6]/20' : 'border border-[#e7e2da] hover:border-[#173124] hover:bg-[#f9f3eb]'}`}>
                  <div className="w-12 h-12 border-2 border-[#c2c8c2] rounded-sm flex items-center justify-center"></div>
                  <span className={`text-[#1d1b17] ${selectedSize === '12x12' ? 'font-semibold' : ''}`} style={{ fontFamily: 'var(--font-hanken)', fontSize: 16 }}>12 x 12"</span>
                </button>
              </div>
            </div>

            {/* Paper Finish */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="text-[#173124] font-semibold" style={{ fontFamily: 'var(--font-hanken)', fontSize: 18 }}>Paper Finish</label>
                <span className="text-[#424844]" style={{ fontFamily: 'var(--font-hanken)', fontSize: 16 }}>
                  {selectedPaper === 'lustre' ? 'Lustre Matte' : selectedPaper === 'glossy' ? 'Gallery Glossy' : 'Fine Art Silk'}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <label onClick={() => setSelectedPaper('lustre')} className={`flex items-center justify-between p-4 rounded cursor-pointer transition-colors ${selectedPaper === 'lustre' ? 'border-2 border-[#173124] bg-[#f9f3eb]' : 'border border-[#e7e2da] bg-[#fff8f0] hover:border-[#727973]'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="paper" checked={selectedPaper === 'lustre'} onChange={() => setSelectedPaper('lustre')} className="text-[#173124] focus:ring-[#173124] w-5 h-5 bg-[#fff8f0] border-[#727973]" />
                    <div>
                      <div className={`text-[#1d1b17] ${selectedPaper === 'lustre' ? 'font-semibold' : ''}`} style={{ fontFamily: 'var(--font-hanken)', fontSize: 16 }}>Lustre Matte</div>
                      <div className="text-[#424844] text-[14px]">Smooth, non-reflective finish. Classic.</div>
                    </div>
                  </div>
                  <span className="text-[#1d1b17] text-[14px]">Included</span>
                </label>
                
                <label onClick={() => setSelectedPaper('glossy')} className={`flex items-center justify-between p-4 rounded cursor-pointer transition-colors ${selectedPaper === 'glossy' ? 'border-2 border-[#173124] bg-[#f9f3eb]' : 'border border-[#e7e2da] bg-[#fff8f0] hover:border-[#727973]'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="paper" checked={selectedPaper === 'glossy'} onChange={() => setSelectedPaper('glossy')} className="text-[#173124] focus:ring-[#173124] w-5 h-5 bg-[#fff8f0] border-[#727973]" />
                    <div>
                      <div className={`text-[#1d1b17] ${selectedPaper === 'glossy' ? 'font-semibold' : ''}`} style={{ fontFamily: 'var(--font-hanken)', fontSize: 16 }}>Gallery Glossy</div>
                      <div className="text-[#424844] text-[14px]">High contrast, vibrant colors.</div>
                    </div>
                  </div>
                  <span className="text-[#1d1b17] text-[14px]">+₹200</span>
                </label>
                
                <label onClick={() => setSelectedPaper('silk')} className={`flex items-center justify-between p-4 rounded cursor-pointer transition-colors ${selectedPaper === 'silk' ? 'border-2 border-[#173124] bg-[#f9f3eb]' : 'border border-[#e7e2da] bg-[#fff8f0] hover:border-[#727973]'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="paper" checked={selectedPaper === 'silk'} onChange={() => setSelectedPaper('silk')} className="text-[#173124] focus:ring-[#173124] w-5 h-5 bg-[#fff8f0] border-[#727973]" />
                    <div>
                      <div className={`text-[#1d1b17] ${selectedPaper === 'silk' ? 'font-semibold' : ''}`} style={{ fontFamily: 'var(--font-hanken)', fontSize: 16 }}>Fine Art Silk</div>
                      <div className="text-[#424844] text-[14px]">Textured, subtle sheen. Premium.</div>
                    </div>
                  </div>
                  <span className="text-[#1d1b17] text-[14px]">+₹400</span>
                </label>
              </div>
            </div>

            {/* Cover Material */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="text-[#173124] font-semibold" style={{ fontFamily: 'var(--font-hanken)', fontSize: 18 }}>Cover Material</label>
                <span className="text-[#424844]" style={{ fontFamily: 'var(--font-hanken)', fontSize: 16 }}>
                  {selectedCover === 'natural' ? 'Natural Linen' : selectedCover === 'charcoal' ? 'Charcoal Linen' : selectedCover === 'rose' ? 'Dusty Rose Cloth' : 'Forest Green Leather'}
                </span>
              </div>
              <div className="flex gap-4">
                {[
                  { id: 'natural', color: '#dfd9d1', name: 'Natural Linen' },
                  { id: 'charcoal', color: '#424844', name: 'Charcoal Linen' },
                  { id: 'rose', color: '#d1a2a2', name: 'Dusty Rose Cloth' },
                  { id: 'forest', color: '#173124', name: 'Forest Green Leather' },
                ].map(cover => (
                  <button 
                    key={cover.id}
                    onClick={() => setSelectedCover(cover.id)}
                    className={`w-16 h-16 rounded-full overflow-hidden relative cursor-pointer transition-colors ${selectedCover === cover.id ? 'border-2 border-[#173124]' : 'border border-[#e7e2da] hover:border-[#727973]'}`}
                    title={cover.name}
                  >
                    <div className="w-full h-full" style={{ backgroundColor: cover.color }}></div>
                    {selectedCover === cover.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#173124] text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="pt-6 border-t border-[#e7e2da] mt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[#1d1b17]" style={{ fontFamily: 'var(--font-hanken)', fontSize: 18 }}>Estimated Delivery</span>
                <span className="text-[#173124] font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-hanken)', fontSize: 16 }}>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>local_shipping</span>
                  Oct 24 - Oct 28
                </span>
              </div>
              
              <button 
                onClick={handleStartDesigning}
                disabled={creating}
                className="w-full bg-[#173124] text-white py-4 px-8 rounded-lg text-[20px] hover:bg-[#2d4739] transition-all duration-300 shadow-sm flex justify-center items-center gap-3 group disabled:opacity-60"
                style={{ fontFamily: 'var(--font-playfair)', fontWeight: 500 }}
              >
                {creating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    Start Designing
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
                  </>
                )}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-6 text-[#424844] text-[14px]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>workspace_premium</span>
                  Satisfaction Guarantee
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>compost</span>
                  Eco-Friendly Paper
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-[#fff8f0] flex flex-col">
      <Navbar />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4 text-[#173124]">
            <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm text-[#424844]">Loading template...</span>
          </div>
        </div>
      }>
        <TemplateDetailContent params={params} />
      </Suspense>
      <Footer />
    </div>
  );
}

