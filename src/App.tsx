import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import ResumeServices from "./pages/ResumeServices";
import CareerProgram from "./pages/CareerProgram";
import About from "./pages/About";
import Industries from "./pages/Industries";
import StorySuccess from "./pages/StorySuccess";
// import SuccessStories from "./pages/SuccessStories";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import { HelmetProvider } from 'react-helmet-async';


const queryClient = new QueryClient();

const App = () => (
   <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/resume-services" element={<ResumeServices />} />
                <Route path="/career-program" element={<CareerProgram />} />
                <Route path="/about" element={<About />} />
                <Route path="/story-success" element={<StorySuccess />} />
                <Route path="/industries" element={<Industries />} />
                {/* <Route path="/success-stories" element={<SuccessStories />} /> */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
