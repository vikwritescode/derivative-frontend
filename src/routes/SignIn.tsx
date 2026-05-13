import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config.ts";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert.tsx";
import { AlertCircleIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner.tsx";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(
    "This should not be visible.",
  );
  const [error, setError] = useState(false);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      setLoad(true);
      setError(false);
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(true);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(String(err));
      }
    } finally {
      setLoad(false);
    }
  };
  return (
    <div className="w-full px-4 py-6 overflow-x-hidden">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Log in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive" hidden={!error}>
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle className="text-left">Issue when logging in</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="foo@bar.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSignIn();
              }}
            />
          </div>
          <Button onClick={handleSignIn} className="w-full" disabled={load}>
            {load ? <Spinner /> : "Log in"}
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          No account?{" "}
          <Link to="/signup" className="underline ml-1">
            Register
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
