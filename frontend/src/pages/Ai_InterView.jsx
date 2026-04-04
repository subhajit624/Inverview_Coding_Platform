import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserButton, useUser } from "@clerk/react";
import {
  ArrowLeft,
  Bot,
  Clock3,
  Loader2,
  Mic,
  MicOff,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

const INTERVIEW_SECONDS = 10 * 60;

const STYLES = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
.fade-up   { animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both; }
.fade-up-1 { animation-delay: .05s; }
.fade-up-2 { animation-delay: .12s; }
.fade-up-3 { animation-delay: .20s; }
.shimmer-text {
  background: linear-gradient(90deg, #818cf8 0%, #34d399 50%, #818cf8 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
`;

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const Ai_InterView = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role;
  const level = location.state?.level || "mid";

  const [interviewId, setInterviewId] = useState("");
  const [conversation, setConversation] = useState([]);
  const [timeLeft, setTimeLeft] = useState(INTERVIEW_SECONDS);

  const [loadingStart, setLoadingStart] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [overall, setOverall] = useState(null);
  const [micBlockedReason, setMicBlockedReason] = useState("");

  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const hasStartedRef = useRef(false);
  const hasEndedRef = useRef(false);
  const stopRequestedRef = useRef(false);

  const hasRecognitionApi = useMemo(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  const isSecureMicContext = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.isSecureContext ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    );
  }, []);

  const recognitionSupported = hasRecognitionApi && isSecureMicContext;

  const speechSupported = useMemo(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.speechSynthesis && window.SpeechSynthesisUtterance);
  }, []);

  const speakText = (text) => {
    if (!speechSupported || !text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      stopRequestedRef.current = true;
      recognitionRef.current.stop();
    }
  };

  const ensureMicPermission = async () => {
    if (typeof window === "undefined") return false;

    if (!navigator.mediaDevices?.getUserMedia) {
      return true;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      const permissionError =
        error?.name === "NotAllowedError" || error?.name === "SecurityError";
      setMicBlockedReason(
        permissionError
          ? "Microphone permission denied. Allow mic access in browser settings."
          : "Microphone is unavailable. Check your input device and browser permissions."
      );
      toast.error(
        permissionError
          ? "Microphone permission denied."
          : "Unable to access microphone."
      );
      return false;
    }
  };

  const handleEndInterview = async (showToast = false) => {
    if (!interviewId || hasEndedRef.current) return;
    hasEndedRef.current = true;

    try {
      setIsEnding(true);
      stopListening();
      if (speechSupported) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }

      const { data } = await axiosInstance.post("/ai-interview/end", { interviewId });

      setConversation(Array.isArray(data?.conversation) ? data.conversation : conversation);
      setOverall({
        overallFeedback: data?.overallFeedback || "No overall feedback generated.",
        overallScore:
          typeof data?.overallScore === "number"
            ? data.overallScore
            : Number(data?.overallScore || 0),
      });

      if (showToast) {
        toast.success("Interview ended successfully.");
      }
    } catch (error) {
      hasEndedRef.current = false;
      toast.error(error.response?.data?.message || "Failed to end interview.");
    } finally {
      setIsEnding(false);
    }
  };

  const handleRespond = async (answer) => {
    if (!interviewId || !answer.trim() || hasEndedRef.current) return;

    try {
      setIsSubmitting(true);

      const { data } = await axiosInstance.post("/ai-interview/respond", {
        interviewId,
        userAnswer: answer.trim(),
      });

      const userMessage = {
        role: "user",
        content: answer.trim(),
        score: data?.score,
        feedback: data?.feedback,
      };

      const nextMessages = [userMessage];
      if (!data?.isLast && data?.nextQuestion) {
        nextMessages.push({ role: "ai", content: data.nextQuestion });
      }

      setConversation((prev) => [...prev, ...nextMessages]);

      if (data?.isLast) {
        await handleEndInterview();
        return;
      }

      if (data?.nextQuestion) {
        speakText(data.nextQuestion);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send your answer.");
    } finally {
      setIsSubmitting(false);
      setLiveTranscript("");
      transcriptRef.current = "";
    }
  };

  const startListening = async () => {
    if (!recognitionSupported || isSubmitting || isEnding || overall) return;

    setMicBlockedReason("");

    if (speechSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const hasPermission = await ensureMicPermission();
    if (!hasPermission) return;

    const RecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new RecognitionClass();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    let finalText = "";
    setLiveTranscript("");
    transcriptRef.current = "";
    stopRequestedRef.current = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let interim = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) {
          finalText += `${result[0].transcript} `;
        } else {
          interim += result[0].transcript;
        }
      }

      const merged = `${finalText}${interim}`.trim();
      transcriptRef.current = merged;
      setLiveTranscript(merged);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      const errorType = event?.error;
      let message = "Microphone capture failed. Please try again.";

      if (errorType === "not-allowed" || errorType === "service-not-allowed") {
        message = "Microphone permission blocked. Please allow access and retry.";
      } else if (errorType === "audio-capture") {
        message = "No microphone detected. Connect an input device and retry.";
      } else if (errorType === "network") {
        message = "Speech recognition network error. Check internet and retry.";
      } else if (errorType === "no-speech") {
        message = "No speech detected. Try speaking louder and closer to your mic.";
      }

      setMicBlockedReason(message);
      toast.error(message);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      const answer = (finalText || transcriptRef.current).trim();
      if (!answer) {
        if (!stopRequestedRef.current) {
          toast.error("No speech detected. Try again.");
        }
        return;
      }
      handleRespond(answer);
    };

    try {
      recognition.start();
    } catch (error) {
      const message =
        error?.name === "InvalidStateError"
          ? "Speech recognition is already active."
          : "Could not start speech recognition. Retry in a moment.";
      setMicBlockedReason(message);
      toast.error(message);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    if (!role || !level) {
      navigate("/select-role-interview", { replace: true });
      return;
    }

    if (!user?.id || hasStartedRef.current) return;

    const startInterview = async () => {
      try {
        setLoadingStart(true);
        hasStartedRef.current = true;

        const { data } = await axiosInstance.post("/ai-interview/start", {
          userId: user.id,
          role,
          level,
        });

        setInterviewId(String(data?.interviewId || ""));
        setConversation([{ role: "ai", content: data?.question || "" }]);

        if (data?.question) {
          speakText(data.question);
        }
      } catch (error) {
        hasStartedRef.current = false;
        toast.error(error.response?.data?.message || "Failed to start interview.");
        navigate("/select-role-interview", { replace: true });
      } finally {
        setLoadingStart(false);
      }
    };

    startInterview();
  }, [isLoaded, level, navigate, role, user?.id]);

  useEffect(() => {
    if (!interviewId || overall || hasEndedRef.current) return undefined;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [interviewId, overall]);

  useEffect(() => {
    if (timeLeft !== 0 || hasEndedRef.current || !interviewId) return;
    handleEndInterview(true);
  }, [interviewId, timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (speechSupported) window.speechSynthesis.cancel();
    };
  }, [speechSupported]);

  if (loadingStart) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white" style={{ background: "#08080f" }}>
        <div className="text-center">
          <Loader2 className="size-8 animate-spin mx-auto mb-3" style={{ color: "#818cf8" }} />
          <p style={{ color: "rgba(255,255,255,0.45)" }}>Preparing your AI interview...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{STYLES}</style>

      <div
        className="min-h-screen text-white overflow-x-hidden"
        style={{ background: "#08080f", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      >
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="fixed top-0 left-1/3 rounded-full pointer-events-none"
          style={{
            width: "460px",
            height: "460px",
            background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="fixed bottom-0 right-1/4 rounded-full pointer-events-none"
          style={{
            width: "320px",
            height: "320px",
            background: "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />

        <nav
          className="sticky top-0 z-40 border-b"
          style={{
            background: "rgba(8,8,15,0.88)",
            backdropFilter: "blur(24px)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Link
                to="/select-role-interview"
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border"
                style={{
                  color: "rgba(255,255,255,0.55)",
                  borderColor: "rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <ArrowLeft className="size-3.5" />
                Back
              </Link>
              <div
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border"
                style={{
                  color: "#818cf8",
                  borderColor: "rgba(99,102,241,0.35)",
                  background: "rgba(99,102,241,0.12)",
                }}
              >
                <Bot className="size-3.5" />
                {role} · {level}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border"
                style={{
                  color: timeLeft < 60 ? "#f87171" : "#4ade80",
                  borderColor:
                    timeLeft < 60 ? "rgba(248,113,113,0.35)" : "rgba(74,222,128,0.35)",
                  background:
                    timeLeft < 60 ? "rgba(248,113,113,0.12)" : "rgba(74,222,128,0.12)",
                }}
              >
                <Clock3 className="size-3.5" />
                {formatTime(timeLeft)}
              </div>
              <UserButton />
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <section
              className="fade-up fade-up-1 rounded-2xl border p-4 sm:p-5"
              style={{
                background: "rgba(12,12,22,0.9)",
                borderColor: "rgba(99,102,241,0.18)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-base sm:text-lg">Interview Conversation</h2>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="px-2 py-1 rounded-full border"
                    style={{
                      color: isSpeaking ? "#818cf8" : "rgba(255,255,255,0.45)",
                      borderColor: isSpeaking ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.12)",
                      background: isSpeaking ? "rgba(99,102,241,0.12)" : "transparent",
                    }}
                  >
                    <Volume2 className="size-3 inline mr-1" />
                    {isSpeaking ? "AI speaking" : "AI idle"}
                  </span>
                  <span
                    className="px-2 py-1 rounded-full border"
                    style={{
                      color: isListening ? "#4ade80" : "rgba(255,255,255,0.45)",
                      borderColor: isListening ? "rgba(74,222,128,0.35)" : "rgba(255,255,255,0.12)",
                      background: isListening ? "rgba(74,222,128,0.12)" : "transparent",
                    }}
                  >
                    <Mic className="size-3 inline mr-1" />
                    {isListening ? "Listening" : "Mic idle"}
                  </span>
                </div>
              </div>

              <div className="space-y-3 max-h-[58vh] overflow-y-auto pr-1">
                {conversation.map((message, index) => {
                  const isAi = message.role === "ai";

                  return (
                    <div key={`${message.role}-${index}`} className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
                      <div
                        className="max-w-[90%] sm:max-w-[78%] rounded-2xl px-4 py-3 border"
                        style={{
                          background: isAi ? "rgba(99,102,241,0.14)" : "rgba(0,0,0,0.35)",
                          borderColor: isAi ? "rgba(99,102,241,0.28)" : "rgba(34,197,94,0.24)",
                        }}
                      >
                        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.86)" }}>
                          {message.content}
                        </p>

                        {!isAi && (
                          <div className="mt-2 space-y-1.5">
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] border"
                              style={{
                                color: "#4ade80",
                                borderColor: "rgba(74,222,128,0.35)",
                                background: "rgba(74,222,128,0.1)",
                              }}
                            >
                              Score: {typeof message.score === "number" ? message.score.toFixed(1) : "-"}/10
                            </div>
                            {message.feedback && (
                              <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                                Feedback: {message.feedback}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {liveTranscript && (
                <div
                  className="mt-4 rounded-xl border px-3 py-2 text-sm"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {liveTranscript}
                </div>
              )}
            </section>

            <aside className="space-y-4">
              <div
                className="fade-up fade-up-2 rounded-2xl border p-4"
                style={{
                  background: "rgba(12,12,22,0.9)",
                  borderColor: "rgba(99,102,241,0.18)",
                }}
              >
                <h3 className="font-semibold text-sm mb-3">Response Controls</h3>

                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  disabled={!recognitionSupported || isSubmitting || isEnding || Boolean(overall)}
                  className="w-full h-11 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 mb-3"
                  style={{
                    background: isListening
                      ? "rgba(248,113,113,0.18)"
                      : "linear-gradient(135deg, rgba(99,102,241,0.92), rgba(34,197,94,0.92))",
                    border: isListening
                      ? "1px solid rgba(248,113,113,0.35)"
                      : "1px solid rgba(99,102,241,0.3)",
                    color: isListening ? "#fda4af" : "white",
                    cursor:
                      !recognitionSupported || isSubmitting || isEnding || overall
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      !recognitionSupported || isSubmitting || isEnding || overall ? 0.55 : 1,
                  }}
                >
                  {isListening ? <Square className="size-4" /> : <Mic className="size-4" />}
                  {isListening ? "Stop & Submit" : "Start Speaking"}
                </button>

                {!hasRecognitionApi && (
                  <p className="text-xs mb-2" style={{ color: "#fca5a5" }}>
                    <MicOff className="size-3 inline mr-1" />
                    SpeechRecognition is not supported in this browser. Use latest Chrome/Edge.
                  </p>
                )}

                {hasRecognitionApi && !isSecureMicContext && (
                  <p className="text-xs mb-2" style={{ color: "#fca5a5" }}>
                    <MicOff className="size-3 inline mr-1" />
                    Microphone requires HTTPS or localhost. Open the app in a secure context.
                  </p>
                )}

                {micBlockedReason && (
                  <p className="text-xs mb-2" style={{ color: "#fca5a5" }}>
                    <MicOff className="size-3 inline mr-1" />
                    {micBlockedReason}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => handleEndInterview(true)}
                  disabled={isEnding || !interviewId || Boolean(overall)}
                  className="w-full h-11 rounded-xl text-sm font-semibold border"
                  style={{
                    background: "rgba(248,113,113,0.12)",
                    borderColor: "rgba(248,113,113,0.35)",
                    color: "#fca5a5",
                    cursor: isEnding || !interviewId || overall ? "not-allowed" : "pointer",
                    opacity: isEnding || !interviewId || overall ? 0.55 : 1,
                  }}
                >
                  {isEnding ? "Ending..." : "End Interview"}
                </button>

                {(isSubmitting || isEnding) && (
                  <p className="mt-3 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                    <Loader2 className="size-3 inline animate-spin mr-1" />
                    {isSubmitting ? "Analyzing your answer..." : "Compiling overall feedback..."}
                  </p>
                )}
              </div>

              {overall && (
                <div
                  className="fade-up fade-up-3 rounded-2xl border p-4"
                  style={{
                    background: "rgba(12,12,22,0.95)",
                    borderColor: "rgba(99,102,241,0.3)",
                    boxShadow: "0 0 45px rgba(99,102,241,0.2)",
                  }}
                >
                  <div className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full border mb-3"
                    style={{
                      color: "#818cf8",
                      borderColor: "rgba(99,102,241,0.35)",
                      background: "rgba(99,102,241,0.12)",
                    }}
                  >
                    <Sparkles className="size-3.5" />
                    Final Evaluation
                  </div>

                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Overall Score</p>
                  <h3 className="font-black text-3xl mb-2">
                    <span className="shimmer-text">{Number(overall.overallScore || 0).toFixed(1)}/10</span>
                  </h3>

                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.68)" }}>
                    {overall.overallFeedback}
                  </p>

                  <Link
                    to="/interview-history"
                    className="mt-4 inline-flex text-xs px-3 py-1.5 rounded-lg border"
                    style={{
                      color: "#4ade80",
                      borderColor: "rgba(74,222,128,0.35)",
                      background: "rgba(74,222,128,0.12)",
                    }}
                  >
                    View Interview History
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ai_InterView;
