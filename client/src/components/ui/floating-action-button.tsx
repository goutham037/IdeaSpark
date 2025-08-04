import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Lightbulb, TrendingUp, Target } from "lucide-react";

interface FloatingActionButtonProps {
  onNewIdea: () => void;
}

export default function FloatingActionButton({ onNewIdea }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const quickActions = [
    {
      icon: Lightbulb,
      label: "New Idea",
      color: "bg-gradient-to-r from-yellow-500 to-orange-500",
      action: onNewIdea,
    },
    {
      icon: TrendingUp,
      label: "Analytics",
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      action: () => console.log("Analytics"),
    },
    {
      icon: Target,
      label: "Goals",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      action: () => console.log("Goals"),
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={action.action}
                  className={`${action.color} hover:shadow-lg transform hover:scale-110 transition-all duration-300 rounded-full w-12 h-12 p-0`}
                  title={action.label}
                >
                  <action.icon className="w-5 h-5 text-white" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={toggleOpen}
          className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-2xl rounded-full w-16 h-16 p-0 animate-pulse-glow"
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </motion.div>
    </div>
  );
}