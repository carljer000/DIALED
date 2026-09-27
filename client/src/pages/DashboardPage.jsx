import { useMemo } from "react";
import PageHeader from "../components/molecules/PageHeader.jsx";
import StateMessage from "../components/atoms/StateMessage.jsx";
import ConsistencyHeatmap from "../components/organisms/ConsistencyHeatmap.jsx";
import DashboardSummary from "../components/organisms/DashboardSummary.jsx";
import WeightTrendChart from "../components/organisms/WeightTrendChart.jsx";
import ProgressInsights from "../components/organisms/ProgressInsights.jsx";
import GoalProgress from "../components/organisms/GoalProgress.jsx";
import WeeklyReflection from "../components/organisms/WeeklyReflection.jsx";
import { useDialed } from "../context/DialedContext.jsx";
import {
  calculateDashboardInsights,
  calculateDashboardStats,
  calculateGoalProgress,
  calculateWeeklyReflection,
} from "../utils/checkins.js";

export default function DashboardPage() {
  const { checkins, loading, error, preferences } = useDialed();
  const stats = useMemo(() => calculateDashboardStats(checkins), [checkins]);
  const insights = useMemo(
    () => calculateDashboardInsights(checkins, preferences.stepGoal),
    [checkins, preferences.stepGoal],
  );
  const goalProgress = useMemo(
    () => calculateGoalProgress(checkins, preferences),
    [checkins, preferences],
  );
  const weeklyReflection = useMemo(
    () => calculateWeeklyReflection(checkins, preferences.stepGoal),
    [checkins, preferences.stepGoal],
  );

  if (loading) {
    return <section className="page"><StateMessage kind="loading">Loading your momentum…</StateMessage></section>;
  }

  return (
    <section className="page">
      <PageHeader
        eyebrow="THE BIG PICTURE"
        title="Proof over"
        accent="mood."
        subtitle="Your cut is built one ordinary day at a time."
      />
      {error && <StateMessage kind="error">{error}</StateMessage>}
      <DashboardSummary streak={stats.streak} onTarget={stats.onTarget} />
      <ConsistencyHeatmap checkins={checkins} />
      <GoalProgress progress={goalProgress} />
      <WeightTrendChart checkins={stats.ascending} unit={preferences.weightUnit} />
      <ProgressInsights insights={insights} />
      <WeeklyReflection summary={weeklyReflection} />
    </section>
  );
}
