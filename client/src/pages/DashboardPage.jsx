import { useMemo } from "react";
import PageHeader from "../components/molecules/PageHeader.jsx";
import StateMessage from "../components/atoms/StateMessage.jsx";
import ConsistencyHeatmap from "../components/organisms/ConsistencyHeatmap.jsx";
import DashboardSummary from "../components/organisms/DashboardSummary.jsx";
import WeightTrendChart from "../components/organisms/WeightTrendChart.jsx";
import { useDialed } from "../context/DialedContext.jsx";
import { calculateDashboardStats } from "../utils/checkins.js";

export default function DashboardPage() {
  const { checkins, loading, error } = useDialed();
  const stats = useMemo(() => calculateDashboardStats(checkins), [checkins]);

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
      <WeightTrendChart checkins={stats.ascending} />
    </section>
  );
}
