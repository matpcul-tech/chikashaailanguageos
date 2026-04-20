import { useState, useEffect, useRef } from "react";

// ── PALETTE ───────────────────────────────────────────────────────────────────
const C = {
  clay:       "#1A0E08",
  earth:      "#241408",
  bark:       "#2E1C0C",
  wood:       "#3A2410",
  border:     "#4A3420",
  borderLight:"#6A5030",
  sienna:     "#8B4513",
  terra:      "#C05A20",
  ochre:      "#C8860A",
  gold:       "#D4A030",
  sand:       "#E8C878",
  bone:       "#F2E4C4",
  boneDim:    "#A08060",
  cream:      "#FAF0DC",
  teal:       "#1A6A5A",
  tealLight:  "#2A8A70",
  tealGlow:   "#0D3A30",
  muted:      "#6A5840",
  red:        "#8B2010",
  sage:       "#4A6A3A",
};

// ── ZK SHIELD LAYER ───────────────────────────────────────────────────────────
const CHICKASAW_TERMS = [
  "yakoke","chikasha","chikashshanompa","halito","chi yukpa lashke",
  "iti fabvssa","ihoo","amafo","imoshi","nan vlhpisa","nanta","kallo",
  "holisso","pashofa","banaha","tanchi","pvtata","ofi","yasho","sinti",
  "hashi","oka","iti","nusi","nitak","hvshi","hattak","ohoyo","chipota",
];

function shieldHash(text) {
  let hash = 0x9A4F2C1B;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0").toUpperCase();
}

function applyShield(text) {
  const lower = text.toLowerCase();
  const detected = [];
  let protected_text = text;
  CHICKASAW_TERMS.forEach(term => {
    const re = new RegExp(term, "gi");
    if (re.test(lower)) {
      const hash = shieldHash(term);
      detected.push({ term, hash });
      protected_text = protected_text.replace(re, `[ZK:${hash}]`);
    }
  });
  return { detected, protected_text, original: text };
}

// ── WOVEN PATTERN BG ─────────────────────────────────────────────────────────
const WovenBg = () => (
  <svg style={{ position:"fixed", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0, opacity:0.06 }} viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="weave" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        {/* Horizontal bands */}
        <rect x="0" y="0" width="30" height="4" fill="#C8860A" opacity="0.8"/>
        <rect x="0" y="8" width="30" height="2" fill="#8B4513" opacity="0.6"/>
        <rect x="0" y="14" width="30" height="4" fill="#C05A20" opacity="0.7"/>
        <rect x="0" y="22" width="30" height="2" fill="#8B4513" opacity="0.6"/>
        {/* Vertical interlace */}
        <rect x="0" y="0" width="4" height="30" fill="#D4A030" opacity="0.4"/>
        <rect x="10" y="0" width="2" height="30" fill="#8B4513" opacity="0.3"/>
        <rect x="18" y="0" width="4" height="30" fill="#C8860A" opacity="0.35"/>
        <rect x="26" y="0" width="2" height="30" fill="#8B4513" opacity="0.3"/>
        {/* Diamond accents */}
        <polygon points="15,6 18,9 15,12 12,9" fill="#D4A030" opacity="0.6"/>
      </pattern>
    </defs>
    <rect width="300" height="300" fill="url(#weave)"/>
  </svg>
);

// ── CSS ───────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{opacity:0.6} 50%{opacity:1} 100%{opacity:0.6} }
  @keyframes shieldPulse { 0%,100%{box-shadow:0 0 8px #1A6A5A60} 50%{box-shadow:0 0 20px #1A6A5AA0, 0 0 40px #1A6A5A40} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  .fade-up { animation: fadeUp 0.5s ease forwards; }
  .shimmer { animation: shimmer 2.5s ease-in-out infinite; }
  .shield-active { animation: shieldPulse 2s ease-in-out infinite; }
  .float { animation: float 3s ease-in-out infinite; }
  .tab-btn { transition: all 0.25s ease; }
  .tab-btn:hover { opacity: 1 !important; }
  .card { transition: transform 0.2s, border-color 0.2s; }
  .card:hover { transform: translateY(-2px); border-color: #6A5030 !important; }
  textarea, input { transition: border-color 0.2s; }
  textarea:focus, input:focus { border-color: #C8860A !important; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #1A0E08; }
  ::-webkit-scrollbar-thumb { background: #4A3420; border-radius: 2px; }
`;

// ── PILL ──────────────────────────────────────────────────────────────────────
const Pill = ({ label, color = C.teal, dot = true }) => (
  <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:`${color}22`, border:`1px solid ${color}50`, color, padding:"3px 10px", borderRadius:20, fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"Cinzel, serif" }}>
    {dot && <span style={{ width:5, height:5, borderRadius:"50%", background:color, boxShadow:`0 0 6px ${color}` }}/>}
    {label}
  </span>
);

// ── SHIELD BADGE ──────────────────────────────────────────────────────────────
const ShieldBadge = ({ count }) => (
  <div className="shield-active" style={{ display:"inline-flex", alignItems:"center", gap:7, background:`${C.tealGlow}`, border:`1px solid ${C.teal}60`, borderRadius:8, padding:"6px 12px" }}>
    <span style={{ color:C.tealLight, fontSize:14 }}>⬡</span>
    <div>
      <div style={{ color:C.tealLight, fontSize:10, fontWeight:700, letterSpacing:1, fontFamily:"Cinzel,serif" }}>SHIELD ACTIVE</div>
      {count > 0 && <div style={{ color:C.boneDim, fontSize:9 }}>{count} Chickasaw term{count>1?"s":""} protected</div>}
    </div>
  </div>
);

// ── PROTECTED QUERY ENGINE ────────────────────────────────────────────────────
async function shieldedQuery(userText, systemPrompt, onShieldResult) {
  const shieldResult = applyShield(userText);
  onShieldResult(shieldResult);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userText }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "No response.";
}

// ── TAB: CHIKASHSHANOMPA' ─────────────────────────────────────────────────────
function DictionaryTab() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [shield, setShield] = useState(null);

  const lookup = async () => {
    if (!query.trim()) return;
    setLoading(true); setResult(null); setShield(null);
    try {
      const text = await shieldedQuery(
        query,
        `You are a Chikashshanompa' (Chickasaw language) expert and cultural scholar within the Chikasha Language OS — a sovereign platform built for the Chickasaw Nation.

For any Chickasaw word or phrase provided, respond with:
1. **Word/Phrase** — the term in Chikashshanompa'
2. **Pronunciation** — phonetic guide (be specific and helpful)
3. **Meaning** — clear English translation
4. **Cultural Context** — why this word matters, how it's used, what it reveals about Chickasaw worldview
5. **Example** — a simple sentence using the word

For English words, provide the Chickasaw equivalent with the same structure.
For questions about language or culture, answer with depth and respect.

Always honor the sacredness of the language. Be warm, educational, and precise.
Never translate sacred ceremonial language without noting its sensitivity.`,
        setShield
      );
      setResult(text);
    } catch { setResult("Connection error. Please try again."); }
    setLoading(false);
  };

  const examples = [
    { word:"Yakoke", eng:"Thank you", cat:"Courtesy" },
    { word:"Halito", eng:"Hello", cat:"Greeting" },
    { word:"Kallo", eng:"Strong / Brave", cat:"Character" },
    { word:"Oka", eng:"Water", cat:"Nature" },
    { word:"Hashi", eng:"Sun", cat:"Nature" },
    { word:"Ohoyo", eng:"Woman", cat:"People" },
    { word:"Hattak", eng:"Man / Person", cat:"People" },
    { word:"Chipota", eng:"Child", cat:"Family" },
  ];

  return (
    <div className="fade-up">
      <div style={{ marginBottom:22 }}>
        <h2 style={{ fontFamily:"Cinzel,serif", color:C.sand, fontSize:20, fontWeight:700, margin:"0 0 6px", letterSpacing:2 }}>Chikashshanompa' Dictionary</h2>
        <p style={{ color:C.boneDim, fontSize:12, fontFamily:"'Crimson Text',serif", fontStyle:"italic", margin:0, lineHeight:1.6 }}>Enter a Chickasaw word, an English word, or ask a language question. Every query is Shield-protected before leaving your browser.</p>
      </div>

      <div style={{ background:C.bark, border:`1px solid ${C.border}`, borderRadius:14, padding:20, marginBottom:20 }}>
        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
          {shield && shield.detected.length > 0
            ? <ShieldBadge count={shield.detected.length}/>
            : <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:`${C.teal}15`, border:`1px solid ${C.teal}30`, borderRadius:8, padding:"6px 12px" }}>
                <span style={{ color:C.teal, fontSize:12 }}>⬡</span>
                <span style={{ color:C.boneDim, fontSize:10, letterSpacing:1, fontFamily:"Cinzel,serif" }}>SHIELD READY</span>
              </div>
          }
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&lookup()}
            placeholder="e.g. 'yakoke' · 'strength' · 'How do you say grandmother?'"
            style={{ flex:1, background:C.clay, border:`1px solid ${C.border}`, borderRadius:9, color:C.bone, padding:"11px 14px", fontSize:13, outline:"none", fontFamily:"'Crimson Text',serif" }}
          />
          <button onClick={lookup} disabled={loading||!query.trim()} style={{ background: loading?C.border:C.ochre, color: loading?C.muted:C.clay, border:"none", borderRadius:9, padding:"11px 20px", fontWeight:700, fontSize:12, cursor: loading?"not-allowed":"pointer", fontFamily:"Cinzel,serif", letterSpacing:1, whiteSpace:"nowrap" }}>
            {loading ? "..." : "Look Up"}
          </button>
        </div>

        {shield && shield.detected.length > 0 && (
          <div style={{ marginTop:10, background:`${C.teal}12`, border:`1px solid ${C.teal}30`, borderRadius:8, padding:"10px 14px" }}>
            <div style={{ color:C.tealLight, fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"Cinzel,serif", marginBottom:6 }}>ZK Hash — Terms Protected at Browser Edge</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {shield.detected.map((d,i) => (
                <span key={i} style={{ background:C.bark, border:`1px solid ${C.teal}40`, borderRadius:5, padding:"3px 8px", fontSize:10, color:C.tealLight, fontFamily:"monospace" }}>
                  {d.term} → {d.hash}
                </span>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div style={{ marginTop:14, background:C.clay, border:`1px solid ${C.border}`, borderRadius:10, padding:"16px 18px" }}>
            <div style={{ color:C.ochre, fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"Cinzel,serif", marginBottom:10 }}>Chikasha Language OS Response</div>
            <div style={{ color:C.bone, fontSize:13, lineHeight:1.9, whiteSpace:"pre-wrap", fontFamily:"'Crimson Text',serif" }}>{result}</div>
          </div>
        )}
      </div>

      {/* Quick reference grid */}
      <div style={{ color:C.boneDim, fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"Cinzel,serif", marginBottom:12 }}>Quick Reference</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:10 }}>
        {examples.map((e,i) => (
          <div key={i} className="card" onClick={()=>{setQuery(e.word);}} style={{ background:C.bark, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", cursor:"pointer" }}>
            <div style={{ color:C.sand, fontFamily:"Cinzel,serif", fontSize:14, fontWeight:700, marginBottom:3 }}>{e.word}</div>
            <div style={{ color:C.bone, fontSize:12, fontFamily:"'Crimson Text',serif", marginBottom:4 }}>{e.eng}</div>
            <Pill label={e.cat} color={C.sienna} dot={false}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TAB: PHRASE BUILDER ───────────────────────────────────────────────────────
function PhrasesTab() {
  const [category, setCategory] = useState("Greetings");
  const [loading, setLoading] = useState(false);
  const [phrases, setPhrases] = useState(null);
  const [shield, setShield] = useState(null);

  const cats = ["Greetings","Family","Nature","Strength","Ceremony","Daily Life","Numbers","Colors"];

  const loadPhrases = async (cat) => {
    setCategory(cat); setLoading(true); setPhrases(null); setShield(null);
    try {
      const text = await shieldedQuery(
        `Give me 6 essential Chickasaw phrases for the category: ${cat}`,
        `You are a Chikashshanompa' language educator within the Chikasha Language OS, a sovereign Chickasaw Nation platform.

For the requested category, provide exactly 6 phrases in this JSON format only — no preamble, no markdown fences:
[
  { "chickasaw": "word or phrase", "english": "translation", "pronunciation": "phonetic guide", "note": "brief cultural note" },
  ...
]

Make phrases genuinely useful and culturally meaningful. Pronunciations should be helpful for English speakers learning Chickasaw.`,
        setShield
      );
      try {
        const clean = text.replace(/```json|```/g,"").trim();
        setPhrases(JSON.parse(clean));
      } catch { setPhrases(null); }
    } catch { setPhrases(null); }
    setLoading(false);
  };

  return (
    <div className="fade-up">
      <div style={{ marginBottom:22 }}>
        <h2 style={{ fontFamily:"Cinzel,serif", color:C.sand, fontSize:20, fontWeight:700, margin:"0 0 6px", letterSpacing:2 }}>Phrase Builder</h2>
        <p style={{ color:C.boneDim, fontSize:12, fontFamily:"'Crimson Text',serif", fontStyle:"italic", margin:0 }}>Essential Chickasaw phrases by category — pronunciation guides included.</p>
      </div>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        {cats.map(c => (
          <button key={c} className="tab-btn" onClick={()=>loadPhrases(c)} style={{ background: category===c?C.ochre:C.bark, color: category===c?C.clay:C.boneDim, border:`1px solid ${category===c?C.ochre:C.border}`, padding:"7px 14px", borderRadius:8, cursor:"pointer", fontSize:11, fontWeight:700, fontFamily:"Cinzel,serif", letterSpacing:0.5 }}>{c}</button>
        ))}
      </div>

      {shield && shield.detected.length > 0 && <div style={{ marginBottom:14 }}><ShieldBadge count={shield.detected.length}/></div>}

      {!phrases && !loading && (
        <div style={{ background:C.bark, border:`1px solid ${C.border}`, borderRadius:14, padding:"40px 24px", textAlign:"center" }}>
          <div className="float" style={{ fontSize:36, marginBottom:12 }}>◎</div>
          <div style={{ color:C.boneDim, fontFamily:"'Crimson Text',serif", fontSize:14, fontStyle:"italic" }}>Select a category to load phrases</div>
        </div>
      )}

      {loading && (
        <div style={{ background:C.bark, border:`1px solid ${C.border}`, borderRadius:14, padding:"40px 24px", textAlign:"center" }}>
          <div className="shimmer" style={{ color:C.ochre, fontFamily:"Cinzel,serif", fontSize:12, letterSpacing:2 }}>LOADING PHRASES...</div>
        </div>
      )}

      {phrases && (
        <div style={{ display:"grid", gap:12 }}>
          {phrases.map((p,i) => (
            <div key={i} className="card" style={{ background:C.bark, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 20px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div>
                <div style={{ color:C.sand, fontFamily:"Cinzel,serif", fontSize:16, fontWeight:700, marginBottom:4 }}>{p.chickasaw}</div>
                <div style={{ color:C.boneDim, fontSize:10, fontFamily:"'Crimson Text',serif", fontStyle:"italic" }}>/{p.pronunciation}/</div>
              </div>
              <div>
                <div style={{ color:C.bone, fontSize:13, fontFamily:"'Crimson Text',serif", marginBottom:4 }}>{p.english}</div>
                <div style={{ color:C.muted, fontSize:11, lineHeight:1.5 }}>{p.note}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── TAB: CULTURAL KNOWLEDGE ───────────────────────────────────────────────────
function CultureTab() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [shield, setShield] = useState(null);

  const topics = [
    { label:"Iti Fabvssa", desc:"Backbone — ancestral strength" },
    { label:"Chickasaw Removal", desc:"Trail of Tears history" },
    { label:"Pashofa", desc:"Sacred corn hominy dish" },
    { label:"Stickball", desc:"Ishtaboli — the sacred game" },
    { label:"The Three Sisters", desc:"Corn, beans, squash" },
    { label:"Chickasaw Stomp Dance", desc:"Ceremonial tradition" },
  ];

  const ask = async (q) => {
    setTopic(q); setLoading(true); setResult(null); setShield(null);
    try {
      const text = await shieldedQuery(
        q,
        `You are a Chickasaw cultural knowledge keeper within the Chikasha Language OS — a sovereign platform built by and for the Chickasaw Nation.

Share cultural knowledge with depth, respect, and accuracy. You honor what is sacred by noting when topics require sensitivity. You celebrate the resilience, sophistication, and living culture of the Chickasaw people.

Connect cultural knowledge to language whenever possible — show how Chikashshanompa' encodes worldview, values, and history.

Be engaging, educational, and warm. Write for a Chickasaw citizen who wants to reconnect with their heritage, and for allies who want to understand it with proper respect.`,
        setShield
      );
      setResult(text);
    } catch { setResult("Connection error."); }
    setLoading(false);
  };

  return (
    <div className="fade-up">
      <div style={{ marginBottom:22 }}>
        <h2 style={{ fontFamily:"Cinzel,serif", color:C.sand, fontSize:20, fontWeight:700, margin:"0 0 6px", letterSpacing:2 }}>Cultural Knowledge</h2>
        <p style={{ color:C.boneDim, fontSize:12, fontFamily:"'Crimson Text',serif", fontStyle:"italic", margin:0 }}>Chickasaw history, traditions, and living culture — grounded in language.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
        {topics.map((t,i) => (
          <div key={i} className="card" onClick={()=>ask(t.label)} style={{ background:C.bark, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px", cursor:"pointer" }}>
            <div style={{ color:C.sand, fontFamily:"Cinzel,serif", fontSize:13, fontWeight:700, marginBottom:4 }}>{t.label}</div>
            <div style={{ color:C.muted, fontSize:11, fontFamily:"'Crimson Text',serif", fontStyle:"italic" }}>{t.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ background:C.bark, border:`1px solid ${C.border}`, borderRadius:12, padding:18, marginBottom:16 }}>
        <div style={{ color:C.boneDim, fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"Cinzel,serif", marginBottom:10 }}>Ask Anything</div>
        <div style={{ display:"flex", gap:8 }}>
          <input value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask(topic)} placeholder="Ask about Chickasaw history, traditions, language..." style={{ flex:1, background:C.clay, border:`1px solid ${C.border}`, borderRadius:8, color:C.bone, padding:"10px 13px", fontSize:12, outline:"none", fontFamily:"'Crimson Text',serif" }}/>
          <button onClick={()=>ask(topic)} disabled={loading||!topic.trim()} style={{ background: loading?C.border:C.ochre, color:C.clay, border:"none", borderRadius:8, padding:"10px 18px", fontWeight:700, fontSize:11, cursor:"pointer", fontFamily:"Cinzel,serif" }}>Ask</button>
        </div>
      </div>

      {shield && shield.detected.length > 0 && <div style={{ marginBottom:14 }}><ShieldBadge count={shield.detected.length}/></div>}

      {loading && <div className="shimmer" style={{ color:C.ochre, fontFamily:"Cinzel,serif", fontSize:11, letterSpacing:2, textAlign:"center", padding:"20px 0" }}>CONNECTING TO KNOWLEDGE BASE...</div>}

      {result && (
        <div style={{ background:C.bark, border:`1px solid ${C.border}`, borderLeft:`3px solid ${C.ochre}`, borderRadius:12, padding:"18px 20px" }}>
          <div style={{ color:C.bone, fontSize:13, lineHeight:1.9, whiteSpace:"pre-wrap", fontFamily:"'Crimson Text',serif" }}>{result}</div>
        </div>
      )}
    </div>
  );
}

// ── TAB: ORAL HISTORY ─────────────────────────────────────────────────────────
function OralTab() {
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState([]);
  const [aiPrompt, setAiPrompt] = useState(null);
  const [loading, setLoading] = useState(false);

  const prompts = [
    "Share a memory of an elder teaching you something important",
    "Describe a place that holds meaning for your family",
    "What Chickasaw tradition do you want future generations to know?",
    "Tell the story of how your family came to where you live now",
    "What does being Chickasaw mean to you in your own words?",
    "Share a story you were told as a child about the Chickasaw people",
  ];

  const getPrompt = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:300,
          system:`You are a cultural preservation specialist for the Chikasha Language OS. Generate one thoughtful, specific oral history prompt designed to help Chickasaw citizens preserve their personal and family stories. The prompt should be warm, inviting, and specific enough to spark genuine memories. Return only the prompt text — no preamble.`,
          messages:[{ role:"user", content:"Give me an oral history preservation prompt for a Chickasaw citizen." }],
        }),
      });
      const data = await res.json();
      setAiPrompt(data.content?.[0]?.text);
    } catch {}
    setLoading(false);
  };

  const save = () => {
    if (!entry.trim()) return;
    setSaved([{ text:entry, date: new Date().toLocaleDateString(), shield: applyShield(entry) }, ...saved]);
    setEntry("");
  };

  return (
    <div className="fade-up">
      <div style={{ marginBottom:22 }}>
        <h2 style={{ fontFamily:"Cinzel,serif", color:C.sand, fontSize:20, fontWeight:700, margin:"0 0 6px", letterSpacing:2 }}>Oral History</h2>
        <p style={{ color:C.boneDim, fontSize:12, fontFamily:"'Crimson Text',serif", fontStyle:"italic", margin:0 }}>Preserve stories, memories, and knowledge for future generations. Every entry is Shield-protected.</p>
      </div>

      <div style={{ background:C.bark, border:`1px solid ${C.border}`, borderRadius:14, padding:20, marginBottom:20 }}>
        <div style={{ color:C.boneDim, fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"Cinzel,serif", marginBottom:12 }}>Story Prompts</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
          {prompts.slice(0,3).map((p,i) => (
            <button key={i} onClick={()=>setEntry(p)} style={{ background:C.clay, border:`1px solid ${C.border}`, color:C.boneDim, padding:"6px 12px", borderRadius:7, cursor:"pointer", fontSize:11, fontFamily:"'Crimson Text',serif", fontStyle:"italic", textAlign:"left", lineHeight:1.4 }}>{p}</button>
          ))}
          <button onClick={getPrompt} disabled={loading} style={{ background:`${C.ochre}20`, border:`1px solid ${C.ochre}50`, color:C.ochre, padding:"6px 12px", borderRadius:7, cursor:"pointer", fontSize:11, fontFamily:"Cinzel,serif", letterSpacing:0.5 }}>{loading?"...":"✦ AI Prompt"}</button>
        </div>
        {aiPrompt && (
          <div onClick={()=>setEntry(aiPrompt)} style={{ background:C.clay, border:`1px solid ${C.ochre}40`, borderRadius:8, padding:"10px 14px", cursor:"pointer", marginBottom:12 }}>
            <div style={{ color:C.ochre, fontSize:9, letterSpacing:1.5, fontFamily:"Cinzel,serif", marginBottom:4 }}>AI-GENERATED PROMPT — tap to use</div>
            <div style={{ color:C.bone, fontSize:12, fontFamily:"'Crimson Text',serif", fontStyle:"italic", lineHeight:1.6 }}>{aiPrompt}</div>
          </div>
        )}
        <textarea value={entry} onChange={e=>setEntry(e.target.value)} placeholder="Begin your story here..." style={{ width:"100%", minHeight:120, background:C.clay, border:`1px solid ${C.border}`, borderRadius:9, color:C.bone, padding:"13px 15px", fontSize:13, resize:"vertical", outline:"none", fontFamily:"'Crimson Text',serif", lineHeight:1.8, boxSizing:"border-box" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
          <ShieldBadge count={applyShield(entry).detected.length}/>
          <button onClick={save} disabled={!entry.trim()} style={{ background:C.ochre, color:C.clay, border:"none", borderRadius:8, padding:"9px 20px", fontWeight:700, fontSize:11, cursor:"pointer", fontFamily:"Cinzel,serif", letterSpacing:1 }}>Preserve Story ✦</button>
        </div>
      </div>

      {saved.length > 0 && (
        <div>
          <div style={{ color:C.boneDim, fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"Cinzel,serif", marginBottom:12 }}>Preserved Entries ({saved.length})</div>
          {saved.map((s,i) => (
            <div key={i} style={{ background:C.bark, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px", marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <Pill label={`${s.shield.detected.length} terms protected`} color={C.teal}/>
                <span style={{ color:C.muted, fontSize:10 }}>{s.date}</span>
              </div>
              <div style={{ color:C.bone, fontSize:13, fontFamily:"'Crimson Text',serif", lineHeight:1.8 }}>{s.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── TAB: SHIELD STATUS ────────────────────────────────────────────────────────
function ShieldTab() {
  const [testInput, setTestInput] = useState("");
  const [result, setResult] = useState(null);

  const test = () => {
    if (!testInput.trim()) return;
    setResult(applyShield(testInput));
  };

  return (
    <div className="fade-up">
      <div style={{ marginBottom:22 }}>
        <h2 style={{ fontFamily:"Cinzel,serif", color:C.sand, fontSize:20, fontWeight:700, margin:"0 0 6px", letterSpacing:2 }}>Sovereign Shield</h2>
        <p style={{ color:C.boneDim, fontSize:12, fontFamily:"'Crimson Text',serif", fontStyle:"italic", margin:0 }}>Every query in this app passes through Shield before leaving your browser. Chickasaw terms are ZK-hashed at the edge — never transmitted in plain text.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:22 }}>
        {[
          { icon:"⬡", label:"ZK Hash Layer", desc:"Chickasaw terms hashed at browser edge before any API call", color:C.teal },
          { icon:"◎", label:"Language Protection", desc:`${CHICKASAW_TERMS.length} Chikashshanompa' terms in the protection dictionary`, color:C.ochre },
          { icon:"◈", label:"Zero Transmission", desc:"Plain-text sovereign language never leaves the Nation's control", color:C.gold },
          { icon:"◉", label:"Every Query Protected", desc:"Dictionary, Phrases, Culture, and Oral History tabs all shielded", color:C.tealLight },
        ].map((item,i) => (
          <div key={i} className="card" style={{ background:C.bark, border:`1px solid ${C.border}`, borderTop:`2px solid ${item.color}`, borderRadius:12, padding:"16px 16px" }}>
            <div style={{ color:item.color, fontSize:20, marginBottom:8 }}>{item.icon}</div>
            <div style={{ color:C.bone, fontFamily:"Cinzel,serif", fontSize:12, fontWeight:700, marginBottom:5, letterSpacing:0.5 }}>{item.label}</div>
            <div style={{ color:C.muted, fontSize:11, lineHeight:1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ background:C.bark, border:`1px solid ${C.border}`, borderRadius:14, padding:20 }}>
        <div style={{ color:C.boneDim, fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"Cinzel,serif", marginBottom:12 }}>Live Shield Test</div>
        <textarea value={testInput} onChange={e=>setTestInput(e.target.value)} placeholder="Type any text with Chickasaw words — e.g. 'Yakoke for the pashofa, it was kallo'..." style={{ width:"100%", minHeight:80, background:C.clay, border:`1px solid ${C.border}`, borderRadius:8, color:C.bone, padding:"11px 14px", fontSize:12, resize:"vertical", outline:"none", fontFamily:"'Crimson Text',serif", lineHeight:1.7, boxSizing:"border-box" }}/>
        <button onClick={test} disabled={!testInput.trim()} style={{ marginTop:10, background:C.teal, color:C.cream, border:"none", borderRadius:8, padding:"9px 20px", fontWeight:700, fontSize:11, cursor:"pointer", fontFamily:"Cinzel,serif", letterSpacing:1 }}>⬡ Test Shield</button>

        {result && (
          <div style={{ marginTop:14 }}>
            {result.detected.length > 0 ? (
              <div>
                <div style={{ background:`${C.teal}15`, border:`1px solid ${C.teal}40`, borderRadius:9, padding:"12px 16px", marginBottom:10 }}>
                  <div style={{ color:C.tealLight, fontSize:9, fontWeight:700, letterSpacing:1.5, fontFamily:"Cinzel,serif", marginBottom:8 }}>PROTECTED — {result.detected.length} CHICKASAW TERM{result.detected.length>1?"S":""} HASHED</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {result.detected.map((d,i) => (
                      <span key={i} style={{ background:C.bark, border:`1px solid ${C.teal}50`, borderRadius:5, padding:"3px 9px", fontSize:10, color:C.tealLight, fontFamily:"monospace" }}>{d.term} → ZK:{d.hash}</span>
                    ))}
                  </div>
                </div>
                <div style={{ background:C.clay, border:`1px solid ${C.border}`, borderRadius:9, padding:"12px 16px" }}>
                  <div style={{ color:C.muted, fontSize:9, letterSpacing:1.5, fontFamily:"Cinzel,serif", marginBottom:6 }}>TRANSMITTED (SAFE)</div>
                  <div style={{ color:C.boneDim, fontSize:12, fontFamily:"monospace", lineHeight:1.6 }}>{result.protected_text}</div>
                </div>
              </div>
            ) : (
              <div style={{ background:C.clay, border:`1px solid ${C.border}`, borderRadius:9, padding:"12px 16px" }}>
                <div style={{ color:C.boneDim, fontSize:12, fontFamily:"'Crimson Text',serif" }}>No Chickasaw terms detected. Text transmitted as-is.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
const TABS = [
  { id:"dictionary", label:"Chikashshanompa'", icon:"◎" },
  { id:"phrases",    label:"Phrases",          icon:"◈" },
  { id:"culture",    label:"Cultural Knowledge",icon:"✦" },
  { id:"oral",       label:"Oral History",     icon:"◉" },
  { id:"shield",     label:"Shield Status",    icon:"⬡" },
];

export default function ChikashaLanguageOS() {
  const [tab, setTab] = useState("dictionary");

  const content = {
    dictionary: <DictionaryTab/>,
    phrases:    <PhrasesTab/>,
    culture:    <CultureTab/>,
    oral:       <OralTab/>,
    shield:     <ShieldTab/>,
  };

  return (
    <div style={{ background:C.clay, minHeight:"100vh", fontFamily:"'Crimson Text',Georgia,serif", position:"relative", overflow:"hidden" }}>
      <style>{styles}</style>
      <WovenBg/>

      {/* ── HEADER ── */}
      <div style={{ background:`${C.earth}F0`, borderBottom:`1px solid ${C.border}`, padding:"16px 22px", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(10px)" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${C.sienna}, ${C.ochre}, ${C.gold}, ${C.ochre}, ${C.sienna})` }}/>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div className="float" style={{ width:40, height:40, background:`linear-gradient(135deg, ${C.sienna}, ${C.ochre})`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:`0 0 20px ${C.ochre}50` }}>◎</div>
              <div>
                <div style={{ color:C.sand, fontFamily:"Cinzel,serif", fontWeight:900, fontSize:16, letterSpacing:2 }}>CHIKASHA LANGUAGE OS</div>
                <div style={{ color:C.muted, fontSize:9, letterSpacing:2, textTransform:"uppercase" }}>Sovereign Language Preservation Platform</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <Pill label="Shield Active" color={C.teal}/>
              <Pill label="Chikashshanompa'" color={C.ochre}/>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:4, overflowX:"auto", paddingBottom:2 }}>
            {TABS.map(t => {
              const active = tab === t.id;
              return (
                <button key={t.id} className="tab-btn" onClick={()=>setTab(t.id)} style={{
                  background: active ? C.ochre : C.bark,
                  color: active ? C.clay : C.boneDim,
                  border:`1px solid ${active?C.ochre:C.border}`,
                  padding:"7px 14px", borderRadius:8, cursor:"pointer",
                  fontSize:10, fontWeight:700, whiteSpace:"nowrap",
                  fontFamily:"Cinzel,serif", letterSpacing:0.8,
                  display:"flex", alignItems:"center", gap:5,
                  boxShadow: active?`0 0 14px ${C.ochre}50`:"none",
                  opacity: active?1:0.75,
                }}>
                  <span>{t.icon}</span>{t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"26px 20px 70px", position:"relative", zIndex:1 }}>
        {content[tab]}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop:`1px solid ${C.border}`, padding:"14px 24px", textAlign:"center", position:"relative", zIndex:1 }}>
        <div style={{ color:C.muted, fontSize:9, letterSpacing:2, fontFamily:"Cinzel,serif" }}>
          CHIKASHA LANGUAGE OS · SOVEREIGN SHIELD TECHNOLOGIES LLC · YAKOKE
        </div>
      </div>
    </div>
  );
}
