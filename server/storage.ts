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
import { eq, like, desc, and, asc, or, sql, inArray } from "drizzle-orm";

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
  upsertGithubRepository(repoData: Partial<GithubRepository> & { id: number, userid: number }): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Always return the first user (blog owner)
  async getBlogOwner() {
    const [user] = await db.select().from(users).orderBy(asc(users.id)).limit(1);
    return user;
  }

  async getAllGithubRepositories() {
    return await db.select().from(githubRepositories);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  // Posts
  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async getPostBySlug(slug: string): Promise<PostWithRelations | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
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
    return db.select().from(posts);
  }

  async getPostsWithRelations(): Promise<PostWithRelations[]> {
    const allPosts = await this.getAllPosts();
    return Promise.all(
      allPosts.map(async (post) => {
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
    const featuredPosts = await db.select()
      .from(posts)
      .where(and(eq(posts.featured, true), eq(posts.published, true)))
      .orderBy(desc(posts.createdAt))
      .limit(limit);

    return Promise.all(
      featuredPosts.map(async (post) => {
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

  async getRecentPosts(limit = 5): Promise<PostWithRelations[]> {
    const recentPosts = await db.select()
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt))
      .limit(limit);

    return Promise.all(
      recentPosts.map(async (post) => {
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

  async getPopularPosts(limit = 4): Promise<PostWithRelations[]> {
    // In a real app, this would be based on view count or other metrics
    // For now, we'll just return recent posts
    return this.getRecentPosts(limit);
  }

  async getPostsByTag(tagSlug: string): Promise<PostWithRelations[]> {
    const tag = await this.getTagBySlug(tagSlug);
    if (!tag) return [];

    const postTagsData = await db.select()
      .from(postsTags)
      .where(eq(postsTags.tagId, tag.id));

    const postIds = postTagsData.map(pt => pt.postId);
    
    if (postIds.length === 0) return [];

    const taggedPosts = await db.select()
      .from(posts)
      .where(and(
        eq(posts.published, true), 
        inArray(posts.id, postIds)
      ))
      .orderBy(desc(posts.createdAt));

    return Promise.all(
      taggedPosts.map(async (post) => {
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

  async createPost(postData: InsertPost): Promise<Post> {
    const [post] = await db.insert(posts).values(postData).returning();
    return post;
  }

  async searchPosts(query: string): Promise<PostWithRelations[]> {
    if (!query.trim()) return [];

    const searchPattern = `%${query}%`;
    
    const searchResults = await db.select()
      .from(posts)
      .where(and(
        eq(posts.published, true),
        or(
          like(posts.title, searchPattern),
          like(posts.excerpt, searchPattern),
          like(posts.content, searchPattern)
        )
      ))
      .orderBy(desc(posts.createdAt));

    return Promise.all(
      searchResults.map(async (post) => {
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

  // Tags
  async getTag(id: number): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    return tag;
  }

  async getTagBySlug(slug: string): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.slug, slug));
    return tag;
  }

  async getAllTags(): Promise<Tag[]> {
    return db.select().from(tags);
  }

  async createTag(tagData: InsertTag): Promise<Tag> {
    const [tag] = await db.insert(tags).values(tagData).returning();
    return tag;
  }

  // Post Tags
  async getPostTags(postId: number): Promise<Tag[]> {
    const postTagsData = await db.select()
      .from(postsTags)
      .where(eq(postsTags.postId, postId));
    
    const tagIds = postTagsData.map(pt => pt.tagId);
    
    if (tagIds.length === 0) return [];
    
    return db.select()
      .from(tags)
      .where(inArray(tags.id, tagIds));
  }

  async addTagToPost(postTagData: InsertPostTag): Promise<PostTag> {
    const [postTag] = await db.insert(postsTags).values(postTagData).returning();
    return postTag;
  }

  // Comments
  async getPostComments(postId: number): Promise<Comment[]> {
    return db.select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));
  }

  async createComment(commentData: InsertComment): Promise<Comment> {
    const [comment] = await db.insert(comments).values(commentData).returning();
    return comment;
  }

  // TIL Entries
  async getTilEntry(id: number): Promise<TilEntry | undefined> {
    const [entry] = await db.select().from(tilEntries).where(eq(tilEntries.id, id));
    return entry;
  }

  async getAllTilEntries(): Promise<TilEntry[]> {
    return db.select().from(tilEntries).orderBy(desc(tilEntries.createdAt));
  }

  async getTilEntriesWithRelations(): Promise<TilEntryWithRelations[]> {
    const entries = await this.getAllTilEntries();
    return Promise.all(
      entries.map(async (entry) => {
        const author = (await this.getUser(entry.authorId))!;
        const tags = await this.getTilTags(entry.id);
        return {
          ...entry,
          author,
          tags
        };
      })
    );
  }

  async getRecentTilEntries(limit = 10): Promise<TilEntryWithRelations[]> {
    const recentEntries = await db.select()
      .from(tilEntries)
      .orderBy(desc(tilEntries.createdAt))
      .limit(limit);

    return Promise.all(
      recentEntries.map(async (entry) => {
        const author = (await this.getUser(entry.authorId))!;
        const tags = await this.getTilTags(entry.id);
        return {
          ...entry,
          author,
          tags
        };
      })
    );
  }

  async getTilEntriesByTag(tagSlug: string): Promise<TilEntryWithRelations[]> {
    const tag = await this.getTagBySlug(tagSlug);
    if (!tag) return [];

    const tilTagsData = await db.select()
      .from(tilTags)
      .where(eq(tilTags.tagId, tag.id));

    const tilIds = tilTagsData.map(tt => tt.tilId);
    
    if (tilIds.length === 0) return [];

    const taggedEntries = await db.select()
      .from(tilEntries)
      .where(inArray(tilEntries.id, tilIds))
      .orderBy(desc(tilEntries.createdAt));

    return Promise.all(
      taggedEntries.map(async (entry) => {
        const author = (await this.getUser(entry.authorId))!;
        const tags = await this.getTilTags(entry.id);
        return {
          ...entry,
          author,
          tags
        };
      })
    );
  }

  async createTilEntry(entryData: InsertTilEntry): Promise<TilEntry> {
    const [entry] = await db.insert(tilEntries).values(entryData).returning();
    return entry;
  }

  async searchTilEntries(query: string): Promise<TilEntryWithRelations[]> {
    if (!query.trim()) return [];

    const searchPattern = `%${query}%`;
    
    const searchResults = await db.select()
      .from(tilEntries)
      .where(
        or(
          like(tilEntries.title, searchPattern),
          like(tilEntries.content, searchPattern)
        )
      )
      .orderBy(desc(tilEntries.createdAt));

    return Promise.all(
      searchResults.map(async (entry) => {
        const author = (await this.getUser(entry.authorId))!;
        const tags = await this.getTilTags(entry.id);
        return {
          ...entry,
          author,
          tags
        };
      })
    );
  }

  // TIL Tags
  async getTilTags(tilId: number): Promise<Tag[]> {
    const tilTagsData = await db.select()
      .from(tilTags)
      .where(eq(tilTags.tilId, tilId));
    
    const tagIds = tilTagsData.map(tt => tt.tagId);
    
    if (tagIds.length === 0) return [];
    
    return db.select()
      .from(tags)
      .where(inArray(tags.id, tagIds));
  }

  async addTagToTil(tilTagData: InsertTilTag): Promise<TilTag> {
    const [tilTag] = await db.insert(tilTags).values(tilTagData).returning();
    return tilTag;
  }

  // GitHub Repositories
  async getGithubRepository(id: number): Promise<GithubRepository | undefined> {
    const [repo] = await db.select().from(githubRepositories).where(eq(githubRepositories.id, id));
    return repo;
  }

  async getGithubRepositoriesByUser(userid: number): Promise<GithubRepository[]> {
    return db.select()
      .from(githubRepositories)
      .where(eq(githubRepositories.userid, userid))
      .orderBy(desc(githubRepositories.id));
  }
  async createGithubRepository(repo: InsertGithubRepository): Promise<GithubRepository> {
    const [insertedRepo] = await db.insert(githubRepositories).values(repo).returning();
    return insertedRepo;
  }
  
  async updateGithubRepository(id: number, repo: Partial<InsertGithubRepository>): Promise<GithubRepository> {
    const [updatedRepo] = await db
      .update(githubRepositories)
      .set({ ...repo })
      .where(eq(githubRepositories.id, id))
      .returning();
    return updatedRepo;
  }

  async getGithubRepositoriesByLanguage(language: string): Promise<GithubRepository[]> {
    // Using SQL approach since jsonb filtering is complex
    const repos = await db.select().from(githubRepositories);
    return repos.filter(repo => {
      if (!repo.languages) return false;
      return Object.keys(repo.languages).includes(language);
    });
  }

  async searchGithubRepositories(query: string): Promise<GithubRepository[]> {
    if (!query.trim()) return [];

    const searchPattern = `%${query}%`;
    return db.select()
      .from(githubRepositories)
      .where(
        or(
          like(githubRepositories.reponame, searchPattern),
          like(githubRepositories.repourl, searchPattern)
        )
      )
      .orderBy(desc(githubRepositories.id));
  }

  async upsertGithubRepository(
    repoData: Partial<GithubRepository> & { id: number; userid: number }
  ): Promise<void> {
    // Only allow DB columns
    const allowedKeys = ["id", "userid", "reponame", "repourl", "languages", "createdat"];
    const dbData: any = {};
    for (const [key, value] of Object.entries(repoData)) {
      if (allowedKeys.includes(key) && value !== undefined) {
        dbData[key] = value;
      }
    }
    console.log("upsert dbData:", dbData);

    // id로 먼저 조회
    const existing = await db
      .select()
      .from(githubRepositories)
      .where(eq(githubRepositories.id, repoData.id));

    if (existing.length > 0) {
      // update
      await db
        .update(githubRepositories)
        .set(dbData)
        .where(eq(githubRepositories.id, repoData.id));
    } else {
      // insert
      await db.insert(githubRepositories).values(dbData);
    }
  }
}

export const storage = new DatabaseStorage();