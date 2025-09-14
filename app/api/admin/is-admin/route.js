import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Not Authorized" },
        { status: 403 }
      );
    }

    return NextResponse.json({ isAdmin: true });
  } catch (error) {
    console.error("is-admin error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
