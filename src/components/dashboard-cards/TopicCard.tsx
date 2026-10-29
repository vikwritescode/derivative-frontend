import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronsUp, ChevronsDown } from "lucide-react";
import { useState } from "react";
import CategoryIcon from "../CategoryIcon";
interface TopicCardProps {
  debateData: Array<any>;
}
const TopicCard = ({ debateData }: TopicCardProps) => {
  const [sortBy, setSortBy] = useState(0);
  const [ascending, setAscending] = useState(false);
  const stats = debateData.reduce<Record<string, [number, number, number]>>(
    (acc, debate) => {
      for (const category of debate["categories"]) {
        if (!acc[category]) {
          acc[category] = [0, 0, 0];
        }
        acc[category][0] += debate["points"];
        acc[category][1] += debate["speaks"];
        acc[category][2] += 1;
      }
      return acc;
    },
    {},
  );
  const pairs = Object.entries(stats);

  const handleSort = (ind: number) => {
    if (ind === sortBy) {
      // flip ascending/descending
      setAscending((prev) => !prev);
    } else {
      setSortBy(ind);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle bigTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead
                className="cursor-pointer hover:underline hover:text-secondary-foreground pl-7"
                onClick={() => handleSort(0)}
              >
                Average Points
                {sortBy === 0 ? (
                  ascending ? (
                    <ChevronsDown className="inline w-auto size-10/24" />
                  ) : (
                    <ChevronsUp className="inline w-auto size-10/24" />
                  )
                ) : (
                  <ChevronsDown
                    color="0000000"
                    className="inline w-auto size-10/24"
                  />
                )}
              </TableHead>
              <TableHead
                onClick={() => handleSort(1)}
                className="cursor-pointer hover:underline hover:text-secondary-foreground pl-7"
              >
                Average Speaks
                {sortBy === 1 ? (
                  ascending ? (
                    <ChevronsDown className="inline w-auto size-10/24" />
                  ) : (
                    <ChevronsUp className="inline w-auto size-10/24" />
                  )
                ) : (
                  <ChevronsDown
                    color="0000000"
                    className="inline w-auto size-10/24"
                  />
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:underline hover:text-secondary-foreground pl-7"
                onClick={() => handleSort(2)}
              >
                Count
                {sortBy === 2 ? (
                  ascending ? (
                    <ChevronsDown className="inline w-auto size-10/24" />
                  ) : (
                    <ChevronsUp className="inline w-auto size-10/24" />
                  )
                ) : (
                  <ChevronsDown
                    color="0000000"
                    className="inline w-auto size-10/24"
                  />
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pairs
              .sort((a, b) => {
                const mult = ascending ? 1 : -1;
                if (sortBy === 2) {
                  // do not find average in this case
                  return mult * (a[1][2] - b[1][2]);
                }
                const avgA = a[1][sortBy] / a[1][2] || 0;
                const avgB = b[1][sortBy] / b[1][2] || 0;
                return mult * (avgA - avgB);
              })
              .map((pair: Array<any>) => (
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CategoryIcon
                        category={
                          pair[0] === "null" || !pair[0] ? "Other" : pair[0]
                        }
                      />
                      <span>
                        {pair[0] === "null" || !pair[0] ? "Other" : pair[0]}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{(pair[1][0] / pair[1][2]).toFixed(2)}</TableCell>
                  <TableCell>{(pair[1][1] / pair[1][2]).toFixed(2)}</TableCell>
                  <TableCell>{pair[1][2]}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopicCard;
