import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/services/supabaseClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const program = searchParams.get("program");

  if (!program) return NextResponse.json({ error: "program query required" }, { status: 400 });

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("program", program);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
