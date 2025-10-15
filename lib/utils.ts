import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

/**
 * Converts database section path to URL-friendly path
 * Examples: 
 * - 'pueblos_alemanes.santa_trinidad' → 'pueblos-alemanes/santa-trinidad'
 * - 'economia.pymes_emprendimientos.campos' → 'economia/pymes-emprendimientos/campos'
 */
export function formatSectionPath(path: string | null): string {
  if (!path) return '';
  // Convert dots to slashes and underscores to hyphens
  return path.replace(/\./g, '/').replace(/_/g, '-');
}

/**
 * Creates a consistent article URL path with full hierarchy
 */
export function getArticleUrl(sectionPath: string, articleSlug: string): string {
  if (!sectionPath) {
    return `/${articleSlug}`
  }
  
  // Convert section_path from "pueblos_alemanes.santa_trinidad" 
  // to URL format "pueblos-alemanes/santa-trinidad"
  const urlPath = sectionPath
    .split('.')           // Split by dots: ["pueblos_alemanes", "santa_trinidad"]
    .map(part => part.replace(/_/g, '-'))  // Replace underscores with hyphens
    .join('/')            // Join with slashes: "pueblos-alemanes/santa-trinidad"
  
  return `/${urlPath}/${articleSlug}`
}
