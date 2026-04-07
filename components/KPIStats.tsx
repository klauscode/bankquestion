import { CheckCircle2, Target, Trophy } from "lucide-react";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils";

interface KPIStatsProps {
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
}

const items = [
  { key: "answered", label: "Questoes respondidas", icon: Target },
  { key: "correct", label: "Acertos", icon: CheckCircle2 },
  { key: "accuracy", label: "Precisao geral", icon: Trophy },
] as const;

export function KPIStats({ totalAnswered, totalCorrect, accuracy }: KPIStatsProps) {
  const values = {
    answered: totalAnswered.toString(),
    correct: totalCorrect.toString(),
    accuracy: formatPercent(accuracy),
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.key}
            className="border-cyan-400/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(180deg,_rgba(11,18,32,0.98)_0%,_rgba(17,26,43,0.96)_100%)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>{item.label}</CardDescription>
                <CardTitle className="mt-2 text-3xl">{values[item.key]}</CardTitle>
              </div>
              <div className="rounded-2xl bg-linear-to-br from-cyan-400 to-blue-500 p-3 text-slate-950 shadow-[0_10px_28px_rgba(34,211,238,0.22)]">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
