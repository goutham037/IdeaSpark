import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Users, Calendar, Heart, Trash2, Edit } from "lucide-react";
import ScoreCircle from "./score-circle";
import type { Idea } from "@shared/schema";

interface IdeaCardProps {
  idea: Idea;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function IdeaCard({ idea, onDelete, isDeleting }: IdeaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(idea.isBookmarked);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "High Potential";
    if (score >= 60) return "Medium";
    return "Needs Work";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-700";
    if (score >= 60) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    // TODO: API call to update bookmark status
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this idea?")) {
      onDelete(idea.id);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/ideas/${idea.id}`}>
        <Card className="cursor-pointer overflow-hidden card-hover-effect group">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-1">
                  {idea.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {idea.problem}
                </p>
              </div>
              <div className="ml-4">
                <ScoreCircle score={idea.viabilityScore || 0} size="sm" />
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 text-indigo-500 mr-2" />
                <span className="line-clamp-1">{idea.targetMarket}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-violet-500 mr-2" />
                <span>Created {formatDate(idea.createdAt?.toString() || new Date().toString())}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <Badge className={getScoreBadgeColor(idea.viabilityScore || 0)}>
                  {getScoreLabel(idea.viabilityScore || 0)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {idea.status === 'completed' ? 'Analyzed' : 'Draft'}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-1">
                <motion.button
                  onClick={toggleBookmark}
                  className={`p-1 rounded-full transition-all duration-300 hover:bg-red-50 ${
                    isBookmarked ? "text-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <Heart className={`w-4 h-4 transition-all duration-300 ${isBookmarked ? "fill-current" : ""}`} />
                </motion.button>
                
                <motion.button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 disabled:opacity-50"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  animate={isDeleting ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isDeleting ? Infinity : 0 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
            
            {/* Hover overlay for actions */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              initial={false}
              animate={{ opacity: isHovered ? 0.1 : 0 }}
            />
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
