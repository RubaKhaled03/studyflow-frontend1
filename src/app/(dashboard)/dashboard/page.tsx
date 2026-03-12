import { WelcomeSection } from "@/components/dashboard/welcome-section";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { FocusModeCard } from "@/components/dashboard/focus-mode-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { SelfLearningProgress } from "@/components/dashboard/self-learning-progress";
import { HighPriorityTasks } from "@/components/dashboard/high-priority-tasks";
import { AcademicProgress } from "@/components/dashboard/academic-progress";
export default function Dashboard() {
  return (
    <div className="space-y-6 pb-8">
      <WelcomeSection />
      {/* Top Row: Quick Stats */}
      <QuickStats />
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          <HighPriorityTasks />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AcademicProgress />
            <SelfLearningProgress />
          </div>
        </div>

        {/* Right Column (1/3 width on large screens) */}
        <div className="space-y-6">
          <FocusModeCard />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
