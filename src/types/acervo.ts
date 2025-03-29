
import { StudyCardProps } from "@/components/StudyCard";

// Type for Supabase acervo items
export interface SupabaseAcervoItem {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
  excerpt: string;
  link: string;
  views: number | null;
  created_at: string;
  updated_at: string;
}

// Function to convert Supabase item to StudyCardProps
export function convertToStudyCardProps(item: SupabaseAcervoItem): StudyCardProps {
  return {
    id: parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || Math.floor(Math.random() * 10000),
    title: item.title,
    type: item.type as "article" | "video" | "document",
    thumbnail: item.thumbnail,
    excerpt: item.excerpt,
    link: item.link,
    views: item.views || 0,
    createdAt: item.created_at,
  };
}

// Function to convert array of Supabase items to StudyCardProps array
export function convertArrayToStudyCardProps(items: SupabaseAcervoItem[]): StudyCardProps[] {
  return items.map(convertToStudyCardProps);
}
