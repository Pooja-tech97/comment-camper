import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { 'agent-id': string }, HTMLElement>;
    }
  }
}

const AICoach = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  useEffect(() => {
    // Load ElevenLabs widget script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  if (!user) return null;

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
              <Sparkles className="w-5 h-5 text-rose-gold" />
              <h1 className="text-lg font-semibold text-cream">AI Wellness Coach</h1>
            </div>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Your Personal AI Wellness Coach
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a conversation with your AI coach about wellness, self-care, mindfulness, 
            or anything on your mind. She's here to listen and guide you on your journey.
          </p>
        </div>

        {/* ElevenLabs Widget Container */}
        <div className="flex justify-center items-center min-h-[500px] bg-card/50 rounded-2xl border border-border/50 backdrop-blur-sm p-8">
          <elevenlabs-convai agent-id="agent_1001kc3t20gxesr94xg3ec7yxy0y"></elevenlabs-convai>
        </div>

        {/* Tips Section */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="bg-card/30 rounded-xl p-4 border border-border/30">
            <h3 className="font-medium text-foreground mb-2">💬 Talk Naturally</h3>
            <p className="text-sm text-muted-foreground">
              Speak as you would to a friend. The AI understands natural conversation.
            </p>
          </div>
          <div className="bg-card/30 rounded-xl p-4 border border-border/30">
            <h3 className="font-medium text-foreground mb-2">🎯 Be Specific</h3>
            <p className="text-sm text-muted-foreground">
              Share what's on your mind - the more context, the better guidance you'll receive.
            </p>
          </div>
          <div className="bg-card/30 rounded-xl p-4 border border-border/30">
            <h3 className="font-medium text-foreground mb-2">🌸 Take Your Time</h3>
            <p className="text-sm text-muted-foreground">
              There's no rush. Pause, reflect, and engage at your own pace.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AICoach;
