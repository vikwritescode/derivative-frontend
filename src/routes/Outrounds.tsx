import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
  PencilIcon,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import CategoryBadge from "@/components/CategoryBadge";
import { type OutroundRecord } from "@/interfaces";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InfoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

const Outrounds = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [outroundArr, setOutroundArr] = useState([]);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loads, setLoads] = useState<boolean[]>([]);
  const [refresher, setRefresher] = useState(false);
  const realName: Record<string, string> = {
    BP: "BP",
    WSDC: "WSDC",
    AUS: "Australs",
  };
  useEffect(() => {
    const fetchStuff = async () => {
      const token = await user?.getIdToken();
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/outrounds/get`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!response.ok) {
          if (response.status === 401) {
            setErrorMessage("Unauthorized. Please log in again.");
          } else if (response.status === 403) {
            setErrorMessage(`Please verify your email to use Derivative.`);
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const json = await response.json();
        console.log(json);
        setOutroundArr(json.outrounds);
        setLoads(Array(json.outrounds.length).fill(false));
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
        `${import.meta.env.VITE_API_URL}/api/outrounds/delete/${x}`,
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

  const handleEditClick = async (x: number) => {
    navigate(`/outrounds/${x}`);
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
          Outrounds
        </h1>
        <Alert variant="destructive" className="mt-6">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle className="text-left mb-1">
            Error retrieving outround history
          </AlertTitle>
          <AlertDescription>
            {errorMessage == "" ? "Please reload the page." : errorMessage}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 overflow-x-hidden">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">Outrounds</h1>
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
                onClick={() => handleSort("round_name")}
              >
                Round Name
                {sortBy === "round_name" ? (
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
              <TableHead>Advancing</TableHead>
              <TableHead>Type</TableHead>
              {/* dummy tablehead */}
              <TableHead></TableHead>
              <TableHead>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => navigate("/add-outround")}
                    >
                      <Plus />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <NavLink to="/import">Import from tab URL</NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <NavLink to="/add-outround">
                        Manually add outround
                      </NavLink>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-left">
            {outroundArr
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
                } else if (
                  sortBy === "format" ||
                  sortBy === "round_name" ||
                  sortBy === "round_short_name"
                ) {
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
              .map((rec: OutroundRecord, i) => (
                <TableRow>
                  <TableCell>{rec["date"]}</TableCell>
                  <TableCell>{rec["tournament"]}</TableCell>
                  <TableCell>{rec["position"]}</TableCell>
                  <TableCell>{rec["round_name"]}</TableCell>
                  <TableCell>{realName[rec["format"]]}</TableCell>
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
                        <PopoverContent className="max-w-md max-h-100 overflow-y-auto">
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
                      <PopoverContent className="max-w-md max-h-100 overflow-y-auto">
                        <p className="text-sm whitespace-pre-wrap">
                          {rec["motion"]}
                        </p>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    {rec["advancing"] ? (
                      <Check className="text-(--success)" />
                    ) : (
                      <X className="text-destructive" />
                    )}
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

                  <TableCell onClick={() => handleEditClick(rec["id"])}>
                    <Button disabled={loads[i]} variant="ghost" size="icon">
                      {loads[i] ? <Spinner /> : <PencilIcon />}
                    </Button>
                  </TableCell>

                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          disabled={loads[i]}
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {loads[i] ? <Spinner /> : <Trash />}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Outround</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this outround?
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
                              onClick={() => handleDeleteClick(rec["id"])}
                              disabled={loads[i]}
                            >
                              Delete
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Outrounds;
