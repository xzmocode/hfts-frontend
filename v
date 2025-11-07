// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { getSimulations, getAnalytics, createSimulation } from "../api/api";
import GenerateForm from "../components/GenerateForm";
import EmailViewer from "../components/EmailViewer";
import toast, { Toaster } from "react-hot-toast";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";

export default function Dashboard() {
  const [simulations, setSimulations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedSim, setSelectedSim] = useState(null);

  const fetchData = async () => {
    try {
      const [simRes, analyticsRes] = await Promise.all([
        getSimulations(),
        getAnalytics(),
      ]);
      setSimulations(simRes.data);
      setAnalytics(analyticsRes.data);
    } catch (e) {
      console.error(e);
      toast.error("Backend unreachable");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async (data) => {
    try {
      const res = await createSimulation(data);
      toast.success("Simulation created!");
      // append new sim so UI updates instantly
      setSimulations((prev) => [...prev, res.data]);
      // refresh analytics too
      const analyticsRes = await getAnalytics();
      setAnalytics(analyticsRes.data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to create simulation");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Toaster position="top-right" />
      <Typography variant="h4" gutterBottom>
        Human Factor Threat Simulator
      </Typography>

      <GenerateForm onGenerate={handleGenerate} />

      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
        Recent Simulations
      </Typography>

      <Grid container spacing={2}>
        {simulations.map((sim) => (
          <Grid item xs={12} md={6} lg={4} key={sim.id}>
            <Card onClick={() => setSelectedSim(sim)} sx={{ cursor: "pointer" }}>
              <CardContent>
                <Typography variant="subtitle1">{sim.subject}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {sim.target?.name} ({sim.target?.role}) — {sim.attackType}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
        Analytics Summary
      </Typography>
      {analytics && (
        <div style={{ lineHeight: 1.8 }}>
          <div>Simulations: {analytics.totals.simulations}</div>
          <div>Interactions: {analytics.totals.interactions}</div>
          <div>Risk Score: {analytics.riskScore}</div>
        </div>
      )}

      <EmailViewer
        open={!!selectedSim}
        onClose={() => setSelectedSim(null)}
        simulation={selectedSim}
        onActionComplete={() => {
          // after clicked/reported, refresh both panels
          fetchData();
          toast.success("Interaction recorded");
        }}
      />
    </Container>
  );
}
