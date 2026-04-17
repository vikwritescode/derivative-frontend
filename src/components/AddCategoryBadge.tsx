import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface AddCategoryBadgeProps {
  category: string;
  onAdd?: () => void;
}

const normalizeCategory = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, " ");

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const AddCategoryBadge = (props: AddCategoryBadgeProps) => {
  const categoryClasses: Record<string, string> = {
    politics: "category-badge-politics",
    economics: "category-badge-economics",
    social: "category-badge-social",
    philosophy: "category-badge-philosophy",
    "international relations": "category-badge-international-relations",
    law: "category-badge-law",
    "science/tech": "category-badge-science-tech",
    environment: "category-badge-environment",
    ethics: "category-badge-ethics",
    religion: "category-badge-religion",
    feminism: "category-badge-feminism",
    gender: "category-badge-gender",
    education: "category-badge-education",
    culture: "category-badge-culture",
    media: "category-badge-media",
    health: "category-badge-health",
    technology: "category-badge-technology",
    science: "category-badge-science",
    ai: "category-badge-ai",
    security: "category-badge-security",
    war: "category-badge-war",
    migration: "category-badge-migration",
    labor: "category-badge-labor",
    justice: "category-badge-justice",
    crime: "category-badge-crime",
    sports: "category-badge-sports",
    history: "category-badge-history",
  };

  const fallbackPalette = [
    "category-badge-politics",
    "category-badge-philosophy",
    "category-badge-environment",
    "category-badge-social",
    "category-badge-science",
    "category-badge-economics",
    "category-badge-science-tech",
    "category-badge-media",
    "category-badge-ethics",
    "category-badge-law",
  ];

  const getCategoryClass = (rawCategory: string) => {
    const category = normalizeCategory(rawCategory);
    if (categoryClasses[category]) return categoryClasses[category];
    return fallbackPalette[hashString(category) % fallbackPalette.length];
  };

  return (
    <Badge
      className={`text-xs px-2 py-1 rounded-md relative cursor-pointer group overflow-hidden hover:!border-green-600 ${getCategoryClass(
        props.category
      )}`}
      onClick={props.onAdd}
    >
      <span className="transition-opacity group-hover:opacity-0">
        {props.category}
      </span>
      <div className="absolute -inset-px flex items-center justify-center opacity-0 group-hover:opacity-100 bg-green-600 text-white transition-opacity">
        <Plus className="w-3.5 h-3.5" />
      </div>
    </Badge>
  );
};

export default AddCategoryBadge;