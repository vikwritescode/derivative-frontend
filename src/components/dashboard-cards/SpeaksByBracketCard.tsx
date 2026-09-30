import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "../ui/chart";

interface SpeaksByBracketProps {
  debateData: Array<any>;
}

const SpeaksByBracketCard = ({
  debateData
}: SpeaksByBracketProps) => {
  const brackets = [
    { "lower": 95, "upper": 100, count: 0 },
    { "lower": 92, "upper": 94, count: 0 },
    { "lower": 89, "upper": 91, count: 0 },
    { "lower": 86, "upper": 88, count: 0 },
    { "lower": 83, "upper": 85, count: 0 },
    { "lower": 79, "upper": 82, count: 0 },
    { "lower": 76, "upper": 78, count: 0 },
    { "lower": 73, "upper": 75, count: 0 },
    { "lower": 70, "upper": 72, count: 0 },
    { "lower": 67, "upper": 69, count: 0 },
    { "lower": 64, "upper": 66, count: 0 },
    { "lower": 61, "upper": 63, count: 0 },
    { "lower": 58, "upper": 60, count: 0 },
    { "lower": 55, "upper": 57, count: 0 },
    { "lower": 50, "upper": 54, count: 0 }
  ];

  for (const debate of debateData) {
    const speaks = debate["speaks"];
    for (const bracket of brackets) {
      if (speaks >= bracket.lower && speaks <= bracket.upper) {
        bracket.count++;
        break;
      }
    }
  }
  
  const sortedBrackets = [...brackets].sort((a, b) => a.lower - b.lower);
  const firstNonEmpty = sortedBrackets.findIndex(({ count }) => count > 0);
  const lastNonEmpty = sortedBrackets.findLastIndex(({ count }) => count > 0);

  const chartData = sortedBrackets
    .slice(firstNonEmpty, lastNonEmpty + 1)
    .map(({ lower, upper, count }) => ({
      bracket: `${lower}-${upper}`,
      count,
    }));

  const chartConfig = {
    "95-100": {
      label: "95-100",
      color: "var(--chart-orange-700)",
      description:
        "Plausibly one of the best debating speeches ever given; It is incredibly difficult to think up satisfactory responses to any of the arguments made; Flawless and compelling arguments.",
    },
    "92-94": {
      label: "92-94",
      color: "var(--chart-orange-700)",
      description:
        "An incredible speech, undoubtedly one of the best at the competition; Successfully engaging with the core issues of the debate, arguments exceptionally well made, and it would take a brilliant set of responses to defeat the arguments; There are no flaws of any significance.",
    },
    "89-91": {
      label: "89-91",
      color: "var(--chart-orange-600)",
      description:
        "Brilliant arguments successfully engage with the main issues in the round; Arguments are very well-explained and illustrated, and demand extremely sophisticated responses in order to be defeated; Only very minor problems, if any, but they do not affect the strength of the claims made.",
    },
    "86-88": {
      label: "86-88",
      color: "var(--chart-orange-600)",
      description:
        "Arguments engage with core issues of the debate, and are highly compelling; No logical gaps, and sophisticated responses required to defeat the arguments; Only minor flaws in arguments.",
    },
    "83-85": {
      label: "83-85",
      color: "var(--chart-orange-500)",
      description:
        "Arguments address the core issues of the debate; Arguments have strong explanations, which demand a strong response from other speakers in order to defeat the arguments; May occasionally fail to fully respond to very well-made arguments; but flaws in the speech are limited.",
    },
    "79-82": {
      label: "79-82",
      color: "var(--chart-orange-500)",
      description:
        "Arguments are relevant, and address the core issues in the debate; Arguments well made without obvious logical gaps, and are all well explained; May be vulnerable to good responses.",
    },
    "76-78": {
      label: "76-78",
      color: "var(--chart-orange-400)",
      description:
        "Arguments are almost exclusively relevant, and address most of the core issues; Occasionally, but not often, arguments may slip into: (i) deficits in explanation, (ii) simplistic argumentation vulnerable to competent responses or (iii) peripheral or irrelevant arguments; Clear to follow, and thus credit.",
    },
    "73-75": {
      label: "73-75",
      color: "var(--chart-orange-400)",
      description:
        "Arguments are almost exclusively relevant, although may fail to address one or more core issues sufficiently; Arguments are logical, but tend to be simplistic and vulnerable to competent responses; Clear enough to follow, and thus credit.",
    },
    "70-72": {
      label: "70-72",
      color: "var(--chart-orange-300)",
      description:
        "Arguments are frequently relevant; Arguments have some explanation, but there are regular significant logical gaps; Sometimes difficult to follow, and thus credit fully.",
    },
    "67-69": {
      label: "67-69",
      color: "var(--chart-orange-300)",
      description:
        "Arguments are generally relevant; Arguments almost all have explanations, but almost all have significant logical gaps; Sometimes clear, but generally difficult to follow and thus credit the speaker for their material.",
    },
    "64-66": {
      label: "64-66",
      color: "var(--chart-orange-200)",
      description:
        "Some arguments made that are relevant; Arguments generally have explanations, but have significant logical gaps; Often unclear, which makes it hard to give the speech much credit.",
    },
    "61-63": {
      label: "61-63",
      color: "var(--chart-orange-200)",
      description:
        "Some relevant claims, and most will be formulated as arguments; Arguments have occasional explanations, but these have significant logical gaps; Frequently unclear and confusing; which makes it hard to give the speech much credit.",
    },
    "58-60": {
      label: "58-60",
      color: "var(--chart-orange-100)",
      description:
        "Claims are occasionally relevant; Claims are not be formulated as arguments, but there may be some suggestion towards an explanation; Hard to follow, which makes it hard to give the speech much credit.",
    },
    "55-57": {
      label: "55-57",
      color: "var(--chart-orange-100)",
      description:
        "One or two marginally relevant claims; Claims are not formulated as arguments, and are instead are just comments; Hard to follow almost in its entirety, which makes it hard to give the speech much credit.",
    },
    "50-54": {
      label: "50-54",
      color: "var(--chart-orange-100)",
      description:
        "Content is not relevant; Content does not go beyond claims, and is both confusing and confused; Very hard to follow in its entirety, which makes it hard to give the speech any credit.",
    },
  } satisfies ChartConfig & { [k: string]: { description?: string } };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl">
          Speaks by Bracket
        </CardTitle>
        <CardDescription>
          Using WUDC brackets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full max-w-3xl max-h-100"
        >
          <BarChart
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="bracket"
              angle={-45}
              textAnchor="end"
              height={60}
              tickLine={false}
              axisLine={false}
            />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload as { bracket: string; count: number };
                const configItem = chartConfig[data.bracket as keyof typeof chartConfig];

                return (
                  <div className="grid min-w-48 max-w-40 max-h-64 items-start gap-1.5 overflow-auto rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                    <div className="flex w-full items-center justify-between gap-2 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                          style={{ backgroundColor: configItem?.color }}
                        />
                        <span>{data.bracket}</span>
                      </div>
                      <span className="font-mono text-foreground font-semibold">
                        {data.count}
                      </span>
                    </div>
                    {configItem?.description && (
                      <p className="text-left text-muted-foreground leading-normal border-t pt-1.5 mt-0.5">
                        {configItem.description}
                      </p>
                    )}
                  </div>
                );
              }}
            />
            <Bar dataKey="count" radius={4}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.bracket}
                  fill={
                    chartConfig[entry.bracket as keyof typeof chartConfig]
                      .color
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SpeaksByBracketCard;