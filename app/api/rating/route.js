import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


//add new rating to a product
export async function POST(request){
    try {
        const {userId} = getAuth(request);
        const {orderId, productId, rating, review,} = await request.json();

        const order = await prisma.order.findUnique({
            where: {id: orderId, userId},
        })

        if(!order){
            return NextResponse.json({error: "Order Not Found"}, {status: 404})
        }

        const isAlreadyRated = await prisma.rating.findFirst({
            where: {productId, orderId}
        })

        if(isAlreadyRated){
            return NextResponse.json({error: "Product Already Rated"}, {status: 400})
        }

        const  newRating = await prisma.rating.create({
            data: {userId, productId, rating, review, orderId}
        })

        return NextResponse.json({message: "Rating Added Successfully", rating: newRating})
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message }, {status: 400});
    }
}

//get all ratings of a product
export async function GET(request){
    try {
        const {userId} = getAuth(request);

        if(!userId){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        const ratings = await prisma.rating.findMany({
            where: {userId}
        })

        return NextResponse.json({ratings});   
     } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message }, {status: 400});
    }
}