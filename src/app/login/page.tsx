"use client";

import { createClient } from "@/utils/supabase/client";
import { Github } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#111] border border-gray-800 rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">
          Zero<span className="text-gray-500">Day</span>
        </h1>
        <p className="text-gray-400 mb-8">Identify yourself, engineer.</p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-4 rounded-xl hover:bg-gray-200 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Github size={20} />
          {loading ? "Connecting..." : "Continue with GitHub"}
        </button>
      </div>
    </div>
  );
}
