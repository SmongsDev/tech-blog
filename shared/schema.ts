import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  twitterUrl: text("twitter_url"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  role: text("role").default("author"),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  color: text("color").default("blue"),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  authorId: integer("author_id").notNull().references(() => users.id),
  published: boolean("published").default(true),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  readingTime: text("reading_time"),
});

export const postsTags = pgTable("posts_tags", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  tagId: integer("tag_id").notNull().references(() => tags.id),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  postId: integer("post_id").notNull().references(() => posts.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  bio: true,
  avatarUrl: true,
  twitterUrl: true,
  githubUrl: true,
  linkedinUrl: true,
  role: true,
}).omit({ id: true });

export const insertTagSchema = createInsertSchema(tags).pick({
  name: true,
  slug: true,
  color: true,
}).omit({ id: true });

export const insertPostSchema = createInsertSchema(posts).pick({
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  coverImage: true,
  authorId: true,
  published: true,
  featured: true,
  readingTime: true,
}).omit({ id: true, createdAt: true });

export const insertPostTagSchema = createInsertSchema(postsTags).pick({
  postId: true,
  tagId: true,
}).omit({ id: true });

export const insertCommentSchema = createInsertSchema(comments).pick({
  content: true,
  authorName: true,
  authorEmail: true,
  postId: true,
}).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Tag = typeof tags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type PostTag = typeof postsTags.$inferSelect;
export type InsertPostTag = z.infer<typeof insertPostTagSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

// Extended types for frontend use
export type PostWithRelations = Post & {
  author: User;
  tags: Tag[];
  comments?: Comment[];
}
