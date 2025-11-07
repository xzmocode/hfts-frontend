// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import {
  getSimulations,
  getAnalytics,
  createSimulation,
  getTrend,
  clearTrend,
  getInteractions,
} from "../api/api";
import GenerateForm from "../components/GenerateForm";
import EmailViewer from "../components/EmailViewer";
import toast, { Toaster } from "react-hot-toast";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#3f51b5", "#f50057", "#ff9800", "#4caf50"];

export default function Dashboard() {
  const [simulations, setSimulations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [trend, setTrend] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [selectedSim, setSelectedSim] = useState(null);

  const fetchData = async () => {
    try {
      const [simRes, analyticsRes, trendRes, interactionsRes] = await Promise.all([
        getSimulations(),
        getAnalytics(),
        getTrend(),
        getInteractions(),
      ]);
      setSimulations(simRes.data);
      setAnalytics(analyticsRes.data);
      setTrend(trendRes.data || []);
      setInteractions(interactionsRes.data || []);
    } catch (e) {
      console.error(e);
      toast.error("Backend unreachable");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async (data) => {
    try {
      const res = await createSimulation(data);
      toast.success("Simulation created!");
      setSimulations((prev) => [...prev, res.data]);
      fetchData();
    } catch (e) {
      console.error(e);
      toast.error("Failed to create simulation");
    }
  };

  const handleClearTrend = async () => {
    try {
      await clearTrend();
      setTrend([]);
      toast.success("Trend cleared");
    } catch {
      toast.error("Failed to clear trend");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Toaster position="top-right" />
      <Typography variant="h4" gutterBottom>
        Human Factor Threat Simulator Dashboard
      </Typography>

      <GenerateForm onGenerate={handleGenerate} />

      <Typography variant="h6" sx={{ mt: 4 }}>
        Analytics Summary
      </Typography>
      {analytics && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography>
              Simulations: {analytics.totals.simulations} | Interactions:{" "}
              {analytics.totals.interactions} | Risk Score: {analytics.riskScore}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Risk Trend
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleClearTrend}
              >
                Clear Trend History
              </Button>
              <LineChart width={400} height={250} data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(t) => new Date(t).toLocaleTimeString()}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="riskScore" stroke="#8884d8" dot />
              </LineChart>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🧩 Interactions by Type
              </Typography>
              {analytics?.byAction && (
                <PieChart width={400} height={250}>
                  <Pie
                    data={Object.entries(analytics.byAction).map(([name, value]) => ({
                      name,
                      value,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {Object.keys(analytics.byAction).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6">Recent Simulations</Typography>
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
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6">⚡ Live Activity Feed</Typography>
          <Card sx={{ maxHeight: 400, overflowY: "auto" }}>
            <List dense>
              {interactions.slice(-10).reverse().map((i) => (
                <React.Fragment key={i.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${i.action.toUpperCase()} — ${
                        Math.round(i.latencyMs / 1000)
                      }s latency`}
                      secondary={new Date(i.createdAt).toLocaleString()}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>

      <EmailViewer
        open={!!selectedSim}
        onClose={() => setSelectedSim(null)}
        simulation={selectedSim}
        onActionComplete={() => {
          fetchData();
          toast.success("Interaction recorded");
        }}
      />
    </Container>
  );
}
