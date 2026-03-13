import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Cell, Pie, PieChart, Label } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
interface PieChartPositionProps {
  title: string;
  debateData: Array<any>;
  position: string;
}

const PieChartPositionCard = ({
  title,
  debateData,
  position,
}: PieChartPositionProps) => {
  const dispAv = ([s, c]: Array<number>) => (s / c || 0).toFixed(2);
  const teamStats = debateData.reduce(
    (acc, debate) => {
      const position = debate["position"].toLowerCase();
      const points = debate["points"];

      acc[position][0] += points;
      acc[position][1] += 1;
      return acc;
    },
    {
      og: [0, 0],
      oo: [0, 0],
      cg: [0, 0],
      co: [0, 0],
      aff: [0, 0],
      neg: [0, 0]
    },
  );
  const speakStats = debateData.reduce(
    (acc, debate) => {
      const position = debate["position"].toLowerCase();
      const speaks = debate["speaks"];

      acc[position][0] += speaks;
      acc[position][1] += 1;
      return acc;
    },
    {
      og: [0, 0],
      oo: [0, 0],
      cg: [0, 0],
      co: [0, 0],
      aff: [0, 0],
      neg: [0, 0],
    },
  );

  const chartConfig = {
    3: {
      label: "3",
      color: "var(--chart-primary)",
    },
    2: {
      label: "2",
      color: "var(--chart-secondary)",
    },
    1: {
      label: "1",
      color: "var(--chart-alt-secondary)",
    },
    0: {
      label: "0",
      color: "var(--chart-alt-primary)",
    },
  } satisfies ChartConfig;
  const chartData = [
    { points: 0, count: 0 },
    { points: 1, count: 0 },
    { points: 2, count: 0 },
    { points: 3, count: 0 },
  ];
  debateData
    .filter((x) => x["position"] == position)
    .forEach((debate) => {
      const points = debate["points"];
      const rec_to_inc = chartData.find((x) => x.points == points);
      if (rec_to_inc) {
        rec_to_inc.count++;
      }
    });
  // dispAv(speakStats[title.toLowerCase()])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title}
        </CardTitle>
        <CardDescription>
          {dispAv(speakStats[position.toLowerCase()])} speaks
        </CardDescription>
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
              <Label
                position="center"
                className="text-foreground"
                fontSize={18}
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl"
                        >
                          {dispAv(teamStats[position.toLowerCase()])}
                        </tspan>
                      </text>
                    );
                  }
                }}
              ></Label>
              {chartData.map((entry) => (
                <Cell
                  key={entry.points}
                  fill={
                    chartConfig[entry.points as keyof typeof chartConfig].color
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

export default PieChartPositionCard;
