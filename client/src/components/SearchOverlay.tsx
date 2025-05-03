import { useState } from 'react';
import { X, Search as SearchIcon } from 'lucide-react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag } from '@shared/schema';

type SearchResult = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  tags: Tag[];
};

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : ['React hooks', 'TypeScript', 'Node.js optimization'];
  });

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['/api/search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    },
    enabled: searchTerm.trim().length > 0
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    // Add to recent searches
    const newRecentSearches = [
      searchTerm,
      ...recentSearches.filter(s => s !== searchTerm)
    ].slice(0, 5);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Search</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close search">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search articles, topics..."
              className="w-full pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <Button 
              type="submit" 
              variant="ghost" 
              className="absolute right-1 top-1 h-8"
              aria-label="Search"
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
          </div>
        </form>
        
        {searchTerm && searchResults.length > 0 ? (
          <div className="mt-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Search Results</h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map((result: SearchResult) => (
                <li key={result.id} className="border-b dark:border-gray-700 pb-2">
                  <Link 
                    href={`/blog/${result.slug}`}
                    className="block hover:bg-gray-50 dark:hover:bg-gray-700 -mx-2 px-2 py-1 rounded"
                    onClick={onClose}
                  >
                    <h4 className="font-medium text-blue-600 dark:text-blue-400">{result.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{result.excerpt}</p>
                    {result.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.tags.slice(0, 2).map(tag => (
                          <span 
                            key={tag.id} 
                            className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Recent searches</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {recentSearches.map((term, index) => (
                <button
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-300 transition-colors"
                  onClick={() => handleRecentSearchClick(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="mt-4 text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
          </div>
        )}
      </div>
    </div>
  );
}
