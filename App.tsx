import React, { useState, useEffect, FC } from 'react';
import {
  Shield,
  Activity,
  FolderLock,
  History,
  Fingerprint,
  Search,
  FileText,
  Download,
  RefreshCw,
  Key,
  Server,
  Globe,
  Clock,
  ShieldCheck,
  Eye,
  Terminal,
  Layers,
  LucideProps
} from 'lucide-react';

// Firebase Governance Substrate
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, collection, query, onSnapshot, limit, Firestore, Timestamp } from "firebase/firestore";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, Auth, User } from "firebase/auth";

/**
 * RPR-KONTROL-PM Governance Tower (v1.5.1)
 * Visual: Glassmorphic Spark (Cyan #00D9FF)
 * Organization: PRP-COMMUNICATIONS-LLC
 */

// --- TYPE DEFINITIONS ---
interface Substrate {
  substrate: {
    identity: string;
    provider: string;
  };
  metadata: {
    last_deploy: string;
    release: string;
    harbor: string;
  };
  wif_config: {
    condition: string;
  };
  auth_bridge?: {
    type: string;
    pool: string;
    protocol: string;
  };
}

interface GovernanceSession {
  id: string;
  event?: string;
  actor_identity?: string;
  verification_status?: 'SUCCESS' | 'FAILURE' | 'PENDING' | 'COMMITTED';
  timestamp?: Timestamp;
}

interface NavTabProps {
  icon: React.ElementType<LucideProps>;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface TelemetryCardProps {
  icon: React.ElementType<LucideProps>;
  title: string;
  value: string;
  detail: string;
  status?: 'active' | 'inactive';
}

declare global {
  interface Window {
    __app_id?: string;
    __initial_auth_token?: string;
  }
}

// --- FIREBASE INITIALIZATION ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "rpr-myaudit",
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);
const appId: string = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';


// --- GLASS DESIGN TOKENS (Visual Audit Compliance) ---
const glassBadgeStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "14px",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
  color: "rgba(255, 255, 255, 0.95)",
  fontWeight: 500,
  letterSpacing: "0.5px",
  padding: "8px 20px",
  backgroundImage: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
};

const activeTabStyle: React.CSSProperties = {
  ...glassBadgeStyle,
  background: "rgba(0, 217, 255, 0.12)",
  borderColor: "rgba(0, 217, 255, 0.4)",
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 217, 255, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
  color: "#00D9FF"
};

// --- COMPONENTS ---

const NavTab: FC<NavTabProps> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={active ? activeTabStyle : glassBadgeStyle}
    className={`flex items-center gap-2.5 group cursor-pointer ${!active ? 'opacity-60 hover:opacity-100 hover:border-white/30' : ''}`}
  >
    <Icon size={16} className={active ? 'text-[#00D9FF]' : 'text-slate-500 group-hover:text-slate-300'} />
    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
  </button>
);

const TelemetryCard: FC<TelemetryCardProps> = ({ icon: Icon, title, value, detail, status = "active" }) => (
  <div className="bg-[#16191E]/60 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group hover:border-[#00D9FF]/30 transition-all duration-500">
    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-all">
      <Icon size={100} />
    </div>
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2.5 bg-black/40 rounded-xl text-[#00D9FF] border border-white/5 shadow-inner">
        <Icon size={18} />
      </div>
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</h3>
    </div>
    <div className="text-xl font-mono text-white mb-2 tracking-tighter">{value}</div>
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]' : 'bg-amber-500'}`} />
      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{detail}</div>
    </div>
  </div>
);

const App: FC = () => {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'vault' | 'sessions' | 'icam'>('telemetry');
  const [substrate, setSubstrate] = useState<Substrate | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<GovernanceSession[]>([]);
  const [vaultFilter, setVaultFilter] = useState<'POLICY' | 'BRAND' | 'REPORTS'>('POLICY');

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (!u) {
        try {
          if (typeof window.__initial_auth_token !== 'undefined' && window.__initial_auth_token) {
            await signInWithCustomToken(auth, window.__initial_auth_token);
          } else {
            await signInAnonymously(auth);
          }
        } catch (e) { console.error("Identity Bridge Failure:", e); }
      }
      setUser(u);
    });

    fetch('/data/GOV-SUBSTRATES.json')
      .then(res => res.json())
      .then((data: Substrate) => setSubstrate(data))
      .catch(() => console.warn("Substrate Manifest Offline"));
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'governance_sessions'), limit(15));
    const unsubscribe = onSnapshot(q, (snap) => {
      setSessions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GovernanceSession)));
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0F1115] text-slate-200 selection:bg-[#00D9FF]/20 flex flex-col">
      {/* HEADER */}
      <header className="p-8 flex items-center justify-between border-b border-white/5 bg-[#16191E]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-[#00D9FF] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,217,255,0.2)]">
              <Shield size={26} className="text-[#0F1115] stroke-[2.5px]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white uppercase leading-none">RPR-KONTROL</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1.5 opacity-60">Governance Tower</p>
            </div>
          </div>
          <div style={glassBadgeStyle} className="text-[10px] hidden md:block uppercase tracking-[0.2em]">
            Classification: <span className="text-[#00D9FF]">TS-Λ3 (CROWN SECRET)</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex flex-col items-end mr-6">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${user ? 'bg-[#00D9FF] animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none">Identity Bridge v2</span>
            </div>
            <span className="text-[10px] font-mono mt-2 text-slate-400 font-bold">{user?.uid?.substring(0, 16).toUpperCase() || "HANDSHAKING..."}</span>
          </div>
          <button className="flex items-center gap-2 px-8 py-3 bg-[#00D9FF] hover:bg-[#00B8D9] text-[#0F1115] text-[11px] font-black uppercase rounded-2xl transition-all shadow-[0_0_15px_rgba(0,217,255,0.1)] active:scale-95 tracking-widest">
            <RefreshCw size={14} /> Force Sync
          </button>
        </div>
      </header>

      {/* TABS (Pill Layout) */}
      <nav className="p-5 flex justify-center gap-4 bg-[#111318]/90 backdrop-blur-md border-b border-white/5 sticky top-[107px] z-40 shadow-2xl">
        <NavTab icon={Activity} label="Telemetry" active={activeTab === 'telemetry'} onClick={() => setActiveTab('telemetry')} />
        <NavTab icon={FolderLock} label="Governance Vault" active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} />
        <NavTab icon={History} label="Audit Sessions" active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} />
        <NavTab icon={Fingerprint} label="Identity Config" active={activeTab === 'icam'} onClick={() => setActiveTab('icam')} />
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-12 max-w-7xl mx-auto w-full">
        {/* Sub-Header Prefix */}
        <div className="mb-14">
          <h2 className="text-[#00D9FF] text-xs font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
            <div className="w-6 h-[1px] bg-[#00D9FF]" /> // Initialize Governance Session
          </h2>
          <div className="h-[1px] w-full bg-gradient-to-r from-[#00D9FF]/20 to-transparent mb-8" />
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-3xl">
            Sovereign oversight of organizational substrates and regional harbor integrity. This dashboard monitors cross-platform logic parity and immutable audit conformity.
          </p>
        </div>

        {activeTab === 'telemetry' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <TelemetryCard icon={Fingerprint} title="Substrate Identity" value={substrate?.substrate?.identity || "ANONYMOUS"} detail={`Provider: ${substrate?.substrate?.provider || "WIF-V2"}`} />
              <TelemetryCard icon={Clock} title="Deploy Heartbeat" value={substrate?.metadata?.last_deploy ? new Date(substrate.metadata.last_deploy).toLocaleTimeString() : "READY"} detail="Latest Manifest Handshake" />
              <TelemetryCard icon={Globe} title="Regional Anchor" value={substrate?.metadata?.harbor || "asia-southeast1"} detail="Singapore Sovereign Harbor" />
            </div>
            <div className="bg-[#16191E]/40 border border-white/5 rounded-[3rem] p-10 shadow-2xl backdrop-blur-xl">
              <h3 className="text-[#00D9FF] text-xs font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Server size={14} /> // WIF Condition Verification
              </h3>
              <div className="bg-black/50 rounded-2xl p-8 border border-white/5 font-mono text-xs text-cyan-400/80 leading-relaxed overflow-hidden shadow-inner">
                {substrate?.wif_config?.condition || "Establishing Token Bridge handshake..."}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="space-y-8 animate-in fade-in duration-700">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="relative flex-grow max-w-xl">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input type="text" placeholder="Search THE VAULT..." className="w-full bg-[#16191E]/60 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-sm font-medium focus:outline-none focus:border-[#00D9FF]/40 transition-all placeholder:text-slate-700 shadow-xl" />
                </div>
                <div className="flex p-2 bg-black/40 rounded-[1.5rem] border border-white/5 backdrop-blur-xl">
                  {['POLICY', 'BRAND', 'REPORTS'].map(cat => (
                    <button key={cat} onClick={() => setVaultFilter(cat as 'POLICY' | 'BRAND' | 'REPORTS')} className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${vaultFilter === cat ? 'bg-[#00D9FF] text-[#2B2F33] shadow-lg shadow-[#00D9FF]/20' : 'text-slate-500 hover:text-slate-300'}`}>{cat}</button>
                  ))}
                </div>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { name: 'GOVERNANCE-PROTOCOL-v1.5.pdf', size: '2.4MB', cat: 'POLICY' },
                  { name: 'RPR-BRAND-KIT-V2.pdf', size: '15.1MB', cat: 'BRAND' },
                  { name: 'GOV-SCHEMAS-v1.0.0.json', size: '12KB', cat: 'REPORTS' },
                  { name: 'SUBSTRATE-AUDIT-v1.4.json', size: '42KB', cat: 'REPORTS' },
                ].filter(a => a.cat === vaultFilter).map((asset, i) => (
                  <div key={i} className="group bg-[#16191E]/60 border border-white/5 p-8 rounded-[2.5rem] hover:border-[#00D9FF]/30 transition-all duration-500 hover:shadow-2xl">
                    <div className="flex items-start justify-between mb-10">
                      <div className="p-5 rounded-2xl bg-black/50 text-[#00D9FF] border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                        <FileText size={26} />
                      </div>
                      <Download size={18} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white transition-all cursor-pointer" />
                    </div>
                    <h4 className="font-bold text-white mb-2 truncate text-sm tracking-tight">{asset.name}</h4>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{asset.size}</span>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="bg-[#16191E]/40 border border-white/5 p-12 rounded-[3.5rem] flex items-center gap-12 relative overflow-hidden group shadow-2xl">
               <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#00D9FF]/5 to-transparent pointer-events-none" />
               <div className="p-8 bg-black/60 rounded-[2.5rem] text-amber-500 border border-white/10 shadow-xl group-hover:scale-105 transition-all duration-700">
                 <Terminal size={48} className="stroke-[1.5px]" />
               </div>
               <div className="relative z-10">
                 <h3 className="text-4xl font-black text-white mb-3 uppercase tracking-tight italic leading-none">Forensic Ledger</h3>
                 <p className="text-sm text-slate-500 max-w-xl font-medium leading-relaxed uppercase tracking-widest opacity-80">
                   // Immutable governance logs synced via the <span className="text-[#00D9FF]">PRP-LLC</span> secure substrate.
                 </p>
               </div>
            </div>
            <div className="bg-[#16191E]/60 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-xl">
               <table className="w-full text-left">
                 <thead>
                   <tr className="border-b border-white/5 bg-black/30 text-[11px] font-black text-slate-600 uppercase tracking-[0.25em]">
                     <th className="px-12 py-7">Event Hash</th>
                     <th className="px-12 py-7">Protocol Identity</th>
                     <th className="px-12 py-7">Audit Status</th>
                     <th className="px-12 py-7 text-right">Time</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {sessions.length === 0 ? (
                     <tr><td colSpan={4} className="px-12 py-32 text-center text-slate-700 font-bold uppercase text-[11px] tracking-[0.3em] animate-pulse">Establishing Ledger Link...</td></tr>
                   ) : (
                     sessions.map((s, idx) => (
                       <tr key={idx} className="hover:bg-white/5 transition-all group">
                         <td className="px-12 py-8"><span className="font-mono text-[10px] font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-4 py-2 rounded-xl border border-[#00D9FF]/20 shadow-[0_0_15px_rgba(0,217,255,0.05)]">{s.id.substring(0, 14).toUpperCase()}</span></td>
                         <td className="px-12 py-8"><div className="text-base font-bold text-white uppercase group-hover:text-[#00D9FF] transition-colors">{s.event || "Substrate Sync"}</div><div className="text-[11px] text-slate-600 font-mono mt-1.5 uppercase font-bold tracking-widest">{s.actor_identity || "PRP-CI"}</div></td>
                         <td className="px-12 py-8">
                           <div style={glassBadgeStyle} className={`inline-flex items-center gap-3 py-2 px-5 text-[11px] font-black uppercase tracking-tighter rounded-full border ${s.verification_status === 'SUCCESS' ? 'text-emerald-400 border-emerald-500/30' : 'text-slate-500 border-white/10'}`}>
                              <div className={`w-1 h-1 rounded-full ${s.verification_status === 'SUCCESS' ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                              {s.verification_status || "COMMITTED"}
                           </div>
                         </td>
                         <td className="px-12 py-8 text-right text-xs font-bold text-slate-400 font-mono">{s.timestamp?.seconds ? new Date(s.timestamp.seconds * 1000).toLocaleTimeString() : "N/A"}</td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'icam' && (
          <div className="max-w-4xl space-y-12 animate-in fade-in duration-700">
             <section className="bg-gradient-to-br from-[#16191E] to-slate-950 border border-white/5 p-16 rounded-[4.5rem] relative overflow-hidden shadow-2xl">
                <Key className="absolute -top-12 -right-12 text-[#00D9FF]/5" size={320} />
                <h3 className="text-[#00D9FF] text-[11px] font-black uppercase tracking-[0.5em] mb-12 flex items-center gap-4">
                   <div className="w-10 h-[1px] bg-[#00D9FF]" /> ICAM Identity Policy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-1 opacity-80">Org Principal</label>
                    <div className="p-7 bg-black/50 border border-white/5 rounded-3xl font-mono text-white font-bold text-base shadow-inner">prp-communications-llc</div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-1 opacity-80">Regional Harbor</label>
                    <div className="p-7 bg-black/50 border border-white/5 rounded-3xl font-mono text-white font-bold text-base shadow-inner">asia-southeast1 (Singapore)</div>
                  </div>
                </div>
             </section>
             <div style={glassBadgeStyle} className="p-12 flex items-start gap-10 shadow-2xl border-white/10 group">
                <div className="p-5 bg-[#00D9FF]/10 rounded-3xl text-[#00D9FF] border border-[#00D9FF]/20 shadow-lg shadow-[#00D9FF]/10 transition-transform group-hover:scale-105">
                   <ShieldCheck size={40} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight italic leading-none">Sovereign State Enforcement</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium mt-4">
                     Identity, Credential, and Access Management (ICAM) policies are enforced at the <span className="text-white">Substrate Plane</span>.
                     Unauthorized repository drift triggers immediate OIDC revocation across all production harbors.
                  </p>
                </div>
             </div>
          </div>
        )}
      </main>

      <footer className="p-16 text-center text-[10px] font-black text-slate-800 uppercase tracking-[0.6em] opacity-40">
        RPR COMMUNICATIONS, LLC // TS-Λ3 // AUTHORITATIVE NODE
      </footer>
    </div>
  );
}

export default App;
