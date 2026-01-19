import React, { useState, useEffect } from 'react';
import {
  Shield,
  Activity,
  FolderLock,
  History,
  Fingerprint,
  RefreshCw,
  Globe,
  ShieldCheck,
  Terminal,
  Link2,
  FileSearch,
  Zap,
  Menu,
  X
} from 'lucide-react';

// Firebase Governance Substrate
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, onSnapshot, limit } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, User } from "firebase/auth";

// Governance Logic Substrates
import { initializeDriveAuth, requestSovereignAccessToken } from './utils/drive/driveAuth';
import { generateExtractionPulse } from './utils/logic/extractionEngine';

/**
 * RPR-KONTROL-PM Governance Tower (v1.6.1)
 * Visual: Glassmorphic Spark (Cyan #00D9FF)
 * Role: Sovereign oversight and regional harbor integrity.
 * Update: Mobile-First Responsive Hardening.
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "rpr-myaudit",
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const appId = "default-app-id";

export default function App() {
  const [activeTab, setActiveTab] = useState('telemetry');
  const [substrate, setSubstrate] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [vaultToken, setVaultToken] = useState<string | null>(null);
  const [extractionStatus, setExtractionStatus] = useState<any>(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (!u) await signInAnonymously(auth);
      setUser(u);
    });

    initializeDriveAuth().catch(() => console.warn("Sovereign Drive Substrate Offline"));

    fetch('/data/GOV-SUBSTRATES.json')
      .then(res => res.json())
      .then(setSubstrate)
      .catch(() => console.warn("Substrate Manifest Offline"));

    setExtractionStatus(generateExtractionPulse());
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'governance_sessions'), limit(15));
    return onSnapshot(q, (snap) => {
      setSessions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.error("Firestore Ledger Link Failure:", err));
  }, [user]);

  const handleConnectVault = () => {
    requestSovereignAccessToken((token) => setVaultToken(token));
  };

  const getTabStyle = (id: string) => (
    activeTab === id
      ? "bg-[#00D9FF]/10 border-[#00D9FF]/40 text-[#00D9FF]"
      : "bg-[#16191E]/60 border-white/5 text-slate-500 hover:text-slate-300"
  );

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-200 flex flex-col font-sans selection:bg-[#00D9FF]/30 overflow-x-hidden">
      {/* HEADER */}
      <header className="p-4 md:p-8 flex items-center justify-between border-b border-white/5 bg-[#111622]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-11 md:h-11 bg-[#00D9FF] rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-900/20">
            <Shield size={20} className="text-[#0A0E1A] md:hidden" />
            <Shield size={24} className="text-[#0A0E1A] hidden md:block" />
          </div>
          <div>
            <h1 className="text-sm md:text-lg font-bold tracking-tight text-white uppercase leading-none">RPR-KONTROL</h1>
            <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1">Governance Tower</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden sm:flex flex-col items-end">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" />
                <span className="text-[9px] font-black uppercase text-slate-500">v1.6.1 Sovereign</span>
             </div>
             <span className="text-[10px] font-mono text-slate-400">{user?.uid?.substring(0, 8).toUpperCase() || "AUTH..." }...</span>
          </div>
          <button className="flex items-center gap-2 p-3 md:px-8 md:py-3 bg-[#00D9FF] text-[#0A0E1A] text-[11px] font-black uppercase rounded-xl md:rounded-2xl hover:bg-[#00B8D9] transition-all active:scale-95">
            <RefreshCw size={14} /> <span className="hidden md:inline">FORCE SYNC</span>
          </button>
        </div>
      </header>

      {/* MOBILE-ADAPTIVE NAVIGATION TABS */}
      <nav className="p-3 md:p-4 flex justify-start md:justify-center gap-3 bg-[#0D121F]/90 border-b border-white/5 sticky top-[73px] md:top-[107px] z-40 overflow-x-auto no-scrollbar whitespace-nowrap px-4 md:px-0">
        {[
          { id: 'telemetry', label: 'TELEMETRY', icon: Activity },
          { id: 'extraction', label: 'EXTRACTION PULSE', icon: FileSearch },
          { id: 'vault', label: 'GOVERNANCE VAULT', icon: FolderLock },
          { id: 'sessions', label: 'AUDIT SESSIONS', icon: History }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 transition-all text-[9px] md:text-[10px] font-black tracking-widest uppercase px-4 py-2.5 md:px-6 md:py-3 rounded-xl border ${getTabStyle(tab.id)}`}
          >
            <tab.icon size={14} className="md:w-4 md:h-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-4 md:p-12 max-w-7xl mx-auto w-full">
        {/* Responsive Section Header */}
        <div className="mb-8 md:mb-14">
           <h2 className="text-[#00D9FF] text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-4 flex items-center gap-3">
             <div className="w-4 md:w-6 h-[1px] bg-[#00D9FF]" /> // INITIALIZE GOVERNANCE SESSION
           </h2>
           <p className="text-[#8B92A8] text-xs md:text-sm leading-relaxed max-w-3xl opacity-80">
             Sovereign oversight of organizational substrates. Monitoring extraction telemetry and forensic hash placeholders for governance verification.
           </p>
        </div>

        {activeTab === 'telemetry' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 animate-in fade-in duration-700">
            <div className="bg-[#16191E] border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Fingerprint size={18} className="text-[#00D9FF]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SUBSTRATE IDENTITY</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-white uppercase truncate">{substrate?.substrate?.identity || "ANONYMOUS"}</div>
              <p className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-widest">PROVIDER: {substrate?.substrate?.provider || "WIF-V2"}</p>
            </div>
            <div className="bg-[#16191E] border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Globe size={18} className="text-[#00D9FF]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">REGIONAL ANCHOR</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-white font-mono lowercase">asia-southeast1</div>
              <p className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-widest">SINGAPORE HARBOR</p>
            </div>
            <div className="bg-[#16191E] border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <Zap size={18} className="text-[#00D9FF]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ENGINE PULSE</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-white uppercase">{extractionStatus?.integrity || "READY"}</div>
              <p className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-widest">PHASE 1.4.6 ACTIVE</p>
            </div>
          </div>
        )}

        {activeTab === 'extraction' && (
          <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
             <div className="bg-[#16191E]/40 border border-white/5 p-6 md:p-10 rounded-2xl md:rounded-[3rem] shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <Terminal size={18} className="text-[#00D9FF]" />
                  <h3 className="text-[#00D9FF] text-[10px] font-black uppercase tracking-[0.3em] leading-none">// TELEMETRY SIGNALS</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  <div className="bg-black/50 p-6 md:p-8 rounded-xl md:rounded-2xl border border-white/5">
                     <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Forensic Signal Log</div>
                     <div className="space-y-3">
                        {extractionStatus?.signals.map((sig: string, i: number) => (
                          <div key={i} className="flex items-center gap-3 text-[11px] font-mono text-cyan-400 break-words">
                             <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-cyan-400 shrink-0" />
                             {sig}
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-black/50 p-6 md:p-8 rounded-xl md:rounded-2xl border border-white/5">
                     <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Verification Hash</div>
                     <div className="text-xs font-mono text-slate-400 break-all bg-black p-4 rounded-xl border border-white/5 shadow-inner">
                        {extractionStatus?.hash}
                     </div>
                  </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="bg-[#16191E]/60 border border-white/5 rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in duration-700">
             <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-black/30 text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 md:px-10 py-5 md:py-6">Event Hash</th>
                      <th className="px-6 md:px-10 py-5 md:py-6">Identity</th>
                      <th className="px-6 md:px-10 py-5 md:py-6 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {sessions.length === 0 ? (
                       <tr><td colSpan={3} className="px-6 md:px-10 py-16 text-center text-slate-700 font-bold uppercase text-[9px] tracking-widest animate-pulse">Syncing Forensic Ledger...</td></tr>
                     ) : (
                       sessions.map((s, i) => (
                         <tr key={i} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 md:px-10 py-4 md:py-6 text-xs font-mono text-[#00D9FF]">{s.id.substring(0, 10).toUpperCase()}</td>
                            <td className="px-6 md:px-10 py-4 md:py-6 text-xs font-bold text-white uppercase">{s.actor_identity || "SYSTEM"}</td>
                            <td className="px-6 md:px-10 py-4 md:py-6 text-right text-xs font-mono text-slate-500 group-hover:text-slate-300">{s.timestamp?.seconds ? new Date(s.timestamp.seconds * 1000).toLocaleTimeString() : "N/A"}</td>
                         </tr>
                       ))
                     )}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {/* VAULT View (Simplified Mobile UI) */}
        {activeTab === 'vault' && (
          <div className="flex flex-col items-center justify-center py-12 md:py-20 bg-[#16191E]/40 border border-white/5 rounded-[2rem] md:rounded-[4rem] text-center space-y-6 md:space-y-8 animate-in zoom-in-95 duration-500">
            {!vaultToken ? (
              <>
                <div className="w-16 h-16 md:w-24 md:h-24 bg-[#00D9FF]/10 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-[#00D9FF]">
                  <Link2 size={32} className="md:w-12 md:h-12" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">Vault Offline</h3>
                <button onClick={handleConnectVault} className="px-8 py-4 md:px-12 md:py-5 bg-[#00D9FF] text-[#0A0E1A] text-[10px] md:text-xs font-black uppercase rounded-2xl md:rounded-3xl shadow-xl active:scale-95 transition-all">
                  Connect Drive
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 text-[#00D9FF]">
                <ShieldCheck size={48} />
                <span className="font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">Vault Bridge Active</span>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="p-8 md:p-16 text-center text-[8px] md:text-[10px] font-bold text-slate-800 uppercase tracking-[0.4em] md:tracking-[0.6em] opacity-40">
        RPR COMMUNICATIONS, LLC // TS-Λ3 // AUTHORITATIVE NODE
      </footer>
    </div>
  );
}
