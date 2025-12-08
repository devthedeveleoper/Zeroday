import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { code, language, slug } = await request.json();

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: problem } = await supabase
    .from("problems")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!problem)
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });

  const { data: testCases } = await supabase
    .from("test_cases")
    .select("input, expected_output")
    .eq("problem_id", problem.id);

  if (!testCases || testCases.length === 0) {
    return NextResponse.json({ error: "No test cases." }, { status: 500 });
  }

  let status = "Accepted";
  let failedCase = null;

  for (const testCase of testCases) {
    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: language,
          version: "*",
          files: [{ content: code }],

          stdin: testCase.input,
        }),
      });

      const result = await response.json();

      if (result.run.stderr) {
        status = "Runtime Error";
        failedCase = { input: testCase.input, error: result.run.stderr };
        break;
      }

      const actualOutput = result.run.stdout ? result.run.stdout.trim() : "";
      const expectedOutput = testCase.expected_output.trim();

      if (actualOutput !== expectedOutput) {
        status = "Wrong Answer";
        failedCase = {
          input: testCase.input,
          expected: expectedOutput,
          actual: actualOutput,
        };
        break;
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Execution Engine Failed" },
        { status: 500 }
      );
    }
  }

  await supabase.from("submissions").insert({
    user_id: user.id,
    problem_id: problem.id,
    code: code,
    language: language,
    status: status,
  });

  return NextResponse.json({ status, failedCase });
}
