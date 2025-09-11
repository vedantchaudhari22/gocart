import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



//Toggle stock of a product
export async function POST(request){
    try {
        const {userId} = getAuth(request);
        const {productId} = await request.json();

        if(!productId){
            return NextResponse.json({error: "Missing Detail: ProductId"}, {stsuts: 400});
        }

        const storeId = await authSeller(userId);

        if(!storeId){
            return NextResponse.json({error: "Not Authorized"}, {status: 401})
        }

        //check if product exists
        const product = await prisma.product.findFirst({
            where: {id: productId, storeId}
        })

        if(!product){
            return NextResponse.json({error: "No Product Found"}, {status: 404})
        }

        await prisma.product.update({
            where: {id: productId},
            data: {inStock: !product.inStock}
        })

        return NextResponse.json({message: "Product Stock Updated SuccessFully"})
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message}, {status:400});
    }
}

