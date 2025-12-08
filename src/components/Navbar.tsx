import Link from "next/link";
import Image from "next/image";

import { Terminal, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-white text-black rounded-lg group-hover:scale-105 transition-transform">
            <Terminal size={20} strokeWidth={3} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Zero<span className="text-gray-400">Day</span>
          </span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">
            Problems
          </Link>
          <Link
            href="/leaderboard"
            className="hover:text-white transition-colors"
          >
            Leaderboard
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {}
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-700 ring-2 ring-transparent group-hover:ring-purple-500 transition-all">
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                {}
                <span className="text-white text-xs hidden md:block">
                  {user.user_metadata.user_name}
                </span>
              </div>

              <form action={signOut}>
                <button
                  className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-red-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="text-white hover:text-gray-300">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
