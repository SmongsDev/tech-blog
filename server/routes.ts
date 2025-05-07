import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPostSchema, 
  insertTagSchema, 
  insertCommentSchema, 
  insertUserSchema, 
  insertPostTagSchema,
  insertTilEntrySchema,
  insertTilTagSchema,
  insertGithubRepositorySchema 
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from 'zod-validation-error';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all posts
  app.get("/api/posts", async (req: Request, res: Response) => {
    try {
      const posts = await storage.getPostsWithRelations();
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      return res.status(500).json({ message: "Error fetching posts" });
    }
  });

  // Get featured posts
  app.get("/api/posts/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const posts = await storage.getFeaturedPosts(limit);
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      return res.status(500).json({ message: "Error fetching featured posts" });
    }
  });

  // Get recent posts
  app.get("/api/posts/recent", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const posts = await storage.getRecentPosts(limit);
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching recent posts:", error);
      return res.status(500).json({ message: "Error fetching recent posts" });
    }
  });

  // Get popular posts
  app.get("/api/posts/popular", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const posts = await storage.getPopularPosts(limit);
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching popular posts:", error);
      return res.status(500).json({ message: "Error fetching popular posts" });
    }
  });

  // Get post by slug
  app.get("/api/posts/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const post = await storage.getPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      return res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      return res.status(500).json({ message: "Error fetching post" });
    }
  });

  // Search posts
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string || "";
      const results = await storage.searchPosts(query);
      return res.json(results);
    } catch (error) {
      console.error("Error searching posts:", error);
      return res.status(500).json({ message: "Error searching posts" });
    }
  });

  // Get all tags
  app.get("/api/tags", async (req: Request, res: Response) => {
    try {
      const tags = await storage.getAllTags();
      return res.json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      return res.status(500).json({ message: "Error fetching tags" });
    }
  });

  // Get posts by tag
  app.get("/api/tags/:slug/posts", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const posts = await storage.getPostsByTag(slug);
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching posts by tag:", error);
      return res.status(500).json({ message: "Error fetching posts by tag" });
    }
  });

  // Create a post
  app.post("/api/posts", async (req: Request, res: Response) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(validatedData);
      
      // Handle tags if provided
      if (req.body.tags && Array.isArray(req.body.tags)) {
        for (const tagId of req.body.tags) {
          await storage.addTagToPost({
            postId: post.id,
            tagId: parseInt(tagId)
          });
        }
      }
      
      return res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating post:", error);
      return res.status(500).json({ message: "Error creating post" });
    }
  });

  // Create a comment
  app.post("/api/comments", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(validatedData);
      return res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating comment:", error);
      return res.status(500).json({ message: "Error creating comment" });
    }
  });

  // Create a tag
  app.post("/api/tags", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(validatedData);
      return res.status(201).json(tag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating tag:", error);
      return res.status(500).json({ message: "Error creating tag" });
    }
  });

  // Get all users
  app.get("/api/users", async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      return res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Error fetching users" });
    }
  });

  // Get user by id
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Error fetching user" });
    }
  });

  // Create a user
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Error creating user" });
    }
  });

  // Update a user
  app.put("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const validatedData = insertUserSchema.partial().parse(req.body);
      const updatedUser = await storage.updateUser(id, validatedData);
      return res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Error updating user" });
    }
  });

  // TIL Entries Routes
  
  // Get all TIL entries
  app.get("/api/til", async (req: Request, res: Response) => {
    try {
      const entries = await storage.getTilEntriesWithRelations();
      return res.json(entries);
    } catch (error) {
      console.error("Error fetching TIL entries:", error);
      return res.status(500).json({ message: "Error fetching TIL entries" });
    }
  });

  // Get recent TIL entries
  app.get("/api/til/recent", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const entries = await storage.getRecentTilEntries(limit);
      return res.json(entries);
    } catch (error) {
      console.error("Error fetching recent TIL entries:", error);
      return res.status(500).json({ message: "Error fetching recent TIL entries" });
    }
  });

  // Get TIL entry by ID
  app.get("/api/til/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const entry = await storage.getTilEntry(id);
      
      if (!entry) {
        return res.status(404).json({ message: "TIL entry not found" });
      }

      const author = await storage.getUser(entry.authorId);
      const tags = await storage.getTilTags(entry.id);
      
      return res.json({
        ...entry,
        author,
        tags
      });
    } catch (error) {
      console.error("Error fetching TIL entry:", error);
      return res.status(500).json({ message: "Error fetching TIL entry" });
    }
  });

  // Get TIL entries by tag
  app.get("/api/tags/:slug/til", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const entries = await storage.getTilEntriesByTag(slug);
      return res.json(entries);
    } catch (error) {
      console.error("Error fetching TIL entries by tag:", error);
      return res.status(500).json({ message: "Error fetching TIL entries by tag" });
    }
  });

  // Search TIL entries
  app.get("/api/til/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string || "";
      const results = await storage.searchTilEntries(query);
      return res.json(results);
    } catch (error) {
      console.error("Error searching TIL entries:", error);
      return res.status(500).json({ message: "Error searching TIL entries" });
    }
  });

  // Create a TIL entry
  app.post("/api/til", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTilEntrySchema.parse(req.body);
      const entry = await storage.createTilEntry(validatedData);
      
      // Handle tags if provided
      if (req.body.tags && Array.isArray(req.body.tags)) {
        for (const tagId of req.body.tags) {
          await storage.addTagToTil({
            tilId: entry.id,
            tagId: parseInt(tagId)
          });
        }
      }
      
      return res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating TIL entry:", error);
      return res.status(500).json({ message: "Error creating TIL entry" });
    }
  });

  // GitHub Repositories Routes
  
  // Get all repositories for a user
  app.get("/api/github/repos", async (req, res) => {
    try {
      // 1. DB에서 블로그 주인 정보 및 GitHub username 조회
      const user = await storage.getBlogOwner();
      if (!user || !user.githubUrl) {
        return res.status(404).json({ message: "User or GitHub username not found" });
      }
      // 2. GitHub에서 최신 레포 목록 가져오기
      const githubToken = process.env.GITHUB_ACCESS_TOKEN;
      const response = await axios.get(`https://api.github.com/users/SmongsDev/repos`, {
        headers: githubToken ? { Authorization: `token ${githubToken}` } : {},
      });
      const githubRepos = response.data;
  
      // 3. DB에 저장/업데이트 (upsert)
      await Promise.all(githubRepos.map(async (repo: any) => {
        await storage.upsertGithubRepository({
          id: repo.id,
          userid: user.id,
          reponame: repo.name,
          repourl: repo.html_url,
          languages: repo.language ? { [repo.language]: 1 } : {},
          createdat: repo.created_at ? new Date(repo.created_at) : new Date(),
        });
      }));
  
      // 4. 동기화된 DB 데이터 반환
      const repos = await storage.getAllGithubRepositories();
      console.log(repos);
      return res.json(repos);
    } catch (error) {
      console.error("Error fetching/syncing GitHub repositories:", error);
      return res.status(500).json({ message: "Error fetching GitHub repositories" });
    }
  });

  // Get repositories filtered by language
  app.get("/api/github/language/:language", async (req: Request, res: Response) => {
    try {
      const { language } = req.params;
      const repos = await storage.getGithubRepositoriesByLanguage(language);
      return res.json(repos);
    } catch (error) {
      console.error("Error fetching GitHub repositories by language:", error);
      return res.status(500).json({ message: "Error fetching GitHub repositories by language" });
    }
  });

  // Search repositories
  app.get("/api/github/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string || "";
      const results = await storage.searchGithubRepositories(query);
      return res.json(results);
    } catch (error) {
      console.error("Error searching GitHub repositories:", error);
      return res.status(500).json({ message: "Error searching GitHub repositories" });
    }
  });

  // Fetch and store repositories from GitHub API
  app.post("/api/github/sync", async (req: Request, res: Response) => {
    try {
      const { username, userId } = req.body;
      
      if (!username || !userId) {
        return res.status(400).json({ message: "Username and userId are required" });
      }

      // Check if GitHub Access Token is available
      const githubToken = process.env.GITHUB_ACCESS_TOKEN;
      if (!githubToken) {
        return res.status(500).json({ message: "GitHub API token not configured" });
      }

      // Fetch repositories from GitHub API
      const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });

      const repositories = await Promise.all(response.data.map(async (repo: any) => {
        // Get languages for repository
        const languagesResponse = await axios.get(repo.languages_url, {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: 'application/vnd.github.v3+json'
          }
        });

        // Get README content if available
        let readme = null;
        try {
          const readmeResponse = await axios.get(`https://api.github.com/repos/${username}/${repo.name}/readme`, {
            headers: {
              Authorization: `token ${githubToken}`,
              Accept: 'application/vnd.github.v3+json'
            }
          });
          const content = readmeResponse.data.content;
          readme = Buffer.from(content, 'base64').toString('utf-8');
        } catch (e) {
          // README not found or other issue
          console.log(`No README found for ${repo.name}`);
        }

        // Create or update repository in database
        const repoData = {
          name: repo.name,
          fullname: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          homepage: repo.homepage,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          languages: languagesResponse.data,
          topics: repo.topics || [],
          readme: readme,
          userId: parseInt(userId)
        };

        // Check if repository already exists
        const existingRepos = await storage.getGithubRepositoriesByUser(parseInt(userId));
        const existingRepo = existingRepos.find(r => r.name === repo.name);

        if (existingRepo) {
          return await storage.updateGithubRepository(existingRepo.id, repoData);
        } else {
          return await storage.createGithubRepository(repoData);
        }
      }));

      return res.status(200).json({ 
        message: `Successfully synced ${repositories.length} repositories`,
        repositories
      });
    } catch (error) {
      console.error("Error syncing GitHub repositories:", error);
      return res.status(500).json({ 
        message: "Error syncing GitHub repositories",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
