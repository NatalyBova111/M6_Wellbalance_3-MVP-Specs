// app/api/add-meal-item/route.ts
// app/api/add-meal-item/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";

type AddMealBody = {
  foodId: string;
  grams: number;
  caloriesTotal: number;
  proteinTotal: number;
  carbsTotal: number;
  fatTotal: number;
};

export async function POST(req: Request) {
  const supabase = await createSupabaseServer();

  // 🔐 Получаем текущего пользователя из сессии
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = user.id;

  const body = (await req.json()) as AddMealBody;
  const {
    foodId,
    grams,
    caloriesTotal,
    proteinTotal,
    carbsTotal,
    fatTotal,
  } = body;

  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

  // 1) Читаем существующую запись за сегодня (если есть)
  const { data: existing, error: selectError } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("log_date", today)
    .maybeSingle();

  if (selectError && selectError.code !== "PGRST116") {
    console.error("Failed to fetch daily_log:", selectError);
    return NextResponse.json(
      { error: "Failed to fetch daily log", details: selectError },
      { status: 500 }
    );
  }

  // 2) Сколько добавляем (int4 → округляем)
  const addCalories = Math.round(caloriesTotal);
  const addProtein = Math.round(proteinTotal);
  const addCarbs = Math.round(carbsTotal);
  const addFat = Math.round(fatTotal);

  // 3) Новые суммарные значения за день
  const newTotals = {
    total_calories: (existing?.total_calories ?? 0) + addCalories,
    protein_g: (existing?.protein_g ?? 0) + addProtein,
    carbs_g: (existing?.carbs_g ?? 0) + addCarbs,
    fat_g: (existing?.fat_g ?? 0) + addFat,
  };

  // 4) upsert по паре (user_id, log_date)
  const { data: logs, error: logError } = await supabase
    .from("daily_logs")
    .upsert(
      {
        user_id: userId,
        log_date: today,
        ...newTotals,
      },
      {
        onConflict: "user_id,log_date",
        ignoreDuplicates: false,
      }
    )
    .select("*");

  if (logError || !logs || !logs[0]) {
    console.error("Failed to update daily_logs:", logError);
    return NextResponse.json(
      { error: "Failed to update daily_logs", details: logError },
      { status: 500 }
    );
  }

  const dailyLog = logs[0];

  console.log("Meal item added:", {
    userId,
    foodId,
    grams,
    added: { addCalories, addProtein, addCarbs, addFat },
    dailyLogId: dailyLog.id,
  });

  return NextResponse.json({ ok: true, dailyLog });
}
