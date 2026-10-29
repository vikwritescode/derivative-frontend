import type { DebateRecord } from "@/interfaces";
import { Card, CardContent, CardTitle } from "../ui/card";
import { mean } from "mathjs";
import { useEffect, useState } from "react";

interface AverageSpeaksCardProps {
  debateData: Array<DebateRecord>;
}
const AverageSpeaksCard = ({ debateData }: AverageSpeaksCardProps) => {
  const speakArray = debateData.map((x) => x["speaks"]);
  const [speaks, setMeanSpeaks] = useState<number>(0);
  useEffect(() => {
    if (speakArray.length === 0) {
      setMeanSpeaks(0);
    } else {
      setMeanSpeaks(mean(speakArray));
    }
  }, [debateData]);

  return (
    <Card>
      <CardTitle>
        Average Speaker Score
      </CardTitle>
      <CardContent>
            <p className="text-5xl">{speaks.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
};

export default AverageSpeaksCard;
