"use client";

import { LEVEL_EMOJI, LEVEL_COLORS, type Level, type Profile } from "@/lib/types";
import Link from "next/link";

interface UserAvatarProps {
  user: Profile;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  showLevel?: boolean;
  showReputation?: boolean;
  linkToProfile?: boolean;
}

const SIZE_CLASSES = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-lg",
  lg: "w-14 h-14 text-2xl",
};

export default function UserAvatar({
  user,
  size = "md",
  showName = false,
  showLevel = false,
  showReputation = false,
  linkToProfile = false,
}: UserAvatarProps) {
  const content = (
    <div className={`flex items-center gap-2 ${showName || showLevel ? "flex-row" : ""}`}>
      {/* Avatar */}
      <div className={`${SIZE_CLASSES[size]} rounded-full bg-lobster-deep overflow-hidden flex items-center justify-center border-2 relative`}
        style={{ borderColor: LEVEL_COLORS[user.level as Level] || '#1E3A5F' }}
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>🦞</span>
        )}
        {/* Level emoji badge */}
        <span className="absolute -bottom-1 -right-1 text-xs">
          {LEVEL_EMOJI[user.level as Level] || '🐚'}
        </span>
      </div>

      {/* Name + meta */}
      {(showName || showLevel || showReputation) && (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-lobster-text">{user.username}</span>
          {showLevel && (
            <span className="text-xs" style={{ color: LEVEL_COLORS[user.level as Level] }}>
              {user.level}
            </span>
          )}
          {showReputation && (
            <div className="flex items-center gap-1 mt-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`text-xs ${i < Math.round(user.reputation / 20) ? "text-yellow-400" : "text-lobster-deep/40"}`}
                >
                  ★
                </span>
              ))}
              <span className="text-xs text-lobster-text/40 ml-1">{user.reputation}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (linkToProfile && user.id) {
    return (
      <Link href={`/profile/${user.id}`} className="hover:opacity-80 transition-opacity inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
