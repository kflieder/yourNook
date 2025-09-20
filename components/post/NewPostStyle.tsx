import React from "react";

type PostCardProps = {
    avatarUrl: string;
    username: string;
    createdAt: string | Date;
    imageUrl: string;
    likes?: number;
    comments?: number;
    shares?: number;
    isFollowing?: boolean;
    onFollow?: () => void;
    onLike?: () => void;
    onComment?: () => void;
    onShare?: () => void;
    onMore?: () => void;
};

const cn = (...classes: Array<string | false | undefined>) =>
    classes.filter(Boolean).join(" ");

const formatTime = (value: string | Date) => {
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return String(value);
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
};

const NewPostStyle: React.FC<PostCardProps> = ({
    avatarUrl,
    username,
    createdAt,
    imageUrl,
    likes,
    comments,
    shares,
    isFollowing = false,
    onFollow,
    onLike,
    onComment, 
    onShare,
    onMore,
}) => {
    return (
        <article className="w-full max-w-xl mx-auto overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            {/* Header */}
            <header className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-full"
                        aria-label={`${username} profile`}
                    >
                        <img
                            src={avatarUrl}
                            alt={`${username} avatar`}
                            className="h-11 w-11 rounded-full object-cover"
                        />
                    </button>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="truncate font-semibold text-neutral-900 dark:text-neutral-50">
                                {username}
                            </span>
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {formatTime(createdAt)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onFollow}
                        className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
                            isFollowing
                                ? "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                                : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                        )}
                        aria-pressed={isFollowing}
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </button>

                    <button
                        onClick={onMore}
                        className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                        aria-label="More options"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-neutral-500 dark:text-neutral-400"
                        >
                            <circle cx="5" cy="12" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="19" cy="12" r="2" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Body */}
            <div className="relative bg-neutral-100 dark:bg-neutral-800">
                <img
                    src={imageUrl}
                    alt="Post content"
                    className="w-full h-auto object-cover aspect-[4/5] sm:aspect-video"
                />
            </div>

            {/* Footer */}
            <footer className="px-2 sm:px-3 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onLike}
                            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                            aria-label="Like"
                        >
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="stroke-current"
                            >
                                <path
                                    d="M12.1 8.64l-.1.1-.1-.1C10.14 6.82 7.1 7.24 5.5 9.09c-1.64 1.9-1.54 4.78.3 6.56l5.53 5.33a.996.996 0 001.34 0l5.53-5.33c1.84-1.78 1.94-4.66.3-6.56-1.6-1.85-4.64-2.27-6.5-.45z"
                                    strokeWidth="1.6"
                                />
                            </svg>
                            <span className="text-sm tabular-nums">{likes}</span>
                        </button>

                        <button
                            onClick={onComment}
                            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                            aria-label="Comment"
                        >
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="stroke-current"
                            >
                                <path
                                    d="M21 12a8.96 8.96 0 01-9 9c-1.39 0-2.7-.32-3.86-.9L3 21l.9-5.14A9 9 0 1121 12z"
                                    strokeWidth="1.6"
                                />
                            </svg>
                            <span className="text-sm tabular-nums">{comments}</span>
                        </button>

                        <button
                            onClick={onShare}
                            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                            aria-label="Share"
                        >
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="stroke-current"
                            >
                                <path
                                    d="M7 12a5 5 0 005-5V3l6 6-6 6v-4a5 5 0 10-5 1z"
                                    strokeWidth="1.6"
                                />
                            </svg>
                            <span className="text-sm tabular-nums">{shares}</span>
                        </button>
                    </div>

                    {/* Save / Bookmark placeholder */}
                    <button
                        className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                        aria-label="Save post"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M6 2a2 2 0 00-2 2v17.382a1 1 0 001.553.833L12 18.236l6.447 3.979A1 1 0 0020 21.382V4a2 2 0 00-2-2H6z" />
                        </svg>
                    </button>
                </div>
            </footer>
        </article>
    );
};

export default NewPostStyle;