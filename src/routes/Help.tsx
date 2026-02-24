import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

const Help = () => {
    return (
      <div className="w-full px-4 py-6 overflow-x-hidden">
        <div>
          <Card className="mx-auto max-w-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold">Help</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              <p>
                The <Link to="/" className="underline">Dashboard</Link> provides a visual summary of your debating history, 
                including your average speaks and team points by competition, by position, and by motion category.
              </p>
              <br />
              <p>
                <Link to="/debates" className="underline">Debates</Link> displays all of your past records in a table, sortable
                by date, tournament, position, and result. You can manually add debates using the plus icon on the
                top bar, and delete records using the trash icon.
              </p>
              <br />
              <p>
                <Link to="/add-tournaments" className="underline">Tournaments</Link> displays all of your previous competitions
                in a table, including your team and individual rank and the size of the competition. You can manually add
                a tournament using the plus icon on the top bar, and delete records using the trash icon.
              </p>
              <br />
              <p>
                <Link to="/import" className="underline">Import Tab</Link> automatically obtains your results from a competition
                when provided with a TabbyCat URL (or the prefix of a CalicoTab page).
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
}

export default Help;