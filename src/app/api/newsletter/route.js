import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data: subscribers, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      subscribers: subscribers || [] 
    });
  } catch (err) {
    console.error("Error fetching subscribers:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// Keep existing POST handler if it exists, or add this if missing
export async function POST(req) {
  try {
    const body = await req.json();
    // Handle subscription logic here if needed
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}