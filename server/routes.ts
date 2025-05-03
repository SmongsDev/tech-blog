import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertTagSchema, insertCommentSchema, insertUserSchema, insertPostTagSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from 'zod-validation-error';

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

  const httpServer = createServer(app);
  return httpServer;
}
