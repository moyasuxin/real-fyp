import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with SERVICE ROLE key (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // This key bypasses RLS
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, role } = await request.json();

    // Validate input
    if (!email || !password || !username || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["admin", "lecturer"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'admin' or 'lecturer'" },
        { status: 400 }
      );
    }

    // 1. Create auth user using admin client
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
      });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: authError.message || "Failed to create auth user" },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "No user data returned from auth" },
        { status: 500 }
      );
    }

    // 2. Insert into admin_users table (bypasses RLS with service role key)
    const { error: dbError } = await supabaseAdmin.from("admin_users").upsert(
      {
        id: authData.user.id,
        email,
        username,
        role,
      },
      {
        onConflict: "id",
      }
    );

    if (dbError) {
      console.error("Database error:", dbError);
      // Try to clean up the auth user if database insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: dbError.message || "Failed to create admin record" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${role} account created successfully`,
      userId: authData.user.id,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
