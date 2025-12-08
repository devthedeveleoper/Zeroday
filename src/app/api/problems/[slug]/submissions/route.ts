import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ data: [] });
  }

  const { data: problem } = await supabase
    .from("problems")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!problem)
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });

  const { data: submissions } = await supabase
    .from("submissions")
    .select("id, status, language, created_at, code")

    .eq("user_id", user.id)
    .eq("problem_id", problem.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ data: submissions });
}
