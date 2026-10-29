import type { DebateRecord } from "@/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Line,
  LineChart,
  XAxis,
  CartesianGrid,
  YAxis,
  Symbols,
} from "recharts";
import { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";
import { Circle, Triangle, type LucideProps } from "lucide-react";

interface PerformanceCardProps {
  debateData: Array<DebateRecord>;
}
interface PerformanceEntry {
  name: string;
  date: string;
  timestamp: number;
  avgPoints: number;
  avgSpeaks: number;
}
const FilledTriangle = (props: LucideProps) => (
  <Triangle
    {...props}
    className="h-3 w-3"
    fill="var(--color-avgSpeaks)"
    stroke="var(--color-avgSpeaks)"
  />
);

const FilledCircle = (props: LucideProps) => (
  <Circle
    {...props}
    className="h-2.5 w-2.5"
    fill="var(--color-avgPoints)"
    stroke="var(--color-avgPoints)"
  />
);
const PerformanceCard = ({ debateData }: PerformanceCardProps) => {
  type SymbolType =
    | "circle"
    | "cross"
    | "diamond"
    | "square"
    | "star"
    | "triangle"
    | "wye";
  interface LastActiveDotProps {
    cx?: number;
    cy?: number;
    payload?: PerformanceEntry;
    shape: SymbolType;
    fill: string;
  }

  const LastActiveDot = ({
    cx,
    cy,
    payload,
    shape,
    fill,
  }: LastActiveDotProps) => {
    if (cx === undefined || cy === undefined || !payload) {
      return null;
    }

    const lastItem = performanceData[performanceData.length - 1];
    const isLastPoint =
      payload.timestamp === lastItem.timestamp &&
      payload.name === lastItem.name;

    if (!isLastPoint) {
      return null;
    }

    return <Symbols cx={cx} cy={cy} type={shape} size={100} fill={fill} />;
  };
  const [performanceData, setPerformanceData] = useState<
    Array<PerformanceEntry>
  >([]);
  useEffect(() => {
    type AccType = {
      name: string;
      date: string;
      timestamp: number;
      sumPoints: number;
      sumSpeaks: number;
      count: number;
    };
    const red = debateData.reduce<Record<number, AccType>>(
      (acc, curr: DebateRecord) => {
        const id = curr.tournament_id;
        if (typeof id === "number") {
          if (!acc[id]) {
            acc[id] = {
              name: curr.tournament,
              date: curr.date,
              timestamp: new Date(curr.date).getTime(),
              sumPoints: 0,
              sumSpeaks: 0,
              count: 0,
            };
          }
          acc[id].sumPoints += curr.points;
          acc[id].sumSpeaks += curr.speaks;
          acc[id].count += 1;
        }
        return acc;
      },
      {},
    );

    const lineChartData = Object.keys(red).map((t_id) => {
      const x = red[parseInt(t_id)];
      return {
        name: x.name,
        date: x.date,
        timestamp: x.timestamp,
        avgPoints: x.sumPoints / x.count || 0,
        avgSpeaks: x.sumSpeaks / x.count || 0,
      };
    });
    lineChartData.sort((a, b) => a.timestamp - b.timestamp);

    setPerformanceData(lineChartData);
  }, [debateData]);
  const chartConfig = {
    avgSpeaks: {
      label: "Average Speaks",
      color: "var(--chart-alt-secondary)",
      icon: FilledTriangle,
    },
    avgPoints: {
      label: "Average Points",
      color: "var(--chart-secondary)",
      icon: FilledCircle,
    },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle bigTitle>Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <ChartContainer
            config={chartConfig}
            className="h-62.5 w-full min-w-125 sm:h-100"
          >
            <LineChart data={performanceData} className="w-full">
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                type="number"
                scale="time"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(value: number) =>
                  new Date(value).toLocaleDateString()
                }
              />
              <YAxis
                yAxisId="speaks"
                orientation="left"
                domain={["dataMin-1", "dataMax+1"]}
                tickFormatter={(value: number) => value.toFixed(2)}
                label={{
                  value: "Speaks",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <YAxis
                yAxisId="points"
                orientation="right"
                domain={[0, 3]}
                tickFormatter={(value: number) => value.toFixed(2)}
                label={{
                  value: "Points",
                  angle: 90,
                  position: "insideRight",
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    className="w-50 gap-4"
                    labelFormatter={(_, payload) => payload[0]?.payload?.name}
                  />
                }
              />
              <Line
                // name="Average Speaks"
                dataKey="avgSpeaks"
                yAxisId="speaks"
                stroke="var(--color-avgSpeaks)"
                strokeWidth={2}
                dot={
                  <LastActiveDot
                    shape="triangle"
                    fill="var(--color-avgSpeaks)"
                  />
                }
                activeDot={
                  <Symbols
                    type="triangle"
                    fill="var(--color-background)"
                    stroke="var(--color-avgSpeaks)"
                  />
                }
              />
              <Line
                // name="Average Points"
                dataKey="avgPoints"
                yAxisId="points"
                stroke="var(--color-avgPoints)"
                strokeWidth={2}
                dot={
                  <LastActiveDot shape="circle" fill="var(--color-avgPoints)" />
                }
                activeDot={
                  <Symbols
                    type="circle"
                    fill="var(--background)"
                    stroke="var(--color-avgPoints)"
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;
