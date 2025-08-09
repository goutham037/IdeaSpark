import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, authRoutes, requireAuth } from "./auth";
import { insertIdeaSchema, updateIdeaSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup auth middleware
  setupAuth(app);
  
  // Register auth routes
  authRoutes(app);

  // Ideas routes
  app.post("/api/ideas", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const ideaData = insertIdeaSchema.parse(req.body);
      
      const idea = await storage.createIdea(userId, ideaData);
      res.status(201).json(idea);
    } catch (error: any) {
      console.error("Error creating idea:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid idea data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create idea" });
      }
    }
  });

  app.get("/api/ideas", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const ideas = await storage.getIdeas(userId);
      res.json(ideas);
    } catch (error) {
      console.error("Error fetching ideas:", error);
      res.status(500).json({ message: "Failed to fetch ideas" });
    }
  });

  app.get("/api/ideas/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const ideaId = req.params.id;
      
      const idea = await storage.getIdea(userId, ideaId);
      if (!idea) {
        return res.status(404).json({ message: "Idea not found" });
      }
      
      res.json(idea);
    } catch (error) {
      console.error("Error fetching idea:", error);
      res.status(500).json({ message: "Failed to fetch idea" });
    }
  });

  app.put("/api/ideas/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const ideaId = req.params.id;
      const updates = updateIdeaSchema.parse(req.body);
      
      const idea = await storage.updateIdea(userId, ideaId, updates);
      if (!idea) {
        return res.status(404).json({ message: "Idea not found" });
      }
      
      res.json(idea);
    } catch (error: any) {
      console.error("Error updating idea:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid update data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update idea" });
      }
    }
  });

  app.delete("/api/ideas/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const ideaId = req.params.id;
      
      const deleted = await storage.deleteIdea(userId, ideaId);
      if (!deleted) {
        return res.status(404).json({ message: "Idea not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting idea:", error);
      res.status(500).json({ message: "Failed to delete idea" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
