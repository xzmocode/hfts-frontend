// src/components/EmailViewer.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, Button, Typography } from "@mui/material";
import { recordInteraction } from "../api/api";

export default function EmailViewer({ open, onClose, simulation, onActionComplete }) {
  if (!simulation) return null;

  const handleAction = async (action) => {
    try {
      await recordInteraction({
        simulationId: simulation.id,
        action,
        latencyMs: Math.floor(Math.random() * 5000),
      });
      // let the parent refresh data immediately
      if (typeof onActionComplete === "function") onActionComplete(action);
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{simulation.subject}</DialogTitle>
      <DialogContent dividers>
        <Typography component="div" dangerouslySetInnerHTML={{ __html: simulation.bodyHtml }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <Button variant="contained" color="error" onClick={() => handleAction("clicked")}>
            Clicked Link
          </Button>
          <Button variant="contained" color="success" onClick={() => handleAction("reported")}>
            Reported Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
