import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Send, Cpu, Shield, AlertTriangle, Zap, CheckCircle2, X, Info, ChevronRight, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export default function CausalInvestigationTerminal() {
  const [history, setHistory] = useState([
    { role: 'assistant', content: 'Causal Inference Engine Ready. Ingesting eBPF topology and PSI metrics. How can I assist with your investigation?' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsProcessing(true);

    // Mock response logic
    setTimeout(() => {
      let response = 'Analyzing propagation paths...';
      if (userMsg.toLowerCase().includes('pvc') || userMsg.toLowerCase().includes('latency')) {
        response = 'Root Cause Analysis Complete: [timeseries-db] is experiencing 120ms PVC write latency. Causal link mapped to [analytics-engine] probe failures. Blast radius: 3 services in [analytics] namespace.';
      } else if (userMsg.toLowerCase().includes('remediate') || userMsg.toLowerCase().includes('fix')) {
        response = 'Remediation Plan Generated: Increase IOPS on storage-class "premium-ssd" for pod [timeseries-db]. Risk: Low. Impact: Restores write throughput within 45s. Awaiting operator approval.';
      }
      setHistory(prev => [...prev, { role: 'assistant', content: response }]);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="glass-panel flex flex-col h-full bg-[#050507] border-[#1a1a23]">
      <div className="p-3 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01] shrink-0">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent-purple" />
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Natural Language Causal Interface</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-mono text-gray-600 uppercase">Model: GPT4-INFRA</span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 style-scrollbar">
        {history.map((msg, idx) => (
          <div key={idx} className={cn(
            "flex flex-col gap-1",
            msg.role === 'user' ? 'items-end' : 'items-start'
          )}>
            <div className="flex items-center gap-2 px-1">
              <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{msg.role}</span>
              {msg.role === 'assistant' && <div className="w-1 h-1 bg-accent-purple rounded-full" />}
            </div>
            <div className={cn(
              "max-w-[90%] p-3 rounded-lg text-[11px] leading-relaxed",
              msg.role === 'user' 
                ? 'bg-accent-blue/10 border border-accent-blue/20 text-accent-blue font-bold italic'
                : 'bg-white/[0.03] border border-white/[0.05] text-gray-300 font-medium font-sans'
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      {/* HITL Action Preview */}
      <AnimatePresence>
        {history.some(m => m.content.includes('operator approval')) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 mx-4 mb-2 bg-accent-purple/10 border border-accent-purple/30 rounded-lg flex flex-col gap-3"
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-accent-purple shrink-0 mt-1" />
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-accent-purple uppercase tracking-[0.1em]">Approval Required: Scaling IOPS</h4>
                <p className="text-[11px] text-gray-200 leading-snug">Scaling storage resources for <span className="font-bold text-white uppercase tracking-tighter">timeseries-db</span> from 2,000 to 10,000 IOPS.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col p-2 bg-white/5 rounded border border-white/5">
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Expected Outcome</span>
                <p className="text-[9px] text-accent-green font-bold uppercase tracking-tight">Recovery in &lt;60s</p>
              </div>
              <div className="flex flex-col p-2 bg-white/5 rounded border border-white/5">
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Risk Level</span>
                <p className="text-[9px] text-gray-300 font-bold uppercase tracking-tight">Minimal / Automatic</p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button className="flex-1 py-1.5 bg-accent-purple text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve Patch
              </button>
              <button className="flex-1 py-1.5 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-white/10 transition-all">
                Reject Action
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 pt-2 border-t border-white/[0.05] bg-[#0a0a0c]">
        <div className="relative group">
          <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-accent-purple transition-colors" />
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Execute investigation query..."
            className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-12 text-[11px] font-mono focus:outline-none focus:border-accent-purple/50 transition-all placeholder:text-gray-700"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-accent-purple hover:text-white disabled:opacity-30 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          {['Identify Root Cause', 'Analysis affected', 'Check IOPS'].map(cmd => (
            <button key={cmd} onClick={() => setInput(cmd)} className="text-[8px] font-bold px-2 py-1 rounded bg-white/5 border border-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300 transition-all uppercase tracking-tighter">
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
