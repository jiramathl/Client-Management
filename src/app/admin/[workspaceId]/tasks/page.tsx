import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Avatar } from "@/components/ui/Avatar";
import { getTasksByColumn, getWorkspace } from "@/lib/data/admin";

const columns = [
  { key: "TODO" as const, title: "To do" },
  { key: "DOING" as const, title: "Doing" },
  { key: "DONE" as const, title: "Done" },
];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default async function TasksPage(props: PageProps<"/admin/[workspaceId]/tasks">) {
  const { workspaceId } = await props.params;
  const [workspace, tasksByColumn] = await Promise.all([getWorkspace(workspaceId), getTasksByColumn(workspaceId)]);
  if (!workspace) return null;

  const now = new Date();

  return (
    <>
      <AdminTopbar eyebrow={workspace.name} title="Tasks" />
      <div className="flex-1 p-7">
        <div className="grid grid-cols-3 gap-4">
          {columns.map((col) => {
            const tasks = tasksByColumn[col.key];
            return (
              <div key={col.key}>
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-[12.5px] font-bold uppercase tracking-wide text-slate">{col.title}</span>
                  <span className="rounded-full bg-parchment-2 px-2 py-0.5 text-[11px] font-semibold text-slate">{tasks.length}</span>
                </div>
                <div className="space-y-2.5">
                  {tasks.map((t) => {
                    const overdue = t.dueDate ? t.dueDate < now && col.key !== "DONE" : false;
                    return (
                      <div key={t.id} className="rounded-[9px] border border-border bg-white p-3.5 shadow-soft">
                        <div className="mb-1.5 text-[13px] font-semibold leading-snug text-ink">{t.title}</div>
                        <div className="mt-2 flex items-center justify-between">
                          {t.assignee ? (
                            <span className="flex items-center gap-1.5">
                              <Avatar initials={initialsOf(t.assignee.name)} className="h-5 w-5 text-[9.5px]" />
                            </span>
                          ) : (
                            <span />
                          )}
                          <span className={`text-[11px] ${overdue ? "font-semibold text-danger" : "text-slate-light"}`}>
                            {t.dueDate?.toLocaleDateString(undefined, { month: "short", day: "numeric" }) ?? "—"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {tasks.length === 0 && <div className="rounded-lg border border-dashed border-border p-4 text-center text-[12px] text-slate-light">Nothing here.</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
