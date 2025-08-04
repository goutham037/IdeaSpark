import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Startup ideas table
export const ideas = pgTable("ideas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  problem: text("problem").notNull(),
  solution: text("solution").notNull(),
  targetMarket: text("target_market").notNull(),
  team: text("team").notNull(),
  businessModel: text("business_model").notNull(),
  competition: text("competition").notNull(),
  viabilityScore: integer("viability_score"),
  feedback: text("feedback"),
  status: varchar("status", { enum: ["draft", "completed", "archived"] }).default("draft"),
  isBookmarked: boolean("is_bookmarked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export schemas for validation
export const insertIdeaSchema = createInsertSchema(ideas).omit({
  id: true,
  userId: true,
  viabilityScore: true,
  feedback: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  problem: z.string().min(10, "Problem description must be at least 10 characters"),
  solution: z.string().min(10, "Solution description must be at least 10 characters"),
  targetMarket: z.string().min(5, "Target market must be at least 5 characters"),
  team: z.string().min(5, "Team description must be at least 5 characters"),
  businessModel: z.string().min(10, "Business model must be at least 10 characters"),
  competition: z.string().min(10, "Competition analysis must be at least 10 characters"),
});

export const updateIdeaSchema = insertIdeaSchema.partial();

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertIdea = z.infer<typeof insertIdeaSchema>;
export type UpdateIdea = z.infer<typeof updateIdeaSchema>;
export type Idea = typeof ideas.$inferSelect;
