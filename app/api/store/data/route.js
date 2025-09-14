import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


//get store info and store products

export async function GET(request){
    try {
        const {searchParams} = new URL(request.url);
        const username = searchParams.get('username').toLocaleLowerCase();

        if(!username){
            return NextResponse.json({error: "Missing Username"}, {status: 400});
        }

        //get store info and instock products with ratings
        const store = await prisma.store.findUnique({
            where: {username, isActive:true},
            include: {Product: {include: {rating: true}}}
        })

        if(!store){
            return NextResponse.json({error: "Store not found"}, {status: 400})
        }

        return NextResponse.json({store})
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message}, {status: 400})
    }
}