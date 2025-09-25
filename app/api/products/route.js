import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

//MOTE - API integration is done in lib/productSlice
//get all the products
export async function GET(request) {
    try {
        let products = await prisma.product.findMany({
            where: { inStock: true },
            include: {
                rating: {
                    select: {
                        createdAt: true, rating: true, review: true, user: { select: { name: true, image: true } }
                    }
                },
                store: true
            },
            orderBy: { createdAt: 'desc' }
        })

        //Remove products with store isActive false
        //Hence the below code only returns the products those are active
        products = products.filter(product => product.store.isActive);

        return NextResponse.json({ products })
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An internal server error occured" }, { status: 500 }
        )
    }
}
