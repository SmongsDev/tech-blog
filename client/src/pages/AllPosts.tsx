import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { PostWithRelations, Tag } from '@shared/schema';
import PostCard from '@/components/PostCard';
import TagList from '@/components/TagList';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function AllPosts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: posts, isLoading: isLoadingPosts } = useQuery<PostWithRelations[]>({
    queryKey: ['/api/posts'],
  });

  const { data: tags, isLoading: isLoadingTags } = useQuery<Tag[]>({
    queryKey: ['/api/tags'],
  });

  const filteredPosts = posts?.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === null || 
      post.tags.some(tag => tag.slug === selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const handleTagClick = (tagSlug: string) => {
    setSelectedTag(tagSlug === selectedTag ? null : tagSlug);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Blog Posts</h1>
        
        <div className="relative w-full max-w-xs">
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Tags filter */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Filter by tag</h2>
        
        {isLoadingTags ? (
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        ) : tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => handleTagClick(tag.slug)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTag === tag.slug
                    ? `bg-${tag.color}-500 text-white`
                    : `bg-${tag.color}-100 text-${tag.color}-800 dark:bg-${tag.color}-900 dark:text-${tag.color}-300 hover:bg-${tag.color}-200 dark:hover:bg-${tag.color}-800`
                }`}
              >
                {tag.name}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Clear filter ×
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No tags available.</p>
        )}
      </div>

      {/* Posts grid */}
      {isLoadingPosts ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-96 w-full rounded-lg" />
          ))}
        </div>
      ) : filteredPosts && filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {searchTerm || selectedTag 
              ? "Try adjusting your search or filter criteria."
              : "Check back later for new content."}
          </p>
        </div>
      )}
    </div>
  );
}
