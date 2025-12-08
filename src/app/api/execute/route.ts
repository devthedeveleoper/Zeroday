import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { code, language } = await request.json();

  const response = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: language, // "python"
      version: "*",
      files: [{ content: code }],
    }),
  });

  const data = await response.json();

  return NextResponse.json({
    output: data.run.stdout,
    error: data.run.stderr,
  });
}
