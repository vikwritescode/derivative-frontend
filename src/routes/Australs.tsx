import { useContext, useEffect, useState } from "react";
import { Context } from "../context/AuthContext";
import PieChartPositionCard from "@/components/dashboard-cards/PieChartPositionCard";
import PieChartPointCard from "@/components/dashboard-cards/PieChartPointCard";
import PerformanceCard from "@/components/dashboard-cards/PerformanceCard";
import TopicCard from "@/components/dashboard-cards/TopicCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DebateRecord } from "@/interfaces";
import { useNavigate } from "react-router-dom";
import {
  Empty,
  EmptyTitle,
  EmptyHeader,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import WSDCAverageSpeaksCard from "@/components/dashboard-cards/WSDCAverageSpeaksCard";
// import { DebateRecord } from "@/interfaces";

const Australs = () => {
  const { user } = useContext(Context);
  const [load, setLoad] = useState(false);
  const [debateData, setDebateData] = useState<DebateRecord[]>([]);
  const [debateArr, setDebateArr] = useState<DebateRecord[]>([]);
  // different arrays to pass to the cards
  const [australsData, setAustralsData] = useState<DebateRecord[]>([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Keep format-specific datasets in sync with the filtered debate list.
  useEffect(() => {
    setAustralsData(debateArr.filter((x) => x.format === "AUS"));
  }, [debateArr]);

  const handleFilterChange = (
    timeCutoff: Date,
    prevData: Array<DebateRecord>,
  ) => {
    const filt = prevData.filter((x: DebateRecord) => {
      const tDate = new Date(x.date);
      return tDate.getTime() >= timeCutoff.getTime();
    });
    setDebateArr(filt);
  };

  const handleTabChange = (val: string) => {
    if (val == "year") {
      // filter past year
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      handleFilterChange(lastYear, debateData);
    } else {
      // filter past year
      const beginning = new Date(0);
      handleFilterChange(beginning, debateData);
    }
  };

  useEffect(() => {
    const fetchStuff = async () => {
      const token = await user?.getIdToken();
      try {
        setLoad(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/debates/get`,
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
        setDebateData(json.debates);

        // filter past year
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
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

  const handleAddEmpty = () => {
    navigate("/import");
  };

  if (error) {
    return (
      <div className="w-full px-4 py-6 overflow-x-hidden">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
          Australs
        </h1>
        <Alert variant="destructive" className="mt-6">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle className="text-left mb-1">
            Error fetching data
          </AlertTitle>
          <AlertDescription>{(errorMessage == "") ? "Please reload the page." : errorMessage}</AlertDescription>
        </Alert>
      </div>
    );
  }
  if (australsData.length === 0 && !load) {
    return (
      <div className="w-full px-4 py-6 overflow-x-hidden">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No Australs Debates Found</EmptyTitle>
            <EmptyDescription>
              You haven't imported any Australs tournaments yet. Import a tab from a URL,
              or add a tournament manually to get started.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={handleAddEmpty}>Import Debates</Button>
          </EmptyContent>
        </Empty>
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

            </div>
          </div>

          {/* Australs dashboard cards */}
          <div hidden={australsData.length === 0} className="mt-6">
            <div className="mt-6">
              <WSDCAverageSpeaksCard debateData={australsData} />
            </div>
            <div className="mt-6">
              <PerformanceCard debateData={australsData} />
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <PieChartPointCard
                title="Win"
                debateData={australsData}
                points={1}
              />
              <PieChartPointCard
                title="Loss"
                debateData={australsData}
                points={0}
              />
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <PieChartPositionCard
                title="Affirmative"
                debateData={australsData}
                position="AFF"
              />
              <PieChartPositionCard
                title="Negative"
                debateData={australsData}
                position="NEG"
              />
            </div>
            <div className="mt-6">
              <TopicCard debateData={australsData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Australs;
