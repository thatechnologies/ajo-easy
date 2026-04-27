import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/BottomNav";
import { AuthProvider } from "@/hooks/useAuth";
import { RequireAuth } from "@/components/RequireAuth";
import Landing from "./pages/Landing.tsx";
import Index from "./pages/Index.tsx";
import Signup from "./pages/Signup.tsx";
import Auth from "./pages/Auth.tsx";
import Otp from "./pages/Otp.tsx";
import ProfileSetup from "./pages/ProfileSetup.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import CreateGroup from "./pages/CreateGroup.tsx";
import JoinGroup from "./pages/JoinGroup.tsx";
import GroupDetail from "./pages/GroupDetail.tsx";
import Pay from "./pages/Pay.tsx";
import Notifications from "./pages/Notifications.tsx";
import Groups from "./pages/Groups.tsx";
import Profile from "./pages/Profile.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/get-started" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/create-group" element={<RequireAuth><CreateGroup /></RequireAuth>} />
            <Route path="/join-group" element={<JoinGroup />} />
            <Route path="/group/:id" element={<GroupDetail />} />
            <Route path="/pay/:id" element={<RequireAuth><Pay /></RequireAuth>} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
