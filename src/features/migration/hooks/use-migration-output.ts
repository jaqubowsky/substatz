"use client";

import { useState } from "react";

export function useMigrationOutput() {
  const [statusOutput, setStatusOutput] = useState<string>("");
  const [showOutput, setShowOutput] = useState(false);

  function showMigrationOutput(output: string) {
    setStatusOutput(output);
    setShowOutput(true);
  }

  function hideMigrationOutput() {
    setShowOutput(false);
  }

  return {
    statusOutput,
    showOutput,
    showMigrationOutput,
    hideMigrationOutput,
  };
}
