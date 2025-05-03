import { 
  users, posts, tags, postsTags, comments, tilEntries, tilTags, githubRepositories,
  type User, type InsertUser,
  type Post, type InsertPost,
  type Tag, type InsertTag,
  type PostTag, type InsertPostTag,
  type Comment, type InsertComment,
  type TilEntry, type InsertTilEntry,
  type TilTag, type InsertTilTag,
  type GithubRepository, type InsertGithubRepository,
  type PostWithRelations, type TilEntryWithRelations, type GithubRepositoryWithLanguages
} from "@shared/schema";
import { db } from "./db";
import { eq, like, desc, and, SQL, asc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Posts
  getPost(id: number): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<PostWithRelations | undefined>;
  getAllPosts(): Promise<Post[]>;
  getPostsWithRelations(): Promise<PostWithRelations[]>;
  getFeaturedPosts(limit?: number): Promise<PostWithRelations[]>;
  getRecentPosts(limit?: number): Promise<PostWithRelations[]>;
  getPopularPosts(limit?: number): Promise<PostWithRelations[]>;
  getPostsByTag(tagSlug: string): Promise<PostWithRelations[]>;
  createPost(post: InsertPost): Promise<Post>;
  searchPosts(query: string): Promise<PostWithRelations[]>;
  
  // Tags
  getTag(id: number): Promise<Tag | undefined>;
  getTagBySlug(slug: string): Promise<Tag | undefined>;
  getAllTags(): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;
  
  // Post Tags
  getPostTags(postId: number): Promise<Tag[]>;
  addTagToPost(postTag: InsertPostTag): Promise<PostTag>;
  
  // Comments
  getPostComments(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;

  // TIL Entries
  getTilEntry(id: number): Promise<TilEntry | undefined>;
  getAllTilEntries(): Promise<TilEntry[]>;
  getTilEntriesWithRelations(): Promise<TilEntryWithRelations[]>;
  getRecentTilEntries(limit?: number): Promise<TilEntryWithRelations[]>;
  getTilEntriesByTag(tagSlug: string): Promise<TilEntryWithRelations[]>;
  createTilEntry(entry: InsertTilEntry): Promise<TilEntry>;
  searchTilEntries(query: string): Promise<TilEntryWithRelations[]>;
  
  // TIL Tags
  getTilTags(tilId: number): Promise<Tag[]>;
  addTagToTil(tilTag: InsertTilTag): Promise<TilTag>;
  
  // GitHub Repositories
  getGithubRepository(id: number): Promise<GithubRepository | undefined>;
  getGithubRepositoriesByUser(userId: number): Promise<GithubRepository[]>;
  createGithubRepository(repo: InsertGithubRepository): Promise<GithubRepository>;
  updateGithubRepository(id: number, repo: Partial<InsertGithubRepository>): Promise<GithubRepository>;
  getGithubRepositoriesByLanguage(language: string): Promise<GithubRepository[]>;
  searchGithubRepositories(query: string): Promise<GithubRepository[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private tags: Map<number, Tag>;
  private postsTags: Map<number, PostTag>;
  private comments: Map<number, Comment>;
  
  private userIdCounter: number;
  private postIdCounter: number;
  private tagIdCounter: number;
  private postTagIdCounter: number;
  private commentIdCounter: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.tags = new Map();
    this.postsTags = new Map();
    this.comments = new Map();
    
    this.userIdCounter = 1;
    this.postIdCounter = 1;
    this.tagIdCounter = 1;
    this.postTagIdCounter = 1;
    this.commentIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add a default admin user
    const user: InsertUser = {
      username: "alexjohnson",
      password: "password123", // In a real app, this would be hashed
      fullName: "Alex Johnson",
      bio: "Building web applications with React, Node.js, and TypeScript. Passionate about clean code and performance.",
      avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      twitterUrl: "https://twitter.com",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
      role: "admin"
    };
    this.createUser(user);
    
    // Add some tags
    const tagData = [
      { name: "React", slug: "react", color: "blue" },
      { name: "JavaScript", slug: "javascript", color: "yellow" },
      { name: "TypeScript", slug: "typescript", color: "purple" },
      { name: "Node.js", slug: "nodejs", color: "green" },
      { name: "Performance", slug: "performance", color: "emerald" },
      { name: "Docker", slug: "docker", color: "red" },
      { name: "DevOps", slug: "devops", color: "blue" },
      { name: "CSS", slug: "css", color: "indigo" }
    ];
    
    tagData.forEach(tag => this.createTag(tag));
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...userData, id };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Posts
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostBySlug(slug: string): Promise<PostWithRelations | undefined> {
    const post = Array.from(this.posts.values()).find(post => post.slug === slug);
    if (!post) return undefined;
    
    const author = await this.getUser(post.authorId);
    if (!author) return undefined;
    
    const tags = await this.getPostTags(post.id);
    const comments = await this.getPostComments(post.id);
    
    return {
      ...post,
      author,
      tags,
      comments
    };
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values());
  }

  async getPostsWithRelations(): Promise<PostWithRelations[]> {
    const posts = await this.getAllPosts();
    return Promise.all(
      posts.map(async post => {
        const author = (await this.getUser(post.authorId))!;
        const tags = await this.getPostTags(post.id);
        return {
          ...post,
          author,
          tags
        };
      })
    );
  }

  async getFeaturedPosts(limit = 1): Promise<PostWithRelations[]> {
    const allPosts = await this.getPostsWithRelations();
    return allPosts
      .filter(post => post.featured && post.published)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getRecentPosts(limit = 5): Promise<PostWithRelations[]> {
    const allPosts = await this.getPostsWithRelations();
    return allPosts
      .filter(post => post.published)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getPopularPosts(limit = 4): Promise<PostWithRelations[]> {
    // In a real app, this would be based on view count or other metrics
    // For this example, we'll just return recent posts
    return this.getRecentPosts(limit);
  }

  async getPostsByTag(tagSlug: string): Promise<PostWithRelations[]> {
    const tag = await this.getTagBySlug(tagSlug);
    if (!tag) return [];
    
    const postTags = Array.from(this.postsTags.values())
      .filter(pt => pt.tagId === tag.id);
    
    const postIds = postTags.map(pt => pt.postId);
    const postsWithRelations = await this.getPostsWithRelations();
    
    return postsWithRelations.filter(post => 
      postIds.includes(post.id) && post.published
    );
  }

  async createPost(postData: InsertPost): Promise<Post> {
    const id = this.postIdCounter++;
    const createdAt = new Date().toISOString();
    const post: Post = { ...postData, id, createdAt };
    this.posts.set(id, post);
    return post;
  }

  async searchPosts(query: string): Promise<PostWithRelations[]> {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    const postsWithRelations = await this.getPostsWithRelations();
    
    return postsWithRelations.filter(post => 
      (post.title.toLowerCase().includes(lowerQuery) ||
       post.excerpt.toLowerCase().includes(lowerQuery) ||
       post.content.toLowerCase().includes(lowerQuery)) &&
      post.published
    );
  }

  // Tags
  async getTag(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }

  async getTagBySlug(slug: string): Promise<Tag | undefined> {
    return Array.from(this.tags.values()).find(tag => tag.slug === slug);
  }

  async getAllTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }

  async createTag(tagData: InsertTag): Promise<Tag> {
    const id = this.tagIdCounter++;
    const tag: Tag = { ...tagData, id };
    this.tags.set(id, tag);
    return tag;
  }

  // Post Tags
  async getPostTags(postId: number): Promise<Tag[]> {
    const postTagIds = Array.from(this.postsTags.values())
      .filter(pt => pt.postId === postId)
      .map(pt => pt.tagId);
    
    return Array.from(this.tags.values())
      .filter(tag => postTagIds.includes(tag.id));
  }

  async addTagToPost(postTagData: InsertPostTag): Promise<PostTag> {
    const id = this.postTagIdCounter++;
    const postTag: PostTag = { ...postTagData, id };
    this.postsTags.set(id, postTag);
    return postTag;
  }

  // Comments
  async getPostComments(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createComment(commentData: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const createdAt = new Date().toISOString();
    const comment: Comment = { ...commentData, id, createdAt };
    this.comments.set(id, comment);
    return comment;
  }
}

export const storage = new MemStorage();
