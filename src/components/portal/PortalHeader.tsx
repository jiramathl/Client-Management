"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/lib/icons";
import { portalSignOutAction } from "@/app/portal/sign-out-action";

const tabs: { key: string; label: string; icon: IconName }[] = [
  { key: "home", label: "Home", icon: "overview" },
  { key: "files", label: "Files", icon: "files" },
  { key: "tasks", label: "Tasks", icon: "tasks" },
  { key: "team", label: "Team", icon: "members" },
  { key: "messages", label: "Messages", icon: "messages" },
  { key: "account", label: "Account", icon: "roles" },
];

export function PortalHeader({
  workspaceName,
  memberName,
  primaryColor,
  accentColor,
}: {
  workspaceName: string;
  memberName: string;
  primaryColor: string;
  accentColor: string;
}) {
  const pathname = usePathname();
  const currentTab = pathname.split("/")[2] ?? "home";

  return (
    <div style={{ background: primaryColor }} className="px-8 pt-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-[30px] w-[30px] items-center justify-center rounded-lg text-[12px] font-bold"
            style={{ background: accentColor, color: primaryColor }}
          >
            {workspaceName.slice(0, 1).toUpperCase()}
          </span>
          <span className="font-serif text-lg font-semibold text-white">{workspaceName}</span>
        </div>
        <div className="flex items-center gap-3 text-[12.5px] text-white">
          <span>{memberName}</span>
          <form action={portalSignOutAction}>
            <button type="submit" className="flex items-center gap-1.5 rounded-lg border border-white/25 px-2.5 py-1.5 text-[11.5px] font-semibold text-white hover:bg-white/10">
              <Icon name="x" className="h-3.5 w-3.5" /> Sign out
            </button>
          </form>
        </div>
      </div>
      <div className="flex gap-1">
        {tabs.map((t) => {
          const isActive = currentTab === t.key;
          return (
            <Link
              key={t.key}
              href={`/portal/${t.key}`}
              className="flex items-center gap-1.5 border-b-[2.5px] px-4 py-2.5 text-[13px] font-semibold transition"
              style={{
                color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                borderBottomColor: isActive ? accentColor : "transparent",
              }}
            >
              <Icon name={t.icon} className="h-[15px] w-[15px]" />
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
