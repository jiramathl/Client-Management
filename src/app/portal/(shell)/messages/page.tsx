import { getCurrentClientMember, getDMThread } from "@/lib/data/portal";
import { sendPortalMessage } from "@/lib/actions/portal";
import { Avatar } from "@/components/ui/Avatar";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default async function PortalMessagesPage() {
  const member = await getCurrentClientMember();
  if (!member) return null;
  const thread = await getDMThread(member.workspaceId, member.email);

  return (
    <div className="flex h-[560px] flex-col overflow-hidden rounded-xl border border-border bg-white">
      <div className="border-b border-border px-[18px] py-3.5 font-serif text-[15px] font-semibold text-ink">Your conversation</div>
      <div className="flex-1 space-y-4 overflow-y-auto p-[18px]">
        {thread.messages.length === 0 ? (
          <div className="pt-10 text-center text-[13px] text-slate-light">No messages yet — say hello.</div>
        ) : (
          thread.messages.map((m) => {
            const isMe = m.authorId === member.id;
            return (
              <div key={m.id} className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}>
                <Avatar initials={m.author ? initialsOf(m.author.name) : "?"} className="h-7 w-7 text-[10px]" />
                <div className={isMe ? "text-right" : ""}>
                  <div className="mb-1 text-[12px] font-semibold text-ink">
                    {isMe ? <>{m.createdAt.toLocaleTimeString()} <span className="ml-1 font-normal text-slate-light">You</span></> : <>{m.author?.name ?? "Unknown"} <span className="ml-1 font-normal text-slate-light">{m.createdAt.toLocaleTimeString()}</span></>}
                  </div>
                  <div
                    className={`inline-block max-w-[360px] rounded-xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                      isMe ? "rounded-tr-none bg-navy text-white" : "rounded-tl-none bg-parchment text-ink"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <form action={sendPortalMessage} className="flex gap-2.5 border-t border-border p-[14px_18px]">
        <input type="hidden" name="threadId" value={thread.id} />
        <input
          name="text"
          required
          placeholder="Type a message…"
          className="flex-1 rounded-lg border border-border px-3.5 py-2.5 text-[13px] outline-none focus:border-brass"
        />
        <button type="submit" className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-white">
          Send
        </button>
      </form>
    </div>
  );
}
