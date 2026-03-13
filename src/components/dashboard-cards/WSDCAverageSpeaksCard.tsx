import type { DebateRecord } from "@/interfaces";
import { Card, CardContent } from "../ui/card";
import { mean } from "mathjs";
import { useEffect, useState } from "react";

interface AverageSpeaksCardProps {
  debateData: Array<DebateRecord>;
}
const WSDCAverageSpeaksCard = ({ debateData }: AverageSpeaksCardProps) => {
  const speakArray = debateData.map((x) => x["speaks"]);
  const replySpeakArray = debateData
    .filter((x) => x.has_reply)
    .map((x) => x.reply);
  const [speaks, setMeanSpeaks] = useState<number>(0);
  const [meanReplySpeaks, setMeanReplySpeaks] = useState<number>(0);
  useEffect(() => {
    if (speakArray.length === 0) {
      setMeanSpeaks(0);
      setMeanReplySpeaks(0);
    } else {
      setMeanSpeaks(mean(speakArray));
      setMeanReplySpeaks(mean(replySpeakArray));
    }
  }, [debateData]);

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 bold text-2xl">
          <div className="mt-6 sm:mt-0 text-bold text-xl">
            <p>substantive speak average</p>
            <p className="text-2xl">{speaks.toFixed(2)}</p>
          </div>
          <div className="mt-6 sm:mt-0 text-bold text-xl">
            <p>reply speak average</p>
            <p className="text-2xl">{meanReplySpeaks.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WSDCAverageSpeaksCard;
