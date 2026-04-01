import type { DebateRecord } from "@/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface PositionOrderCardProps {
  position: string;
  firstSpeaker: string;
  secondSpeaker: string;
  tournData: Array<DebateRecord>;
}

const PositionOrderCard = ({
  position,
  firstSpeaker,
  secondSpeaker,
  tournData
}: PositionOrderCardProps) => {
    const [firstSpeakerPoints, firstSpeakerCount] = tournData.reduce(
      (acc, debate) => {
        if (debate.position.toLowerCase() === position.toLowerCase() && debate.order === 1) {
          acc[0] += debate.points;
          acc[1] += 1;
        }
        return acc;
      },
      [0, 0]
    );

    const [secondSpeakerPoints, secondSpeakerCount] = tournData.reduce(
      (acc, debate) => {
        if (debate.position.toLowerCase() === position.toLowerCase() && debate.order === 2) {
          acc[0] += debate.points;
          acc[1] += 1;
        }
        return acc;
      },
      [0, 0]
    );

     const firstSpeakerSpeaks = tournData.reduce(
      (acc, debate) => {
        if (debate.position.toLowerCase() === position.toLowerCase() && debate.order === 1) {
          acc[0] += debate.speaks;
          acc[1] += 1;
        }
        return acc;
      },
      [0, 0]
    );

    const secondSpeakerSpeaks = tournData.reduce(
      (acc, debate) => {
        if (debate.position.toLowerCase() === position.toLowerCase() && debate.order === 2) {
          acc[0] += debate.speaks;
          acc[1] += 1;
        }
        return acc;
      },
      [0, 0]
    );

    const firstSpeakerAvgPoints = firstSpeakerCount === 0 ? 0 : firstSpeakerPoints / firstSpeakerCount;
    const secondSpeakerAvgPoints = secondSpeakerCount === 0 ? 0 : secondSpeakerPoints / secondSpeakerCount;
    const firstSpeakerAvgSpeaks = firstSpeakerSpeaks[1] === 0 ? 0 : firstSpeakerSpeaks[0] / firstSpeakerSpeaks[1];
    const secondSpeakerAvgSpeaks = secondSpeakerSpeaks[1] === 0 ? 0 : secondSpeakerSpeaks[0] / secondSpeakerSpeaks[1];

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{position}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg border bg-muted/30 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {firstSpeaker}
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Points</span>
            <span className="text-2xl tabular-nums tracking-tight">
              {firstSpeakerAvgPoints.toPrecision(3)}
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Speaks</span>
            <span className="text-2xl tabular-nums tracking-tight">
              {firstSpeakerAvgSpeaks.toPrecision(3)}
            </span>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/30 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {secondSpeaker}
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Points</span>
            <span className="text-2xl tabular-nums tracking-tight">
              {secondSpeakerAvgPoints.toPrecision(3)}
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Speaks</span>
            <span className="text-2xl tabular-nums tracking-tight">
              {secondSpeakerAvgSpeaks.toPrecision(3)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PositionOrderCard;
