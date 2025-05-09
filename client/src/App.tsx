import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import BlogPost from "@/pages/BlogPost";
import AllPosts from "@/pages/AllPosts";
import About from "@/pages/About";
import TagsPage from "@/pages/TagsPage";
import TodayILearned from "@/pages/TodayILearned";
import Repositories from "@/pages/Repositories";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={AllPosts} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/tags" component={TagsPage} />
      <Route path="/tags/:slug" component={TagsPage} />
      <Route path="/til" component={TodayILearned} />
      <Route path="/til/:id" component={TodayILearned} />
      <Route path="/repositories" component={Repositories} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Navbar />
        <Toaster />
        <Router />
        <Footer />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
