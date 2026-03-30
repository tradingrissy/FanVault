import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any
      const { fan_id, creator_id, tier_id } = session.metadata
      await supabaseAdmin.from('user_subscriptions').insert({ fan_id, creator_id, tier_id, stripe_subscription_id: session.subscription, stripe_customer_id: session.customer, status: 'active', current_period_end: new Date(Date.now() + 30*24*60*60*1000).toISOString() })
      await supabaseAdmin.from('notifications').insert({ user_id: creator_id, type: 'new_subscriber', title: 'New subscriber!', body: 'Someone just subscribed to your page.' })
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as any
      await supabaseAdmin.from('user_subscriptions').update({ status: 'cancelled' }).eq('stripe_subscription_id', sub.id)
      break
    }
    case 'invoice.paid': {
      const invoice = event.data.object as any
      await supabaseAdmin.from('user_subscriptions').update({ status: 'active', current_period_end: new Date(invoice.lines.data[0].period.end * 1000).toISOString() }).eq('stripe_subscription_id', invoice.subscription)
      break
    }
  }
  return NextResponse.json({ received: true })
}
