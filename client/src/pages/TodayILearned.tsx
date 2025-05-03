import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, Calendar, Tag, Plus } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import TagList from "@/components/TagList";
import { Skeleton } from "@/components/ui/skeleton";

import type { Tag as TagType, TilEntryWithRelations } from "@shared/schema";

function TilEntryCard({ entry }: { entry: TilEntryWithRelations }) {
  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>
              <Link to={`/til/${entry.id}`} className="hover:text-primary">
                {entry.title}
              </Link>
            </CardTitle>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Calendar size={14} className="mr-1" />
              <span>{format(new Date(entry.createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <MarkdownRenderer content={entry.content.length > 300 ? `${entry.content.substring(0, 300)}...` : entry.content} />
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/30 border-t">
        <div className="flex items-center">
          <img 
            src={entry.author.profileImageUrl || "https://github.com/identicons/app/oauth_app/1234"} 
            alt={entry.author.username}
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="text-sm">{entry.author.username}</span>
        </div>
        <TagList tags={entry.tags} />
      </CardFooter>
    </Card>
  );
}

function TilEntrySkeleton() {
  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/4 mt-2" />
      </CardHeader>
      <CardContent className="pt-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/30 border-t">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-32" />
      </CardFooter>
    </Card>
  );
}

export default function TodayILearned() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: allEntries, isLoading: isLoadingEntries } = useQuery({
    queryKey: ["/api/til"],
  });

  const { data: tags, isLoading: isLoadingTags } = useQuery({
    queryKey: ["/api/tags"],
  });

  // Filter entries based on search query and selected tag
  const filteredEntries = allEntries?.filter((entry: TilEntryWithRelations) => {
    const matchesSearch = searchQuery === "" || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === null || 
      entry.tags.some((tag: TagType) => tag.slug === selectedTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Today I Learned</h1>
          <p className="text-muted-foreground">
            Short notes and code snippets on things I learn day to day
          </p>
        </div>
        <Button className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600">
          <Plus size={16} className="mr-2" />
          Add TIL
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-3">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entries..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoadingEntries ? (
            <>
              <TilEntrySkeleton />
              <TilEntrySkeleton />
              <TilEntrySkeleton />
            </>
          ) : filteredEntries?.length > 0 ? (
            filteredEntries.map((entry: TilEntryWithRelations) => (
              <TilEntryCard key={entry.id} entry={entry} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No entries found.</p>
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Tag size={16} className="mr-2" />
              Tags
            </h2>
            
            {isLoadingTags ? (
              <>
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-8 w-5/6" />
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedTag === null ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(null)}
                >
                  All
                </Badge>
                
                {tags?.map((tag: TagType) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTag === tag.slug ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedTag(tag.slug)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}