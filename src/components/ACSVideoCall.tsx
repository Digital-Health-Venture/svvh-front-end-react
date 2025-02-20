import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Call, CallAgent } from "@azure/communication-calling";

import { AzureCommunicationTokenCredential } from "@azure/communication-common";

import {
  CallClientProvider,
  CallAgentProvider,
  CallProvider,
  createStatefulCallClient,
  StatefulCallClient,
  createAzureCommunicationCallAdapter,
  CallAdapter,
  CallComposite,
} from "@azure/communication-react";

import useACSTransaction from "../hooks/useACSTransaction";

const ACSVideoCall: React.FC = () => {
  const userData = useMemo(
    () => ({
      firstName: "John",
      lastName: "Doe",
      hn: "12345",
      birthdate: "2000-01-01",
      idCard: "ID12345",
      tel: "1234567890",
      email: "john.doe@example.com",
      gender: "Male",
    }),
    []
  );

  const userConsent = useMemo(
    () => ({
      isAcceptTerms: true,
      isConsent3rdParty: true,
      isConsentMarketing: true,
    }),
    []
  );

  const { session, isTransactionReady } = useACSTransaction(
    "PartnerName",
    userData,
    userConsent
  );

  const userAccessToken = session?.callAccessToken || "";
  const userId = session?.callUserId || "";
  const displayName = session?.callPatientName || "ACS DEMO";
  const callSessionId = session?.callSessionId || "";

  const tokenCredential = useMemo(
    () =>
      userAccessToken
        ? new AzureCommunicationTokenCredential(userAccessToken)
        : undefined,
    [userAccessToken]
  );

  const [statefulCallClient, setStatefulCallClient] =
    useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent>();
  const [call, setCall] = useState<Call>();
  const [callAdapter, setCallAdapter] = useState<CallAdapter>();
  const [callAgentInitialized, setCallAgentInitialized] = useState(false);

  useEffect(() => {
    if (userId && !statefulCallClient) {
      setStatefulCallClient(
        createStatefulCallClient({ userId: { communicationUserId: userId } })
      );
    }
  }, [userId, statefulCallClient]);

  useEffect(() => {
    if (
      statefulCallClient &&
      tokenCredential &&
      !callAgent &&
      !callAgentInitialized
    ) {
      setCallAgentInitialized(true);
      const createCallAgent = async () => {
        try {
          const agent = await statefulCallClient.createCallAgent(
            tokenCredential,
            { displayName }
          );
          setCallAgent(agent);
        } catch (error) {
          console.error("Error creating call agent:", error);
          setCallAgentInitialized(false);
        }
      };
      createCallAgent();
    }
  }, [
    statefulCallClient,
    tokenCredential,
    callAgent,
    displayName,
    callAgentInitialized,
  ]);

  useEffect(() => {
    if (callAgent && callSessionId && !callAdapter) {
      const createAdapter = async () => {
        try {
          const adapter = await createAzureCommunicationCallAdapter({
            userId: { communicationUserId: userId },
            displayName,
            credential: tokenCredential!,
            locator: { groupId: callSessionId },
          });
          setCallAdapter(adapter);
        } catch (error) {
          console.error("Error creating call adapter:", error);
        }
      };
      createAdapter();
    }
  }, [
    callAgent,
    callSessionId,
    tokenCredential,
    userId,
    displayName,
    callAdapter,
  ]);

  const startCall = useCallback(() => {
    if (!call && callAgent && callSessionId) {
      const callOptions = {
        videoOptions: { localVideoStreams: [] },
        audioOptions: { muted: false },
      };
      const activeCall = callAgent.join(
        { groupId: callSessionId },
        callOptions
      );
      setCall(activeCall);
    }
  }, [call, callAgent, callSessionId]);

  useEffect(() => {
    if (isTransactionReady) {
      startCall();
    }
  }, [isTransactionReady, startCall, call]);

  useEffect(() => {
    return () => {
      if (callAgent) {
        callAgent.dispose();
      }
    };
  }, [callAgent]);

  useEffect(() => {
    console.log("callAdapter", callAdapter);
  }, [callAdapter]);

  return (
    <div style={{ height: "100vh" }}>
      {statefulCallClient && callAgent && callAdapter ? (
        <CallClientProvider callClient={statefulCallClient}>
          <CallAgentProvider callAgent={callAgent}>
            {call ? (
              <CallProvider call={call}>
                <CallComposite adapter={callAdapter} />
              </CallProvider>
            ) : (
              <button onClick={startCall}>Start Call</button>
            )}
          </CallAgentProvider>
        </CallClientProvider>
      ) : (
        <p>Initializing call...</p>
      )}
    </div>
  );
};

export default ACSVideoCall;
