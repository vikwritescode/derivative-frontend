import { useContext, useEffect, useState } from "react";
import { Context } from "../context/AuthContext";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Trash,
  AlertCircleIcon,
  Plus,
  ChevronsUp,
  ChevronsDown,
  Cat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import CategoryBadge from "@/components/CategoryBadge";
import { type DebateRecord } from "@/interfaces";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InfoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Debates = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [debateArr, setDebateArr] = useState([]);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState(false);
  const [loads, setLoads] = useState<boolean[]>([]);
  const [refresher, setRefresher] = useState(false);
  useEffect(() => {
    const fetchStuff = async () => {
      const token = await user?.getIdToken();
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/get`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const json = await response.json();
        console.log(json);
        setDebateArr(json.debates);
        setLoads(Array(json.debates.length).fill(false));
        setLoad(false);
      } catch (err) {
        setError(true);
        console.error(err);
      }
    };
    fetchStuff();
  }, [refresher]);

  const handleDeleteClick = async (x: number) => {
    try {
      setLoads((prev) => prev.map((v, i) => (i === x ? true : v)));
      const token = await user?.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/delete/${x}`,
        {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );
      if (!response.ok) {
        console.log(load);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      console.log(json);
      setRefresher((prev) => !prev);
    } catch (err) {
      console.error(err);
    } finally {
      setLoad(false);
      setLoads((prev) => prev.map((v, i) => (i === x ? false : v)));
    }
  };

  const [sortBy, setSortBy] = useState("date");
  const [ascending, setAscending] = useState(false);

  const handleSort = (ind: string) => {
    if (ind === sortBy) {
      // flip ascending/descending
      setAscending((prev) => !prev);
    } else {
      setSortBy(ind);
    }
  };

  if (error) {
    return (
      <div className="w-full px-4 py-6 overflow-x-hidden">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
          Your Debates
        </h1>
        <Alert variant="destructive" className="mt-6">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle className="text-left mb-1">
            Error retrieving debate history
          </AlertTitle>
          <AlertDescription>Please reload the page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 overflow-x-hidden">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
        Your Debates
      </h1>
      <div className="py-4">
        <Table>
          <TableHeader>
            <TableRow className="text-left">
              <TableHead
                className="cursor-pointer hover:underline hover:text-secondary-foreground"
                onClick={() => handleSort("date")}
              >
                Date
                {sortBy === "date" ? (
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
                className="cursor-pointer hover:underline hover:text-secondary-foreground"
                onClick={() => handleSort("tournament")}
              >
                Tournament
                {sortBy === "tournament" ? (
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
                className="cursor-pointer hover:underline hover:text-secondary-foreground"
                onClick={() => handleSort("position")}
              >
                Position
                {sortBy === "position" ? (
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
                className="cursor-pointer hover:underline hover:text-secondary-foreground"
                onClick={() => handleSort("points")}
              >
                Points
                {sortBy === "points" ? (
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
                className="cursor-pointer hover:underline hover:text-secondary-foreground"
                onClick={() => handleSort("speaks")}
              >
                Speaks
                {sortBy === "speaks" ? (
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
                className="cursor-pointer hover:underline hover:text-secondary-foreground"
                onClick={() => handleSort("format")}
              >
                Format
                {sortBy === "format" ? (
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
              <TableHead>Info Slide</TableHead>
              <TableHead>Motion</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => navigate("/add")}
                >
                  <Plus />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-left">
            {debateArr
              .sort((a, b) => {
                const mult = ascending ? 1 : -1;
                if (sortBy == "date") {
                  return (
                    mult *
                    (new Date(a["date"]).getTime() -
                      new Date(b["date"]).getTime())
                  );
                } else if (sortBy === "tournament") {
                  const valA =
                    (a[sortBy] as string) === null ? "" : (a[sortBy] as string);
                  const valB =
                    (b[sortBy] as string) === null ? "" : (b[sortBy] as string);
                  return (
                    mult *
                    valA.localeCompare(valB, undefined, { numeric: true })
                  );
                } else if (sortBy === "format") {
                  const valA =
                    (a[sortBy] as string) === null ? "" : (a[sortBy] as string);
                  const valB =
                    (b[sortBy] as string) === null ? "" : (b[sortBy] as string);
                  return (
                    mult *
                    valA.localeCompare(valB, undefined, { numeric: true })
                  );
                } else if (sortBy === "position") {
                  const positions = {
                    OG: 0,
                    OO: 1,
                    CG: 2,
                    CO: 3,
                    AFF: 4,
                    NEG: 5,
                  };
                  return mult * (positions[a[sortBy]] - positions[b[sortBy]]);
                }
                return mult * (a[sortBy] - b[sortBy]);
              })
              .map((rec: DebateRecord, i) => (
                <TableRow>
                  <TableCell>
                    {rec["date"] == null ? rec["legacy_date"] : rec["date"]}
                  </TableCell>
                  <TableCell>{rec["tournament"]}</TableCell>
                  <TableCell>{rec["position"]}</TableCell>
                  <TableCell>{rec["points"]}</TableCell>
                  <TableCell>{Math.round(rec["speaks"] * 100) / 100}</TableCell>
                  <TableCell>{rec["format"]}</TableCell>
                  <TableCell>
                    {rec["infoslide"] === "" ? (
                      <></>
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost">
                            <InfoIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="max-w-md max-h-[400px] overflow-y-auto">
                          <p className="text-sm whitespace-pre-wrap">
                            {rec["infoslide"]}
                          </p>
                        </PopoverContent>
                      </Popover>
                    )}
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost">
                          <InfoIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="max-w-md max-h-[400px] overflow-y-auto">
                        <p className="text-sm whitespace-pre-wrap">
                          {rec["motion"]}
                        </p>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(rec["categories"] || [])
                        .filter((x: string) => x)
                        .map((x: string) => (
                          <CategoryBadge category={x} />
                        ))}
                    </div>
                  </TableCell>
                  <TableCell onClick={() => handleDeleteClick(rec["id"])}>
                    <Button
                      disabled={loads[i]}
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      {loads[i] ? <Spinner /> : <Trash />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Debates;
