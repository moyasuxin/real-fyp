import { NextResponse } from "next/server";
import { supabase } from "@/services/supabaseClient";

export async function POST(req: Request) {
  const { id, description } = await req.json();

  const { error } = await supabase
    .from("students")
    .update({ description })
    .eq("id", id);

  if (error) {
    console.error("Supabase update error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
