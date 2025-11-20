"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "../lib/supabaseBrowser";

type User = {
  id: string;
  email?: string | null;
};

export function NavAuthButtons() {
  const router = useRouter();

  // undefined = ещё загружаем, null = не залогинен, объект = залогинен
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const { data } = await supabaseBrowser.auth.getUser();
      if (!isMounted) return;
      setUser(data.user ?? null);
    }

    loadUser();

    const {
      data: subscription,
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.push("/");
    router.refresh();
  }

  // Пока загружаемся — можно показать кнопку Sign in как дефолт
  if (user === undefined) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 rounded-full bg-linear-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white shadow-lg shadow-green-300/40 hover:shadow-xl hover:shadow-green-400/50 transition-all duration-200"
      >
        Sign in
      </Link>
    );
  }

  // Не залогинен
  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 rounded-full bg-linear-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white shadow-lg shadow-green-300/40 hover:shadow-xl hover:shadow-green-400/50 transition-all duration-200"
      >
        Sign in
      </Link>
    );
  }

  // Залогинен → показываем Logout
  return (
    <button
      type="button"
      onClick={handleLogout}
      className="px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-all duration-200"
    >
      Logout
    </button>
  );
}
