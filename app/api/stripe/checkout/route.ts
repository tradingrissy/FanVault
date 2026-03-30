import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const { tier_id, creator_id, fan_id } = await req.json()
  const { data: tier } = await supabaseAdmin.from('subscription_tiers').select('*').eq('id', tier_id).single()
  if (!tier) return NextResponse.json({ error: 'Tier not found' }, { status: 404 })
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{ price_data: { currency: 'usd', product_data: { name: tier.name }, unit_amount: tier.price, recurring: { interval: 'month' } }, quantity: 1 }],
    metadata: { fan_id, creator_id, tier_id },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/browse`,
  })
  return NextResponse.json({ url: session.url })
}
