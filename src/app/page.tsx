"use client";

import { useState, useEffect } from "react";
import { Copy, RefreshCw, Sparkles, Zap, Code, Smile, User, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SpotlightCard from "@/components/SpotlightCard";

type Joke = {
  id: number;
  type: string;
  setup: string;
  punchline: string;
};

const CATEGORIES = [
  { id: "random", label: "Random", apiPath: "https://official-joke-api.appspot.com/random_joke", icon: Zap },
  { id: "general", label: "General", apiPath: "https://official-joke-api.appspot.com/jokes/general/random", icon: Smile },
  { id: "programming", label: "Dev", apiPath: "https://official-joke-api.appspot.com/jokes/programming/random", icon: Code },
  { id: "knock-knock", label: "Knock Knock", apiPath: "https://official-joke-api.appspot.com/jokes/knock-knock/random", icon: User },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].id);
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPunchline, setShowPunchline] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchJoke = async (url: string) => {
    setLoading(true);
    setShowPunchline(false);
    setCopied(false);
    try {
      const res = await fetch(url);
      const data = await res.json();
      const newJoke = Array.isArray(data) ? data[0] : data;
      // Artificial delay for premium feel
      await new Promise((resolve) => setTimeout(resolve, 300));
      setJoke(newJoke);
    } catch (error) {
      console.error("Failed to fetch joke", error);
      setJoke({
        id: 0,
        type: "error",
        setup: "Transmission Interrupted.",
        punchline: "The void has claimed your joke.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const category = CATEGORIES.find((c) => c.id === activeTab);
    if (category) {
      fetchJoke(category.apiPath);
    }
  }, [activeTab]);

  const copyToClipboard = () => {
    if (joke) {
      const text = `${joke.setup}\n\n${joke.punchline}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 lg:p-8 font-geist-sans overflow-hidden bg-[#030014] text-white">

      {/* Deep Space Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-drift" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-purple-600/15 rounded-full blur-[150px] animate-drift-slow" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="z-10 w-full max-w-lg flex flex-col gap-6">

        {/* Minimal Header */}
        <header className="flex items-center justify-between px-2 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                JokeBox
              </h1>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="p-2 rounded-full glass-panel glass-panel-hover text-white/50 hover:text-white transition-colors" aria-label="Share this page">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Glass Card Container */}
        <div className="glass-panel rounded-3xl p-1 shadow-2xl backdrop-blur-2xl">
          {/* Tabs */}
          <div className="flex p-1 bg-black/20 rounded-2xl mb-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`relative flex-1 flex flex-col items-center justify-center py-3 rounded-xl gap-1 text-[10px] font-medium transition-all duration-300 ${isActive ? "text-white" : "text-white/60 hover:text-white/70"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="glass-tab"
                      className="absolute inset-0 bg-white/10 rounded-xl border border-white/5 shadow-inner"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 relative z-10 transition-transform duration-300 ${isActive ? "scale-110 text-indigo-300" : ""}`} />
                  <span className="relative z-10 tracking-wider uppercase">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="bg-black/20 rounded-2xl min-h-[400px] flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                >
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full" />
                    <div className="absolute inset-0 border-2 border-t-indigo-400 rounded-full animate-spin" />
                  </div>
                  <span className="text-xs font-medium text-indigo-300/50 uppercase tracking-[0.2em] animate-pulse">
                    Constructing...
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key={joke?.id}
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex-1 flex flex-col p-8 sm:p-10"
                >
                  {/* Meta */}
                  <div className="flex justify-between items-start mb-auto">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                      {joke?.type || "SYSTEM"}
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className="group relative p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors"
                      aria-label="Copy joke"
                    >
                      {copied ? <span className="absolute -left-12 top-1/2 -translate-y-1/2 text-[10px] text-emerald-400">Copied</span> : null}
                      <Copy className={`w-4 h-4 transition-transform ${copied ? "scale-90 text-emerald-400" : "group-hover:scale-110"}`} />
                    </button>
                  </div>

                  {/* Joke Text */}
                  <div className="my-8 space-y-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-semibold leading-relaxed text-white drop-shadow-lg">
                      {joke?.setup}
                    </h2>

                    <div className="min-h-[4rem] flex items-center justify-center">
                      {showPunchline ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative"
                        >
                          <div className="absolute -inset-4 bg-indigo-500/20 blur-xl rounded-full" />
                          <p className="relative text-xl sm:text-2xl font-medium text-indigo-200 italic">
                            "{joke?.punchline}"
                          </p>
                        </motion.div>
                      ) : (
                        <button
                          onClick={() => setShowPunchline(true)}
                          className="group flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300"
                        >
                          <span className="text-sm font-medium text-white/50 group-hover:text-indigo-300">
                            Reveal Punchline
                          </span>
                          <Sparkles className="w-3.5 h-3.5 text-white/30 group-hover:text-indigo-400 transition-colors" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="mt-auto">
                    <button
                      onClick={() => {
                        const category = CATEGORIES.find((c) => c.id === activeTab);
                        if (category) fetchJoke(category.apiPath);
                      }}
                      className="w-full group relative overflow-hidden rounded-xl bg-white text-black font-bold text-sm py-3.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
                        Get Another One
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-4">
          <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full glass-panel">
            <span className="text-[10px] font-medium text-white/30 uppercase tracking-widest hover:text-white/60 transition-colors cursor-default">
              JokeBox v2.1
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="text-[10px] font-medium text-white/30 uppercase tracking-widest hover:text-white/60 transition-colors cursor-default">
              Est. 2026
            </span>
          </div>
        </footer>

      </div>
    </main>
  );
}
