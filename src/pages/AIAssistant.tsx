import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles, TrendingUp, DollarSign, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { mockProducts } from "@/data/mockData";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Speech synthesis - better voice selection and accent support
  const speak = useCallback((text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    // Clean markdown and special chars for better speech
    const cleanText = text
      .replace(/[#*_`~\[\]()>|]/g, '')
      .replace(/\n{2,}/g, '. ')
      .replace(/\n/g, ', ')
      .replace(/R\$/g, 'reais ')
      .replace(/(\d+)\.(\d+)/g, '$1 vírgula $2')
      .replace(/%/g, ' por cento')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "pt-BR";
    utterance.rate = 1.15;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    // Pick best pt-BR voice (prefer Google or Microsoft voices for quality)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoices = [
      voices.find(v => v.name.includes("Google") && v.lang === "pt-BR"),
      voices.find(v => v.name.includes("Microsoft") && v.lang === "pt-BR"),
      voices.find(v => v.lang === "pt-BR" && v.localService === false),
      voices.find(v => v.lang === "pt-BR"),
      voices.find(v => v.lang.startsWith("pt")),
    ];
    const bestVoice = preferredVoices.find(Boolean);
    if (bestVoice) utterance.voice = bestVoice;
    
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  // Speech recognition
  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: "Navegador não suporta reconhecimento de voz", variant: "destructive" });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join("");
      setInput(transcript);
      if (event.results[0].isFinal) {
        setIsListening(false);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, toast]);

  // Stream chat
  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;

    const userMsg: Message = { role: "user", content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erro na conexão" }));
        throw new Error(err.error || "Erro na conexão com IA");
      }

      if (!resp.body) throw new Error("Sem resposta");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Speak final response
      if (assistantSoFar) speak(assistantSoFar);
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Assistente IA</h1>
            <p className="text-xs text-muted-foreground">Converse por texto ou voz</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setVoiceEnabled(!voiceEnabled);
            if (voiceEnabled) window.speechSynthesis.cancel();
          }}
          className="gap-2"
        >
          {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {voiceEnabled ? "Voz ativa" : "Voz muda"}
        </Button>
      </div>

      {/* Chat area */}
      <Card className="flex-1 flex flex-col overflow-hidden border-border/50">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Olá! Sou o assistente da Rede Condor</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Posso ajudar com análises de produtos, preços, margens, tabloides e decisões comerciais. 
                  Digite ou use o microfone para conversar.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Quais produtos têm melhor margem?", "Analise os preços competitivos", "Sugestões para o próximo tabloide"].map(q => (
                  <Button key={q} variant="outline" size="sm" className="text-xs" onClick={() => sendMessage(q)}>
                    {q}
                  </Button>
                ))}
              </div>

              {/* Product cards */}
              <div className="mt-6 w-full max-w-2xl">
                <p className="text-xs font-medium text-muted-foreground mb-3">Produtos em destaque — clique para perguntar</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mockProducts.slice(0, 6).map(product => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:shadow-md transition-all hover:border-primary/30 group"
                      onClick={() => sendMessage(`Analise o produto ${product.name} (preço R$${product.price.toFixed(2)}, margem ${(product.margin * 100).toFixed(0)}%, vendas ${product.sales} un). Vale colocar no tabloide?`)}
                    >
                      <CardContent className="p-3 flex flex-col items-center gap-2">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-14 h-14 object-contain rounded-lg bg-muted/50 p-1"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                        />
                        <span className="text-xs font-medium text-foreground text-center line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                          {product.name}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap justify-center">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1">
                            <DollarSign className="h-2.5 w-2.5" />
                            R${product.price.toFixed(2)}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
                            <TrendingUp className="h-2.5 w-2.5" />
                            {(product.margin * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1 text-muted-foreground">
                          <Package className="h-2.5 w-2.5" />
                          {product.sales} vendas
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:my-1 [&>ol]:my-1">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === "user" && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">EU</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-3 items-center">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Pensando...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="border-t border-border/50 p-4">
          <div className="flex gap-2 items-center">
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              onClick={toggleListening}
              className={`shrink-0 ${isListening ? "animate-pulse" : ""}`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Ouvindo..." : "Digite sua mensagem..."}
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={() => sendMessage()} disabled={!input.trim() || isLoading} size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
