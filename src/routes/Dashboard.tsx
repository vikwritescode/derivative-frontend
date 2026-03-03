import { useContext, useEffect, useState } from "react";
import { Context } from "../context/AuthContext";
import PieChartPositionCard from "@/components/dashboard-cards/PieChartPositionCard";
import PieChartPointCard from "@/components/dashboard-cards/PieChartPointCard";
import AverageSpeaksCard from "@/components/dashboard-cards/AverageSpeaksCard";
import PerformanceCard from "@/components/dashboard-cards/PerformanceCard";
import TopicCard from "@/components/dashboard-cards/TopicCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DebateRecord } from "@/interfaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { DebateRecord } from "@/interfaces";

const Dashboard = () => {
  const { user } = useContext(Context);
  const [load, setLoad] = useState(false);
  const [debateData, setDebateData] = useState<DebateRecord[]>([]);
  const [debateArr, setDebateArr] = useState<DebateRecord[]>([]);
  const [error, setError] = useState(false);
  const [partnerSet, setPartnerSet] = useState<Set<string>>(new Set());
  const [partner, setPartner] = useState<string>("");
  const [timeCutoff, setTimeCutoff] = useState<Date>(new Date(0));

  const handleFilterChange = (
    timeCutoff: Date,
    prevData: Array<DebateRecord>,
    partnerFilter: string = "",
  ) => {
    const filt = prevData.filter((x: DebateRecord) => {
      const tDate = new Date(x.date);
      const partnerMatch = partnerFilter ? x.partner === partnerFilter : true;
      return tDate.getTime() >= timeCutoff.getTime() && partnerMatch;
    });
    setDebateArr(filt);
  };

  const handleTabChange = (val: string) => {
    if (val == "year") {
      // filter past year
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      setTimeCutoff(lastYear);
      handleFilterChange(lastYear, debateData, partner);
    } else {
      // filter past year
      const beginning = new Date(0);
      setTimeCutoff(beginning);
      handleFilterChange(beginning, debateData, partner);
    }
  };
  const handlePartnerChange = (val: string) => {
    let v = val;
    if (val == "all") {
      v = "";
    }
    setPartner(v);
    handleFilterChange(timeCutoff, debateData, v);
  };
  useEffect(() => {
    const fetchStuff = async () => {
      const token = await user?.getIdToken();
      try {
        setLoad(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/get`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const json = await response.json();
        console.log(json);
        setDebateData(json.debates);
        const d: Array<DebateRecord> = json.debates;
        setPartnerSet(new Set(d.map((x) => x.partner)));

        // filter past year
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        setTimeCutoff(lastYear);
        handleFilterChange(lastYear, json.debates);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoad(false);
      }
    };
    fetchStuff();
  }, []);

  if (error) {
    return (
      <div className="w-full px-4 py-6 overflow-x-hidden">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
          Dashboard
        </h1>
        <Alert variant="destructive" className="mt-6">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle className="text-left mb-1">
            Error fetching data
          </AlertTitle>
          <AlertDescription>Please reload the page.</AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <div className="w-full px-4 py-6 overflow-x-hidden">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">Dashboard</h1>
      {load ? (
        <div className="min-h-screen p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col md:flex-row md:justify-between gap-4 items-stretch md:items-center">
              <Tabs
                defaultValue="year"
                className="w-full md:w-fit flex-1"
                onValueChange={handleTabChange}
              >
                <TabsList className="grid w-full grid-cols-2 h-12 bg-card border">
                  <TabsTrigger value="year">Past Year</TabsTrigger>
                  <TabsTrigger value="all">All Time</TabsTrigger>
                </TabsList>
              </Tabs>

              <Select onValueChange={handlePartnerChange}>
                <SelectTrigger className="w-full md:w-50 h-12">
                  <SelectValue placeholder="All Partners" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Partners</SelectItem>
                  {[...partnerSet].map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-6">
            <AverageSpeaksCard debateData={debateArr} />
            <PerformanceCard debateData={debateArr} />
          </div>

          <div className="mt-4">
            <h2 className="text-3xl sm:text-4xl font-semibold">Positions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <PieChartPositionCard
                title="OG"
                debateData={debateArr}
                position="OG"
              />
              <PieChartPositionCard
                title="OO"
                debateData={debateArr}
                position="OO"
              />
              <PieChartPositionCard
                title="CG"
                debateData={debateArr}
                position="CG"
              />
              <PieChartPositionCard
                title="CO"
                debateData={debateArr}
                position="CO"
              />
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-3xl sm:text-4xl font-semibold">Points</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <PieChartPointCard
                title="1st"
                debateData={debateArr}
                points={3}
              />
              <PieChartPointCard
                title="2nd"
                debateData={debateArr}
                points={2}
              />
              <PieChartPointCard
                title="3rd"
                debateData={debateArr}
                points={1}
              />
              <PieChartPointCard
                title="4th"
                debateData={debateArr}
                points={0}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-6">
            <TopicCard debateData={debateArr} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
