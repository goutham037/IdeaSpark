import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Lightbulb, 
  TrendingUp, 
  Star, 
  Clock, 
  Users,
  LogOut,
  BarChart3
} from "lucide-react";
import IdeaCard from "@/components/ui/idea-card";
import Navigation from "@/components/ui/navigation";
import type { Idea } from "@shared/schema";

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const { data: ideas = [], isLoading } = useQuery({
    queryKey: ["/api/ideas"],
    retry: false,
  });

  const deleteIdeaMutation = useMutation({
    mutationFn: async (ideaId: string) => {
      await apiRequest("DELETE", `/api/ideas/${ideaId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ideas"] });
      toast({
        title: "Success",
        description: "Idea deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete idea",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const filteredIdeas = ideas.filter((idea: Idea) => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.problem.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterCategory === "all" || 
                         (filterCategory === "high" && idea.viabilityScore >= 80) ||
                         (filterCategory === "medium" && idea.viabilityScore >= 60 && idea.viabilityScore < 80) ||
                         (filterCategory === "low" && idea.viabilityScore < 60) ||
                         (filterCategory === "draft" && idea.status === "draft");
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: ideas.length,
    avgScore: ideas.length > 0 ? Math.round(ideas.reduce((sum: number, idea: Idea) => sum + (idea.viabilityScore || 0), 0) / ideas.length) : 0,
    highPotential: ideas.filter((idea: Idea) => idea.viabilityScore >= 80).length,
    inProgress: ideas.filter((idea: Idea) => idea.status === "draft").length,
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onLogout={handleLogout} />

      {/* Dashboard Header */}
      <motion.div 
        className="bg-white border-b border-gray-200 px-4 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Ideas Dashboard</h1>
            <p className="text-gray-600 mt-1">Track, analyze, and improve your startup concepts</p>
          </div>
          <Link href="/ideas/new">
            <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              <Plus className="mr-2 w-4 h-4" />
              New Idea
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {[
            {
              title: "Total Ideas",
              value: stats.total,
              icon: Lightbulb,
              color: "bg-indigo-100 text-indigo-600",
              change: "+23%",
              changeColor: "text-emerald-600"
            },
            {
              title: "Avg Score",
              value: stats.avgScore,
              icon: BarChart3,
              color: "bg-emerald-100 text-emerald-600",
              progress: stats.avgScore,
              changeColor: "text-emerald-600"
            },
            {
              title: "High Potential",
              value: stats.highPotential,
              icon: Star,
              color: "bg-violet-100 text-violet-600",
              subtitle: "Score 80+",
              changeColor: "text-violet-600"
            },
            {
              title: "In Progress",
              value: stats.inProgress,
              icon: Clock,
              color: "bg-amber-100 text-amber-600",
              subtitle: "Needs review",
              changeColor: "text-amber-600"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4">
                    {stat.progress !== undefined && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          className="bg-emerald-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    )}
                    {stat.change && (
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${stat.changeColor}`}>{stat.change}</span>
                        <span className="text-gray-500 text-sm ml-2">vs last month</span>
                      </div>
                    )}
                    {stat.subtitle && (
                      <span className={`text-sm font-medium ${stat.changeColor}`}>{stat.subtitle}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search your ideas..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="high">High Potential (80+)</SelectItem>
                      <SelectItem value="medium">Medium Potential (60-79)</SelectItem>
                      <SelectItem value="low">Needs Work (&lt;60)</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ideas Grid */}
        <AnimatePresence>
          {filteredIdeas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {ideas.length === 0 ? "No ideas yet" : "No matching ideas"}
              </h3>
              <p className="text-gray-600 mb-8">
                {ideas.length === 0 
                  ? "Create your first startup idea to get started with validation"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {ideas.length === 0 && (
                <Link href="/ideas/new">
                  <Button className="bg-gradient-to-r from-indigo-500 to-violet-500">
                    <Plus className="mr-2 w-4 h-4" />
                    Create Your First Idea
                  </Button>
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {filteredIdeas.map((idea: Idea, index: number) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <IdeaCard 
                    idea={idea} 
                    onDelete={(id) => deleteIdeaMutation.mutate(id)}
                    isDeleting={deleteIdeaMutation.isPending}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
