import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Code, Star, GitFork, ExternalLink, RefreshCw } from "lucide-react";
import { SiGithub } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { apiRequest } from "@/lib/queryClient";

import type { GithubRepository } from "@shared/schema";

// Helper function to get color for language
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#2b7489",
    Python: "#3572A5",
    Java: "#b07219",
    C: "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    Ruby: "#701516",
    Go: "#00ADD8",
    PHP: "#4F5D95",
    Swift: "#ffac45",
    Kotlin: "#F18E33",
    Rust: "#dea584",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051"
  };
  
  return colors[language] || "#6e768166";
}

function RepositoryCard({ repo }: { repo: GithubRepository }) {
  const languages = repo.languages ? Object.keys(repo.languages) : [];
  const totalBytes = languages.reduce((acc, lang) => acc + (repo.languages?.[lang] || 0), 0);
  
  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <SiGithub className="mr-2" />
              <a 
                href={repo.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary flex items-center"
              >
                {repo.name} <ExternalLink size={14} className="ml-1" />
              </a>
            </CardTitle>
            {repo.description && (
              <p className="text-sm text-muted-foreground mt-2">{repo.description}</p>
            )}
          </div>
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              <Star size={16} className="mr-1 text-yellow-500" />
              <span>{repo.stars}</span>
            </div>
            <div className="flex items-center">
              <GitFork size={16} className="mr-1 text-blue-500" />
              <span>{repo.forks}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      {repo.readme && (
        <CardContent className="pt-4 max-h-60 overflow-y-auto">
          <MarkdownRenderer content={repo.readme} />
        </CardContent>
      )}
      
      <CardFooter className="flex justify-between bg-muted/30 border-t">
        <div className="flex flex-wrap gap-2">
          {languages.map(lang => (
            <Badge key={lang} className="flex items-center gap-1">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getLanguageColor(lang) }}
              />
              <span>{lang}</span>
              <span className="text-xs opacity-70">
                {Math.round((repo.languages?.[lang] || 0) / totalBytes * 100)}%
              </span>
            </Badge>
          ))}
        </div>
        
        {repo.homepage && (
          <a 
            href={repo.homepage} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center"
          >
            Demo <ExternalLink size={12} className="ml-1" />
          </a>
        )}
      </CardFooter>
    </Card>
  );
}

function RepositorySkeleton() {
  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <div className="flex justify-between">
          <div>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72 mt-2" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/30 border-t">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardFooter>
    </Card>
  );
}

export default function Repositories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: repositories, isLoading: isLoadingRepos } = useQuery({
    queryKey: ["/api/github/repos/1"], // Replace with actual user ID
  });

  // Extract all unique languages from repos
  const allLanguages = repositories?.reduce((langs: string[], repo: GithubRepository) => {
    if (repo.languages) {
      Object.keys(repo.languages).forEach(lang => {
        if (!langs.includes(lang)) {
          langs.push(lang);
        }
      });
    }
    return langs;
  }, []) || [];

  // Sort languages by usage
  allLanguages.sort();

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/github/sync", {
        method: "POST",
        body: JSON.stringify({ username: "your-github-username", userId: 1 }) // Replace with actual GitHub username and user ID
      });
    },
    onSuccess: () => {
      toast({
        title: "Repositories synced!",
        description: "Your GitHub repositories have been successfully synced.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/github/repos/1"] });
    },
    onError: (error) => {
      toast({
        title: "Sync failed",
        description: "Failed to sync repositories. Please try again.",
        variant: "destructive",
      });
      console.error("Sync error:", error);
    }
  });

  // Filter repositories based on search query and selected language
  const filteredRepos = repositories?.filter((repo: GithubRepository) => {
    const matchesSearch = searchQuery === "" || 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (repo.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesLanguage = selectedLanguage === null || 
      (repo.languages && Object.keys(repo.languages).includes(selectedLanguage));
    
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">GitHub Repositories</h1>
          <p className="text-muted-foreground">
            My open source projects and contributions
          </p>
        </div>
        <Button 
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
        >
          <RefreshCw size={16} className={`mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
          Sync Repositories
        </Button>
      </div>

      {syncMutation.isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            Failed to sync repositories. Please check your GitHub token and try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-3">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoadingRepos ? (
            <>
              <RepositorySkeleton />
              <RepositorySkeleton />
              <RepositorySkeleton />
            </>
          ) : filteredRepos?.length > 0 ? (
            filteredRepos.map((repo: GithubRepository) => (
              <RepositoryCard key={repo.id} repo={repo} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No repositories found.</p>
              {repositories?.length === 0 && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => syncMutation.mutate()}
                  disabled={syncMutation.isPending}
                >
                  Sync with GitHub
                </Button>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Code size={16} className="mr-2" />
              Languages
            </h2>
            
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedLanguage === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedLanguage(null)}
              >
                All
              </Badge>
              
              {allLanguages.map(language => (
                <Badge
                  key={language}
                  variant={selectedLanguage === language ? "default" : "outline"}
                  className="cursor-pointer flex items-center gap-1"
                  onClick={() => setSelectedLanguage(language)}
                >
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: getLanguageColor(language) }}
                  />
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}