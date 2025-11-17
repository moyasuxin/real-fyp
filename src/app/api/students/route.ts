// src/app/api/students/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/services/supabaseClient";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const program = searchParams.get("program");

    console.log("🟢 API Called: /api/students");
    console.log("Program param:", program);

    const query = supabase.from("students").select("*");

    if (program) {
      // First, try to fetch the full program name from the programs table
      const { data: programData } = await supabase
        .from("programs")
        .select("program_long")
        .eq("program_short", program)
        .single();

      if (programData) {
        // Use the full program name for filtering
        query.ilike("program", `%${programData.program_long}%`);
      } else {
        // Fallback: search for the short code in the program field
        query.ilike("program", `%${program}%`);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("❌ Supabase query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ Supabase returned:", data?.length, "rows");

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("❌ API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
