// src/components/GenerateForm.jsx
import React, { useState } from "react";
import { Box, TextField, Button, MenuItem } from "@mui/material";
import { createSimulation } from "../api/api";

const roles = ["finance", "hr", "it", "general"];
const types = [
  { value: "invoice", label: "Invoice (Finance)" },
  { value: "account_verify", label: "Account Verification (IT)" },
  { value: "hr_policy", label: "HR Policy Update" },
  { value: "delivery", label: "Delivery/Package Notification" },
];

export default function GenerateForm({ onCreated }) {
  const [name, setName] = useState("Alex");
  const [role, setRole] = useState("finance");
  const [attackType, setAttackType] = useState("invoice");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createSimulation({
        targetName: name,
        targetRole: role,
        attackType,
      });
      onCreated?.(res.data); // refresh parent data
    } catch (err) {
      console.error(err);
      alert("Failed to create simulation. Check backend logs or console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}
    >
      <TextField
        label="Target Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        size="small"
      />
      <TextField
        select
        label="Target Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        size="small"
        sx={{ minWidth: 160 }}
      >
        {roles.map((r) => (
          <MenuItem key={r} value={r}>
            {r}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Attack Type"
        value={attackType}
        onChange={(e) => setAttackType(e.target.value)}
        size="small"
        sx={{ minWidth: 220 }}
      >
        {types.map((t) => (
          <MenuItem key={t.value} value={t.value}>
            {t.label}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? "Generating..." : "Generate Simulation"}
      </Button>
    </Box>
  );
}
