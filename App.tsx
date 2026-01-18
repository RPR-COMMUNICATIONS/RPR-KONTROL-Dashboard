import React, { useState, useEffect } from 'react';
import {
  Shield,
  Database,
  Activity,
  Settings,
  FolderLock,
  ExternalLink,
  ChevronRight,
  Globe,
  Clock,
  Fingerprint,
  RefreshCw,
  Search,
  FileText,
  Image as ImageIcon,
  Eye,
  Download,
  ShieldCheck,
  Lock,
  Cpu,
  History,
  Terminal
} from 'lucide-react';

/**
 * RPR-KONTROL Governance Tower (v1.4.5)
 * Organization: PRP-COMMUNICATIONS-LLC
 * Harbor: asia-southeast1 (Singapore)
 * Design: Spark Visual System (RPR-BRAND-KIT-V2)
 * Protocol: SENTINEL PROTOCOL v1.1.0
 */

// --- SHARED UI COMPONENTS ---

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active
        ? 'bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20'
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
    }`}
  >
    <Icon size={18} />
    <span className="text-sm font-semibold tracking-tight">{label}</span>
    {active && <ChevronRight size={14} className="ml-auto" />}
  </button>
);

const TelemetryCard = ({ icon: Icon, title, value, detail, status = "active" }) => (
  <div className="bg-[#16191E] border border-slate-800 p-6 rounded-2xl shadow-xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={64} />
    </div>
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-slate-800 rounded-lg text-[#00D9FF]">
        <Icon size={18} />
      </div>
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="text-xl font-mono text-white mb-1 truncate">{value}</div>
    <div className="flex items-center gap-2">
      <div className={`w-1 h-1 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      <div className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-tighter">{detail}</div>
    </div>
  </div>
);

const AssetCard = ({ file }) => (
  <div className="group bg-[#16191E] border border-slate-800 p-4 rounded-2xl hover:border-[#00D9FF]/30 transition-all cursor-pointer">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl bg-slate-900 ${file.type === 'doc' ? 'text-blue-400' : 'text-cyan-400'}`}>
        {file.type === 'doc' ? <FileText size={20} /> : <ImageIcon size={20} />}
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
          <Eye size={16} />
        </button>
        <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
          <Download size={16} />
        </button>
      </div>
    </div>
    <h4 className="text-sm font-bold text-white mb-1 truncate">{file.name}</h4>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{file.size}</span>
      <span className="w-1 h-1 rounded-full bg-slate-700" />
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{file.modified}</span>
    </div>
  </div>
);

// --- MAIN APPLICATION ---

export default function App() {
  const [activeTab, setActiveTab] = useState('telemetry');
  const [substrate, setSubstrate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vaultCategory, setVaultCategory] = useState('policy');

  useEffect(() => {
    const fetchSubstrate = async () => {
      try {
        const response = await fetch('/data/GOV-SUBSTRATES.json');
        if (response.ok) {
          const data = await response.json();
          setSubstrate(data);
        }
      } catch (e) {
        console.warn("Operating in local dev mode (Manifest offline)");
      } finally {
        setLoading(false);
      }
    };
    fetchSubstrate();
  }, []);

  const vaultAssets = [
    { name: 'GOVERNANCE-PROTOCOL-v1.4.pdf', size: '2.4MB', modified: '2h ago', type: 'doc', category: 'policy' },
    { name: 'PRP-BRAND-KIT-V2.pdf', size: '15.1MB', modified: '1d ago', type: 'image', category: 'brand' },
    { name: 'SUBSTRATE-HARDENING-REPORT.json', size: '12KB', modified: '4h ago', type: 'doc', category: 'policy' },
    { name: 'REGIONAL-COMPLIANCE-ASIA.svg', size: '890KB', modified: '2d ago', type: 'image', category: 'brand' },
  ];

  return (
    <div className="min-h-screen bg-[#0F1115] text-slate-200 font-['Inter',_sans-serif] selection:bg-[#00D9FF]/30">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#16191E] border-r border-slate-800 flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-8 h-8 bg-[#00D9FF] rounded-lg flex items-center justify-center shadow-lg shadow-[#00D9FF]/20">
            <Shield size={20} className="text-[#2B2F33]" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-white leading-none">RPR-KONTROL</h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Governance Tower</p>
          </div>
        </div>

        <nav className="space-y-1 flex-grow">
          <NavItem icon={Activity} label="Telemetry" active={activeTab === 'telemetry'} onClick={() => setActiveTab('telemetry')} />
          <NavItem icon={FolderLock} label="Governance Vault" active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} />
          <NavItem icon={History} label="Audit Sessions" active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} />
          <NavItem icon={Fingerprint} label="Identity Config" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">WIF Bridge v2</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-400">SECURE</span>
            </div>
          </div>
          <p className="text-[9px] text-slate-600 leading-relaxed font-bold uppercase tracking-tight">
            PRP-COMMUNICATIONS-LLC<br />
            asia-southeast1 Harbor
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 lg:p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-4xl font-black text-white tracking-tight capitalize">
                {activeTab.replace('-', ' ')}
              </h2>
              <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-2">
                <ShieldCheck size={12} className="text-[#00D9FF]" />
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Sovereign Node Verified</span>
              </div>
            </div>
            <p className="text-slate-500 max-w-xl text-sm leading-relaxed">
              Forensic oversight of organization substrates and OIDC identity handshakes.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all">
              <RefreshCw size={14} /> Force Sync
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#00D9FF] hover:bg-[#00B8D9] text-[#2B2F33] text-xs font-black rounded-xl transition-all shadow-lg shadow-[#00D9FF]/20 active:scale-95">
              <Lock size={14} /> Authorize Vault
            </button>
          </div>
        </header>

        {/* TAB: TELEMETRY */}
        {activeTab === 'telemetry' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TelemetryCard
                icon={Fingerprint}
                title="Substrate Identity"
                value={loading ? "Handshaking..." : (substrate?.substrate?.identity || "DEV_STATION")}
                detail={`ID: ${substrate?.substrate?.provider || "local_provider"}`}
              />
              <TelemetryCard
                icon={Clock}
                title="Deploy Heartbeat"
                value={loading ? "..." : (substrate?.metadata?.last_deploy ? new Date(substrate.metadata.last_deploy).toLocaleTimeString() : "READY")}
                detail={`REL: v${substrate?.metadata?.release || "1.4.5"}`}
              />
              <TelemetryCard
                icon={Globe}
                title="Regional Anchor"
                value={substrate?.metadata?.harbor || "asia-southeast1"}
                detail="Singapore Sovereign Harbor"
              />
            </div>

            <div className="bg-[#16191E] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
                <h3 className="text-xs font-black text-white uppercase tracking-tighter flex items-center gap-2">
                  <Activity size={16} className="text-[#00D9FF]" /> Audit Telemetry Stream
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">TS-Λ3 ENCRYPTED</span>
              </div>
              <div className="divide-y divide-slate-800">
                {[
                  { event: 'SUBSTRATE_DEPLOY_V2', status: 'SUCCESS', target: 'hosting:kontrol', time: '2h ago' },
                  { event: 'WIF_OIDC_HANDSHAKE', status: 'VERIFIED', target: 'gcp-iam', time: '5h ago' },
                  { event: 'MANIFEST_GEN_V145', status: 'COMPLETED', target: 'dist-kontrol', time: '21h ago' },
                ].map((item, idx) => (
                  <div key={idx} className="px-8 py-5 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div>
                        <div className="text-sm font-mono text-white font-bold tracking-tight">{item.event}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Target Harbor: {item.target}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-300">{item.status}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: VAULT */}
        {activeTab === 'vault' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="Search Governance Assets..."
                  className="w-full bg-[#16191E] border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00D9FF]/50 transition-all"
                />
              </div>
              <div className="flex items-center gap-2 p-1 bg-[#16191E] border border-slate-800 rounded-2xl">
                <button
                  onClick={() => setVaultCategory('policy')}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${vaultCategory === 'policy' ? 'bg-slate-800 text-[#00D9FF]' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Policy
                </button>
                <button
                  onClick={() => setVaultCategory('brand')}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${vaultCategory === 'brand' ? 'bg-slate-800 text-[#00D9FF]' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Assets
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#16191E] to-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-6">
                <div className="w-16 h-16 bg-[#00D9FF]/10 rounded-2xl flex items-center justify-center text-[#00D9FF]">
                  <FolderLock size={32} />
                </div>
                <div>
                  <div className="text-2xl font-black text-white leading-none mb-1 uppercase tracking-tighter">Vault C-Λ2</div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Drive Identity Verified</p>
                </div>
              </div>
              <div className="bg-[#16191E] border border-slate-800 p-6 rounded-3xl flex items-center gap-6">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <div className="text-2xl font-black text-white leading-none mb-1 uppercase tracking-tighter">Encryption: ON</div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">PRP Sovereign Key Active</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {vaultAssets.filter(a => a.category === vaultCategory).map((file, idx) => (
                <AssetCard key={idx} file={file} />
              ))}
            </div>
          </div>
        )}

        {/* TAB: AUDIT SESSIONS */}
        {activeTab === 'sessions' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] flex items-center gap-8">
              <div className="p-5 bg-slate-800 rounded-2xl text-amber-500">
                <Terminal size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">Governance Sessions</h3>
                <p className="text-sm text-slate-500 max-w-lg">
                  Immutable record of all human-in-the-loop approvals and substrate modifications.
                </p>
              </div>
            </div>

            <div className="bg-[#16191E] border border-slate-800 rounded-3xl overflow-hidden">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-slate-800 bg-slate-900/30">
                     <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Session ID</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Action</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                   {[
                     { id: 'SESS-88A2', action: 'Hardening Verification', status: 'LOCKED', time: '2026-01-18 10:23' },
                     { id: 'SESS-71F0', action: 'Org Migration (PRP-LLC)', status: 'COMMITTED', time: '2026-01-18 09:12' },
                     { id: 'SESS-299C', action: 'WIF v2 Handshake', status: 'SUCCESS', time: '2026-01-17 18:45' },
                   ].map((row, idx) => (
                     <tr key={idx} className="hover:bg-slate-800/20 transition-colors cursor-default">
                       <td className="px-8 py-5 text-xs font-mono font-bold text-[#00D9FF]">{row.id}</td>
                       <td className="px-8 py-5 text-sm font-semibold text-white">{row.action}</td>
                       <td className="px-8 py-5">
                         <span className="px-2 py-1 rounded text-[10px] font-black bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-tighter">
                           {row.status}
                         </span>
                       </td>
                       <td className="px-8 py-5 text-xs text-slate-500 font-medium">{row.time}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </div>
        )}

        {/* TAB: SETTINGS / IDENTITY */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-8 animate-in fade-in duration-500">
             <section>
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Infrastructure Identity</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                   <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Organization Principal</div>
                   <div className="text-sm font-mono text-white font-bold">prp-communications-llc</div>
                 </div>
                 <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                   <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Harbor Target</div>
                   <div className="text-sm font-mono text-white font-bold">myaudit-kontrol-dashboard</div>
                 </div>
               </div>
             </section>

             <section>
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">WIF Configuration</h3>
               <div className="bg-[#16191E] border border-slate-800 rounded-2xl divide-y divide-slate-800">
                 {[
                   { label: 'OIDC Provider', value: substrate?.auth_bridge?.type || 'WIF/OIDC v2' },
                   { label: 'Workload Pool', value: substrate?.auth_bridge?.pool || 'github-actions-pool' },
                   { label: 'Protocol Version', value: substrate?.auth_bridge?.protocol || 'SENTINEL-v1.1.0' },
                 ].map((conf, idx) => (
                   <div key={idx} className="px-6 py-4 flex items-center justify-between">
                     <span className="text-xs font-bold text-slate-400">{conf.label}</span>
                     <span className="text-xs font-mono text-[#00D9FF] font-bold">{conf.value}</span>
                   </div>
                 ))}
               </div>
             </section>

             <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-3xl flex items-start gap-6">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                  <Cpu size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white mb-1 uppercase">Sovereign State Warning</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Modification of the substrate identity requires Founder-level authorization. Any unauthorized drift from the <strong>asia-southeast1</strong> harbor will trigger an immediate OIDC revocation.
                  </p>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
