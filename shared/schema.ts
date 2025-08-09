import { z } from "zod";

// User types for MongoDB
export interface User {
  _id?: string;
  id: string;
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Startup ideas for MongoDB
export interface Idea {
  _id?: string;
  id: string;
  userId: string;
  title: string;
  problem: string;
  solution: string;
  targetMarket: string;
  team: string;
  businessModel: string;
  competition: string;
  viabilityScore?: number;
  feedback?: string;
  status: "draft" | "completed" | "archived";
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Export schemas for validation
export const insertIdeaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  problem: z.string().min(10, "Problem description must be at least 10 characters"),
  solution: z.string().min(10, "Solution description must be at least 10 characters"),
  targetMarket: z.string().min(5, "Target market must be at least 5 characters"),
  team: z.string().min(5, "Team description must be at least 5 characters"),
  businessModel: z.string().min(10, "Business model must be at least 10 characters"),
  competition: z.string().min(10, "Competition analysis must be at least 10 characters"),
  status: z.enum(["draft", "completed", "archived"]).default("draft"),
  isBookmarked: z.boolean().default(false),
});

export const updateIdeaSchema = insertIdeaSchema.partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type InsertIdea = z.infer<typeof insertIdeaSchema>;
export type UpdateIdea = z.infer<typeof updateIdeaSchema>;
