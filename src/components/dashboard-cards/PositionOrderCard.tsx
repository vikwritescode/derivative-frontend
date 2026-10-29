import type { DebateRecord } from "@/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

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
    const firstSpeakerAvgSpeaks = firstSpeakerCount === 0 ? 0 : firstSpeakerSpeaks[0] / firstSpeakerCount;
    const secondSpeakerAvgSpeaks = secondSpeakerCount === 0 ? 0 : secondSpeakerSpeaks[0] / secondSpeakerCount;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{position}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Speaks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
        {firstSpeakerCount > 0 && (
          <TableRow>
            <TableCell>{firstSpeaker}</TableCell>
            <TableCell>{firstSpeakerAvgPoints.toPrecision(3)}</TableCell>
            <TableCell>{firstSpeakerAvgSpeaks.toPrecision(3)}</TableCell>
          </TableRow>
        )}

        {secondSpeakerCount > 0 && (
          <TableRow>
            <TableCell>{secondSpeaker}</TableCell>
            <TableCell>{secondSpeakerAvgPoints.toPrecision(3)}</TableCell>
            <TableCell>{secondSpeakerAvgSpeaks.toPrecision(3)}</TableCell>
          </TableRow>
        )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PositionOrderCard;
