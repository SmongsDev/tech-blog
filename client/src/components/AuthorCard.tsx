import { User } from '@shared/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Twitter, GitPullRequest, Linkedin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AuthorCardProps {
  author: User;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={author.avatarUrl} alt={author.fullName} />
            <AvatarFallback className="text-xl">{author.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {author.fullName}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {author.role}
          </p>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {author.bio || 'Developer and technology enthusiast.'}
          </p>
          
          <div className="flex space-x-3">
            {author.twitterUrl && (
              <a 
                href={author.twitterUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            
            {author.githubUrl && (
              <a 
                href={author.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-400"
                aria-label="GitPullRequest"
              >
                <GitPullRequest className="h-5 w-5" />
              </a>
            )}
            
            {author.linkedinUrl && (
              <a 
                href={author.linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-900 dark:text-gray-400 dark:hover:text-blue-400"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
