import { sendEmailVerification, signOut } from "firebase/auth";
import { useContext, useState } from "react";
import { Context } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { auth } from "@/firebase-config";

const VerificationHeader = () => {
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "This should not be visible.",
  );
  const { user } = useContext(Context);

  if (!user || user.emailVerified) return null;

  const sendVerificationEmail = async () => {
    try {
      if (!user) return;
      setLoad(true);
      setError(false);
      await sendEmailVerification(user);
      
      toast("Verification Email Sent", {
        description: "Check your inbox and click the link to verify",
      });

      console.log("Verification email sent!");
      await signOut(auth);
      navigate("/signin");

    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setError(true);
    } finally {
      setLoad(false);
    }
  };
  return (
    <div className="mt-2">
      <Alert className="flex flex-col sm:flex-row items-center justify-between">
        <AlertTitle className="mb-0">
          You have not verified your email address.
        </AlertTitle>
        <AlertDescription className="mt-0 pt-2 sm:pt-0">
          <Button size="sm" onClick={sendVerificationEmail} disabled={load}>
            {load ? <Spinner /> : <></>}
            Send Email
          </Button>
          {error ? errorMessage : <></>}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default VerificationHeader;
