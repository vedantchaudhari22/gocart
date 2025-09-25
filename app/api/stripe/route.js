import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { buffer } from "node:buffer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        // Get raw body for Stripe signature verification
        const body = await request.text();
        const sig = request.headers.get("stripe-signature");

        const event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        const handlePaymentIntent = async (paymentIntentId, isPaid) => {
            const session = await stripe.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            if (!session.data.length) return;

            const { orderIds, userId, appId } = session.data[0].metadata;

            if (!orderIds || !userId) {
                console.warn("Missing metadata:", session.data[0]?.metadata);
                return;
            }

            const orderIdsArray = orderIds.split(",");

            if (isPaid) {
                await Promise.all(
                    orderIdsArray.map(async (orderId) => {
                        await prisma.order.update({
                            where: { id: orderId },
                            data: { isPaid: true },
                        });
                    })
                );

                // Clear user cart
                await prisma.user.update({
                    where: { id: userId },
                    data: { cart: {} },
                });
            } else {
                // Failed/canceled orders
                await Promise.all(
                    orderIdsArray.map(async (orderId) => {
                        await prisma.order.delete({ where: { id: orderId } });
                    })
                );
            }
        };


        switch (event.type) {
            case "payment_intent.succeeded":
                await handlePaymentIntent(event.data.object.id, true);
                break;

            case "payment_intent.canceled":
            case "payment_intent.payment_failed":
                await handlePaymentIntent(event.data.object.id, false);
                break;

            default:
                console.log("Unhandled event type:", event.type);
                break;
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}


export const config = {
    api: { bodyparser: false }
}