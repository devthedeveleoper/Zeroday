import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { code, language, stdin } = await request.json();

  const response = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: language,
      version: "*",
      files: [{ content: code }],
      stdin: stdin || "",
    }),
  });

  const data = await response.json();

  return NextResponse.json({
    output: data.run.stdout,
    error: data.run.stderr,
  });
}
