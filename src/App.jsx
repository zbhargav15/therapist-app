import { useState, useEffect, useRef } from "react";

const PIN = "1234";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #F7F5F2; color: #1a1a1a; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #c8c0b4; border-radius: 2px; }
`;

const COLORS = {
  bg: "#F7F5F2", card: "#FFFFFF", accent: "#4A6FA5", accentLight: "#EBF0F8",
  text: "#1a1a1a", muted: "#7a7a7a", border: "#E8E4DF", danger: "#C0392B",
  dangerLight: "#FDECEA", success: "#2E7D5E", successLight: "#E8F5EF",
  warn: "#C87941", warnLight: "#FDF3E7", serif: "'DM Serif Display', serif",
  sans: "'DM Sans', sans-serif",
};

const s = {
  app: { minHeight: "100vh", background: COLORS.bg, fontFamily: COLORS.sans },
  pinScreen: {
    minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", background: COLORS.bg, gap: 32,
  },
  pinTitle: { fontFamily: COLORS.serif, fontSize: 32, color: COLORS.text, textAlign: "center" },
  pinSub: { fontSize: 14, color: COLORS.muted, marginTop: 6, textAlign: "center" },
  pinDots: { display: "flex", gap: 14, justifyContent: "center", margin: "8px 0" },
  pinDot: (filled) => ({
    width: 14, height: 14, borderRadius: "50%",
    background: filled ? COLORS.accent : "transparent",
    border: `2px solid ${filled ? COLORS.accent : COLORS.border}`,
    transition: "all 0.15s",
  }),
  pinGrid: { display: "grid", gridTemplateColumns: "repeat(3, 72px)", gap: 10 },
  pinBtn: {
    width: 72, height: 72, borderRadius: 16, border: `1px solid ${COLORS.border}`,
    background: COLORS.card, fontFamily: COLORS.sans, fontSize: 20, fontWeight: 400,
    color: COLORS.text, cursor: "pointer", transition: "all 0.12s",
  },
  pinError: { color: COLORS.danger, fontSize: 13, textAlign: "center", minHeight: 20 },
  sidebar: {
    width: 220, minHeight: "100vh", background: COLORS.card,
    borderRight: `1px solid ${COLORS.border}`, display: "flex",
    flexDirection: "column", padding: "32px 0 24px", position: "fixed", top: 0, left: 0,
  },
  sidebarLogo: { padding: "0 24px 32px", borderBottom: `1px solid ${COLORS.border}` },
  sidebarLogoText: { fontFamily: COLORS.serif, fontSize: 20, color: COLORS.text },
  sidebarLogoSub: { fontSize: 11, color: COLORS.muted, marginTop: 2, letterSpacing: 1, textTransform: "uppercase" },
  sidebarNav: { flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 2 },
  navItem: (active) => ({
    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
    borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: active ? 500 : 400,
    color: active ? COLORS.accent : COLORS.muted,
    background: active ? COLORS.accentLight : "transparent",
    transition: "all 0.15s", border: "none", width: "100%", textAlign: "left",
  }),
  sidebarBottom: { padding: "16px 24px", borderTop: `1px solid ${COLORS.border}` },
  main: { marginLeft: 220, padding: "40px 48px", minHeight: "100vh" },
  pageTitle: { fontFamily: COLORS.serif, fontSize: 28, color: COLORS.text, marginBottom: 4 },
  pageSub: { fontSize: 13, color: COLORS.muted, marginBottom: 32 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 },
  card: {
    background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`,
    padding: 24, marginBottom: 0,
  },
  cardTitle: { fontSize: 11, fontWeight: 500, letterSpacing: 1.2, textTransform: "uppercase", color: COLORS.muted, marginBottom: 16 },
  statNum: { fontFamily: COLORS.serif, fontSize: 36, color: COLORS.text },
  statLabel: { fontSize: 13, color: COLORS.muted, marginTop: 4 },
  btn: (variant = "primary") => ({
    padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: 500, fontFamily: COLORS.sans, transition: "all 0.15s",
    background: variant === "primary" ? COLORS.accent : variant === "danger" ? COLORS.danger : variant === "ghost" ? "transparent" : COLORS.accentLight,
    color: variant === "primary" ? "#fff" : variant === "danger" ? "#fff" : variant === "ghost" ? COLORS.muted : COLORS.accent,
    border: variant === "ghost" ? `1px solid ${COLORS.border}` : "none",
  }),
  input: {
    width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${COLORS.border}`,
    fontFamily: COLORS.sans, fontSize: 14, color: COLORS.text, background: COLORS.bg,
    outline: "none", transition: "border 0.15s",
  },
  textarea: {
    width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${COLORS.border}`,
    fontFamily: COLORS.sans, fontSize: 14, color: COLORS.text, background: COLORS.bg,
    outline: "none", resize: "vertical", minHeight: 100,
  },
  label: { fontSize: 12, fontWeight: 500, color: COLORS.muted, marginBottom: 6, display: "block", letterSpacing: 0.5 },
  formGroup: { marginBottom: 18 },
  tag: (color) => ({
    display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500,
    background: color === "danger" ? COLORS.dangerLight : color === "success" ? COLORS.successLight : color === "warn" ? COLORS.warnLight : COLORS.accentLight,
    color: color === "danger" ? COLORS.danger : color === "success" ? COLORS.success : color === "warn" ? COLORS.warn : COLORS.accent,
  }),
  modal: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
  },
  modalBox: {
    background: COLORS.card, borderRadius: 20, padding: 32, width: 560,
    maxWidth: "90vw", maxHeight: "85vh", overflowY: "auto", border: `1px solid ${COLORS.border}`,
  },
  divider: { height: 1, background: COLORS.border, margin: "20px 0" },
  aiBox: {
    background: COLORS.accentLight, border: `1px solid #c5d6ee`, borderRadius: 12,
    padding: 20, marginTop: 16, fontSize: 14, color: COLORS.text, lineHeight: 1.7,
    whiteSpace: "pre-wrap",
  },
};

const initialPatients = [
  {
    id: 1, name: "Sarah M.", age: 34, type: "Adult", startDate: "2024-01-15",
    diagnosis: "Anxiety, Depression", risk: "low", phone: "—", email: "—",
    history: "Referred by GP. Previous CBT 2021. No prior hospitalisation.",
    sessions: [
      { id: 1, date: "2025-03-01", attended: true, notes: "Patient reported reduced anxiety this week. Sleep improving. Still avoidant of social situations. Discussed behavioural activation techniques." },
      { id: 2, date: "2025-03-15", attended: true, notes: "Breakthrough session — patient connected childhood patterns to current avoidance. Tearful but engaged. Homework: journalling daily." },
      { id: 3, date: "2025-04-01", attended: false, notes: "" },
    ],
    reminders: [{ id: 1, text: "Review GAD-7 scores", date: "2025-04-15", recurring: "monthly" }],
    tests: [{ name: "GAD-7", date: "2025-01-20", score: "14 (Moderate)" }],
    mood: [3, 4, 3, 5, 4],
  },
  {
    id: 2, name: "Tom B.", age: 9, type: "Child", startDate: "2024-09-10",
    diagnosis: "ADHD, ODD", risk: "medium", phone: "—", email: "Parent: —",
    history: "School referral. Parents divorced 2023. On Methylphenidate since 2024.",
    sessions: [
      { id: 1, date: "2025-03-05", attended: true, notes: "Play therapy session. Tom engaged well with sand tray. Themes of conflict and separation prominent. Parent meeting scheduled." },
      { id: 2, date: "2025-03-19", attended: true, notes: "Tom showed less aggression today. Responded well to reward chart discussion. Mother reports improvement at home." },
    ],
    reminders: [{ id: 1, text: "Give new stationery set", date: "2025-04-01", recurring: "monthly" }],
    tests: [{ name: "Conners-3", date: "2024-09-15", score: "High (ADHD composite)" }],
    mood: [2, 3, 3, 4],
  },
];

function useStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

function PinScreen({ onUnlock }) {
  const [entered, setEntered] = useState("");
  const [error, setError] = useState("");
  const digits = ["1","2","3","4","5","6","7","8","9","","0","⌫"];
  const press = (d) => {
    if (d === "") return;
    if (d === "⌫") { setEntered(p => p.slice(0,-1)); setError(""); return; }
    const next = entered + d;
    if (next.length <= 4) {
      setEntered(next);
      if (next.length === 4) {
        if (next === PIN) { setTimeout(onUnlock, 200); }
        else { setTimeout(() => { setEntered(""); setError("Incorrect PIN. Try again."); }, 300); }
      }
    }
  };
  return (
    <div style={s.pinScreen}>
      <style>{FONTS}{CSS}</style>
      <div>
        <div style={s.pinTitle}>TherapyDesk</div>
        <div style={s.pinSub}>Enter your PIN to continue</div>
      </div>
      <div style={s.pinDots}>{[0,1,2,3].map(i => <div key={i} style={s.pinDot(i < entered.length)} />)}</div>
      <div style={s.pinGrid}>
        {digits.map((d,i) => (
          <button key={i} style={{...s.pinBtn, opacity: d===""?0:1, pointerEvents: d===""?"none":"auto"}}
            onClick={() => press(d)}>{d}</button>
        ))}
      </div>
      <div style={s.pinError}>{error}</div>
      <div style={{fontSize:12,color:COLORS.muted}}>Default PIN: 1234</div>
    </div>
  );
}

function NavIcon({ name }) {
  const icons = {
    dashboard: "⊞", patients: "♦", sessions: "◷", reminders: "◉", notes: "✎", settings: "⚙",
  };
  return <span style={{fontSize:16}}>{icons[name]||"•"}</span>;
}

function Badge({ count }) {
  if (!count) return null;
  return <span style={{marginLeft:"auto",background:COLORS.danger,color:"#fff",borderRadius:20,fontSize:11,padding:"1px 7px"}}>{count}</span>;
}

function Sidebar({ page, setPage, reminderCount }) {
  const nav = [
    { id: "dashboard", label: "Dashboard" },
    { id: "patients", label: "Patients" },
    { id: "sessions", label: "Sessions" },
    { id: "reminders", label: "Reminders", badge: reminderCount },
    { id: "notes", label: "Session Notes" },
  ];
  return (
    <div style={s.sidebar}>
      <div style={s.sidebarLogo}>
        <div style={s.sidebarLogoText}>TherapyDesk</div>
        <div style={s.sidebarLogoSub}>Practice Manager</div>
      </div>
      <nav style={s.sidebarNav}>
        {nav.map(n => (
          <button key={n.id} style={s.navItem(page===n.id)} onClick={() => setPage(n.id)}>
            <NavIcon name={n.id} />{n.label}{n.badge ? <Badge count={n.badge}/> : null}
          </button>
        ))}
      </nav>
      <div style={s.sidebarBottom}>
        <div style={{fontSize:11,color:COLORS.muted}}>🔒 All data stored locally</div>
      </div>
    </div>
  );
}

function Dashboard({ patients, setPage, setSelectedPatient }) {
  const today = new Date().toISOString().split("T")[0];
  const allSessions = patients.flatMap(p => p.sessions.map(s => ({...s, patient: p})));
  const todaySessions = allSessions.filter(s => s.date === today);
  const attended = allSessions.filter(s => s.attended).length;
  const total = allSessions.length;
  const highRisk = patients.filter(p => p.risk === "high");
  const medRisk = patients.filter(p => p.risk === "medium");
  const upcoming = allSessions.filter(s => s.date >= today).sort((a,b) => a.date.localeCompare(b.date)).slice(0,5);
  const typeCount = {};
  patients.forEach(p => { typeCount[p.type] = (typeCount[p.type]||0)+1; });

  return (
    <div>
      <div style={s.pageTitle}>Good morning</div>
      <div style={s.pageSub}>Here's your practice overview</div>

      <div style={{...s.grid3, marginBottom: 24}}>
        <div style={s.card}>
          <div style={s.cardTitle}>Total Patients</div>
          <div style={s.statNum}>{patients.length}</div>
          <div style={s.statLabel}>Active cases</div>
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>Session Attendance</div>
          <div style={s.statNum}>{total ? Math.round(attended/total*100) : 0}%</div>
          <div style={s.statLabel}>{attended} of {total} sessions attended</div>
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>Flagged Patients</div>
          <div style={s.statNum}>{highRisk.length + medRisk.length}</div>
          <div style={s.statLabel}>{highRisk.length} high · {medRisk.length} medium risk</div>
        </div>
      </div>

      <div style={{...s.grid2, marginBottom: 24}}>
        <div style={s.card}>
          <div style={s.cardTitle}>Today's Sessions</div>
          {todaySessions.length === 0
            ? <div style={{color:COLORS.muted,fontSize:14}}>No sessions scheduled today</div>
            : todaySessions.map(s2 => (
              <div key={s2.id} style={{padding:"10px 0",borderBottom:`1px solid ${COLORS.border}`,fontSize:14}}>
                <strong>{s2.patient.name}</strong> <span style={{color:COLORS.muted}}>— {s2.date}</span>
              </div>
            ))
          }
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>Upcoming Sessions</div>
          {upcoming.length === 0
            ? <div style={{color:COLORS.muted,fontSize:14}}>No upcoming sessions</div>
            : upcoming.map((s2,i) => (
              <div key={i} style={{padding:"8px 0",borderBottom:`1px solid ${COLORS.border}`,fontSize:14,display:"flex",justifyContent:"space-between"}}>
                <span>{s2.patient.name}</span><span style={{color:COLORS.muted}}>{s2.date}</span>
              </div>
            ))
          }
        </div>
      </div>

      <div style={{...s.grid2}}>
        <div style={s.card}>
          <div style={s.cardTitle}>Patient Types</div>
          {Object.entries(typeCount).map(([type, count]) => (
            <div key={type} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${COLORS.border}`,fontSize:14}}>
              <span>{type}</span>
              <span style={s.tag("accent")}>{count}</span>
            </div>
          ))}
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>Risk Overview</div>
          {highRisk.map(p => (
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${COLORS.border}`,fontSize:14}}>
              <span>{p.name}</span><span style={s.tag("danger")}>High Risk</span>
            </div>
          ))}
          {medRisk.map(p => (
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${COLORS.border}`,fontSize:14}}>
              <span>{p.name}</span><span style={s.tag("warn")}>Medium Risk</span>
            </div>
          ))}
          {highRisk.length + medRisk.length === 0 && <div style={{color:COLORS.muted,fontSize:14}}>No flagged patients</div>}
        </div>
      </div>
    </div>
  );
}

function PatientCard({ patient, onClick }) {
  const riskColor = patient.risk === "high" ? "danger" : patient.risk === "medium" ? "warn" : "success";
  const attended = patient.sessions.filter(s => s.attended).length;
  return (
    <div style={{...s.card, cursor:"pointer", transition:"box-shadow 0.15s"}} onClick={onClick}
      onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow="none"}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <div>
          <div style={{fontFamily:COLORS.serif,fontSize:18}}>{patient.name}</div>
          <div style={{fontSize:12,color:COLORS.muted,marginTop:2}}>{patient.type} · Age {patient.age}</div>
        </div>
        <span style={s.tag(riskColor)}>{patient.risk} risk</span>
      </div>
      <div style={{fontSize:13,color:COLORS.muted,marginBottom:12}}>{patient.diagnosis}</div>
      <div style={{display:"flex",gap:16,fontSize:12,color:COLORS.muted}}>
        <span>Since {patient.startDate}</span>
        <span>{attended}/{patient.sessions.length} sessions</span>
      </div>
    </div>
  );
}

function MoodBar({ scores }) {
  if (!scores || scores.length === 0) return null;
  return (
    <div style={{display:"flex",gap:4,alignItems:"flex-end",height:40}}>
      {scores.map((v,i) => (
        <div key={i} style={{
          width:20, height: `${v*20}%`, minHeight:6, borderRadius:4,
          background: v>=4 ? COLORS.success : v>=3 ? COLORS.accent : COLORS.warn,
          transition:"height 0.3s",
        }} title={`Session ${i+1}: ${v}/5`}/>
      ))}
    </div>
  );
}

function PatientModal({ patient, onClose, onUpdate }) {
  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(patient);
  const [newTest, setNewTest] = useState({name:"",date:"",score:""});
  const tabs = ["profile","sessions","reminders","tests","notes"];

  const save = () => { onUpdate(form); setEditing(false); };
  const addTest = () => {
    if (!newTest.name) return;
    onUpdate({...form, tests:[...form.tests, {...newTest,id:Date.now()}]});
    setForm(f=>({...f,tests:[...f.tests,{...newTest,id:Date.now()}]}));
    setNewTest({name:"",date:"",score:""});
  };

  return (
    <div style={s.modal} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{...s.modalBox, width:680}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div>
            <div style={{fontFamily:COLORS.serif,fontSize:22}}>{patient.name}</div>
            <div style={{fontSize:12,color:COLORS.muted}}>{patient.type} · Age {patient.age} · Since {patient.startDate}</div>
          </div>
          <button style={s.btn("ghost")} onClick={onClose}>✕ Close</button>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:24,borderBottom:`1px solid ${COLORS.border}`,paddingBottom:12}}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,
              fontFamily:COLORS.sans, fontWeight: tab===t?500:400,
              background:tab===t?COLORS.accentLight:"transparent",color:tab===t?COLORS.accent:COLORS.muted,
            }}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
          ))}
        </div>

        {tab==="profile" && (
          <div>
            {editing ? (
              <div>
                {[["name","Name"],["age","Age"],["diagnosis","Diagnosis"],["phone","Phone"],["email","Email"]].map(([k,l])=>(
                  <div key={k} style={s.formGroup}>
                    <label style={s.label}>{l}</label>
                    <input style={s.input} value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}/>
                  </div>
                ))}
                <div style={s.formGroup}>
                  <label style={s.label}>Risk Level</label>
                  <select style={s.input} value={form.risk} onChange={e=>setForm(f=>({...f,risk:e.target.value}))}>
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>History / Background</label>
                  <textarea style={s.textarea} value={form.history||""} onChange={e=>setForm(f=>({...f,history:e.target.value}))}/>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button style={s.btn("primary")} onClick={save}>Save Changes</button>
                  <button style={s.btn("ghost")} onClick={()=>setEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                {[["Diagnosis",patient.diagnosis],["Phone",patient.phone],["Email",patient.email],["Start Date",patient.startDate]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${COLORS.border}`,fontSize:14}}>
                    <span style={{color:COLORS.muted,fontSize:12,fontWeight:500}}>{k}</span><span>{v}</span>
                  </div>
                ))}
                <div style={{padding:"12px 0",fontSize:14}}>
                  <div style={{color:COLORS.muted,fontSize:12,fontWeight:500,marginBottom:6}}>History</div>
                  <div style={{lineHeight:1.7}}>{patient.history||"—"}</div>
                </div>
                <div style={{marginTop:16}}>
                  <div style={{color:COLORS.muted,fontSize:12,fontWeight:500,marginBottom:8}}>Mood Trend</div>
                  <MoodBar scores={patient.mood}/>
                </div>
                <button style={{...s.btn("ghost"),marginTop:20}} onClick={()=>setEditing(true)}>Edit Profile</button>
              </div>
            )}
          </div>
        )}

        {tab==="sessions" && (
          <div>
            {patient.sessions.length === 0
              ? <div style={{color:COLORS.muted,fontSize:14}}>No sessions recorded.</div>
              : patient.sessions.map(sess => (
                <div key={sess.id} style={{padding:"14px 0",borderBottom:`1px solid ${COLORS.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:14,fontWeight:500}}>{sess.date}</span>
                    <span style={s.tag(sess.attended?"success":"danger")}>{sess.attended?"Attended":"Did not attend"}</span>
                  </div>
                  {sess.notes && <div style={{fontSize:13,color:COLORS.muted,lineHeight:1.6}}>{sess.notes}</div>}
                </div>
              ))
            }
          </div>
        )}

        {tab==="reminders" && (
          <PatientReminders patient={patient} onUpdate={onUpdate}/>
        )}

        {tab==="tests" && (
          <div>
            {patient.tests.map((t,i) => (
              <div key={i} style={{padding:"10px 0",borderBottom:`1px solid ${COLORS.border}`,fontSize:14,display:"flex",justifyContent:"space-between"}}>
                <span>{t.name}</span>
                <span style={{color:COLORS.muted}}>{t.date} · <strong>{t.score}</strong></span>
              </div>
            ))}
            <div style={s.divider}/>
            <div style={{fontSize:12,color:COLORS.muted,marginBottom:12,fontWeight:500}}>ADD TEST RESULT</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:8,alignItems:"end"}}>
              <div><label style={s.label}>Test Name</label><input style={s.input} placeholder="e.g. PHQ-9" value={newTest.name} onChange={e=>setNewTest(t=>({...t,name:e.target.value}))}/></div>
              <div><label style={s.label}>Date</label><input type="date" style={s.input} value={newTest.date} onChange={e=>setNewTest(t=>({...t,date:e.target.value}))}/></div>
              <div><label style={s.label}>Score/Result</label><input style={s.input} placeholder="Score" value={newTest.score} onChange={e=>setNewTest(t=>({...t,score:e.target.value}))}/></div>
              <button style={s.btn("primary")} onClick={addTest}>Add</button>
            </div>
          </div>
        )}

        {tab==="notes" && (
          <SessionNotesTab patient={patient} onUpdate={onUpdate}/>
        )}
      </div>
    </div>
  );
}

function PatientReminders({ patient, onUpdate }) {
  const [newR, setNewR] = useState({text:"",date:"",recurring:"none"});
  const add = () => {
    if (!newR.text) return;
    const updated = {...patient, reminders:[...patient.reminders,{...newR,id:Date.now()}]};
    onUpdate(updated);
    setNewR({text:"",date:"",recurring:"none"});
  };
  const del = (id) => onUpdate({...patient, reminders: patient.reminders.filter(r=>r.id!==id)});
  return (
    <div>
      {patient.reminders.map(r => (
        <div key={r.id} style={{padding:"12px 0",borderBottom:`1px solid ${COLORS.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:14}}>{r.text}</div>
            <div style={{fontSize:12,color:COLORS.muted}}>{r.date}{r.recurring!=="none"?` · repeats ${r.recurring}`:""}</div>
          </div>
          <button style={{...s.btn("ghost"),fontSize:12,padding:"4px 10px"}} onClick={()=>del(r.id)}>Remove</button>
        </div>
      ))}
      <div style={s.divider}/>
      <div style={{fontSize:12,color:COLORS.muted,marginBottom:12,fontWeight:500}}>ADD REMINDER</div>
      <div style={s.formGroup}><label style={s.label}>Reminder</label><input style={s.input} placeholder="e.g. Give new stationery" value={newR.text} onChange={e=>setNewR(r=>({...r,text:e.target.value}))}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div><label style={s.label}>Date</label><input type="date" style={s.input} value={newR.date} onChange={e=>setNewR(r=>({...r,date:e.target.value}))}/></div>
        <div><label style={s.label}>Recurring</label>
          <select style={s.input} value={newR.recurring} onChange={e=>setNewR(r=>({...r,recurring:e.target.value}))}>
            <option value="none">One-time</option><option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option><option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
      <button style={{...s.btn("primary"),marginTop:8}} onClick={add}>Add Reminder</button>
    </div>
  );
}

function SessionNotesTab({ patient, onUpdate }) {
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attended, setAttended] = useState(true);
  const [mood, setMood] = useState(3);
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!note.trim()) return;
    const newSession = { id: Date.now(), date, attended, notes: note, mood };
    const updated = {
      ...patient,
      sessions: [...patient.sessions, newSession],
      mood: [...(patient.mood||[]), mood],
    };
    onUpdate(updated);
    setNote(""); setAiResult("");
  };

  const analyse = async () => {
    const allNotes = patient.sessions.filter(s=>s.notes).map((s,i)=>`Session ${i+1} (${s.date}): ${s.notes}`).join("\n\n");
    if (!allNotes.trim()) { setAiResult("No session notes available to analyse yet."); return; }
    setLoading(true); setAiResult("");
    try {
      const prompt = `You are a clinical supervisor supporting a psychotherapist. The following are session notes for a patient named ${patient.name}, aged ${patient.age}, presenting with: ${patient.diagnosis}.\n\nBackground: ${patient.history||"Not provided"}\n\nSession Notes:\n${allNotes}\n\nPlease provide:\n1. KEY THEMES & PATTERNS observed across sessions\n2. THERAPEUTIC PROGRESS: What progress has been made?\n3. AREAS OF CONCERN: Any risk indicators or stagnation?\n4. RECOMMENDED PSYCHOLOGICAL TESTS to consider\n5. THERAPEUTIC SUGGESTIONS: Approaches or techniques to try\n6. NEXT STEPS for the therapist\n\nBe specific, clinically grounded, and compassionate. Format clearly with headings.`;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{role:"user",content:prompt}] })
      });
      const data = await res.json();
      const text = data.content?.filter(c=>c.type==="text").map(c=>c.text).join("\n")||"No response.";
      setAiResult(text);
    } catch(e) { setAiResult("Analysis unavailable. Please try again."); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{fontSize:12,color:COLORS.muted,fontWeight:500,marginBottom:16}}>ADD SESSION NOTE</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <div><label style={s.label}>Session Date</label><input type="date" style={s.input} value={date} onChange={e=>setDate(e.target.value)}/></div>
        <div><label style={s.label}>Attendance</label>
          <select style={s.input} value={attended} onChange={e=>setAttended(e.target.value==="true")}>
            <option value="true">Attended</option><option value="false">Did not attend</option>
          </select>
        </div>
      </div>
      <div style={{...s.formGroup,marginBottom:8}}>
        <label style={s.label}>Mood Score (1–5)</label>
        <div style={{display:"flex",gap:8}}>
          {[1,2,3,4,5].map(v=>(
            <button key={v} onClick={()=>setMood(v)} style={{
              width:36,height:36,borderRadius:8,border:`2px solid ${mood===v?COLORS.accent:COLORS.border}`,
              background:mood===v?COLORS.accentLight:"transparent",cursor:"pointer",fontSize:14,fontFamily:COLORS.sans,
              color:mood===v?COLORS.accent:COLORS.muted,
            }}>{v}</button>
          ))}
        </div>
      </div>
      <div style={s.formGroup}>
        <label style={s.label}>Session Notes</label>
        <textarea style={{...s.textarea,minHeight:120}} placeholder="Write your session notes here..." value={note} onChange={e=>setNote(e.target.value)}/>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:24}}>
        <button style={s.btn("primary")} onClick={submit}>Save Note</button>
        <button style={s.btn("accent")} onClick={analyse} disabled={loading}>
          {loading?"Analysing...":"✦ Analyse All Notes with AI"}
        </button>
      </div>
      {aiResult && (
        <div>
          <div style={{fontSize:12,color:COLORS.accent,fontWeight:500,marginBottom:8}}>✦ AI CLINICAL ANALYSIS</div>
          <div style={s.aiBox}>{aiResult}</div>
        </div>
      )}
    </div>
  );
}

function PatientsPage({ patients, setPatients }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newP, setNewP] = useState({name:"",age:"",type:"Adult",diagnosis:"",startDate:"",phone:"",email:"",history:"",risk:"low",sessions:[],reminders:[],tests:[],mood:[]});

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.diagnosis.toLowerCase().includes(search.toLowerCase()));
  const updatePatient = (updated) => { setPatients(ps => ps.map(p => p.id===updated.id ? updated : p)); setSelected(updated); };
  const addPatient = () => {
    if (!newP.name) return;
    setPatients(ps => [...ps, {...newP, id:Date.now()}]);
    setAdding(false);
    setNewP({name:"",age:"",type:"Adult",diagnosis:"",startDate:"",phone:"",email:"",history:"",risk:"low",sessions:[],reminders:[],tests:[],mood:[]});
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32}}>
        <div>
          <div style={s.pageTitle}>Patients</div>
          <div style={s.pageSub}>{patients.length} active cases</div>
        </div>
        <button style={s.btn("primary")} onClick={()=>setAdding(true)}>+ New Patient</button>
      </div>
      <input style={{...s.input,maxWidth:320,marginBottom:24}} placeholder="Search by name or diagnosis..." value={search} onChange={e=>setSearch(e.target.value)}/>
      <div style={s.grid2}>
        {filtered.map(p => <PatientCard key={p.id} patient={p} onClick={()=>setSelected(p)}/>)}
      </div>
      {selected && <PatientModal patient={selected} onClose={()=>setSelected(null)} onUpdate={updatePatient}/>}
      {adding && (
        <div style={s.modal} onClick={e=>e.target===e.currentTarget&&setAdding(false)}>
          <div style={s.modalBox}>
            <div style={{fontFamily:COLORS.serif,fontSize:20,marginBottom:20}}>New Patient</div>
            {[["name","Full Name"],["age","Age"],["diagnosis","Diagnosis / Presenting Issue"],["phone","Phone"],["email","Email"]].map(([k,l])=>(
              <div key={k} style={s.formGroup}><label style={s.label}>{l}</label><input style={s.input} value={newP[k]||""} onChange={e=>setNewP(p=>({...p,[k]:e.target.value}))}/></div>
            ))}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              <div><label style={s.label}>Type</label>
                <select style={s.input} value={newP.type} onChange={e=>setNewP(p=>({...p,type:e.target.value}))}>
                  {["Child","Adolescent","Adult","Couple","Family"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label style={s.label}>Risk</label>
                <select style={s.input} value={newP.risk} onChange={e=>setNewP(p=>({...p,risk:e.target.value}))}>
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select>
              </div>
              <div><label style={s.label}>Start Date</label><input type="date" style={s.input} value={newP.startDate} onChange={e=>setNewP(p=>({...p,startDate:e.target.value}))}/></div>
            </div>
            <div style={s.formGroup}><label style={s.label}>Background / History</label><textarea style={s.textarea} value={newP.history} onChange={e=>setNewP(p=>({...p,history:e.target.value}))}/></div>
            <div style={{display:"flex",gap:10}}>
              <button style={s.btn("primary")} onClick={addPatient}>Add Patient</button>
              <button style={s.btn("ghost")} onClick={()=>setAdding(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SessionsPage({ patients, setPatients }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({patientId:"",date:"",attended:true,notes:"",mood:3});
  const allSessions = patients.flatMap(p => p.sessions.map(s=>({...s,patientName:p.name,patientId:p.id}))).sort((a,b)=>b.date.localeCompare(a.date));

  const save = () => {
    if (!form.patientId) return;
    setPatients(ps => ps.map(p => p.id===parseInt(form.patientId)
      ? {...p, sessions:[...p.sessions,{id:Date.now(),date:form.date,attended:form.attended,notes:form.notes}], mood:[...(p.mood||[]),form.mood]}
      : p
    ));
    setAdding(false);
    setForm({patientId:"",date:"",attended:true,notes:"",mood:3});
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32}}>
        <div>
          <div style={s.pageTitle}>Sessions</div>
          <div style={s.pageSub}>All recorded sessions across patients</div>
        </div>
        <button style={s.btn("primary")} onClick={()=>setAdding(true)}>+ Log Session</button>
      </div>
      <div style={s.card}>
        {allSessions.map((sess,i) => (
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:`1px solid ${COLORS.border}`}}>
            <div>
              <div style={{fontSize:14,fontWeight:500}}>{sess.patientName}</div>
              {sess.notes && <div style={{fontSize:12,color:COLORS.muted,marginTop:2,maxWidth:480}}>{sess.notes.substring(0,100)}{sess.notes.length>100?"…":""}</div>}
            </div>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <span style={{fontSize:13,color:COLORS.muted}}>{sess.date}</span>
              <span style={s.tag(sess.attended?"success":"danger")}>{sess.attended?"Attended":"DNA"}</span>
            </div>
          </div>
        ))}
        {allSessions.length===0 && <div style={{color:COLORS.muted,fontSize:14}}>No sessions recorded yet.</div>}
      </div>
      {adding && (
        <div style={s.modal} onClick={e=>e.target===e.currentTarget&&setAdding(false)}>
          <div style={s.modalBox}>
            <div style={{fontFamily:COLORS.serif,fontSize:20,marginBottom:20}}>Log Session</div>
            <div style={s.formGroup}><label style={s.label}>Patient</label>
              <select style={s.input} value={form.patientId} onChange={e=>setForm(f=>({...f,patientId:e.target.value}))}>
                <option value="">Select patient...</option>
                {patients.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={s.label}>Date</label><input type="date" style={s.input} value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></div>
              <div><label style={s.label}>Attendance</label>
                <select style={s.input} value={form.attended} onChange={e=>setForm(f=>({...f,attended:e.target.value==="true"}))}>
                  <option value="true">Attended</option><option value="false">Did not attend</option>
                </select>
              </div>
            </div>
            <div style={{...s.formGroup,marginBottom:12}}>
              <label style={s.label}>Mood (1–5)</label>
              <div style={{display:"flex",gap:8}}>
                {[1,2,3,4,5].map(v=>(
                  <button key={v} onClick={()=>setForm(f=>({...f,mood:v}))} style={{width:36,height:36,borderRadius:8,border:`2px solid ${form.mood===v?COLORS.accent:COLORS.border}`,background:form.mood===v?COLORS.accentLight:"transparent",cursor:"pointer",fontSize:14,fontFamily:COLORS.sans,color:form.mood===v?COLORS.accent:COLORS.muted}}>{v}</button>
                ))}
              </div>
            </div>
            <div style={s.formGroup}><label style={s.label}>Session Notes</label><textarea style={s.textarea} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></div>
            <div style={{display:"flex",gap:10}}>
              <button style={s.btn("primary")} onClick={save}>Save Session</button>
              <button style={s.btn("ghost")} onClick={()=>setAdding(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RemindersPage({ patients, setPatients }) {
  const today = new Date().toISOString().split("T")[0];
  const allReminders = patients.flatMap(p => p.reminders.map(r=>({...r,patientName:p.name,patientId:p.id})));
  const due = allReminders.filter(r => r.date <= today);
  const upcoming = allReminders.filter(r => r.date > today).sort((a,b)=>a.date.localeCompare(b.date));

  return (
    <div>
      <div style={s.pageTitle}>Reminders</div>
      <div style={s.pageSub}>Manage reminders across all patients</div>
      {due.length > 0 && (
        <div style={{marginBottom:32}}>
          <div style={{fontSize:12,fontWeight:500,color:COLORS.danger,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Due / Overdue ({due.length})</div>
          <div style={s.card}>
            {due.map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${COLORS.border}`}}>
                <div>
                  <div style={{fontSize:14}}>{r.text}</div>
                  <div style={{fontSize:12,color:COLORS.muted}}>{r.patientName} · {r.date}{r.recurring!=="none"?` · ${r.recurring}`:""}</div>
                </div>
                <span style={s.tag("danger")}>Due</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <div style={{fontSize:12,fontWeight:500,color:COLORS.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Upcoming</div>
        <div style={s.card}>
          {upcoming.length===0 && <div style={{color:COLORS.muted,fontSize:14}}>No upcoming reminders.</div>}
          {upcoming.map((r,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${COLORS.border}`}}>
              <div>
                <div style={{fontSize:14}}>{r.text}</div>
                <div style={{fontSize:12,color:COLORS.muted}}>{r.patientName} · {r.recurring!=="none"?r.recurring:"one-time"}</div>
              </div>
              <span style={{fontSize:13,color:COLORS.muted}}>{r.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function extractTextFromFile(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".txt") || name.endsWith(".md")) {
    return await file.text();
  }
  if (name.endsWith(".pdf")) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = e.target.result.split(",")[1];
          const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514", max_tokens: 1000,
              messages: [{ role: "user", content: [
                { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
                { type: "text", text: "Extract and return all the text from this document exactly as written. Return only the raw text, no commentary." }
              ]}]
            })
          });
          const data = await res.json();
          const text = data.content?.filter(c => c.type === "text").map(c => c.text).join("\n") || "";
          resolve(text);
        } catch { resolve(""); }
      };
      reader.readAsDataURL(file);
    });
  }
  // For .docx and other files — read as text fallback
  try { return await file.text(); } catch { return ""; }
}

function UploadNotesPanel({ patient, onUpdate }) {
  const [uploads, setUploads] = useState([]);
  const [importing, setImporting] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisScope, setAnalysisScope] = useState("uploaded");
  const fileRef = useRef();

  const handleFiles = async (files) => {
    setImporting(true);
    const results = [];
    for (const file of Array.from(files)) {
      const text = await extractTextFromFile(file);
      if (text.trim()) results.push({ name: file.name, text, id: Date.now() + Math.random() });
    }
    setUploads(u => [...u, ...results]);
    setImporting(false);
  };

  const removeUpload = (id) => setUploads(u => u.filter(f => f.id !== id));

  const importToSessions = () => {
    if (!uploads.length) return;
    const newSessions = uploads.map(u => ({
      id: Date.now() + Math.random(),
      date: new Date().toISOString().split("T")[0],
      attended: true,
      notes: `[Imported from: ${u.name}]\n\n${u.text}`,
      mood: 3,
    }));
    onUpdate({ ...patient, sessions: [...patient.sessions, ...newSessions] });
    setUploads([]);
    alert(`${newSessions.length} file(s) imported as session notes.`);
  };

  const analyse = async () => {
    setLoading(true); setAiResult("");
    let notesText = "";
    if (analysisScope === "uploaded") {
      notesText = uploads.map((u, i) => `File ${i + 1} — ${u.name}:\n${u.text}`).join("\n\n---\n\n");
    } else {
      const saved = patient.sessions.filter(s => s.notes).map((s, i) => `Session ${i + 1} (${s.date}): ${s.notes}`).join("\n\n");
      const up = uploads.map((u, i) => `Uploaded File ${i + 1} — ${u.name}:\n${u.text}`).join("\n\n");
      notesText = [saved, up].filter(Boolean).join("\n\n---\n\n");
    }
    if (!notesText.trim()) { setAiResult("No notes to analyse."); setLoading(false); return; }
    try {
      const prompt = `You are a clinical supervisor supporting a psychotherapist. The following notes relate to a patient named ${patient.name}, aged ${patient.age}, presenting with: ${patient.diagnosis}.\n\nBackground: ${patient.history || "Not provided"}\n\nNotes:\n${notesText}\n\nPlease provide a thorough clinical analysis covering:\n1. KEY THEMES & RECURRING PATTERNS\n2. THERAPEUTIC PROGRESS & TIMELINE\n3. AREAS OF CONCERN & RISK INDICATORS\n4. RECOMMENDED PSYCHOLOGICAL ASSESSMENTS\n5. THERAPEUTIC APPROACHES TO CONSIDER\n6. SUGGESTED NEXT STEPS FOR THE THERAPIST\n\nBe specific, evidence-based, and clinically grounded.`;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      setAiResult(data.content?.filter(c => c.type === "text").map(c => c.text).join("\n") || "No response.");
    } catch { setAiResult("Analysis unavailable. Please try again."); }
    setLoading(false);
  };

  const dropProps = {
    onDragOver: e => { e.preventDefault(); e.currentTarget.style.borderColor = COLORS.accent; },
    onDragLeave: e => { e.currentTarget.style.borderColor = COLORS.border; },
    onDrop: e => { e.preventDefault(); e.currentTarget.style.borderColor = COLORS.border; handleFiles(e.dataTransfer.files); },
  };

  return (
    <div>
      <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
        Upload Previous Notes
      </div>

      {/* Drop zone */}
      <div {...dropProps} onClick={() => fileRef.current.click()} style={{
        border: `2px dashed ${COLORS.border}`, borderRadius: 14, padding: "32px 24px",
        textAlign: "center", cursor: "pointer", transition: "border-color 0.2s", marginBottom: 16,
        background: COLORS.bg,
      }}>
        <input ref={fileRef} type="file" multiple accept=".txt,.pdf,.md,.docx" style={{ display: "none" }}
          onChange={e => handleFiles(e.target.files)} />
        <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
        <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 500 }}>
          {importing ? "Reading files…" : "Drop files here or click to browse"}
        </div>
        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>Supports .txt, .pdf, .md files</div>
      </div>

      {/* Uploaded files list */}
      {uploads.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 500, marginBottom: 10 }}>
            {uploads.length} file{uploads.length > 1 ? "s" : ""} ready
          </div>
          {uploads.map(u => (
            <div key={u.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 14px", background: COLORS.successLight, borderRadius: 10, marginBottom: 6,
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.success }}>✓ {u.name}</div>
                <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>
                  {u.text.length.toLocaleString()} characters extracted
                </div>
              </div>
              <button onClick={() => removeUpload(u.id)} style={{
                background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 16, padding: "0 4px"
              }}>×</button>
            </div>
          ))}

          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <button style={s.btn("ghost")} onClick={importToSessions}>
              ↓ Import as Session Notes
            </button>
          </div>
        </div>
      )}

      {/* Analysis scope + trigger */}
      {(uploads.length > 0 || patient.sessions.some(s => s.notes)) && (
        <div style={{ marginTop: 8 }}>
          <div style={s.divider} />
          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 500, marginBottom: 10 }}>ANALYSE</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            {[
              { val: "uploaded", label: "Uploaded files only" },
              { val: "all", label: "Uploaded + saved sessions" },
            ].map(opt => (
              <button key={opt.val} onClick={() => setAnalysisScope(opt.val)} style={{
                padding: "7px 14px", borderRadius: 8, border: `2px solid ${analysisScope === opt.val ? COLORS.accent : COLORS.border}`,
                background: analysisScope === opt.val ? COLORS.accentLight : "transparent",
                color: analysisScope === opt.val ? COLORS.accent : COLORS.muted,
                fontSize: 13, cursor: "pointer", fontFamily: COLORS.sans,
              }}>{opt.label}</button>
            ))}
          </div>
          <button style={{ ...s.btn("primary"), opacity: loading ? 0.7 : 1 }} onClick={analyse} disabled={loading}>
            {loading ? "Analysing…" : "✦ Run AI Analysis"}
          </button>
        </div>
      )}

      {aiResult && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: COLORS.accent, fontWeight: 500, marginBottom: 8 }}>
            ✦ Clinical Analysis
          </div>
          <div style={s.aiBox}>{aiResult}</div>
        </div>
      )}
    </div>
  );
}

function NotesPage({ patients, setPatients }) {
  const [selected, setSelected] = useState(patients[0] || null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attended, setAttended] = useState(true);
  const [mood, setMood] = useState(3);
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [subTab, setSubTab] = useState("write");

  // Keep selected in sync when patients update
  useEffect(() => {
    if (selected) setSelected(patients.find(p => p.id === selected.id) || patients[0] || null);
  }, [patients]);

  const submit = () => {
    if (!selected || !note.trim()) return;
    const newSession = { id: Date.now(), date, attended, notes: note, mood };
    setPatients(ps => ps.map(p => p.id === selected.id
      ? { ...p, sessions: [...p.sessions, newSession], mood: [...(p.mood || []), mood] }
      : p
    ));
    setNote(""); setAiResult("");
  };

  const analyse = async () => {
    if (!selected) return;
    const allNotes = selected.sessions.filter(s => s.notes).map((s, i) => `Session ${i + 1} (${s.date}): ${s.notes}`).join("\n\n");
    if (!allNotes.trim()) { setAiResult("No session notes available for this patient yet."); return; }
    setLoading(true); setAiResult("");
    try {
      const prompt = `You are a clinical supervisor supporting a psychotherapist. Below are session notes for ${selected.name}, aged ${selected.age}, presenting with: ${selected.diagnosis}.\n\nBackground: ${selected.history || "Not provided"}\n\nSession Notes:\n${allNotes}\n\nProvide:\n1. KEY THEMES & PATTERNS\n2. THERAPEUTIC PROGRESS\n3. AREAS OF CONCERN & RISK INDICATORS\n4. RECOMMENDED PSYCHOLOGICAL ASSESSMENTS\n5. THERAPEUTIC APPROACHES TO CONSIDER\n6. SUGGESTED NEXT STEPS\n\nBe specific, evidence-based, and clinically thoughtful.`;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      const text = data.content?.filter(c => c.type === "text").map(c => c.text).join("\n") || "No response.";
      setAiResult(text);
    } catch { setAiResult("Analysis unavailable. Please try again."); }
    setLoading(false);
  };

  const updatePatient = (updated) => setPatients(ps => ps.map(p => p.id === updated.id ? updated : p));

  return (
    <div>
      <div style={s.pageTitle}>Session Notes</div>
      <div style={s.pageSub}>Write notes, upload previous records, and run AI analysis</div>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>
        {/* Patient list */}
        <div style={s.card}>
          <div style={s.cardTitle}>Patients</div>
          {patients.map(p => (
            <div key={p.id} onClick={() => { setSelected(p); setAiResult(""); }} style={{
              padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 4, fontSize: 14,
              background: selected?.id === p.id ? COLORS.accentLight : "transparent",
              color: selected?.id === p.id ? COLORS.accent : COLORS.text,
            }}>{p.name}</div>
          ))}
        </div>

        {/* Right panel */}
        <div style={s.card}>
          {!selected
            ? <div style={{ color: COLORS.muted }}>Select a patient</div>
            : <>
              <div style={{ fontFamily: COLORS.serif, fontSize: 18, marginBottom: 2 }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 20 }}>{selected.diagnosis}</div>

              {/* Sub-tabs */}
              <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 12 }}>
                {[{ id: "write", label: "Write Note" }, { id: "upload", label: "📎 Upload & Analyse" }, { id: "history", label: "Note History" }].map(t => (
                  <button key={t.id} onClick={() => setSubTab(t.id)} style={{
                    padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13,
                    fontFamily: COLORS.sans, fontWeight: subTab === t.id ? 500 : 400,
                    background: subTab === t.id ? COLORS.accentLight : "transparent",
                    color: subTab === t.id ? COLORS.accent : COLORS.muted,
                  }}>{t.label}</button>
                ))}
              </div>

              {/* Write Note tab */}
              {subTab === "write" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div><label style={s.label}>Date</label><input type="date" style={s.input} value={date} onChange={e => setDate(e.target.value)} /></div>
                    <div><label style={s.label}>Attendance</label>
                      <select style={s.input} value={attended} onChange={e => setAttended(e.target.value === "true")}>
                        <option value="true">Attended</option><option value="false">Did not attend</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={s.label}>Mood (1–5)</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[1, 2, 3, 4, 5].map(v => (
                        <button key={v} onClick={() => setMood(v)} style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${mood === v ? COLORS.accent : COLORS.border}`, background: mood === v ? COLORS.accentLight : "transparent", cursor: "pointer", fontSize: 14, fontFamily: COLORS.sans, color: mood === v ? COLORS.accent : COLORS.muted }}>{v}</button>
                      ))}
                    </div>
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Session Notes</label>
                    <textarea style={{ ...s.textarea, minHeight: 160 }} placeholder="Document your observations, interventions, and patient responses..." value={note} onChange={e => setNote(e.target.value)} />
                  </div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                    <button style={s.btn("primary")} onClick={submit}>Save Note</button>
                    <button style={{ ...s.btn("accent"), background: COLORS.accentLight, color: COLORS.accent }} onClick={analyse} disabled={loading}>
                      {loading ? "Analysing…" : "✦ Analyse All Notes"}
                    </button>
                  </div>
                  {aiResult && (
                    <div>
                      <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: COLORS.accent, fontWeight: 500, marginBottom: 8 }}>✦ Clinical Analysis</div>
                      <div style={s.aiBox}>{aiResult}</div>
                    </div>
                  )}
                </>
              )}

              {/* Upload & Analyse tab */}
              {subTab === "upload" && (
                <UploadNotesPanel patient={selected} onUpdate={updatePatient} />
              )}

              {/* History tab */}
              {subTab === "history" && (
                <div>
                  {selected.sessions.filter(s => s.notes).length === 0
                    ? <div style={{ color: COLORS.muted, fontSize: 14 }}>No notes saved yet.</div>
                    : selected.sessions.filter(s => s.notes).map((sess, i) => (
                      <div key={sess.id || i} style={{ padding: "14px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{sess.date}</span>
                          <span style={s.tag(sess.attended ? "success" : "danger")}>{sess.attended ? "Attended" : "DNA"}</span>
                        </div>
                        <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{sess.notes}</div>
                      </div>
                    ))
                  }
                </div>
              )}
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [patients, setPatients] = useStorage("therapydesk_patients", initialPatients);

  const dueReminders = patients.flatMap(p=>p.reminders).filter(r=>r.date<=new Date().toISOString().split("T")[0]).length;

  if (!unlocked) return <PinScreen onUnlock={()=>setUnlocked(true)}/>;

  return (
    <div style={s.app}>
      <style>{FONTS}{CSS}</style>
      <Sidebar page={page} setPage={setPage} reminderCount={dueReminders}/>
      <main style={s.main}>
        {page==="dashboard" && <Dashboard patients={patients} setPage={setPage}/>}
        {page==="patients" && <PatientsPage patients={patients} setPatients={setPatients}/>}
        {page==="sessions" && <SessionsPage patients={patients} setPatients={setPatients}/>}
        {page==="reminders" && <RemindersPage patients={patients} setPatients={setPatients}/>}
        {page==="notes" && <NotesPage patients={patients} setPatients={setPatients}/>}
      </main>
    </div>
  );
}
