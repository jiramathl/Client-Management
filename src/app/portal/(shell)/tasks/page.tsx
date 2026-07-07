import { getCurrentClientMember } from "@/lib/data/portal";
import { getTasksByColumn } from "@/lib/data/admin";
import { Icon } from "@/lib/icons";

const sections = [
  { key: "DONE" as const, title: "Done" },
  { key: "DOING" as const, title: "In progress" },
  { key: "TODO" as const, title: "To do" },
];

export default async function PortalTasksPage() {
  const member = await getCurrentClientMember();
  if (!member) return null;
  const tasksByColumn = await getTasksByColumn(member.workspaceId);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="border-b border-border px-[18px] py-3.5 font-serif text-[16px] font-semibold text-ink">Progress checklist</div>
      {sections.map((s) => {
        const tasks = tasksByColumn[s.key];
        if (tasks.length === 0) return null;
        return (
          <div key={s.key}>
            <div className="bg-parchment px-[18px] py-2 text-[11px] font-bold uppercase tracking-wide text-slate-light">{s.title}</div>
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-2.5 border-b border-parchment-2 px-[18px] py-3 text-[13px] last:border-b-0">
                <span
                  className={`flex h-[17px] w-[17px] flex-shrink-0 items-center justify-center rounded-[5px] border-[1.5px] ${
                    s.key === "DONE" ? "border-success bg-success text-white" : "border-border"
                  }`}
                >
                  {s.key === "DONE" && <Icon name="check" className="h-3 w-3" />}
                </span>
                <span className={s.key === "DONE" ? "text-slate-light line-through" : "text-ink"}>{t.title}</span>
                {t.dueDate && <span className="ml-auto text-[11px] text-slate-light">{t.dueDate.toLocaleDateString()}</span>}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
