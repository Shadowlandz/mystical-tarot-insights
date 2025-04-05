
import { useState, useEffect } from "react";
import { StudyCardProps } from "@/components/StudyCard";

/**
 * Hook for filtering and sorting video items
 */
export function useVideoFilters(items: StudyCardProps[]) {
  const [filteredItems, setFilteredItems] = useState<StudyCardProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  
  // Filter and sort items
  useEffect(() => {
    let filtered = [...items];
    
    // Apply search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        (item.excerpt && item.excerpt.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
    } else if (sortBy === "views") {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredItems(filtered);
  }, [items, searchQuery, sortBy]);

  return {
    filteredItems,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy
  };
}
