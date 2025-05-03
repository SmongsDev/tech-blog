import { useState, useEffect, useRef } from 'react';
import { markdownToHtml } from '@/lib/markdown';
import { Skeleton } from '@/components/ui/skeleton';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function processMarkdown() {
      if (!content) return;
      
      setLoading(true);
      try {
        const result = await markdownToHtml(content);
        if (isMounted) {
          setHtml(result);
        }
      } catch (error) {
        console.error("Error processing markdown:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    processMarkdown();
    
    return () => {
      isMounted = false;
    };
  }, [content]);

  // Highlight code blocks after html content is set
  useEffect(() => {
    if (!loading && containerRef.current && window.Prism) {
      // Highlight all code elements in the container
      window.Prism.highlightAllUnder(containerRef.current);
    }
  }, [html, loading]);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-6 w-11/12" />
        <Skeleton className="h-6 w-4/5" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`prose dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
