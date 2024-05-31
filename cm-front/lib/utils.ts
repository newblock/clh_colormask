import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
// 混合类名
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
