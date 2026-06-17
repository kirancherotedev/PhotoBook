import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { DesignData, PriceBreakdown } from '@/lib/types';

async function calculatePrice(designData: DesignData, promoCode?: string): Promise<PriceBreakdown> {
  const rules = await prisma.pricingRule.findMany({ where: { isActive: true } });

  const { bookConfig } = designData;

  // Find base price for this size
  const basePriceRule = rules.find(r => {
    if (r.category !== 'base_price' || !r.metadata) return false;
    const meta = JSON.parse(r.metadata);
    return meta.size === bookConfig.size;
  });
  const basePrice = basePriceRule?.value || 999;
  const basePriceLabel = basePriceRule?.name || bookConfig.size;

  // Calculate extra pages cost (base includes 20 pages)
  const basePages = 20;
  const extraPages = Math.max(0, bookConfig.pageCount - basePages);
  const perPageRule = rules.find(r => r.category === 'per_page');
  const perPageCost = extraPages * (perPageRule?.value || 49);

  // Cover type surcharge
  const coverRule = rules.find(r => {
    if (r.category !== 'cover_type' || !r.metadata) return false;
    const meta = JSON.parse(r.metadata);
    return meta.coverType === bookConfig.coverType;
  });
  const coverSurcharge = coverRule?.value || 0;
  const coverLabel = coverRule?.name || bookConfig.coverType;

  // Paper type surcharge
  const paperRule = rules.find(r => {
    if (r.category !== 'paper_type' || !r.metadata) return false;
    const meta = JSON.parse(r.metadata);
    return meta.paperType === bookConfig.paperType;
  });
  const paperSurcharge = paperRule?.value || 0;
  const paperLabel = paperRule?.name || bookConfig.paperType;

  const subtotal = basePrice + perPageCost + coverSurcharge + paperSurcharge;

  // Promo code discount
  let discount = 0;
  let discountLabel: string | undefined;

  if (promoCode) {
    const promo = await prisma.promoCode.findUnique({ where: { code: promoCode } });
    if (promo && promo.isActive && (!promo.maxUses || promo.usedCount < promo.maxUses)) {
      if (!promo.expiresAt || new Date(promo.expiresAt) > new Date()) {
        if (subtotal >= promo.minOrder) {
          if (promo.discountType === 'percentage') {
            discount = Math.round(subtotal * promo.discountValue / 100);
            discountLabel = `${promo.code} (${promo.discountValue}% off)`;
          } else {
            discount = promo.discountValue;
            discountLabel = `${promo.code} (₹${promo.discountValue} off)`;
          }
        }
      }
    }
  }

  const shippingCost = 99; // Standard shipping

  return {
    basePrice,
    basePriceLabel,
    perPageCost,
    extraPages,
    coverSurcharge,
    coverLabel,
    paperSurcharge,
    paperLabel,
    subtotal,
    discount,
    discountLabel,
    shippingCost,
    total: subtotal - discount + shippingCost,
  };
}

// POST /api/pricing/calculate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { designData, promoCode } = body;

    if (!designData || !designData.bookConfig) {
      return NextResponse.json({ success: false, error: 'Design data with bookConfig is required' }, { status: 400 });
    }

    const breakdown = await calculatePrice(designData as DesignData, promoCode);
    return NextResponse.json({ success: true, data: breakdown });
  } catch (error) {
    console.error('Pricing error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
