import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
interface PieChartCardProps {
  title: string;
  debateData: Array<any>;
  points: number;
}

const PieChartPointCard = ({
  title,
  debateData,
  points,
}: PieChartCardProps) => {
  const chartConfig = {
    OG: {
      label: "OG",
      color: "var(--chart-primary)",
    },
    OO: {
      label: "OO",
      color: "var(--chart-secondary)",
    },
    CG: {
      label: "CG",
      color: "var(--chart-alt-secondary)",
    },
    CO: {
      label: "CO",
      color: "var(--chart-alt-primary)",
    },
    AFF: {
      label: "Affirmative",
      color: "var(--chart-primary)",
    },
    NEG: {
      label: "Negative",
      color: "var(--chart-alt-primary)",
    },
  } satisfies ChartConfig;
  const chartData = [
    { position: "OG", count: 0 },
    { position: "OO", count: 0 },
    { position: "CG", count: 0 },
    { position: "CO", count: 0 },
    { position: "AFF", count: 0 },
    { position: "NEG", count: 0 },
  ];
  debateData
    .filter((x) => x["points"] == points)
    .forEach((debate) => {
      const position = debate["position"];
      const rec_to_inc = chartData.find((x) => x.position == position);
      if (rec_to_inc) {
        rec_to_inc.count++;
      }
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="position"
              innerRadius={60}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.position}
                  fill={
                    chartConfig[entry.position as keyof typeof chartConfig]
                      .color
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PieChartPointCard;
