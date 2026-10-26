import { useEffect, useState } from "react";
import { Context } from "../context/AuthContext";
import { useContext } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";
import type { TournamentRecord } from "@/interfaces";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardContent,
  CardAction,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EditCategoryBadge from "@/components/EditCategoryBadge";
import AddCategoryBadge from "@/components/AddCategoryBadge";

const AVAILABLE_CATEGORIES = [
  "Economics",
  "International Relations",
  "Africa",
  "Art",
  "Asia",
  "Children",
  "Cities",
  "Criminal Justice",
  "Culture",
  "Feminism",
  "Latin America",
  "Law",
  "LGBTQ+",
  "Media",
  "Medical",
  "Middle East",
  "Military",
  "Minority Communities",
  "Philosophy",
  "Politics",
  "Religion",
  "Romance/Sexuality",
  "Science/Technology",
  "Social Justice",
  "Sports",
];

const AddOutround = () => {
  const [pos, setPos] = useState("OG");
  const [order, setOrder] = useState("1");
  const [roundName, setRoundName] = useState("");
  const [roundShortName, setRoundShortName] = useState("");
  const [advancing, setAdvancing] = useState(false);
  const [infoSlide, setInfoSlide] = useState("");
  const [motion, setMotion] = useState("");
  const [tournament, setTournament] = useState("");
  const [tournamentArr, setTournamentArr] = useState<Array<TournamentRecord>>(
    [],
  );
  const [categories, setCategories] = useState<Array<string>>([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [dataValidError, setDataValidError] = useState(false);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);

  const { user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const getTourneys = async () => {
      try {
        const token = await user?.getIdToken();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/usertournaments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setTournamentArr(data);
      } catch (err) {
        console.error(err);
        setError(true);
        setErrorMessage("Failed to fetch tournaments.");
      }
    };
    getTourneys();
  }, []);

  const handleAdd = async () => {
    const token = await user?.getIdToken();
    // data validation and error checking
    const outroundData = {
      position: pos,
      tournament: parseInt(tournament),
      round_name: roundName,
      round_short_name: roundShortName,
      advancing,
      infoslide: infoSlide,
      motion: motion,
      order: parseInt(order),
      categories: categories.length > 0 ? { categories } : null,
    };
    const valid = ["OG", "OO", "CG", "CO", "AFF", "NEG"];
    if (
      tournament.length > 0 &&
      valid.includes(outroundData.position) &&
      outroundData.round_name.trim().length > 0 &&
      outroundData.round_short_name.trim().length > 0
    ) {
      try {
        setLoad(true);
        setError(false);
        setDataValidError(false);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/outrounds/add`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(outroundData),
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const json = await response.json();
        console.log(json);
        navigate("/outrounds");
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoad(false);
      }
    } else {
      setDataValidError(true);
      console.log("get good");
    }
  };

  const selectTournament = (e: string) => {
    setTournament(e);

  };
  return (
    <div className="w-full px-4 py-6 overflow-x-hidden">
      <div>
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold">Add Outround</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert variant="destructive" hidden={!error}>
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle className="text-left">Tournaments error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            <Alert variant="destructive" hidden={!dataValidError}>
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle className="text-left">Invalid outround</AlertTitle>
              <AlertDescription>
                Make sure all entries contain valid data.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive" hidden={!error}>
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle className="text-left">API error</AlertTitle>
              <AlertDescription>
                The API was unable to process your request.
              </AlertDescription>
            </Alert>
            {/* 1 column on mobile, 2×2 on sm+ */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <h3 className="text-sm font-medium">Tournament</h3>
                <Select onValueChange={selectTournament}>
                  <SelectTrigger className="h-9 w-full text-sm">
                    <SelectValue placeholder="Tournament" />
                  </SelectTrigger>
                  <SelectContent>
                    {tournamentArr.map((x) => (
                      <SelectItem key={x.id} value={x.id.toString()}>
                        {x.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Position */}
              <div className="space-y-1.5">
                <h3 className="text-sm font-medium">Position</h3>
                <Select value={pos} onValueChange={setPos}>
                  <SelectTrigger className="h-9 w-full text-sm">
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                  <SelectContent>
                    {(["OG", "OO", "CG", "CO", "AFF", "NEG"] as const).map(
                      (value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              {/* Order */}
              <div className="space-y-1.5">
                <h3 className="text-sm font-medium">Order</h3>
                <Select value={order} onValueChange={setOrder}>
                  <SelectTrigger className="h-9 w-full text-sm">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 (Spoke First)</SelectItem>
                    <SelectItem value="2">2 (Spoke Second)</SelectItem>
                    <SelectItem value="3">3 (Spoke Third)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Round Name */}
              <div className="space-y-1.5">
                <h3 className="text-sm font-medium">Round Name</h3>
                <Input
                  value={roundName}
                  onChange={(e) => setRoundName(e.target.value)}
                  className="h-9 w-full px-2 text-sm"
                  placeholder="Round Name"
                />
              </div>

              {/* Short Round Name */}
              <div className="space-y-1.5">
                <h3 className="text-sm font-medium">Short Round Name</h3>
                <Input
                  value={roundShortName}
                  onChange={(e) => setRoundShortName(e.target.value)}
                  className="h-9 w-full px-2 text-sm"
                  placeholder="QF, SF, GF, etc."
                />
              </div>

              {/* Advancing */}
              <div className="space-y-1.5">
                <div className="h-9 flex items-center space-x-2 mt-6">
                  <Checkbox
                    id="advancing"
                    checked={advancing}
                    onCheckedChange={(checked) => setAdvancing(checked === true)}
                  />
                  <label
                    htmlFor="advancing"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Advancing
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-medium">Info Slide</h3>
              <Textarea
                value={infoSlide}
                onChange={(e) => setInfoSlide(e.target.value)}
                className="min-h-20 w-full text-sm resize-y"
                placeholder="Info Slide"
              />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-medium">Motion</h3>
              <Textarea
                value={motion}
                onChange={(e) => setMotion(e.target.value)}
                className="min-h-20 w-full text-sm resize-y"
                placeholder="Motion"
              />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-medium">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <EditCategoryBadge
                      key={category}
                      category={category}
                      onDelete={() =>
                        setCategories((previous) =>
                          previous.filter((item) => item !== category),
                        )
                      }
                    />
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No categories added
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-medium">Other Categories</h3>
              <h4 className="text-sm text-muted-foreground">Click to add</h4>
              <div className="flex flex-wrap gap-2 border rounded-md p-3 h-48 overflow-y-auto bg-muted/20">
                {AVAILABLE_CATEGORIES.filter(
                  (category) => !categories.includes(category),
                ).map((category) => (
                  <AddCategoryBadge
                    key={category}
                    category={category}
                    onAdd={() =>
                      setCategories((previous) => [...previous, category])
                    }
                  />
                ))}
              </div>
            </div>
          </CardContent>

          <CardAction className="flex justify-end px-6 pb-4">
            <Button onClick={handleAdd} disabled={load} size="sm">
              {load ? <Spinner /> : "Add Outround"}
            </Button>
          </CardAction>
        </Card>
      </div>
    </div>
  );
};

export default AddOutround;
