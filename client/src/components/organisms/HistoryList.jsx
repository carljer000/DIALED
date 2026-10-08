import { useState } from "react";
import CheckInCard from "../molecules/CheckInCard.jsx";
import StateMessage from "../atoms/StateMessage.jsx";

export default function HistoryList({ checkins, onDelete, weightUnit }) {
  const [deletingId, setDeletingId] = useState("");
  const [deleteError, setDeleteError] = useState("");

  async function remove(id) {
    setDeletingId(id);
    setDeleteError("");
    try {
      await onDelete(id);
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      setDeletingId("");
    }
  }

  if (!checkins.length) {
    return <StateMessage kind="empty">No check-ins yet. Your first log starts the story.</StateMessage>;
  }

  return (
    <>
      {deleteError && <StateMessage kind="error">{deleteError}</StateMessage>}
      <div className="history-list">
        {checkins.map((checkin) => (
          <CheckInCard
            key={checkin.id}
            checkin={checkin}
            deleting={deletingId === checkin.id}
            onDelete={remove}
            weightUnit={weightUnit}
          />
        ))}
      </div>
    </>
  );
}
