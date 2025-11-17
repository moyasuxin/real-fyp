import { NextResponse } from "next/server";
import { supabase } from "@/services/supabaseClient"; // adjust path if your client is in another folder

export async function GET() {
  try {
    console.log("🟢 Fetching programs from Supabase...");
    
    // Fetch all programs
    const { data, error } = await supabase.from("programs").select("*");

    if (error) {
      console.error("❌ Supabase error:", error);
      throw error;
    }

    console.log("✅ Programs fetched:", data?.length || 0);
    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("❌ Error fetching programs:", err);
    return NextResponse.json(
      { error: "Failed to fetch programs", details: (err as Error).message },
      { status: 500 }
    );
  }
}
