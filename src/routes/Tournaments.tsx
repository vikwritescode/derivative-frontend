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
  ChevronsUp,
  ChevronsDown,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { type DebateResponse, type TournamentRecord } from "@/interfaces";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Tournaments = () => {
  type SortKey =
    | "date"
    | "name"
    | "team_standing"
    | "speaker_standing"
    | "rooms"
    | "format"
    | "total_points"
    | "avg_speaks";

  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [tournamentArr, setTournamentArr] = useState<TournamentRecord[]>([]);
  const [dated, setDated] = useState(new Set<number>());
  const [dead, setDead] = useState(new Set<number>());
  const [load, setLoad] = useState(true);
  const [error, setError] = useState(false);
  const [loads, setLoads] = useState<boolean[]>([]);
  const [refreshLoads, setRefreshLoads] = useState<boolean[]>([]);
  const [refresher, setRefresher] = useState(false);
  useEffect(() => {
    const fetchStuff = async () => {
      const token = await user?.getIdToken();
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/usertournaments`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const json = await response.json();
        if (!Array.isArray(json)) {
          throw new Error("Invalid tournaments payload");
        }
        console.log(json);
        setTournamentArr(json);
        const deadSet = new Set<number>();
        json.forEach((tourn: TournamentRecord) => {
          if (!tourn.tab_url) {
            deadSet.add(tourn.id);
          }
        });
        setDead(deadSet);

        setLoads(Array(json.length).fill(false));
        setRefreshLoads(Array(json.length).fill(false));
        setLoad(false);
      } catch (err) {
        setError(true);
        console.error(err);
      }
    };
    const fetchDebates = async () => {
      const token = await user?.getIdToken();
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/debates/get`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const json: DebateResponse = await response.json();
        if (!json?.debates || !Array.isArray(json.debates)) {
          throw new Error("Invalid debates payload");
        }
        // find outdated records to refresh
        const outdated = new Set<number>();
        json.debates.forEach((debate) => {
          const tournId = parseInt(debate.tournament_id);
          if (
            debate.format === "BP" &&
            (debate.partner == null || debate.order === 0)
          ) {
            outdated.add(tournId);
          }
        });
        console.log(outdated);
        setDated(outdated);
        setLoad(false);
      } catch (err) {
        setError(true);
        console.error(err);
      }
    };
    fetchStuff();
    fetchDebates();
  }, [refresher]);

  const handleRefreshAllClick = async () => {
    try {
      setLoad(true);
      const token = await user?.getIdToken();
      setRefreshLoads(Array(tournamentArr.length).fill(true));
      dated.forEach(async (tournId) => {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/refresh/${tournId}`,
          {
            method: "POST",
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const json = await response.json();
        console.log(json);
      });
      setRefresher((prev) => !prev);
    } catch (err) {
      console.error(err);
    } finally {
      setLoad(false);
    }
  };
  const handleDeleteClick = async (rowIndex: number, tournamentId: number) => {
    try {
      setLoads((prev) => prev.map((v, i) => (i === rowIndex ? true : v)));
      const token = await user?.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/usertournaments/delete/${tournamentId}`,
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
      setLoads((prev) => prev.map((v, i) => (i === rowIndex ? false : v)));
    }
  };

  const handleRefreshClick = async (rowIndex: number, tournamentId: number) => {
    try {
      setRefreshLoads((prev) =>
        prev.map((v, i) => (i === rowIndex ? true : v)),
      );
      const token = await user?.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/refresh/${tournamentId}`,
        {
          method: "POST",
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
      setRefreshLoads((prev) =>
        prev.map((v, i) => (i === rowIndex ? false : v)),
      );
    }
  };

  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [ascending, setAscending] = useState(false);
  const refreshableIds = [...dated].filter((id) => !dead.has(id));

  const handleSort = (ind: SortKey) => {
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
          Your Tournaments
        </h1>
        <Alert variant="destructive" className="mt-6">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle className="text-left mb-1">
            Error retrieving tournament history
          </AlertTitle>
          <AlertDescription>Please reload the page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 overflow-x-hidden">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
        Your Tournaments
      </h1>
      <Alert
        variant="default"
        className="mt-6"
        onClick={handleRefreshAllClick}
        hidden={refreshableIds.length === 0}
      >
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle className="text-left mb-1">Outdated Tournaments</AlertTitle>
        <AlertDescription>
          Some of your tournament records are outdated. Click this message to
          automatically reimport tabs and take advantage of newer features where
          possible.
        </AlertDescription>
      </Alert>
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
                    <ChevronsDown className="inline w-auto size-10/24 pl-1" />
                  ) : (
                    <ChevronsUp className="inline w-auto size-10/24 pl-1" />
                  )
                ) : (
                  <ChevronsDown
                    color="0000000"
                    className="inline w-auto size-10/24 pl-1"
                  />
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:underline hover:text-secondary-foreground"
                onClick={() => handleSort("name")}
              >
                Tournament
                {sortBy === "name" ? (
                  ascending ? (
                    <ChevronsDown className="inline w-auto size-10/24 pl-1" />
                  ) : (
                    <ChevronsUp className="inline w-auto size-10/24 pl-1" />
                  )
                ) : (
                  <ChevronsDown
                    color="0000000"
                    className="inline w-auto size-10/24 pl-1"
                  />
                )}
              </TableHead>

              <TableHead
                className="cursor-pointer hover:underline hover:text-secondary-foreground"
                onClick={() => handleSort("team_standing")}
              >
                Team Rank
                {sortBy === "team_standing" ? (
                  ascending ? (
                    <ChevronsDown className="inline w-auto size-10/24 pl-1" />
                  ) : (
                    <ChevronsUp className="inline w-auto size-10/24 pl-1" />
                  )
                ) : (
                  <ChevronsDown
                    color="0000000"
                    className="inline w-auto size-10/24 pl-1"
                  />
                )}
              </TableHead>

              <TableHead
                className="cursor-pointer hover:underline hover:text-secondary-foreground"
                onClick={() => handleSort("speaker_standing")}
              >
                Speaker Rank
                {sortBy === "speaker_standing" ? (
                  ascending ? (
                    <ChevronsDown className="inline w-auto size-10/24 pl-1" />
                  ) : (
                    <ChevronsUp className="inline w-auto size-10/24 pl-1" />
                  )
                ) : (
                  <ChevronsDown
                    color="0000000"
                    className="inline w-auto size-10/24 pl-1"
                  />
                )}
              </TableHead>

              <TableHead
                className="cursor-pointer hover:underline hover:text-secondary-foreground"
                onClick={() => handleSort("rooms")}
              >
                Rooms
                {sortBy === "rooms" ? (
                  ascending ? (
                    <ChevronsDown className="inline w-auto size-10/24 pl-1" />
                  ) : (
                    <ChevronsUp className="inline w-auto size-10/24 pl-1" />
                  )
                ) : (
                  <ChevronsDown
                    color="0000000"
                    className="inline w-auto size-10/24 pl-1"
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
                    <ChevronsDown className="inline w-auto size-10/24 pl-1" />
                  ) : (
                    <ChevronsUp className="inline w-auto size-10/24 pl-1" />
                  )
                ) : (
                  <ChevronsDown
                    color="0000000"
                    className="inline w-auto size-10/24 pl-1"
                  />
                )}
              </TableHead>

              <TableHead
                className="cursor-pointer hover:underline hover:text-secondary-foreground"
                onClick={() => handleSort("total_points")}
              >
                Points
                {sortBy === "total_points" ? (
                  ascending ? (
                    <ChevronsDown className="inline w-auto size-10/24 pl-1" />
                  ) : (
                    <ChevronsUp className="inline w-auto size-10/24 pl-1" />
                  )
                ) : (
                  <ChevronsDown
                    color="0000000"
                    className="inline w-auto size-10/24 pl-1"
                  />
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:underline hover:text-secondary-foreground"
                onClick={() => handleSort("avg_speaks")}
              >
                Avg Speaks
                {sortBy === "avg_speaks" ? (
                  ascending ? (
                    <ChevronsDown className="inline w-auto size-10/24 pl-1" />
                  ) : (
                    <ChevronsUp className="inline w-auto size-10/24 pl-1" />
                  )
                ) : (
                  <ChevronsDown
                    color="0000000"
                    className="inline w-auto size-10/24 pl-1"
                  />
                )}
              </TableHead>

              <TableHead>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => navigate("/add-tournaments")}
                >
                  <Plus />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-left">
            {[...tournamentArr]
              .sort((a, b) => {
                const mult = ascending ? 1 : -1;
                switch (sortBy) {
                  case "date":
                    return (
                      mult *
                      (new Date(a.date).getTime() - new Date(b.date).getTime())
                    );
                  case "name":
                    return (
                      mult *
                      (a.name ?? "").localeCompare(b.name ?? "", undefined, {
                        numeric: true,
                      })
                    );
                  case "format":
                    return (
                      mult *
                      (a.format ?? "").localeCompare(
                        b.format ?? "",
                        undefined,
                        {
                          numeric: true,
                        },
                      )
                    );
                  case "team_standing":
                    return mult * (a.team_standing - b.team_standing);
                  case "speaker_standing":
                    return mult * (a.speaker_standing - b.speaker_standing);
                  case "rooms":
                    return mult * (a.rooms - b.rooms);
                  case "total_points":
                    return mult * (a.total_points - b.total_points);
                  case "avg_speaks":
                    return mult * (a.avg_speaks - b.avg_speaks);
                  default:
                    return 0;
                }
              })
              .map((rec: TournamentRecord, i) => (
                <TableRow>
                  <TableCell>{rec["date"]}</TableCell>
                  <TableCell>{rec["name"]}</TableCell>
                  <TableCell>{rec["team_standing"]}</TableCell>
                  <TableCell>{rec["speaker_standing"]}</TableCell>
                  <TableCell>{rec["rooms"]}</TableCell>
                  <TableCell>{rec["format"]}</TableCell>
                  <TableCell>{rec["total_points"]}</TableCell>
                  <TableCell>
                    {Math.round(rec["avg_speaks"] * 100) / 100}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        {
                          <Button
                            disabled={loads[i] || refreshLoads[i]}
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            {loads[i] ? <Spinner /> : <Trash />}
                          </Button>
                        }
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Tournament</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete {rec["name"]} and
                            all associated debates?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 p-6 sm:p-0 -m-6 sm:m-0">
                          <DialogClose asChild>
                            <Button
                              className="w-full sm:w-auto"
                              variant="outline"
                              disabled={loads[i]}
                            >
                              Cancel
                            </Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              className="w-full sm:w-auto"
                              variant="destructive"
                              onClick={() => handleDeleteClick(i, rec["id"])}
                              disabled={loads[i]}
                            >
                              Delete
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>

                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex">
                          <Button
                            disabled={
                              refreshLoads[i] || loads[i] || dead.has(rec["id"])
                            }
                            variant="outline"
                            hidden={!dated.has(rec["id"])}
                            size="icon"
                            onClick={() => handleRefreshClick(i, rec["id"])}
                          >
                            {dead.has(rec["id"]) ? (
                              <AlertCircleIcon />
                            ) : refreshLoads[i] ? (
                              <Spinner />
                            ) : (
                              <RefreshCw />
                            )}
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {dead.has(rec["id"]) ? (
                          <p>Invalid Tournament. Import again.</p>
                        ) : (
                          <p>Refresh Tournament Data</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Tournaments;
