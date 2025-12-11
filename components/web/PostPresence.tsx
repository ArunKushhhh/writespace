"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import usePresence from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";

interface iAppProps {
  roomId: Id<"blogs">;
  userId: string;
}

export function PostPresence({ roomId, userId }: iAppProps) {
  const presence = usePresence(api.presence, roomId, userId);

  if (!presence || presence.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
        Viewing now
      </h2>
      <div className="text-black">
        <FacePile
          presenceState={presence.map((p) => ({
            ...p,
            name: p.name,
          }))}
        />
      </div>
    </div>
  );
}
