import type { DebateRecord } from "@/interfaces";
import { Card, CardContent, CardTitle } from "../ui/card";
import { std } from "mathjs";
import { useEffect, useState } from "react";

interface StdevCardProps {
  debateData: Array<DebateRecord>;
}
const StdevCard = ({ debateData }: StdevCardProps) => {
  const speakArray = debateData.map((x) => x["speaks"]);
  const [standardDeviation, setStandardDeviation] = useState<number>(0);
  useEffect(() => {
    if (speakArray.length === 0) {
      setStandardDeviation(0);
    } else {
      const result = std(speakArray);
      setStandardDeviation(typeof result === "number" ? result : 0);
    }
  }, [debateData]);

  return (
    <Card>
      <CardTitle>
        Speaker Score Standard Deviation
      </CardTitle>
      <CardContent>
        <p className="text-5xl">{standardDeviation.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
};

export default StdevCard;
