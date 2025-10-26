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
      query.ilike("program", program);
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
