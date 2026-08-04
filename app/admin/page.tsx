import Link from "next/link"
import { redirect } from "next/navigation"

import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { StatTile } from "@/features/admin/components/StatTile"

function isAdminEmail(email: string): boolean {
  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)

  return allowlist.includes(email.toLowerCase())
}

export default async function AdminPage() {
  const supabase = await getSupabaseServerClient()

  if (!supabase) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">
          Admin dashboard isn&apos;t configured yet.
        </p>
      </main>
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email || !isAdminEmail(user.email)) {
    redirect("/generate")
  }

  const adminClient = getSupabaseAdminClient()

  if (!adminClient) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">
          Admin dashboard needs SUPABASE_SERVICE_ROLE_KEY configured.
        </p>
      </main>
    )
  }

  const { data, error } = await adminClient.rpc("admin_dashboard_stats")
  const stats = data?.[0]

  const { data: subscribers, error: subscribersError } = await adminClient
    .from("email_subscribers")
    .select("email, source, created_at")
    .order("created_at", { ascending: false })
    .limit(200)

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">
          Admin Dashboard
        </h1>
        <Link
          href="/generate"
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          Back to app
        </Link>
      </div>

      {error || !stats ? (
        <p className="text-sm text-destructive">
          Couldn&apos;t load stats: {error?.message ?? "no data"}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatTile label="Total Registered Users" value={stats.total_users} />
          <StatTile label="Daily Active Users" value={stats.dau} />
          <StatTile label="Weekly Active Users" value={stats.wau} />
          <StatTile label="Monthly Active Users" value={stats.mau} />
          <StatTile label="Returning Users" value={stats.returning_users} />
          <StatTile
            label="Avg. Generations / User"
            value={Number(stats.avg_generations_per_user).toFixed(1)}
          />
          <StatTile label="Most Used Feature" value={stats.most_used_feature ?? "—"} />
          <StatTile
            label="Most Active Country"
            value={stats.most_active_country ?? "—"}
          />
          <StatTile
            label="Most Active Language"
            value={stats.most_active_language ?? "—"}
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">
          Email List{subscribers ? ` (${subscribers.length})` : ""}
        </h2>

        {subscribersError ? (
          <p className="text-sm text-destructive">
            Couldn&apos;t load subscribers: {subscribersError.message}
          </p>
        ) : !subscribers || subscribers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No emails captured yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Email</th>
                  <th className="px-4 py-2 font-medium">Source</th>
                  <th className="px-4 py-2 font-medium">Captured</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.email} className="border-b border-border last:border-0">
                    <td className="px-4 py-2">{subscriber.email}</td>
                    <td className="px-4 py-2 text-muted-foreground">{subscriber.source}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {new Date(subscriber.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
