import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


//add new address
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { address } = await request.json();

        address.userId = userId;

        //save the address into the user object in db
        const newAddress = await prisma.address.create({
            data: address
        })

        return NextResponse.json({
            message: "Address Added Successfully",
            newAddress,
        })

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        )
    }
}


//get all address of user
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const addresses = await prisma.address.findMany(
            { where: { userId: userId } }
        )

        return NextResponse.json({ addresses })
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        )
    }
}