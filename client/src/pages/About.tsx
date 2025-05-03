import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, GitPullRequest, Twitter, Linkedin, Code, Database, Server, Terminal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function About() {
  const { data: authors, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">About DevBlog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          A tech blog focused on modern web development, programming best practices, and software engineering insights.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            At DevBlog, we believe in sharing knowledge that helps developers build better software. Our articles focus on practical, real-world solutions to common development challenges.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We cover a wide range of topics including frontend frameworks, backend systems, DevOps practices, performance optimization techniques, and emerging technologies.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Our goal is to provide in-depth, well-researched content that helps developers at all levels improve their skills and stay up-to-date with the rapidly evolving tech landscape.
          </p>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Technologies We Cover</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Frontend</h3>
            <p className="text-gray-600 dark:text-gray-300">
              React, Vue, Angular, TypeScript, CSS frameworks, performance optimization
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Server className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Backend</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Node.js, Python, Go, REST APIs, GraphQL, microservices architecture
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
              <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Databases</h3>
            <p className="text-gray-600 dark:text-gray-300">
              SQL, NoSQL, data modeling, optimization, scalability patterns
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
              <Terminal className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">DevOps</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Docker, Kubernetes, CI/CD pipelines, infrastructure as code, cloud services
            </p>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Meet Our Team</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80 w-full rounded-lg" />
            ))}
          </div>
        ) : authors && authors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <div key={author.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                {author.avatarUrl && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={author.avatarUrl} 
                      alt={author.fullName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={author.avatarUrl} alt={author.fullName} />
                      <AvatarFallback>{author.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {author.fullName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{author.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {author.bio || 'Developer and technology enthusiast.'}
                  </p>
                  <div className="flex space-x-2">
                    {author.twitterUrl && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={author.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                          <Twitter className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {author.githubUrl && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={author.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitPullRequest">
                          <GitPullRequest className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {author.linkedinUrl && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={author.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-center">Team information coming soon!</p>
        )}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h2>
        <div className="inline-block bg-white dark:bg-gray-800 rounded-lg shadow-md px-8 py-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Have questions or want to contribute to the blog? We'd love to hear from you!
          </p>
          <Button asChild>
            <Link href="/contact" className="inline-flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
