import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Lightbulb, Rocket, Play, Users, BarChart3, Clock, Star, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const handleGetStarted = () => {
    setLocation("/auth");
  };

  const handleDemo = () => {
    // TODO: Implement demo functionality
    alert("Demo feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Drishti
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {["Features", "Pricing", "About"].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 relative"
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 bg-indigo-600"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={handleGetStarted}
                className="text-gray-600 hover:text-indigo-600"
              >
                Sign In
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <motion.div 
          className="absolute inset-0 overflow-hidden"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-8 bg-white/60 backdrop-blur-sm border-indigo-200 text-indigo-600">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse" />
                AI-Powered Startup Validation
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Validate Your{" "}
              <motion.span
                className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 100%" }}
              >
                Startup Ideas
              </motion.span>
              <br />
              Before You Build
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Get instant, AI-powered feedback on your startup concepts. Analyze market viability, 
              identify risks, and discover opportunities with our intelligent validation platform.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg px-8 py-4"
                onMouseEnter={() => setIsHovered("cta")}
                onMouseLeave={() => setIsHovered(null)}
              >
                <Rocket className={`mr-2 w-5 h-5 ${isHovered === "cta" ? "animate-bounce" : ""}`} />
                Start Validating Now
                <ArrowRight className={`ml-2 w-5 h-5 transform transition-transform duration-300 ${
                  isHovered === "cta" ? "translate-x-1" : ""
                }`} />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleDemo}
                className="text-lg px-8 py-4 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {[
                { icon: Users, value: "500+", label: "Ideas Validated", color: "text-indigo-600" },
                { icon: BarChart3, value: "95%", label: "Accuracy Rate", color: "text-violet-600" },
                { icon: Clock, value: "2 min", label: "Average Time", color: "text-cyan-600" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center group cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`text-3xl font-bold ${stat.color} mb-2 flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 mr-2" />
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Startup Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to validate, refine, and launch your startup idea with confidence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Lightbulb,
                title: "AI-Powered Analysis",
                description: "Get intelligent feedback on market viability, competition, and growth potential using advanced AI algorithms.",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: BarChart3,
                title: "Interactive Dashboard",
                description: "Track all your ideas in one place with beautiful visualizations and real-time progress indicators.",
                color: "from-green-400 to-blue-500"
              },
              {
                icon: Star,
                title: "Instant Scoring",
                description: "Receive immediate viability scores with detailed breakdowns and actionable recommendations.",
                color: "from-purple-400 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-gray-200">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Validate Your Next Big Idea?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of entrepreneurs who trust Drishti to validate their startup concepts.
            </p>
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-50 hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg px-8 py-4"
            >
              <Rocket className="mr-2 w-5 h-5" />
              Get Started Today
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
