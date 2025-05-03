import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import PostCard from '@/components/PostCard';
import TagList from '@/components/TagList';
import Newsletter from '@/components/Newsletter';
import AuthorCard from '@/components/AuthorCard';
import { Tag, User, PostWithRelations } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const { data: featuredPost, isLoading: isLoadingFeatured } = useQuery<PostWithRelations[]>({
    queryKey: ['/api/posts/featured'],
  });

  const { data: recentPosts, isLoading: isLoadingRecent } = useQuery<PostWithRelations[]>({
    queryKey: ['/api/posts/recent'],
  });

  const { data: popularPosts, isLoading: isLoadingPopular } = useQuery<PostWithRelations[]>({
    queryKey: ['/api/posts/popular'],
  });

  const { data: tags, isLoading: isLoadingTags } = useQuery<Tag[]>({
    queryKey: ['/api/tags'],
  });

  const { data: authors, isLoading: isLoadingAuthors } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-violet-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl tracking-tight">
              Welcome to DevBlog
            </h1>
            <p className="mt-4 text-xl max-w-2xl">
              Insights, tutorials, and thoughts on modern web development, programming languages, and software engineering.
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg" asChild variant="secondary">
                <Link href="/blog">
                  Read Latest Posts
                </Link>
              </Button>
              <Button size="lg" asChild>
                <a href="#newsletter">
                  Subscribe
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column (blog posts) */}
          <div className="lg:w-3/4">
            {/* Featured Post */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Featured Post</h2>
              
              {isLoadingFeatured ? (
                <Skeleton className="h-96 w-full rounded-lg" />
              ) : featuredPost && featuredPost.length > 0 ? (
                <PostCard 
                  {...featuredPost[0]} 
                  featured={true} 
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-300">No featured posts yet.</p>
                </div>
              )}
            </div>

            {/* Recent Posts */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Recent Posts</h2>
              
              {isLoadingRecent ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-lg" />
                  ))}
                </div>
              ) : recentPosts && recentPosts.length > 0 ? (
                <div className="space-y-6">
                  {recentPosts.map((post) => (
                    <PostCard key={post.id} {...post} />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-300">No posts yet.</p>
                </div>
              )}

              <div className="mt-8 text-center">
                <Button variant="outline" asChild>
                  <Link href="/blog" className="inline-flex items-center">
                    View all posts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:w-1/4">
            {/* Author card */}
            {isLoadingAuthors ? (
              <Skeleton className="h-72 w-full rounded-lg mb-6" />
            ) : authors && authors.length > 0 ? (
              <div className="mb-6">
                <AuthorCard author={authors[0]} />
              </div>
            ) : null}

            {/* Newsletter */}
            <div className="mb-6" id="newsletter">
              <Newsletter />
            </div>

            {/* Popular Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Popular Tags</h3>
              
              {isLoadingTags ? (
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-8 w-16 rounded-full" />
                  ))}
                </div>
              ) : tags && tags.length > 0 ? (
                <TagList tags={tags} linkToTag={true} />
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No tags available.</p>
              )}
            </div>

            {/* Popular Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Most Popular</h3>
              
              {isLoadingPopular ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-full mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : popularPosts && popularPosts.length > 0 ? (
                <ul className="space-y-4">
                  {popularPosts.map((post, index) => (
                    <li key={post.id}>
                      <Link href={`/blog/${post.slug}`} className="flex items-start space-x-3 group">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                            {post.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No popular posts yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
