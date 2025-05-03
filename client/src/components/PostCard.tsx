import { Link } from 'wouter';
import { User, Tag } from '@shared/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  author: User;
  tags: Tag[];
  createdAt: string;
  featured?: boolean;
}

export default function PostCard({ id, title, slug, excerpt, coverImage, author, tags, createdAt, featured = false }: PostCardProps) {
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <Card className={featured ? "overflow-hidden" : ""}>
      {featured && coverImage && (
        <div className="w-full h-64 overflow-hidden">
          <img 
            src={coverImage} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      <CardContent className={featured ? "p-6" : "p-6"}>
        <div className="flex items-center mb-2">
          {tags.slice(0, 2).map((tag) => (
            <Badge 
              key={tag.id} 
              variant="secondary" 
              className={`mr-2 bg-${tag.color}-100 text-${tag.color}-800 dark:bg-${tag.color}-900 dark:text-${tag.color}-300`}
            >
              {tag.name}
            </Badge>
          ))}
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-auto">{formattedDate}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          <Link href={`/blog/${slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
            {title}
          </Link>
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {excerpt}
        </p>
        
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={author.avatarUrl} alt={author.fullName} />
            <AvatarFallback>{author.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{author.fullName}</p>
            {author.role && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{author.role}</p>
            )}
          </div>
          
          <div className="ml-auto">
            <Link 
              href={`/blog/${slug}`} 
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Read more →
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
