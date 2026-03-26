import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';
import { Empty } from "@/components/Empty";
import AssetProduction from "@/pages/AssetProduction";
import ProjectOverview from "@/pages/ProjectOverview";
import EpisodesList from "@/pages/EpisodesList";
import ScenesList from "@/pages/ScenesList";
import AssetsList from "@/pages/AssetsList";
import ShotsList from "@/pages/ShotsList";
import TasksList from "@/pages/TasksList";
import StoryboardProduction from "@/pages/StoryboardProduction";
import VideoProduction from "@/pages/VideoProduction";
import ReviewTask from "@/pages/ReviewTask";
import CompletedTasks from "@/pages/CompletedTasks";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:projectId/overview" element={<ProjectOverview />} />
          <Route path="/project/:projectId/episodes" element={<EpisodesList />} />
          <Route path="/project/:projectId/scenes" element={<ScenesList />} />
          <Route path="/project/:projectId/assets" element={<AssetsList />} />
          <Route path="/project/:projectId/shots" element={<ShotsList />} />
          <Route path="/project/:projectId/tasks" element={<TasksList />} />
        <Route path="/project/:projectId/production/assets" element={<AssetProduction />} />
        <Route path="/project/:projectId/production/storyboards" element={<StoryboardProduction />} />
        <Route path="/project/:projectId/production/videos" element={<VideoProduction />} />
        <Route path="/project/:projectId/production/reviews" element={<ReviewTask />} />
        <Route path="/project/:projectId/production/completed" element={<CompletedTasks />} />
      </Routes>
    </AuthContext.Provider>
  );
}
