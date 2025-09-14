import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


// Toggle store activities
export async function POST(request){
    try {
        const {userId} = getAuth(request);
        const isAdmin = authAdmin(userId);

        if(!isAdmin){
            return NextResponse.json({error: "Not Authorized"}, {status: 401})
        }

        const {storeId} = await request.json();

        if(!storeId){
            return NextResponse.json({error: "Missing Store ID"},{status: 400});
        }

        //find the stores
        const store = await prisma.store.findUnique({
            where: {id: storeId}
        });

        if(!store){
            return NextResponse.json({error: "Store Not Found"}, {status: 400});
        }

        await prisma.store.update({
            where: {id: storeId},
            data: {isActive: !store.isActive}
        })

        return NextResponse.json({message: "Store Updated Successfully"})  
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message}, {status: 400});
    }
}
