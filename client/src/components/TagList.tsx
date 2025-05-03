import { Link } from 'wouter';
import { Tag } from '@shared/schema';
import { Badge } from '@/components/ui/badge';

interface TagListProps {
  tags: Tag[];
  className?: string;
  linkToTag?: boolean;
}

export default function TagList({ tags, className = "", linkToTag = true }: TagListProps) {
  if (!tags.length) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => {
        if (linkToTag) {
          return (
            <Badge
              key={tag.id}
              variant="secondary"
              className={`px-3 py-1 bg-${tag.color}-100 text-${tag.color}-800 dark:bg-${tag.color}-900 dark:text-${tag.color}-300 hover:bg-${tag.color}-200`}
              asChild
            >
              <Link href={`/tags/${tag.slug}`}>
                {tag.name}
              </Link>
            </Badge>
          );
        } else {
          return (
            <Badge
              key={tag.id}
              variant="secondary"
              className={`px-3 py-1 bg-${tag.color}-100 text-${tag.color}-800 dark:bg-${tag.color}-900 dark:text-${tag.color}-300`}
            >
              {tag.name}
            </Badge>
          );
        }
      })}
    </div>
  );
}
