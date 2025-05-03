import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'wouter';
import { Tag, PostWithRelations } from '@shared/schema';
import PostCard from '@/components/PostCard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tag as TagIcon } from 'lucide-react';

export default function TagsPage() {
  const { slug } = useParams();

  const { data: tags, isLoading: isLoadingTags } = useQuery<Tag[]>({
    queryKey: ['/api/tags'],
  });

  const { data: posts, isLoading: isLoadingPosts } = useQuery<PostWithRelations[]>({
    queryKey: [`/api/tags/${slug}/posts`],
    enabled: !!slug,
  });

  // If a tag slug is provided, show posts for that tag
  if (slug) {
    const tag = tags?.find(t => t.slug === slug);

    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <Link href="/tags" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-2 inline-block">
              ← Back to all tags
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <TagIcon className="mr-2 h-6 w-6" />
              {isLoadingTags ? (
                <Skeleton className="h-10 w-32" />
              ) : tag ? (
                <>Posts tagged with <span className={`ml-2 text-${tag.color}-600 dark:text-${tag.color}-400`}>{tag.name}</span></>
              ) : (
                'Tag Not Found'
              )}
            </h1>
          </div>
        </div>

        {isLoadingPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              There are no posts with this tag yet.
            </p>
            <Link 
              href="/blog"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all posts instead
            </Link>
          </Card>
        )}
      </div>
    );
  }

  // If no tag slug is provided, show all tags
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Topics & Tags</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Browse all topics and tags to find the content that interests you.
        </p>
      </div>

      {isLoadingTags ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : tags && tags.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tags.map((tag) => (
            <Link href={`/tags/${tag.slug}`} key={tag.id}>
              <Card className={`h-full p-6 hover:shadow-md transition-shadow border-l-4 border-${tag.color}-500 cursor-pointer`}>
                <div className="flex items-start h-full">
                  <div>
                    <Badge className={`bg-${tag.color}-100 text-${tag.color}-800 dark:bg-${tag.color}-900 dark:text-${tag.color}-300 mb-3`}>
                      {tag.name}
                    </Badge>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Articles about {tag.name.toLowerCase()} development, best practices, and tutorials.
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No tags found</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Check back later for new content categories.
          </p>
        </div>
      )}
    </div>
  );
}
