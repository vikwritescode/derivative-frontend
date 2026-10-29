import type { DebateRecord } from "@/interfaces";
import { Card, CardContent, CardTitle } from "../ui/card";
import { mean, std } from "mathjs";
import { useEffect, useState } from "react";

interface AverageStdevCardProps {
  debateData: Array<DebateRecord>;
}
const AverageStdevCard = ({ debateData }: AverageStdevCardProps) => {
  const [averageStandardDeviation, setAverageStandardDeviation] =
    useState<number>(0);
  useEffect(() => {
    const speaksByTournament = debateData.reduce<Record<string, number[]>>(
      (tournaments, debate) => {
        const tournamentSpeaks = tournaments[debate.tournament_id] ?? [];
        tournamentSpeaks.push(debate.speaks);
        tournaments[debate.tournament_id] = tournamentSpeaks;
        return tournaments;
      },
      {},
    );

    const tournamentStandardDeviations = Object.values(
      speaksByTournament,
    ).map((speaks) => {
      if (speaks.length < 2) {
        return 0;
      }

      const result = std(speaks);
      return typeof result === "number" ? result : 0;
    });

    if (tournamentStandardDeviations.length === 0) {
      setAverageStandardDeviation(0);
    } else {
      const result = mean(tournamentStandardDeviations);
      setAverageStandardDeviation(typeof result === "number" ? result : 0);
    }
  }, [debateData]);

  return (
    <Card>
      <CardTitle>
        Average Speak Standard Deviation
      </CardTitle>
      <CardContent>
        <p className="text-5xl">{averageStandardDeviation.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
};

export default AverageStdevCard;
