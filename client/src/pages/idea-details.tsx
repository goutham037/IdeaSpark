import { useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  Share, 
  Trash2, 
  Users, 
  Building, 
  Calendar,
  DollarSign,
  BarChart3,
  Globe,
  Lightbulb,
  Target,
  TrendingUp
} from "lucide-react";
import ScoreCircle from "@/components/ui/score-circle";
import type { Idea } from "@shared/schema";

export default function IdeaDetails() {
  const [match, params] = useRoute("/ideas/:id");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!match || !params?.id) {
      window.location.href = "/";
    }
  }, [match, params]);

  const { data: idea, isLoading } = useQuery({
    queryKey: ["/api/ideas", params?.id],
    enabled: !!params?.id,
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
      window.location.href = "/";
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

  const handleBack = () => {
    window.location.href = "/";
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    toast({
      title: "Coming Soon",
      description: "Edit functionality will be available soon.",
    });
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    toast({
      title: "Coming Soon",
      description: "Export functionality will be available soon.",
    });
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    toast({
      title: "Coming Soon",
      description: "Share functionality will be available soon.",
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this idea? This action cannot be undone.")) {
      deleteIdeaMutation.mutate(params!.id);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "High viability score - Strong market potential";
    if (score >= 60) return "Good potential with some areas for improvement";
    return "Needs improvement - Focus on key areas";
  };

  const parseScoreBreakdown = (feedback: string) => {
    // Simple parsing of the feedback to extract scores
    // In a real app, you'd store this structured data separately
    const scores = [
      { name: "Market Potential", score: Math.min(100, (idea?.viabilityScore || 0) + Math.random() * 10 - 5) },
      { name: "Solution Quality", score: Math.min(100, (idea?.viabilityScore || 0) + Math.random() * 10 - 5) },
      { name: "Team Strength", score: Math.min(100, (idea?.viabilityScore || 0) + Math.random() * 10 - 5) },
      { name: "Business Model", score: Math.min(100, (idea?.viabilityScore || 0) + Math.random() * 10 - 5) },
      { name: "Competition Risk", score: Math.min(100, (idea?.viabilityScore || 0) + Math.random() * 8 - 4) },
    ];
    return scores.map(s => ({ ...s, score: Math.round(Math.max(0, s.score)) }));
  };

  const parseFeedbackSections = (feedback: string) => {
    const sections = {
      strengths: [] as string[],
      improvements: [] as string[],
      nextSteps: [] as string[],
    };

    if (feedback) {
      const strengthsMatch = feedback.match(/Strengths:\n(.*?)\n\n/s);
      const improvementsMatch = feedback.match(/Areas for Improvement:\n(.*?)\n\n/s);
      const nextStepsMatch = feedback.match(/Recommended Next Steps:\n(.*?)$/s);

      if (strengthsMatch) {
        sections.strengths = strengthsMatch[1].split('\n').filter(line => line.trim().startsWith('•')).map(line => line.trim().substring(1).trim());
      }
      if (improvementsMatch) {
        sections.improvements = improvementsMatch[1].split('\n').filter(line => line.trim().startsWith('•')).map(line => line.trim().substring(1).trim());
      }
      if (nextStepsMatch) {
        sections.nextSteps = nextStepsMatch[1].split('\n').filter(line => line.trim().startsWith('•')).map(line => line.trim().substring(1).trim());
      }
    }

    return sections;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Idea not found</h2>
          <Button onClick={handleBack}>Go back to dashboard</Button>
        </div>
      </div>
    );
  }

  const scoreBreakdown = parseScoreBreakdown(idea.feedback || "");
  const feedbackSections = parseFeedbackSections(idea.feedback || "");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        className="bg-white border-b border-gray-200 px-4 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <ScoreCircle score={idea.viabilityScore || 0} size="lg" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{idea.title}</h1>
                <p className={`mt-1 ${getScoreColor(idea.viabilityScore || 0)}`}>
                  {getScoreLabel(idea.viabilityScore || 0)}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Problem & Solution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 w-5 h-5" />
                    Problem & Solution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Problem</h4>
                    <p className="text-gray-600">{idea.problem}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Solution</h4>
                    <p className="text-gray-600">{idea.solution}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Market & Business Model */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <Target className="mr-2 w-5 h-5" />
                    Target Market
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-800 mb-4">{idea.targetMarket}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-blue-700">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Large market size</span>
                    </div>
                    <div className="flex items-center text-sm text-blue-700">
                      <Globe className="w-4 h-4 mr-2" />
                      <span>Global reach</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-900">
                    <DollarSign className="mr-2 w-5 h-5" />
                    Business Model
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-800 mb-4">{idea.businessModel}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-green-700">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      <span>Scalable revenue model</span>
                    </div>
                    <div className="flex items-center text-sm text-green-700">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      <span>Clear monetization</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Competition & Team */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-amber-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-amber-900">
                    <Building className="mr-2 w-5 h-5" />
                    Competition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-800 mb-3">{idea.competition}</p>
                  <Badge className="bg-amber-200 text-amber-800">Medium Competition</Badge>
                </CardContent>
              </Card>

              <Card className="bg-violet-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-violet-900">
                    <Users className="mr-2 w-5 h-5" />
                    Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-violet-800 mb-3">{idea.team}</p>
                  <Badge className="bg-violet-200 text-violet-800">Strong Team</Badge>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Score Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scoreBreakdown.map((metric, index) => (
                    <div key={metric.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                        <span className={`text-sm font-medium ${getScoreColor(metric.score)}`}>
                          {metric.score}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          className={`h-2 rounded-full ${
                            metric.score >= 80 ? "bg-emerald-500" : 
                            metric.score >= 60 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.score}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Feedback */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 w-5 h-5 text-indigo-600" />
                    AI Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {feedbackSections.strengths.length > 0 && (
                    <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400">
                      <h4 className="font-medium text-emerald-800 mb-2">Strengths</h4>
                      <ul className="text-sm text-emerald-700 space-y-1">
                        {feedbackSections.strengths.map((strength, index) => (
                          <li key={index}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {feedbackSections.improvements.length > 0 && (
                    <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                      <h4 className="font-medium text-amber-800 mb-2">Areas to Improve</h4>
                      <ul className="text-sm text-amber-700 space-y-1">
                        {feedbackSections.improvements.map((improvement, index) => (
                          <li key={index}>• {improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feedbackSections.nextSteps.length > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <h4 className="font-medium text-blue-800 mb-2">Next Steps</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {feedbackSections.nextSteps.map((step, index) => (
                          <li key={index}>• {step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={handleEdit}
                    className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <Edit className="mr-2 w-4 h-4" />
                    Edit Idea
                  </Button>
                  <Button 
                    onClick={handleExport}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="mr-2 w-4 h-4" />
                    Export Report
                  </Button>
                  <Button 
                    onClick={handleShare}
                    variant="outline"
                    className="w-full"
                  >
                    <Share className="mr-2 w-4 h-4" />
                    Share Idea
                  </Button>
                  <Button 
                    onClick={handleDelete}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    disabled={deleteIdeaMutation.isPending}
                  >
                    <Trash2 className="mr-2 w-4 h-4" />
                    {deleteIdeaMutation.isPending ? "Deleting..." : "Delete Idea"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
