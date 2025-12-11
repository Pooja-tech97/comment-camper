import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useConversation } from "@elevenlabs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mic, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AGENT_ID = "agent_1001kc3t20gxesr94xg3ec7yxy0y";

const AICoach = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => console.log("Connected to agent"),
    onDisconnect: () => console.log("Disconnected from agent"),
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => {
      console.error("Conversation error:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect to voice agent. Please try again.",
      });
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-conversation', {
        body: { agentId: AGENT_ID },
      });

      if (error) {
        throw new Error(error.message || 'Failed to get conversation token');
      }

      if (!data?.signed_url) {
        throw new Error('No signed URL received');
      }

      await conversation.startSession({
        signedUrl: data.signed_url,
      });

      toast({
        title: "Connected",
        description: "Voice interface is ready. Start speaking!",
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Could not start voice chat.",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, toast]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    toast({
      title: "Disconnected",
      description: "Voice conversation ended.",
    });
  }, [conversation, toast]);

  if (!user) return null;

  const isConnected = conversation.status === "connected";

  return (
    <div className="min-h-screen bg-gradient-to-br from-mauve/20 via-background to-blush/20">
      {/* Header */}
      <header className="bg-primary/95 backdrop-blur-sm border-b border-cream/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/videos")}
                className="text-cream/80 hover:text-cream hover:bg-cream/10"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-rose-gold" />
              <h1 className="text-lg font-semibold text-cream">AI Wellness Coach</h1>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Your Personal AI Wellness Coach
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Have a voice conversation with your wellness companion
          </p>
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/30">
            <span 
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-muted-foreground"
              }`} 
            />
            <span className="text-sm text-muted-foreground">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        {/* Conversation Container */}
        <div className="bg-card/30 rounded-2xl border border-border/50 backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border/30">
            <Bot className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Conversation</span>
          </div>
          
          {/* Content Area */}
          <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
            <Bot className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">
              {isConnected 
                ? conversation.isSpeaking 
                  ? "AI is speaking..." 
                  : "Listening..."
                : "Start a conversation by clicking the microphone button below"
              }
            </p>
          </div>
        </div>

        {/* Microphone Button */}
        <div className="flex flex-col items-center mt-8">
          <button
            onClick={isConnected ? stopConversation : startConversation}
            disabled={isConnecting}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isConnected 
                ? "bg-red-500/80 hover:bg-red-500 text-white" 
                : "bg-cream hover:bg-cream/90 text-primary"
            } ${isConnecting ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
          >
            <Mic className="w-8 h-8" />
          </button>
          <p className="text-muted-foreground text-sm mt-4">
            {isConnecting 
              ? "Connecting..." 
              : isConnected 
                ? "Click to end conversation" 
                : "Click to start voice chat"
            }
          </p>
        </div>
      </main>
    </div>
  );
};

export default AICoach;
