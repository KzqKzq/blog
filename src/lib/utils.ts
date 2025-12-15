import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTagColor(tag: string) {
    const colors = [
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
        "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
        "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
        "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
        "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
        "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
        "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
        "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    ];
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}
