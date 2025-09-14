import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// add new coupon
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const isAdmin = await authAdmin(userId);
        if (!isAdmin) {
            return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
        }
        const { coupon } = await request.json();
        coupon.code = coupon?.code?.toUpperCase();

        await prisma.coupon.create({ data: coupon }).then(async(coupon) => {
            //run inngest schedular function to delete coupon on expiry
            await inngest.send({
                name: "app/coupon.expired",
                data: {
                    code: coupon.code,
                    expires_at: coupon.expiresAt
                }
            })
        })

        return NextResponse.json({ message: "Coupon Addedd SuccessFully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}

//delete coupon /api/coupon?id=couponId
export async function DELETE(request) {
    try {
        const { userId } = getAuth(request);
        const isAdmin = await authAdmin(userId);
        if (!isAdmin) {
            return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
        }
        // const { searchParams } = request.nextUrl;
        // const code = searchParams.get('code');

        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");


        //delete coupon
        await prisma.coupon.delete({ where: { code } });
        return NextResponse.json({ message: "Coupon Deleted SuccessFully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}

//get the list of coupons
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isAdmin = await authAdmin(userId);
        if (!isAdmin) {
            return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
        }
        const coupons = await prisma.coupon.findMany({});
        return NextResponse.json({ coupons });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}