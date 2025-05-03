import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'wouter';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Twitter, Facebook, Linkedin, Clock, Share2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import TagList from '@/components/TagList';
import CommentForm from '@/components/CommentForm';
import Newsletter from '@/components/Newsletter';
import AuthorCard from '@/components/AuthorCard';
import { PostWithRelations } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams();
  const [shareUrl, setShareUrl] = useState('');
  
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const { data: post, isLoading, error } = useQuery<PostWithRelations>({
    queryKey: [`/api/posts/${slug}`],
    enabled: !!slug,
  });

  const { data: popularPosts } = useQuery<PostWithRelations[]>({
    queryKey: ['/api/posts/popular', 4],
  });

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Alert variant="destructive" className="max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not load the blog post. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="lg:w-3/4">
          {isLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <div className="flex items-center mb-6">
                <Skeleton className="h-12 w-12 rounded-full mr-4" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ) : post ? (
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>
              
              <div className="flex items-center flex-wrap gap-2 mb-6">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={post.author.avatarUrl} alt={post.author.fullName} />
                  <AvatarFallback>{post.author.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {post.author.fullName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    Published on {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
                    {post.readingTime && (
                      <>
                        <span className="mx-1">·</span>
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readingTime}
                      </>
                    )}
                  </p>
                </div>
                <div className="ml-auto flex space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a 
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a 
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </div>

              {post.coverImage && (
                <div className="mb-6">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-auto rounded-lg" 
                  />
                </div>
              )}

              <MarkdownRenderer content={post.content} />

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tags</h3>
                <TagList tags={post.tags} className="mb-6" />
                
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6">
                  <Button variant="outline" asChild>
                    <Link href="/blog">
                      ← Back to all posts
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share this post
                  </Button>
                </div>
              </div>
            </article>
          ) : null}

          {/* Comments */}
          {post && (
            <>
              {post.comments && post.comments.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Comments ({post.comments.length})
                  </h3>
                  
                  <ul className="space-y-4">
                    {post.comments.map((comment) => (
                      <li key={comment.id} className="border-b dark:border-gray-700 pb-4 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {comment.authorName}
                          </h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(comment.createdAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          {comment.content}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <CommentForm postId={post.id} postSlug={post.slug} />
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/4">
          {/* Author card */}
          {post && (
            <div className="mb-6">
              <AuthorCard author={post.author} />
            </div>
          )}

          {/* Newsletter */}
          <div className="mb-6">
            <Newsletter />
          </div>

          {/* Popular Posts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Most Popular</h3>
            
            {popularPosts && popularPosts.length > 0 ? (
              <ul className="space-y-4">
                {popularPosts.map((popularPost, index) => (
                  <li key={popularPost.id}>
                    <Link 
                      href={`/blog/${popularPost.slug}`} 
                      className="flex items-start space-x-3 group"
                    >
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {popularPost.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(popularPost.createdAt), 'MMMM d, yyyy')}
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
  );
}
