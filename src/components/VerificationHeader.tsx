import { sendEmailVerification } from "firebase/auth";
import { useContext } from "react";
import { Context } from "../context/AuthContext";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "./ui/button";

const VerificationHeader = () => {
  const { user } = useContext(Context);

  if (!user || user.emailVerified) return null;

  const sendVerificationEmail = async () => {
    try {
      if (!user) return;
      await sendEmailVerification(user);
      console.log("Verification email sent!");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="mt-2">
      <Alert className="flex flex-col sm:flex-row items-center justify-between">
        <AlertTitle className="mb-0">You have not verified your email address.</AlertTitle>
        <AlertDescription className="mt-0 pt-2 sm:pt-0">
          <Button
            size="sm"
            onClick={sendVerificationEmail}
          >
            Send Email
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default VerificationHeader;
