"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

const STORAGE_KEY = "clicker-game-state";

export default function ClickerGame() {
  const [score, setScore] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [clickUpgradeCost, setClickUpgradeCost] = useState(10);
  const [autoUpgradeCost, setAutoUpgradeCost] = useState(50);

  // Load state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setScore(parsed.score ?? 0);
      setClickPower(parsed.clickPower ?? 1);
      setAutoClickers(parsed.autoClickers ?? 0);
      setClickUpgradeCost(parsed.clickUpgradeCost ?? 10);
      setAutoUpgradeCost(parsed.autoUpgradeCost ?? 50);
    }
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        score,
        clickPower,
        autoClickers,
        clickUpgradeCost,
        autoUpgradeCost,
      })
    );
  }, [score, clickPower, autoClickers, clickUpgradeCost, autoUpgradeCost]);

  // Auto clickers effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScore((s) => s + autoClickers);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoClickers]);

  const handleClick = () => setScore((s) => s + clickPower);

  const buyClickUpgrade = () => {
    if (score >= clickUpgradeCost) {
      setScore((s) => s - clickUpgradeCost);
      setClickPower((p) => p + 1);
      setClickUpgradeCost((c) => Math.floor(c * 1.5));
    }
  };

  const buyAutoUpgrade = () => {
    if (score >= autoUpgradeCost) {
      setScore((s) => s - autoUpgradeCost);
      setAutoClickers((a) => a + 1);
      setAutoUpgradeCost((c) => Math.floor(c * 1.5));
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h2 className="text-xl font-semibold">Clicker Game</h2>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="text-4xl font-bold">{score}</div>
        <Button onClick={handleClick} className="w-full">
          Click (+{clickPower})
        </Button>
        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={buyClickUpgrade}
            disabled={score < clickUpgradeCost}
            variant="outline"
            className="w-full"
          >
            Upgrade Click (+1) – {clickUpgradeCost} pts
          </Button>
          <Button
            onClick={buyAutoUpgrade}
            disabled={score < autoUpgradeCost}
            variant="outline"
            className="w-full"
          >
            Auto Clicker (+1/sec) – {autoUpgradeCost} pts
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Auto Clickers: {autoClickers}
      </CardFooter>
    </Card>
  );
}
