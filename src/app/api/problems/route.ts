import { createClient } from "@/utils/supabase/server";

import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: problems, error } = await supabase
    .from("problems")
    .select("id, title, slug, difficulty");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  let solvedProblemIds = new Set();

  if (user) {
    const { data: submissions } = await supabase
      .from("submissions")
      .select("problem_id")
      .eq("user_id", user.id)
      .eq("status", "Accepted");

    if (submissions) {
      submissions.forEach((sub) => solvedProblemIds.add(sub.problem_id));
    }
  }

  const problemsWithStatus = problems.map((p) => ({
    ...p,
    status: solvedProblemIds.has(p.id) ? "Solved" : "Todo",
  }));

  return NextResponse.json({ data: problemsWithStatus });
}
