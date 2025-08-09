import {
  type User,
  type InsertUser,
  type Idea,
  type InsertIdea,
  type UpdateIdea,
} from "@shared/schema";
import { getDb } from "./db";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;

  // Idea operations
  createIdea(userId: string, idea: InsertIdea): Promise<Idea>;
  getIdeas(userId: string): Promise<Idea[]>;
  getIdea(userId: string, ideaId: string): Promise<Idea | undefined>;
  updateIdea(userId: string, ideaId: string, updates: UpdateIdea): Promise<Idea | undefined>;
  deleteIdea(userId: string, ideaId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async createUser(userData: InsertUser): Promise<User> {
    const db = await getDb();
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = {
      id: uuidv4(),
      username: userData.username,
      password: hashedPassword,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(user);
    return { ...user, _id: result.insertedId.toString() } as User;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const db = await getDb();
    const user = await db.collection('users').findOne({ username });
    return user as User | null;
  }

  async getUserById(id: string): Promise<User | null> {
    const db = await getDb();
    const user = await db.collection('users').findOne({ id });
    return user as User | null;
  }

  // Idea operations
  async createIdea(userId: string, ideaData: InsertIdea): Promise<Idea> {
    const db = await getDb();
    
    // Calculate viability score and generate feedback
    const { viabilityScore, feedback } = this.calculateViabilityScore(ideaData);
    
    const idea = {
      id: uuidv4(),
      userId,
      ...ideaData,
      viabilityScore,
      feedback,
      status: "completed" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('ideas').insertOne(idea);
    return { ...idea, _id: result.insertedId.toString() } as Idea;
  }

  async getIdeas(userId: string): Promise<Idea[]> {
    const db = await getDb();
    const ideas = await db.collection('ideas')
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();
    return ideas.map(idea => ({ ...idea, _id: idea._id?.toString() })) as Idea[];
  }

  async getIdea(userId: string, ideaId: string): Promise<Idea | undefined> {
    const db = await getDb();
    const idea = await db.collection('ideas').findOne({ id: ideaId, userId });
    if (!idea) return undefined;
    return { ...idea, _id: idea._id?.toString() } as Idea;
  }

  async updateIdea(userId: string, ideaId: string, updates: UpdateIdea): Promise<Idea | undefined> {
    const db = await getDb();
    
    // Recalculate score if content changed
    let scoreUpdates = {};
    if (updates.problem || updates.solution || updates.targetMarket || updates.businessModel || updates.competition || updates.team) {
      const existingIdea = await this.getIdea(userId, ideaId);
      if (existingIdea) {
        const updatedData = { ...existingIdea, ...updates };
        const { viabilityScore, feedback } = this.calculateViabilityScore(updatedData);
        scoreUpdates = { viabilityScore, feedback };
      }
    }

    const updateData = {
      ...updates,
      ...scoreUpdates,
      updatedAt: new Date(),
    };

    await db.collection('ideas').updateOne(
      { id: ideaId, userId },
      { $set: updateData }
    );

    return await this.getIdea(userId, ideaId);
  }

  async deleteIdea(userId: string, ideaId: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.collection('ideas').deleteOne({ id: ideaId, userId });
    return result.deletedCount > 0;
  }

  private calculateViabilityScore(idea: Partial<Idea>): { viabilityScore: number; feedback: string } {
    let score = 0;
    const feedback: string[] = [];
    const strengths: string[] = [];
    const improvements: string[] = [];

    // Problem analysis (20 points)
    if (idea.problem) {
      const problemScore = Math.min(20, Math.floor(idea.problem.length / 10) + 5);
      score += problemScore;
      if (problemScore >= 15) {
        strengths.push("Well-defined problem statement");
      } else {
        improvements.push("Provide more detailed problem description");
      }
    }

    // Solution analysis (25 points)
    if (idea.solution) {
      const solutionScore = Math.min(25, Math.floor(idea.solution.length / 8) + 5);
      score += solutionScore;
      if (solutionScore >= 20) {
        strengths.push("Comprehensive solution approach");
      } else {
        improvements.push("Elaborate on your solution's unique features");
      }
    }

    // Market analysis (20 points)
    if (idea.targetMarket) {
      const marketScore = Math.min(20, Math.floor(idea.targetMarket.length / 6) + 5);
      score += marketScore;
      if (marketScore >= 15) {
        strengths.push("Clear target market definition");
      } else {
        improvements.push("Define your target market more specifically");
      }
    }

    // Business model analysis (15 points)
    if (idea.businessModel) {
      const businessScore = Math.min(15, Math.floor(idea.businessModel.length / 8) + 3);
      score += businessScore;
      if (businessScore >= 12) {
        strengths.push("Solid monetization strategy");
      } else {
        improvements.push("Strengthen your revenue model");
      }
    }

    // Competition analysis (10 points)
    if (idea.competition) {
      const competitionScore = Math.min(10, Math.floor(idea.competition.length / 10) + 2);
      score += competitionScore;
      if (competitionScore >= 8) {
        strengths.push("Thorough competitive analysis");
      } else {
        improvements.push("Research competitors more thoroughly");
      }
    }

    // Team analysis (10 points)
    if (idea.team) {
      const teamScore = Math.min(10, Math.floor(idea.team.length / 8) + 2);
      score += teamScore;
      if (teamScore >= 8) {
        strengths.push("Strong team composition");
      } else {
        improvements.push("Highlight relevant team experience");
      }
    }

    // Generate feedback
    let scoreCategory: string;
    let nextSteps: string[];

    if (score >= 80) {
      scoreCategory = "Excellent viability with high market potential";
      nextSteps = [
        "Create detailed MVP roadmap",
        "Conduct user interviews",
        "Develop go-to-market strategy",
        "Seek initial funding"
      ];
    } else if (score >= 60) {
      scoreCategory = "Good potential with some areas for improvement";
      nextSteps = [
        "Validate assumptions with target users",
        "Refine value proposition",
        "Build prototype",
        "Test market demand"
      ];
    } else if (score >= 40) {
      scoreCategory = "Moderate potential, needs significant development";
      nextSteps = [
        "Conduct market research",
        "Clarify unique selling proposition",
        "Validate problem-solution fit",
        "Strengthen business model"
      ];
    } else {
      scoreCategory = "Low viability, major improvements needed";
      nextSteps = [
        "Redefine core problem",
        "Research market thoroughly",
        "Develop unique solution approach",
        "Consider pivot opportunities"
      ];
    }

    const feedbackText = `Score: ${score}/100 - ${scoreCategory}

Strengths:
${strengths.map(s => `• ${s}`).join('\n')}

Areas for Improvement:
${improvements.map(i => `• ${i}`).join('\n')}

Recommended Next Steps:
${nextSteps.map(s => `• ${s}`).join('\n')}`;

    return { viabilityScore: score, feedback: feedbackText };
  }
}

export const storage = new DatabaseStorage();
