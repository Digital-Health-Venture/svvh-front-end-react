import { useEffect, useState, useRef } from "react";

import { transactionService, Session } from "../services/transactionService";

const useACSTransaction = (
  partnerName: string,
  userData: any,
  userConsent: any
) => {
  const [session, setSessionState] = useState<Session | null>(null);
  const [isTransactionReady, setIsTransactionReady] = useState(false);
  const hasStarted = useRef(false); // Track if transaction has already started

  useEffect(() => {
    if (hasStarted.current) return; // Prevent duplicate execution
    hasStarted.current = true;

    let intervalId: NodeJS.Timeout | null = null;

    const initiateTransactionFlow = async () => {
      try {
        // Step 1: Initialize session
        await transactionService.initSession(partnerName);

        // Step 2: Create session object
        const newSession = {
          CK: transactionService.getSessionCk(),
          SK: transactionService.getSessionSk(),
          transactionStatus: 0,
          transactionProgress: 0,
          callAccessToken: "",
          callSessionId: "",
          callUserId: "",
          callPatientName:  userData.firstName || "Default Name",
        };
        transactionService.setSession(newSession);

        // Step 3: Retrieve session and set state
        const sessionData = transactionService.getSession();
        if (!sessionData) throw new Error("Session data is undefined");
        setSessionState(sessionData);

        // Step 4: Register patient
        await transactionService.register(userData, userConsent, partnerName);

        // Step 5: Check if queue already exists
        const existingQueue = await transactionService.checkQueue();
        if (existingQueue && existingQueue.TransactionStatus !== 0) {
          console.log("Queue already exists, skipping queue creation.");
        } else {
          // Step 6: Create queue only if it doesn't exist
          const mockPartner: any = {
            name: partnerName,
            userToken: "userTokenMock",
            userConsent: {
              isAcceptTerms: true,
              isConsent3rdParty: true,
              isConsentMarketing: true,
            },
            hospitalId: "1",
          };
          await transactionService.createQueue(mockPartner);
        }

        // Step 7: Poll queue status
        intervalId = setInterval(async () => {
          const queueData = await transactionService.checkQueue();

          // Only proceed if the transaction status is 2 (call is picked up)
          if (queueData?.TransactionStatus === 2) {
            // Step 8: Retrieve updated session before starting call
            const updatedSession = transactionService.getSession();
            if (updatedSession) {
              setSessionState(updatedSession);
              setIsTransactionReady(true);
            }
            clearInterval(intervalId as NodeJS.Timeout); // Stop polling once status is 2
          }
        }, 2000);
      } catch (error) {
        console.error("Error during transaction flow:", error);
      }
    };

    initiateTransactionFlow();

    // Cleanup to stop polling if component unmounts
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [partnerName, userData, userConsent]);

  return { session, isTransactionReady };
};

export default useACSTransaction;
