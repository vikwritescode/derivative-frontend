import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
  category: string;
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

const CategoryBadge = (props: CategoryBadgeProps) => {
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
      className={`text-xs px-2 py-1 rounded-md ${getCategoryClass(
        props.category
      )}`}
    >
      {props.category}
    </Badge>
  );
};

export default CategoryBadge;