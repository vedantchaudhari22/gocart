import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// Update Seller Order Function
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({
                error: "Not Authorized",
                status: 401
            })
        }

        const { orderId, status } = await request.json();
        await prisma.order.update({
            where: { id: orderId, storeId },
            data: { status }
        })

        return NextResponse.json({
            message: "Order Status Updated"
        })

    } catch (error) {
        console.error();
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}

//get all orders list
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "Not Authorized" }, { status: 401 })
        }

        const orders = await prisma.order.findMany({
            where: { storeId },
            include: { user: true, address: true, orderItems: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ orders });
    } catch (error) {
        console.error();
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}