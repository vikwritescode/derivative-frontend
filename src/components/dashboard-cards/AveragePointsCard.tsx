import type { DebateRecord } from "@/interfaces";
import { Card, CardContent, CardTitle } from "../ui/card";
import { mean } from "mathjs";
import { useEffect, useState } from "react";

interface AveragePointsCardProps {
  debateData: Array<DebateRecord>;
}
const AveragePointsCard = ({ debateData }: AveragePointsCardProps) => {
  const pointArray = debateData.map((x) => x["points"]);
  const [points, setMeanPoints] = useState<number>(0);
  useEffect(() => {
    if (pointArray.length === 0) {
      setMeanPoints(0);
    } else {
      setMeanPoints(mean(pointArray));
    }
  }, [debateData]);

  return (
    <Card>
      <CardTitle>
        Average Points 
      </CardTitle>
      <CardContent>
            <p className="text-5xl">{points.toFixed(3)}</p>
      </CardContent>
    </Card>
  );
};

export default AveragePointsCard;
