// app/dashboard/page.tsx
import { revalidatePath } from 'next/cache';
import { createSupabaseServer } from '../../lib/supabaseServer';

type Food = {
  id: string;
  name: string;
  calories_per_serving: number | null;
};

export default async function DashboardPage() {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from('foods')
    .select('id, name, calories_per_serving')
    .order('name', { ascending: true });

  // --- server action для формы Add food ---
  async function addFood(formData: FormData) {
    'use server';

    const name = (formData.get('name') ?? '').toString().trim();
    const caloriesRaw = (formData.get('calories_per_serving') ?? '')
      .toString()
      .trim();

    if (!name) {
      // без имени не сохраняем
      return;
    }

    const calories = caloriesRaw ? Number(caloriesRaw) : null;

    const supabase = createSupabaseServer();

    await supabase.from('foods').insert({
      name,
      calories_per_serving: calories,
    });

    // после вставки обновляем страницу
    revalidatePath('/dashboard');
  }

  const foods = (data ?? []) as Food[];

  return (
    <main className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <section className="bg-white shadow-xs rounded-2xl p-6 border border-emerald-100">
        <h1 className="text-2xl font-semibold mb-2">
          WellBalance • Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Track your foods and calories.
        </p>
      </section>

      {/* Форма Add food */}
      <section className="bg-white shadow-xs rounded-2xl p-6 border border-emerald-100">
        <h2 className="text-lg font-semibold mb-4">Add food</h2>
        <form action={addFood} className="flex flex-col sm:flex-row gap-3">
          <input
            name="name"
            placeholder="Food name"
            className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm"
            required
          />
          <input
            name="calories_per_serving"
            type="number"
            min="0"
            step="1"
            placeholder="Calories"
            className="w-32 rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
          >
            Save
          </button>
        </form>
      </section>

      {/* Список foods */}
      <section className="bg-white shadow-xs rounded-2xl p-6 border border-emerald-100">
        <h2 className="text-lg font-semibold mb-4">Your foods</h2>

        {error && (
          <p className="text-sm text-red-600">
            Error loading foods: {error.message}
          </p>
        )}

        {!error && foods.length === 0 && (
          <p className="text-sm text-slate-500">
            No foods yet. Add your first one above ✨
          </p>
        )}

        {foods.length > 0 && (
          <ul className="divide-y divide-slate-100">
            {foods.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span>{f.name}</span>
                <span className="text-slate-500">
                  {f.calories_per_serving ?? '—'} kcal
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
