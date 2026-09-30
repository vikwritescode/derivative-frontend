import type { DebateRecord } from "@/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
} from "recharts";

interface ScatterCardProps {
  debateData: Array<DebateRecord>;
}

const ScatterCard = (debateData: ScatterCardProps) => {
  const chartConfig = {
    speaks: {
      label: "Speaks",
    },
    timestamp: {
      label: "Date",
    },
    bestFit: {
      label: "Best Fit",
    },
  };
  const chartData = debateData.debateData.map((debate) => ({
    timestamp: new Date(debate.date).getTime(),
    speaks: debate.speaks,
    name: debate.tournament,
  }));
  const xMean =
    chartData.reduce((sum, point) => sum + point.timestamp, 0) /
    chartData.length;
  const yMean =
    chartData.reduce((sum, point) => sum + point.speaks, 0) / chartData.length;
  const denominator = chartData.reduce(
    (sum, point) => sum + (point.timestamp - xMean) ** 2,
    0,
  );
  const slope =
    denominator === 0
      ? 0
      : chartData.reduce(
          (sum, point) =>
            sum + (point.timestamp - xMean) * (point.speaks - yMean),
          0,
        ) / denominator;
  const intercept = yMean - slope * xMean;
  const regressionData = chartData.map((point) => ({
    ...point,
    bestFit: slope * point.timestamp + intercept,
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl">Speaks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <ChartContainer
            config={chartConfig}
            className="h-62.5 w-full min-w-125 sm:h-100"
          >
            <ComposedChart data={regressionData}>
              <CartesianGrid />
              <ChartTooltip
                shared={false}
                content={
                  <ChartTooltipContent
                    className="w-50 gap-4"
                    labelFormatter={(_, payload) => payload[0]?.payload?.name}
                  />
                }
              />
              <XAxis
                dataKey="timestamp"
                type="number"
                scale="time"
                domain={["dataMin", "dataMax"]}
                interval={20}
                tickFormatter={(value: number) =>
                  new Date(value).toLocaleDateString()
                }
              />
              <YAxis dataKey="speaks" type="number" domain={[50, 100]} />
              <Scatter
                dataKey="speaks"
                name="Speaks"
                data={regressionData}
                fill="var(--chart-alt-secondary)"
              />
              <Line
                dataKey="bestFit"
                type="linear"
                stroke="var(--chart-primary)"
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
            </ComposedChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScatterCard;
