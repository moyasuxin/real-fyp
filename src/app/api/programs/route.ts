import { NextResponse } from "next/server";
import { supabase } from "@/services/supabaseClient"; // adjust path if your client is in another folder

export async function GET() {
  try {
    // Fetch all programs
    const { data, error } = await supabase.from("programs").select("*");

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("Error fetching programs:", (err as Error).message);
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}
