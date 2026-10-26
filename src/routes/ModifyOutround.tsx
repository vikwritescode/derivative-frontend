import { Calendar } from "@/components/ui/calendar";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate, useParams } from "react-router-dom";
import type { TournamentRecord } from "@/interfaces";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const ModifyOutround = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [order, setOrder] = useState(0);
  const [position, setPosition] = useState("OG");
  const [roundName, setRoundName] = useState("");
  const [roundShortName, setRoundShortName] = useState("");
  const [advancing, setAdvancing] = useState(false);
  const [infoSlide, setInfoSlide] = useState("");
  const [motion, setMotion] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [tournament, setTournament] = useState("");
  const [tournaments, setTournaments] = useState<TournamentRecord[]>([]);
  const [tournamentSelected, setTournamentSelected] = useState(false);
  const [modified, setModified] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState(false);

  const otherCategories = AVAILABLE_CATEGORIES.filter(
    (category) => !categories.includes(category),
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await user?.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };
        const [tournamentsResponse, outroundResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/usertournaments`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/outrounds/get/${id}`, { headers }),
        ]);
        if (!tournamentsResponse.ok || !outroundResponse.ok) {
          throw new Error("Unable to load outround");
        }

        const tournamentData = await tournamentsResponse.json();
        const data = await outroundResponse.json();
        setTournaments(tournamentData);
        setDate(new Date(data.date));
        setOrder(data.order ?? 0);
        setPosition(data.position ?? "OG");
        setRoundName(data.round_name ?? "");
        setRoundShortName(data.round_short_name ?? "");
        setAdvancing(Boolean(data.advancing));
        setInfoSlide(data.infoslide ?? "");
        setMotion(data.motion ?? "");
        setCategories(Array.isArray(data.categories) ? data.categories : []);
        if (data.tournament_id) {
          setTournament(String(data.tournament_id));
          setTournamentSelected(true);
        }
      } catch (requestError) {
        console.error(requestError);
        setError("Failed to fetch outround data.");
      }
    };
    fetchData();
  }, [id, user]);

  const markModified = () => setModified(true);

  const handleTournamentChange = (value: string) => {
    setTournament(value);
    setTournamentSelected(true);
    const selected = tournaments.find((item) => String(item.id) === value);
    if (selected) setDate(new Date(selected.date));
    markModified();
  };

  const handleModify = async () => {
    const payload = {
      date: date.toISOString().slice(0, 10),
      tournament: Number(tournament),
      position,
      order: Number(order) || 0,
      round_name: roundName.trim(),
      round_short_name: roundShortName.trim(),
      advancing,
      infoslide: infoSlide,
      motion,
      categories: categories.length ? { categories } : null,
    };
    const validPositions = ["OG", "OO", "CG", "CO", "AFF", "NEG"];
    const valid =
      tournament.length > 0 &&
      validPositions.includes(payload.position) &&
      payload.round_name.length > 0 &&
      payload.round_short_name.length > 0 &&
      payload.date <= new Date().toISOString().slice(0, 10);
    if (!valid) {
      setValidationError(true);
      return;
    }

    try {
      setLoading(true);
      setValidationError(false);
      const token = await user?.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/outrounds/edit?outround_id=${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      navigate("/outrounds");
    } catch (requestError) {
      console.error(requestError);
      setError("The API was unable to process your request.");
    } finally {
      setLoading(false);
    }
  };

  if (error && !loading) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle className="text-left">Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full px-4 py-6 overflow-x-hidden">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">Edit Outround</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive" hidden={!validationError && !error}>
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle className="text-left">
              {validationError ? "Invalid outround" : "Outround error"}
            </AlertTitle>
            <AlertDescription>
              {validationError ? "Make sure all entries contain valid data." : error}
            </AlertDescription>
          </Alert>

          <div className="space-y-1.5">
            <h3 className="text-sm font-medium">Tournament</h3>
            <Select value={tournament} onValueChange={handleTournamentChange}>
              <SelectTrigger className="h-9 w-full text-sm">
                <SelectValue placeholder="Tournament" />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <h3 className="text-sm font-medium">Date</h3>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={tournamentSelected}
                    className="h-9 w-full justify-start text-left text-sm"
                  >
                    {date.toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (!selectedDate) return;
                      setDate(selectedDate);
                      markModified();
                      setCalendarOpen(false);
                    }}
                    className="rounded-md border shadow-sm w-full"
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2">
              <div className="space-y-1.5 flex-1">
                <h3 className="text-sm font-medium">Position</h3>
                <Select value={position} onValueChange={(value) => { setPosition(value); markModified(); }}>
                  <SelectTrigger className="h-9 w-full text-sm">
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                  <SelectContent>
                    {["OG", "OO", "CG", "CO", "AFF", "NEG"].map((value) => (
                      <SelectItem key={value} value={value}>{value}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 w-16">
                <h3 className="text-sm font-medium">Order</h3>
                <Input
                  type="number"
                  min={0}
                  value={order}
                  onChange={(event) => { setOrder(Number(event.target.value) || 0); markModified(); }}
                  className="h-9 w-full px-2 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-medium">Round Name</h3>
              <Input
                value={roundName}
                onChange={(event) => { setRoundName(event.target.value); markModified(); }}
                className="h-9 w-full px-2 text-sm"
                placeholder="Round Name"
              />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-medium">Short Round Name</h3>
              <Input
                value={roundShortName}
                onChange={(event) => {
                  setRoundShortName(event.target.value);
                  markModified();
                }}
                className="h-9 w-full px-2 text-sm"
                placeholder="Short Round Name"
              />
            </div>
            <div className="space-y-1.5 flex flex-col justify-center">
              <div className="h-9 mt-6 flex items-center space-x-2">
                <Checkbox
                  id="advancing"
                  checked={advancing}
                  onCheckedChange={(checked) => { setAdvancing(checked === true); markModified(); }}
                />
                <label htmlFor="advancing" className="text-sm font-medium leading-none cursor-pointer">
                  Advancing
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-medium">Info Slide</h3>
            <Textarea
              value={infoSlide}
              onChange={(event) => { setInfoSlide(event.target.value); markModified(); }}
              className="min-h-20 w-full text-sm resize-y"
              placeholder="Info Slide"
            />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium">Motion</h3>
            <Textarea
              value={motion}
              onChange={(event) => { setMotion(event.target.value); markModified(); }}
              className="min-h-20 w-full text-sm resize-y"
              placeholder="Motion"
            />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-medium">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.length ? categories.map((category) => (
                <EditCategoryBadge
                  key={category}
                  category={category}
                  onDelete={() => { setCategories((previous) => previous.filter((item) => item !== category)); markModified(); }}
                />
              )) : (
                <span className="text-sm text-muted-foreground">No categories added</span>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium">Other Categories</h3>
            <h4 className="text-sm text-muted-foreground">Click to add</h4>
            <div className="flex flex-wrap gap-2 border rounded-md p-3 h-48 overflow-y-auto bg-muted/20">
              {otherCategories.map((category) => (
                <AddCategoryBadge
                  key={category}
                  category={category}
                  onAdd={() => { setCategories((previous) => [...previous, category]); markModified(); }}
                />
              ))}
            </div>
          </div>
        </CardContent>
        <CardAction className="flex justify-end px-6 pb-4">
          <Button onClick={handleModify} disabled={loading || !modified} size="sm">
            {loading ? <Spinner /> : "Save Changes"}
          </Button>
        </CardAction>
      </Card>
    </div>
  );
};

export default ModifyOutround;
