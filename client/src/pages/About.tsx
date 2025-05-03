import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  GitPullRequest, 
  Twitter, 
  Github, 
  Linkedin, 
  Code, 
  Database, 
  Server, 
  Terminal,
  Globe,
  Bookmark,
  BookOpen,
  Share2,
  HardDrive,
  SquareCode
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// SMONGS brand colors
const smongsPrimary = "from-indigo-500 to-purple-600";
const smongsSecondary = "from-rose-500 to-orange-500";

export default function About() {
  const { data: authors, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-4">
          About SMONGS
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Where Software, Machines, Online Networks, and Global Systems converge
        </p>
      </div>

      {/* Brand Story */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
          The SMONGS Story
        </h2>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              SMONGS represents the intersection of <strong>S</strong>oftware, <strong>M</strong>achines, <strong>O</strong>nline 
              <strong>N</strong>etworks, <strong>G</strong>lobal <strong>S</strong>ystems — the foundation of modern technology.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              Founded by a passionate developer with over a decade of experience building innovative tech solutions,
              SMONGS is more than just a blog — it's a platform dedicated to sharing knowledge, insights, and expertise
              about the technologies that shape our digital world.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Here, you'll find in-depth articles, practical tutorials, and thought-provoking discussions about
              software development, scalable architecture, cutting-edge innovations, and technology best practices.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SMONGS Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                Knowledge Sharing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                We believe in the power of open knowledge. Our mission is to demystify complex technical concepts
                and make them accessible to all developers, regardless of their experience level.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-rose-500 to-orange-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center">
                  <SquareCode className="h-5 w-5 text-white" />
                </div>
                Technical Excellence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                We are committed to high standards of technical accuracy, practical utility, and in-depth analysis,
                ensuring our content helps you build better, more reliable software systems.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-rose-500 to-orange-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                Global Perspective
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Technology transcends borders. We approach topics with a global mindset, considering diverse
                perspectives and the worldwide impact of the technologies we discuss.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Share2 className="h-5 w-5 text-white" />
                </div>
                Community Driven
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                We believe the best ideas come from collaboration. We actively engage with the developer community,
                inviting contributions, feedback, and discussions to enrich our content.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tech Focus */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
          Technology Focus
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-t-4 border-blue-500 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center mb-4 shadow-inner">
              <Code className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Frontend</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Modern JavaScript frameworks, TypeScript, responsive design, state management, and performance optimization
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-t-4 border-green-500 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center mb-4 shadow-inner">
              <Server className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Backend</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Node.js, Python, Go, RESTful and GraphQL APIs, microservices, serverless architecture
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-t-4 border-purple-500 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center mb-4 shadow-inner">
              <Database className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Data Systems</h3>
            <p className="text-gray-600 dark:text-gray-300">
              PostgreSQL, MongoDB, Redis, data modeling, query optimization, and distributed data systems
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-t-4 border-orange-500 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center mb-4 shadow-inner">
              <HardDrive className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Infrastructure</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Cloud services, containerization, Kubernetes, CI/CD pipelines, and infrastructure as code
            </p>
          </div>
        </div>
      </div>

      {/* Author/Team section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          The Mind Behind SMONGS
        </h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6">
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
        ) : authors && authors.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {authors.map((author) => (
              <Card key={author.id} className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <div className="flex flex-col md:flex-row">
                  {author.avatarUrl && (
                    <div className="w-full md:w-1/3 h-64 md:h-auto overflow-hidden">
                      <img 
                        src={author.avatarUrl} 
                        alt={author.fullName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8 w-full md:w-2/3">
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                      {author.fullName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-1 text-lg">{author.role || "Software Engineer & Tech Writer"}</p>
                    <p className="text-gray-500 dark:text-gray-500 mb-4">SMONGS Founder</p>
                    
                    <div className="mb-6 text-gray-600 dark:text-gray-300 space-y-4">
                      <p>
                        {author.bio || "A passionate technologist with over a decade of experience building software across the full stack. Specializes in creating scalable web applications and sharing knowledge through writing and open source contributions."}
                      </p>
                      <p>
                        Committed to creating high-quality technical content that helps fellow developers solve real-world problems and advance their careers.
                      </p>
                    </div>
                    
                    <div className="flex space-x-3">
                      {author.githubUrl && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={author.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <Github className="h-5 w-5" />
                          </a>
                        </Button>
                      )}
                      {author.twitterUrl && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={author.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <Twitter className="h-5 w-5" />
                          </a>
                        </Button>
                      )}
                      {author.linkedinUrl && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={author.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <Linkedin className="h-5 w-5" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center p-8">
            <p className="text-gray-600 dark:text-gray-300">Team information coming soon!</p>
          </Card>
        )}
      </div>

      {/* Contact */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
          Get in Touch
        </h2>
        <Card className="inline-block border-0 shadow-lg p-8 max-w-lg mx-auto">
          <CardContent className="p-0">
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              Have questions, feedback, or want to collaborate? I'd love to hear from you!
            </p>
            <Button asChild className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
              <Link href="/contact" className="inline-flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Contact Me
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
