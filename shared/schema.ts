import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullname: text("fullname").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatarurl"),
  nickname: text("nickname").default("SmongsDev"),
  twitterUrl: text("twitterurl"),
  githubUrl: text("githuburl"),
  linkedinUrl: text("linkedinurl"),
  githubToken: text("githubtoken"),
  role: text("role").default("author"),
  skills: jsonb("skills").$type<string[]>().default([]),
  introduction: text("introduction"),
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
  coverImage: text("coverimage"),
  authorId: integer("authorid").notNull().references(() => users.id),
  published: boolean("published").default(true),
  featured: boolean("featured").default(false),
  createdAt: timestamp("createdat").defaultNow(),
  readingTime: text("readingtime"),
});

export const postsTags = pgTable("posts_tags", {
  id: serial("id").primaryKey(),
  postId: integer("postid").notNull().references(() => posts.id),
  tagId: integer("tagid").notNull().references(() => tags.id),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorName: text("authorname").notNull(),
  authorEmail: text("authoremail").notNull(),
  postId: integer("postid").notNull().references(() => posts.id),
  createdAt: timestamp("createdat").defaultNow(),
});

export const tilEntries = pgTable("til_entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("authorid").notNull().references(() => users.id),
  createdAt: timestamp("createdat").defaultNow(),
});

export const tilTags = pgTable("til_tags", {
  id: serial("id").primaryKey(),
  tilId: integer("tilid").notNull().references(() => tilEntries.id),
  tagId: integer("tagid").notNull().references(() => tags.id),
});

export const githubRepositories = pgTable("github_repositories", {
  id: serial("id").primaryKey(),
  userid: integer("userid").references(() => users.id),
  reponame: text("reponame").notNull(),
  repourl: text("repourl").notNull(),
  languages: jsonb("languages").$type<Record<string, number>>(),
  createdat: timestamp("createdat").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullname: true,
  bio: true,
  avatarUrl: true,
  nickname: true,
  twitterUrl: true,
  githubUrl: true,
  linkedinUrl: true,
  githubToken: true,
  role: true,
  skills: true,
  introduction: true,
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

export const insertTilEntrySchema = createInsertSchema(tilEntries).pick({
  title: true,
  content: true,
  authorId: true,
}).omit({ id: true, createdAt: true });

export const insertTilTagSchema = createInsertSchema(tilTags).pick({
  tilId: true,
  tagId: true,
}).omit({ id: true });

export const insertGithubRepositorySchema = createInsertSchema(githubRepositories).pick({
  userid: true,
  reponame: true,
  repourl: true,
  languages: true,
}).omit({ id: true, createdat: true });

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

export type TilEntry = typeof tilEntries.$inferSelect;
export type InsertTilEntry = z.infer<typeof insertTilEntrySchema>;

export type TilTag = typeof tilTags.$inferSelect;
export type InsertTilTag = z.infer<typeof insertTilTagSchema>;

export type GithubRepository = typeof githubRepositories.$inferSelect;
export type InsertGithubRepository = z.infer<typeof insertGithubRepositorySchema>;

// Extended types for frontend use
export type PostWithRelations = Post & {
  author: User;
  tags: Tag[];
  comments?: Comment[];
}

export type TilEntryWithRelations = TilEntry & {
  author: User;
  tags: Tag[];
}

export type GithubRepositoryWithLanguages = GithubRepository;
