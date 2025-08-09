import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import AuthPage from "@/pages/auth";
import Home from "@/pages/home";
import IdeaForm from "@/pages/idea-form";
import IdeaDetails from "@/pages/idea-details";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/auth" component={AuthPage} />
          <Route component={() => <Navigate to="/" />} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/ideas/new" component={IdeaForm} />
          <Route path="/ideas/:id" component={IdeaDetails} />
          <Route path="/auth" component={() => <Navigate to="/" />} />
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

function Navigate({ to }: { to: string }) {
  const [, setLocation] = useLocation();
  setLocation(to);
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
