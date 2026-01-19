import React, { useState, useEffect } from 'react';
import {
  Activity,
  FolderLock,
  History,
  Fingerprint,
  Search,
  FileText,
  Download,
  RefreshCw,
  Server,
  Globe,
  Clock,
  ShieldCheck,
  Terminal,
  Link2
} from 'lucide-react';

// Firebase Governance Substrate
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, onSnapshot, limit } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, User } from "firebase/auth";

// Drive Substrate Logic (Phase 3)
import { initializeDriveAuth, requestSovereignAccessToken } from './utils/drive/driveAuth';

/**
 * RPR-KONTROL-PM Governance Tower (v1.6.0)
 * Visual: Glassmorphic Spark (Cyan #00D9FF)
 * Organization: PRP-COMMUNICATIONS-LLC
 * Phase 3: Sovereign Vault Activation
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

// --- GLASS DESIGN TOKENS ---
const glassBadgeStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "14px",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
  color: "rgba(255, 255, 255, 0.95)",
  fontWeight: "500",
  letterSpacing: "0.5px",
  padding: "8px 20px",
  transition: "all 0.3s ease"
};

const activeTabStyle: React.CSSProperties = {
  ...glassBadgeStyle,
  background: "rgba(0, 217, 255, 0.12)",
  borderColor: "rgba(0, 217, 255, 0.4)",
  color: "#00D9FF"
};

const NavTab = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    style={active ? activeTabStyle : glassBadgeStyle}
    className={`flex items-center gap-2.5 group cursor-pointer ${!active ? 'opacity-60 hover:opacity-100' : ''}`}
  >
    <Icon size={16} className={active ? 'text-[#00D9FF]' : 'text-slate-500'} />
    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
  </button>
);

const TelemetryCard = ({ icon: Icon, title, value, detail }: any) => (
  <div className="bg-[#16191E]/60 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-[#00D9FF]/30 transition-all">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2.5 bg-black/40 rounded-xl text-[#00D9FF] border border-white/5">
        <Icon size={18} />
      </div>
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</h3>
    </div>
    <div className="text-xl font-mono text-white mb-2 tracking-tighter">{value}</div>
    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{detail}</div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('telemetry');
  const [substrate, setSubstrate] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [vaultToken, setVaultToken] = useState<string | null>(null);
  const [vaultFilter, setVaultFilter] = useState('POLICY');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) await signInAnonymously(auth);
      setUser(u);
    });

    // Initialize Phase 3 Handshake
    initializeDriveAuth().catch(() => console.warn("Sovereign Drive Substrate Offline"));

    fetch('/data/GOV-SUBSTRATES.json')
      .then(res => res.json())
      .then(setSubstrate)
      .catch(() => console.warn("Substrate Manifest Offline"));

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'governance_sessions'), limit(15));
    return onSnapshot(q, (snap) => {
      setSessions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [user]);

  const handleConnectVault = () => {
    requestSovereignAccessToken((token) => setVaultToken(token));
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-slate-200 flex flex-col font-sans">
      <header className="p-8 flex items-center justify-between border-b border-white/5 bg-[#16191E]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <svg width="140" height="44" viewBox="0 0 140 44" className="h-10 md:h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 4 6 L 22 6 L 13 22 Z" stroke="#00D9FF" strokeWidth="1.5" fill="none" />
            <path d="M 10 12 Q 13 10, 16 12 Q 13 15, 10 12" stroke="#00D9FF" strokeWidth="1.2" fill="none" />
            <text x="28" y="16" fontSize="11" fontWeight="900" fontFamily="Inter, sans-serif" fill="#FFFFFF" letterSpacing="0.1" className="uppercase">RPR-KONTROL</text>
            <text x="28" y="26" fontSize="6.5" fontWeight="700" fontFamily="Inter, sans-serif" fill="#64748B" letterSpacing="0.25" className="uppercase">GOVERNANCE TOWER</text>
          </svg>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden xl:flex flex-col items-end">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" />
              <span className="text-[9px] font-black uppercase text-slate-500">v1.6.0 Sovereign</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">{user?.uid?.substring(0, 12).toUpperCase() || "AUTH..."}</span>
          </div>
          <button className="px-8 py-3 bg-[#00D9FF] text-[#0F1115] text-[11px] font-black uppercase rounded-2xl shadow-lg shadow-cyan-950">
            Force Sync
          </button>
        </div>
      </header>

      <nav className="p-4 flex justify-center gap-4 bg-[#111318]/90 border-b border-white/5 sticky top-[107px] z-40">
        <NavTab icon={Activity} label="LIVE VIEW" active={activeTab === 'telemetry'} onClick={() => setActiveTab('telemetry')} />
        <NavTab icon={FolderLock} label="THE VAULT" active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} />
        <NavTab icon={History} label="THE SESSIONS" active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} />
        <NavTab icon={Fingerprint} label="ICAM" active={activeTab === 'icam'} onClick={() => setActiveTab('icam')} />
      </nav>

      <main className="flex-grow p-12 max-w-7xl mx-auto w-full">
        <div className="mb-14">
          <h2 className="text-[#00D9FF] text-xs font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
            <div className="w-6 h-[1px] bg-[#00D9FF]" /> Sovereign Node
          </h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-3xl">
            Centralized oversight of organizational substrates and the Sovereign Drive bridge.
          </p>
        </div>

        {activeTab === 'telemetry' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <TelemetryCard icon={Server} title="Substrate Identity" value={substrate?.substrate?.identity || "HANDSHAKING..."} detail={`Release: ${substrate?.metadata?.release || "v1.5.x"}`} />
            <TelemetryCard icon={Clock} title="Heartbeat" value={new Date().toLocaleTimeString()} detail="Verified Pulse" />
            <TelemetryCard icon={Globe} title="Regional Anchor" value="asia-southeast1" detail="Singapore Harbor" />
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="space-y-10">
            {!vaultToken ? (
              <div className="bg-[#16191E]/60 border border-white/10 p-20 rounded-[4rem] text-center space-y-8 backdrop-blur-xl">
                <div className="w-24 h-24 bg-[#00D9FF]/10 rounded-3xl mx-auto flex items-center justify-center text-[#00D9FF]">
                  <Link2 size={48} />
                </div>
                <h3 className="text-2xl font-black text-white">Sovereign Drive Offline</h3>
                <button onClick={handleConnectVault} className="px-12 py-5 bg-[#00D9FF] text-[#0F1115] text-xs font-black uppercase rounded-3xl shadow-xl shadow-[#00D9FF]/10">
                  Connect Sovereign Drive
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="p-8 bg-black/40 border border-cyan-500/20 rounded-3xl flex items-center gap-4 text-cyan-400">
                  <ShieldCheck size={24} />
                  <span className="text-xs font-black uppercase tracking-widest">Bridge Active</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="bg-[#16191E]/60 border border-white/5 rounded-[3rem] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-black/30 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <tr>
                  <th className="px-10 py-6">Event</th>
                  <th className="px-10 py-6">Identity</th>
                  <th className="px-10 py-6 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sessions.map((s, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="px-10 py-6 text-sm font-bold text-white">{s.event}</td>
                    <td className="px-10 py-6 text-xs font-mono text-[#00D9FF]">{s.actor_identity}</td>
                    <td className="px-10 py-6 text-right text-xs font-mono text-slate-500">{s.timestamp?.seconds ? new Date(s.timestamp.seconds * 1000).toLocaleTimeString() : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'icam' && (
          <div className="bg-[#16191E]/40 border border-white/5 p-12 rounded-[3.5rem] space-y-8">
            <div className="flex items-center gap-6 mb-8 text-[#00D9FF]">
              <Fingerprint size={32} />
              <h3 className="text-2xl font-black text-white leading-none">ICAM Policy</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
              <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                <div className="text-[10px] text-slate-600 mb-2 uppercase font-black">Provider</div>
                <div className="text-sm text-cyan-400">github-actions-provider-v2</div>
              </div>
              <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                <div className="text-[10px] text-slate-600 mb-2 uppercase font-black">Pool</div>
                <div className="text-sm text-cyan-400">github-actions-pool</div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="p-12 text-center text-[10px] font-black text-slate-800 uppercase tracking-[0.6em]">
        PRP COMMUNICATIONS, LLC // TS-Λ3
      </footer>
    </div>
  );
}
