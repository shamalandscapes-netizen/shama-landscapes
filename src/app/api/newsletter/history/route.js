import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data: history, error } = await supabase
      .from("newsletter_sends")
      .select("*")
      .order("sent_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      history: history || [] 
    });
  } catch (err) {
    console.error("Error fetching history:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}