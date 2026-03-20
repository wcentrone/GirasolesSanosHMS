"use client";
import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

// ═══════════════════════════════════════════════════════════════
// GIRASOLES SANOS — Full Dashboard with Design Skin Applied
// Health Bridges International
// Aesthetic: "Andean Warmth meets Clinical Precision"
// ═══════════════════════════════════════════════════════════════

const injectFonts = () => {
  if (typeof document !== "undefined" && !document.getElementById("girasoles-fonts")) {
    const link = document.createElement("link");
    link.id = "girasoles-fonts";
    link.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Sans+3:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@400;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
};

const S = {
  red: "#C22D3A", redDark: "#9B1B2A", redLight: "#E85D6A", redGhost: "#FDE8EC",
  teal: "#1D9E9E", tealDark: "#147272", tealLight: "#3FC7C7", tealGhost: "#E3F6F6",
  gold: "#D4A017", goldDark: "#A67C0F", goldLight: "#F0CC5B", goldGhost: "#FDF6E3",
  ink: "#1C1C28", inkSoft: "#3A3A4A", slate: "#6B7185", silver: "#9CA3B4",
  mist: "#E4E6ED", cloud: "#F2F1EE", parchment: "#FAF9F6", white: "#FFFFFF",
  success: "#1AAD55", successGhost: "#E6F9EE",
  warning: "#E8930C", warningGhost: "#FEF4E0",
  danger: "#D93025", dangerGhost: "#FDE8E6",
  info: "#3478F6", infoGhost: "#E8F0FE",
  gradBridge: "linear-gradient(135deg, #C22D3A 0%, #9B1B2A 50%, #701428 100%)",
  gradTeal: "linear-gradient(135deg, #1D9E9E 0%, #147272 100%)",
  gradSunrise: "linear-gradient(135deg, #C22D3A 0%, #D4A017 100%)",
  gradSidebar: "linear-gradient(180deg, #1C1C28 0%, #242438 50%, #1C1C28 100%)",
  shadowSm: "0 1px 2px rgba(28,28,40,0.04), 0 1px 3px rgba(28,28,40,0.06)",
  shadowMd: "0 4px 6px rgba(28,28,40,0.04), 0 2px 4px rgba(28,28,40,0.06)",
  shadowLg: "0 10px 25px rgba(28,28,40,0.06), 0 4px 10px rgba(28,28,40,0.04)",
  shadowGlow: "0 0 20px rgba(29,158,158,0.15)",
  sm: 8, md: 14, lg: 20, xl: 28, full: 9999,
  display: "'DM Serif Display', Georgia, serif",
  body: "'Source Sans 3', 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Consolas', monospace",
};

const CHART_COLORS = [S.teal, S.red, S.gold, S.info, S.success, "#8B5CF6", "#EC4899", S.warning];

const AndeanPattern = ({ opacity = 0.03, color = S.teal }) => (
  <svg width="60" height="60" viewBox="0 0 60 60" style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", opacity, pointerEvents:"none" }}>
    <defs>
      <pattern id="andean" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke={color} strokeWidth="0.5"/>
        <path d="M15 15L45 15L45 45L15 45Z" fill="none" stroke={color} strokeWidth="0.3"/>
        <circle cx="30" cy="30" r="3" fill="none" stroke={color} strokeWidth="0.4"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#andean)"/>
  </svg>
);

const BridgeArch = ({ width=200, height=80, color=S.red }) => (
  <svg width={width} height={height} viewBox="0 0 200 80" fill="none">
    <path d="M10 78 C10 78, 40 5, 100 5 C160 5, 190 78, 190 78" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.15"/>
    <path d="M30 78 C30 78, 55 15, 100 15 C145 15, 170 78, 170 78" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.25"/>
    <path d="M50 78 C50 78, 70 25, 100 25 C130 25, 150 78, 150 78" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.1"/>
  </svg>
);

const Sunflower = ({ size=32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    {[0,30,60,90,120,150,180,210,240,270,300,330].map(angle=>(
      <ellipse key={angle} cx="20" cy="20" rx="3.5" ry="9" fill={S.gold}
        transform={`rotate(${angle} 20 20) translate(0 -6)`} opacity="0.85"/>
    ))}
    <circle cx="20" cy="20" r="6" fill={S.goldDark}/>
    <circle cx="20" cy="20" r="4.5" fill="#8B6914"/>
    <circle cx="20" cy="20" r="3" fill={S.goldDark} opacity="0.6"/>
  </svg>
);

const Card = ({ children, variant="default", hover=false, onClick, style={} }) => {
  const [hov, setHov] = useState(false);
  const variants = {
    default: { background: S.white, border:`1px solid ${S.mist}`, shadow:S.shadowSm },
    elevated: { background: S.white, border:"1px solid transparent", shadow:S.shadowMd },
    teal: { background: S.tealGhost, border:`1px solid ${S.tealLight}40`, shadow:S.shadowSm },
    red: { background: S.redGhost, border:`1px solid ${S.redLight}30`, shadow:S.shadowSm },
    gold: { background: S.goldGhost, border:`1px solid ${S.goldLight}40`, shadow:S.shadowSm },
    dark: { background: S.ink, border:"1px solid rgba(255,255,255,0.06)", shadow:S.shadowLg },
    success: { background: S.successGhost, border:`1px solid ${S.success}30`, shadow:S.shadowSm },
  };
  const v = variants[variant] || variants.default;
  return (
    <div onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:v.background, border:v.border, borderRadius:S.md, padding:24,
        boxShadow:(hov&&(hover||onClick))?S.shadowLg:v.shadow,
        transform:(hov&&(hover||onClick))?"translateY(-2px)":"none",
        transition:"all 0.25s cubic-bezier(0.4,0,0.2,1)",
        cursor:onClick?"pointer":"default", position:"relative", overflow:"hidden", ...style }}>
      {children}
    </div>
  );
};

const Button = ({ children, variant="primary", size="md", onClick, disabled=false, icon, style={} }) => {
  const [hov, setHov] = useState(false);
  const variants = {
    primary: { bg: S.gradBridge, color:"#FFF", border:"none" },
    secondary: { bg: S.gradTeal, color:"#FFF", border:"none" },
    gold: { bg:`linear-gradient(135deg, ${S.gold}, ${S.goldDark})`, color:"#FFF", border:"none" },
    ghost: { bg:"transparent", color:S.red, border:`1.5px solid ${S.red}` },
    ghostTeal: { bg:"transparent", color:S.teal, border:`1.5px solid ${S.teal}` },
    dark: { bg:S.ink, color:"#FFF", border:"none" },
    danger: { bg:S.danger, color:"#FFF", border:"none" },
  };
  const sizes = {
    sm: { padding:"6px 14px", fontSize:11 },
    md: { padding:"9px 18px", fontSize:13 },
    lg: { padding:"12px 24px", fontSize:14 },
  };
  const v = variants[variant]||variants.primary;
  const sz = sizes[size]||sizes.md;
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:v.bg, color:v.color, border:v.border,
        borderRadius:S.sm, ...sz, fontFamily:S.body, fontWeight:700,
        cursor:disabled?"not-allowed":"pointer",
        opacity:disabled?0.6:1, display:"inline-flex", alignItems:"center", gap:6,
        transform:hov&&!disabled?"translateY(-1px)":"none",
        boxShadow:hov&&!disabled?S.shadowMd:"none",
        transition:"all 0.2s", ...style }}>
      {icon&&<span style={{fontSize:sz.fontSize+2}}>{icon}</span>}{children}
    </button>
  );
};

const Badge = ({ label, variant="teal", size="sm" }) => {
  const variants = {
    teal: { bg:S.tealGhost, color:S.tealDark, border:`1px solid ${S.teal}30` },
    red: { bg:S.redGhost, color:S.redDark, border:`1px solid ${S.red}30` },
    gold: { bg:S.goldGhost, color:S.goldDark, border:`1px solid ${S.gold}30` },
    success: { bg:S.successGhost, color:"#0d6b35", border:`1px solid ${S.success}30` },
    warning: { bg:S.warningGhost, color:"#974f06", border:`1px solid ${S.warning}30` },
    danger: { bg:S.dangerGhost, color:"#8b1a10", border:`1px solid ${S.danger}30` },
    info: { bg:S.infoGhost, color:"#1a4fa3", border:`1px solid ${S.info}30` },
    silver: { bg:S.cloud, color:S.slate, border:`1px solid ${S.mist}` },
  };
  const v = variants[variant]||variants.teal;
  const sz = size==="sm"?{padding:"3px 10px",fontSize:11}:{padding:"5px 14px",fontSize:13};
  return (
    <span style={{ ...sz, background:v.bg, color:v.color, border:v.border,
      borderRadius:S.full, fontWeight:700, fontFamily:S.body, letterSpacing:0.3,
      display:"inline-flex", alignItems:"center" }}>{label}</span>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    completed: { label:"Completado", variant:"success" },
    in_progress: { label:"En Progreso", variant:"info" },
    pending: { label:"Pendiente", variant:"warning" },
    overdue: { label:"Vencido", variant:"danger" },
  };
  const c = map[status]||map.pending;
  return <Badge label={c.label} variant={c.variant} />;
};

const Avatar = ({ name, size=44, color=S.teal }) => {
  const initials = name.split(" ").map(n=>n[0]).slice(0,2).join("");
  return (
    <div style={{ width:size, height:size, borderRadius:"50%",
      background:`linear-gradient(135deg, ${color}, ${color}BB)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      color:"#FFF", fontWeight:800, fontSize:size*0.36,
      fontFamily:S.body, flexShrink:0, boxShadow:`0 2px 8px ${color}30` }}>
      {initials}
    </div>
  );
};

const MoodDot = ({ value, size=36 }) => {
  const c = ({
    1:{emoji:"😢",bg:"#FEE2E2",ring:S.danger},
    2:{emoji:"😟",bg:S.warningGhost,ring:S.warning},
    3:{emoji:"😐",bg:S.cloud,ring:S.silver},
    4:{emoji:"🙂",bg:S.successGhost,ring:S.success},
    5:{emoji:"😊",bg:"#D1FAE5",ring:"#059669"},
  })[value]||{emoji:"❓",bg:S.cloud,ring:S.silver};
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:c.bg,
      border:`2px solid ${c.ring}40`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.55, lineHeight:1 }}>{c.emoji}</div>
  );
};

const ProgressBar = ({ value, max=100, color=S.teal, height=8 }) => {
  const pct = Math.min((value/max)*100,100);
  return (
    <div style={{ width:"100%", height, borderRadius:height, background:S.mist, overflow:"hidden" }}>
      <div style={{ width:`${pct}%`, height:"100%", borderRadius:height,
        background:`linear-gradient(90deg, ${color}, ${color}DD)`,
        transition:"width 0.6s cubic-bezier(0.4,0,0.2,1)" }}/>
    </div>
  );
};

const ProgressRing = ({ value, max=100, size=64, color=S.teal }) => {
  const pct = (value/max)*100;
  const r = (size-8)/2, circ = 2*Math.PI*r, offset = circ-(pct/100)*circ;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={S.mist} strokeWidth={6}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{transition:"stroke-dashoffset 0.6s ease"}}/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{transform:"rotate(90deg)",transformOrigin:"center",fontSize:size*0.2,fontWeight:700,fill:S.slate,fontFamily:S.mono}}>
        {Math.round(pct)}%
      </text>
    </svg>
  );
};

const SectionTitle = ({ icon, title, subtitle, style={} }) => (
  <div style={{ marginBottom:20, ...style }}>
    <h2 style={{ fontSize:19, fontWeight:400, fontFamily:S.display, color:S.ink, margin:0, display:"flex", alignItems:"center", gap:10 }}>
      <span style={{fontSize:22}}>{icon}</span>{title}
    </h2>
    {subtitle && <p style={{ fontSize:12, color:S.slate, margin:"4px 0 0 32px", fontFamily:S.body }}>{subtitle}</p>}
  </div>
);

const TabBar = ({ tabs, active, onChange }) => (
  <div style={{ display:"flex", gap:2, background:S.cloud, borderRadius:S.md, padding:3, marginBottom:24, overflowX:"auto" }}>
    {tabs.map(tab => (
      <button key={tab.id} onClick={()=>onChange(tab.id)} style={{
        flex:1, padding:"9px 14px", borderRadius:S.sm, border:"none",
        background:active===tab.id?S.white:"transparent",
        color:active===tab.id?S.red:S.slate,
        fontWeight:active===tab.id?800:500, fontSize:12.5,
        cursor:"pointer", transition:"all 0.2s", fontFamily:S.body,
        boxShadow:active===tab.id?S.shadowSm:"none",
        whiteSpace:"nowrap", minWidth:80,
      }}>{tab.icon} {tab.label}</button>
    ))}
  </div>
);

const InfoRow = ({ label, value, mono=false }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"8px 0", borderBottom:`1px solid ${S.mist}`, fontSize:13, fontFamily:S.body }}>
    <span style={{ color:S.slate, fontWeight:600 }}>{label}</span>
    <span style={{ color:S.ink, fontFamily:mono?S.mono:S.body, fontWeight:mono?400:500 }}>{value}</span>
  </div>
);

// ── Mock Data ──────────────────────────────────────────────────

const MOCK_CHILDREN = [
  {
    id:"GS-001", fullName:"Carlos Alejandro Quispe Huamán", dob:"2012-03-15", age:13, dni:"72345678",
    schoolGrade:"2do Secundaria", referralAgency:"UPE Cusco", caseNumber:"UPE-2024-0142",
    protectionType:"Acogimiento Residencial", dateEntered:"2024-01-20", photo:null, gender:"M",
    mother:{name:"María Elena Huamán Condori",dob:"1985-06-22",dni:"45678901",address:"Jr. Comercio 234, Cusco",phone:"984-567-890",email:"maria.huaman@gmail.com",occupation:"Comerciante"},
    father:{name:"Juan Carlos Quispe Torres",dob:"1982-11-10",dni:"43210987",address:"Desconocido",phone:"",email:"",occupation:"Desconocido"},
    guardian:null,
    familyHistory:"Familia monoparental. La madre trabaja como comerciante ambulante. El padre abandonó el hogar cuando Carlos tenía 3 años. La abuela materna fue cuidadora principal hasta su fallecimiento en 2023.",
    previousComplaints:"Reporte de negligencia por DEMUNA en 2023. Evaluación de riesgo por UPE en enero 2024.",
    currentSituation:"Carlos fue referido por negligencia y falta de supervisión adecuada. La madre trabaja largas horas y no puede garantizar cuidado apropiado.",
    familySituation:"La madre mantiene contacto regular. Visitas quincenales. Está participando en programa de fortalecimiento familiar.",
    psychDiagnosis:"Trauma por abandono paterno. Ansiedad moderada. Dificultades de apego. Fortalezas: resiliente, sociable, interesado en deportes.",
    objectives:[
      {id:1,text:"Estabilización emocional y manejo de ansiedad",activities:"Terapia individual semanal, mindfulness diario",deadline:"2025-06-30",service:"Psicología",responsible:"Lic. Ana Vega",followUp:"2025-03-15",status:"in_progress"},
      {id:2,text:"Mejora del rendimiento académico",activities:"Tutorías 3x/semana, plan lector",deadline:"2025-07-30",service:"Educación",responsible:"Prof. Luis Mamani",followUp:"2025-04-01",status:"in_progress"},
      {id:3,text:"Fortalecimiento del vínculo materno",activities:"Visitas supervisadas, terapia familiar mensual",deadline:"2025-12-30",service:"Trabajo Social",responsible:"T.S. Rosa Chávez",followUp:"2025-05-01",status:"pending"},
    ],
    health:{
      lastMdVisit:"2025-01-15",visitReason:"Control anual",diagnosis:"Anemia leve",lastWellChild:"2025-01-15",
      vaccines:"Completo",height:152,weight:42,bmi:18.2,
      dental:{lastVisit:"2024-11-20",cavities:2,extractions:0,prevention:"Sellantes aplicados"},
      behavioral:{diagnosis:"Trastorno de ansiedad generalizada",treatment:"TCC + Mindfulness",provider:"Lic. Ana Vega",plan:"Sesiones semanales, revisión trimestral"},
    },
    moodHistory:[
      {date:"2025-02-24",mood:3},{date:"2025-02-25",mood:4},{date:"2025-02-26",mood:3},
      {date:"2025-02-27",mood:2},{date:"2025-02-28",mood:4},{date:"2025-03-01",mood:5},
    ],
    lifeDomains:{
      educational:{attendance:92,grades:"B+",readingLevel:85,socialConnectedness:4},
      family:{visitFrequency:"Quincenal",comfortLevel:3,language:"Quechua/Español"},
      wellness:{witY:68,aceScore:4,spirituality:3,extracurricular:"Ciclismo, Fútbol"},
      lifeSkills:{caseyScore:62,dailyLiving:3,relationships:3,studyHabits:4,communityResources:2,moneyMgmt:2,computerLiteracy:3},
      transition:{birthCert:true,dni:true,secondaryProgress:"En curso",cv:false,safetyPlan:false,socialConnectedness:58},
    },
    incidents:[{date:"2025-01-10",description:"Altercado verbal con compañero",actionPlan:"Mediación y sesión de resolución de conflictos",followUp:"Completado",notified:"No"}],
    coeProgress:{section:4,modulesCompleted:6,totalModules:12,lastActivity:"2025-02-20"},
    articulateModules:[
      {name:"Entendiendo el Trauma",completed:true,score:88},
      {name:"Comunicación Empática",completed:true,score:92},
      {name:"Habilidades de Vida",completed:false,score:null},
    ],
  },
  {
    id:"GS-002", fullName:"Miguel Ángel Torres Pachari", dob:"2010-08-22", age:15, dni:"71234567",
    schoolGrade:"4to Secundaria", referralAgency:"DEMUNA Urubamba", caseNumber:"DEM-2023-0089",
    protectionType:"Acogimiento Residencial", dateEntered:"2023-06-15", photo:null, gender:"M",
    mother:{name:"Juana Pachari Llanos",dob:"1988-02-14",dni:"46789012",address:"Calle Sol 45, Urubamba",phone:"974-321-654",email:"",occupation:"Agricultura"},
    father:{name:"Pedro Torres Inca",dob:"1986-09-30",dni:"44567890",address:"Calle Sol 45, Urubamba",phone:"965-432-789",email:"",occupation:"Jornalero"},
    guardian:null,
    familyHistory:"Ambos padres presentes. Historial de violencia doméstica. El padre con problemas de alcoholismo.",
    previousComplaints:"Múltiples reportes de DEMUNA por violencia familiar desde 2021.",
    currentSituation:"Retirado del hogar por violencia física. Padre en proceso de rehabilitación.",
    familySituation:"Madre visita mensualmente. Padre sin contacto por orden judicial.",
    psychDiagnosis:"TEPT moderado. Conductas disruptivas. Fortalezas: liderazgo natural, aptitud deportiva destacada.",
    objectives:[
      {id:1,text:"Procesamiento del trauma familiar",activities:"EMDR semanal, grupo terapéutico",deadline:"2025-09-30",service:"Psicología",responsible:"Lic. Ana Vega",followUp:"2025-04-15",status:"in_progress"},
      {id:2,text:"Canalizar energía en actividades deportivas",activities:"Entrenamiento ciclismo 4x/semana",deadline:"2025-12-30",service:"Recreación",responsible:"Coach Estela Acurio",followUp:"2025-03-30",status:"completed"},
      {id:3,text:"Plan de transición a independencia",activities:"Habilidades de vida, orientación vocacional",deadline:"2026-06-30",service:"Trabajo Social",responsible:"T.S. Rosa Chávez",followUp:"2025-06-01",status:"pending"},
    ],
    health:{
      lastMdVisit:"2025-02-01",visitReason:"Lesión deportiva menor",diagnosis:"Saludable",lastWellChild:"2024-12-10",
      vaccines:"Completo",height:168,weight:55,bmi:19.5,
      dental:{lastVisit:"2025-01-15",cavities:0,extractions:0,prevention:"Limpieza semestral"},
      behavioral:{diagnosis:"TEPT",treatment:"EMDR + Terapia grupal",provider:"Lic. Ana Vega",plan:"Procesamiento gradual, revisión cada 2 meses"},
    },
    moodHistory:[
      {date:"2025-02-24",mood:4},{date:"2025-02-25",mood:4},{date:"2025-02-26",mood:5},
      {date:"2025-02-27",mood:3},{date:"2025-02-28",mood:4},{date:"2025-03-01",mood:4},
    ],
    lifeDomains:{
      educational:{attendance:88,grades:"B",readingLevel:78,socialConnectedness:5},
      family:{visitFrequency:"Mensual",comfortLevel:2,language:"Español"},
      wellness:{witY:72,aceScore:6,spirituality:2,extracurricular:"Ciclismo XCO, Fútbol"},
      lifeSkills:{caseyScore:70,dailyLiving:4,relationships:4,studyHabits:3,communityResources:3,moneyMgmt:3,computerLiteracy:4},
      transition:{birthCert:true,dni:true,secondaryProgress:"4to año",cv:true,safetyPlan:false,socialConnectedness:65},
    },
    incidents:[],
    coeProgress:{section:6,modulesCompleted:9,totalModules:12,lastActivity:"2025-02-28"},
    articulateModules:[
      {name:"Entendiendo el Trauma",completed:true,score:95},
      {name:"Comunicación Empática",completed:true,score:90},
      {name:"Habilidades de Vida",completed:true,score:85},
    ],
  },
  {
    id:"GS-003", fullName:"Diego Fernando Ccahuana Soto", dob:"2013-12-01", age:12, dni:"73456789",
    schoolGrade:"1ro Secundaria", referralAgency:"UPE Cusco", caseNumber:"UPE-2024-0198",
    protectionType:"Acogimiento Residencial", dateEntered:"2024-05-10", photo:null, gender:"M",
    mother:{name:"Rosa Soto Mamani",dob:"1990-04-18",dni:"47890123",address:"Comunidad Chinchero",phone:"956-789-012",email:"",occupation:"Tejedora"},
    father:{name:"Desconocido",dob:"",dni:"",address:"",phone:"",email:"",occupation:""},
    guardian:{name:"Abuela Materna - Dominga Mamani Quispe",dob:"1960-11-05",dni:"23456789",address:"Comunidad Chinchero",phone:"945-678-901",email:"",occupation:"Agricultura"},
    familyHistory:"Madre soltera, padre desconocido. Criado por abuela materna. Madre migró a Lima por trabajo.",
    previousComplaints:"Primera intervención de protección.",
    currentSituation:"Abuela no puede hacerse cargo por salud deteriorada. Madre con paradero parcialmente conocido en Lima.",
    familySituation:"Abuela visita cuando puede. Contacto telefónico mensual con madre.",
    psychDiagnosis:"Ansiedad por separación. Timidez social. Fortalezas: creativo, buen artista, empatía con animales.",
    objectives:[
      {id:1,text:"Adaptación al entorno residencial",activities:"Acompañamiento, actividades de integración",deadline:"2025-05-30",service:"Cuidado Directo",responsible:"Cuidador Principal",followUp:"2025-03-20",status:"completed"},
      {id:2,text:"Fortalecimiento de identidad cultural",activities:"Taller de arte andino, conexión con comunidad",deadline:"2025-12-30",service:"Cultura",responsible:"Prof. Carmen Quispe",followUp:"2025-04-15",status:"in_progress"},
      {id:3,text:"Localización y vínculo con madre",activities:"Investigación social, facilitación de contacto",deadline:"2025-09-30",service:"Trabajo Social",responsible:"T.S. Rosa Chávez",followUp:"2025-05-01",status:"in_progress"},
    ],
    health:{
      lastMdVisit:"2025-02-20",visitReason:"Resfriado común",diagnosis:"Desnutrición leve en recuperación",lastWellChild:"2024-12-01",
      vaccines:"Incompleto - pendiente refuerzo",height:140,weight:33,bmi:16.8,
      dental:{lastVisit:"2024-09-30",cavities:4,extractions:1,prevention:"Pendiente sellantes"},
      behavioral:{diagnosis:"Ansiedad por separación",treatment:"Terapia de juego",provider:"Lic. Ana Vega",plan:"Sesiones semanales con técnicas expresivas"},
    },
    moodHistory:[
      {date:"2025-02-24",mood:2},{date:"2025-02-25",mood:3},{date:"2025-02-26",mood:3},
      {date:"2025-02-27",mood:4},{date:"2025-02-28",mood:3},{date:"2025-03-01",mood:3},
    ],
    lifeDomains:{
      educational:{attendance:85,grades:"C+",readingLevel:60,socialConnectedness:2},
      family:{visitFrequency:"Irregular",comfortLevel:4,language:"Quechua"},
      wellness:{witY:55,aceScore:5,spirituality:4,extracurricular:"Arte, Cuidado de animales"},
      lifeSkills:{caseyScore:45,dailyLiving:2,relationships:2,studyHabits:3,communityResources:1,moneyMgmt:1,computerLiteracy:2},
      transition:{birthCert:true,dni:true,secondaryProgress:"1er año",cv:false,safetyPlan:false,socialConnectedness:40},
    },
    incidents:[{date:"2025-02-05",description:"Episodio de llanto por extrañar a abuela",actionPlan:"Contención emocional, llamada a abuela",followUp:"Estable",notified:"No"}],
    coeProgress:{section:2,modulesCompleted:3,totalModules:12,lastActivity:"2025-02-15"},
    articulateModules:[
      {name:"Entendiendo el Trauma",completed:true,score:75},
      {name:"Comunicación Empática",completed:false,score:null},
      {name:"Habilidades de Vida",completed:false,score:null},
    ],
  },
];

const STAFF_MOOD_DATA = [
  {date:"2025-02-24",avgMood:3.8},{date:"2025-02-25",avgMood:4.0},{date:"2025-02-26",avgMood:3.5},
  {date:"2025-02-27",avgMood:4.2},{date:"2025-02-28",avgMood:3.9},{date:"2025-03-01",avgMood:4.1},
];

const COE_SECTIONS = ["Introducción","Supuestos","El Modelo","Principios","Motivación","Formación","Integración","Ejercicios","Prácticas","Integración Total","Consolidación","Egreso"];

// ── SIDEBAR ────────────────────────────────────────────────────

const Sidebar = ({ activeView, onNavigate, collapsed, onToggle }) => {
  const navItems = [
    {id:"dashboard",icon:"📊",label:"Panel Principal"},
    {id:"children",icon:"👦",label:"Residentes"},
    {id:"mimp",icon:"📋",label:"Informes MIMP"},
    {id:"coe",icon:"🌟",label:"CoE"},
    {id:"articulate",icon:"📚",label:"Módulos"},
    {id:"ai_plans",icon:"🤖",label:"IA Planes"},
    {id:"wellness",icon:"💚",label:"Bienestar"},
    {id:"reports",icon:"📄",label:"Reportes"},
  ];
  return (
    <div style={{ width:collapsed?64:240, minHeight:"100vh", background:S.gradSidebar,
      transition:"width 0.3s ease", overflow:"hidden", display:"flex", flexDirection:"column",
      position:"fixed", left:0, top:0, zIndex:100, borderRight:"1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ padding:collapsed?"14px 10px":"20px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)", position:"relative", overflow:"hidden" }}>
        <AndeanPattern opacity={0.04} color="#FFF"/>
        <div style={{ display:"flex", alignItems:"center", gap:10, position:"relative", zIndex:1 }}>
          <div style={{flexShrink:0}}><Sunflower size={collapsed?32:36}/></div>
          {!collapsed&&(
            <div>
              <div style={{ fontFamily:S.display, color:"#FFF", fontSize:17, lineHeight:1.1 }}>Girasoles Sanos</div>
              <div style={{ color:S.tealLight, fontSize:9, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginTop:2, fontFamily:S.body }}>Health Bridges Int'l</div>
            </div>
          )}
        </div>
      </div>
      <button onClick={onToggle} style={{ margin:"8px auto", background:"rgba(255,255,255,0.05)",
        border:"none", color:"#666", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontSize:13 }}>
        {collapsed?"▶":"◀"}
      </button>
      <nav style={{ flex:1, padding:"6px" }}>
        {navItems.map(item=>(
          <button key={item.id} onClick={()=>onNavigate(item.id)} style={{
            display:"flex", alignItems:"center", gap:12, width:"100%",
            padding:collapsed?"12px 0":"11px 14px", marginBottom:3,
            background:activeView===item.id?"rgba(194,45,58,0.14)":"transparent",
            borderLeft:activeView===item.id?`3px solid ${S.red}`:"3px solid transparent",
            borderRight:"none", borderTop:"none", borderBottom:"none",
            borderRadius:`0 ${S.sm}px ${S.sm}px 0`,
            color:activeView===item.id?"#FFF":"#8A8FA8",
            cursor:"pointer", fontSize:13, fontWeight:activeView===item.id?700:400,
            transition:"all 0.15s", justifyContent:collapsed?"center":"flex-start",
            fontFamily:S.body,
          }}>
            <span style={{fontSize:17,flexShrink:0}}>{item.icon}</span>
            {!collapsed&&<span>{item.label}</span>}
          </button>
        ))}
      </nav>
      {!collapsed&&(
        <div style={{ padding:"16px", borderTop:"1px solid rgba(255,255,255,0.06)", fontSize:10, color:"#444", fontFamily:S.mono }}>
          <div>Girasoles Sanos v2.0</div>
          <div style={{marginTop:2}}>© 2025 Health Bridges Int'l</div>
        </div>
      )}
    </div>
  );
};

// ── DASHBOARD VIEW ─────────────────────────────────────────────

const DashboardView = ({ children, onSelectChild }) => {
  const totalChildren = children.length;
  const avgMood = (children.reduce((s,c)=>s+c.moodHistory[c.moodHistory.length-1].mood,0)/totalChildren).toFixed(1);
  const avgAttendance = Math.round(children.reduce((s,c)=>s+c.lifeDomains.educational.attendance,0)/totalChildren);
  const objCompleted = children.reduce((s,c)=>s+c.objectives.filter(o=>o.status==="completed").length,0);
  const totalObj = children.reduce((s,c)=>s+c.objectives.length,0);
  const domainData = [
    {domain:"Educación",value:Math.round(children.reduce((s,c)=>s+c.lifeDomains.educational.attendance,0)/totalChildren)},
    {domain:"Familia",value:Math.round(children.reduce((s,c)=>s+c.lifeDomains.family.comfortLevel*20,0)/totalChildren)},
    {domain:"Bienestar",value:Math.round(children.reduce((s,c)=>s+c.lifeDomains.wellness.witY,0)/totalChildren)},
    {domain:"Hab. Vida",value:Math.round(children.reduce((s,c)=>s+c.lifeDomains.lifeSkills.caseyScore,0)/totalChildren)},
    {domain:"Transición",value:Math.round(children.reduce((s,c)=>s+c.lifeDomains.transition.socialConnectedness,0)/totalChildren)},
  ];
  const moodTrend = children[0].moodHistory.map((_,i)=>({
    date: children[0].moodHistory[i].date.slice(5),
    ...Object.fromEntries(children.map(c=>[c.fullName.split(" ")[0],c.moodHistory[i]?.mood||0])),
  }));
  const kpis = [
    {label:"Residentes Activos",value:totalChildren,icon:"👦",color:S.red,bg:S.redGhost},
    {label:"Estado Anímico",value:`${avgMood}/5`,icon:"💛",color:S.gold,bg:S.goldGhost},
    {label:"Asistencia Escolar",value:`${avgAttendance}%`,icon:"🎒",color:S.teal,bg:S.tealGhost},
    {label:"Objetivos Cumplidos",value:`${objCompleted}/${totalObj}`,icon:"🎯",color:S.info,bg:S.infoGhost},
  ];
  return (
    <div>
      <div style={{marginBottom:28}}>
        <h1 style={{fontSize:30,fontWeight:400,fontFamily:S.display,color:S.ink,margin:0}}>Panel Principal</h1>
        <p style={{color:S.slate,fontSize:13,margin:"4px 0 0",fontFamily:S.body}}>Girasoles Sanos — Monitoreo Integral · {new Date().toLocaleDateString("es-PE",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
        {kpis.map((kpi,i)=>(
          <Card key={i} style={{padding:20,background:kpi.bg,border:`1px solid ${kpi.color}15`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
              <div>
                <div style={{fontSize:10,color:S.slate,fontWeight:700,letterSpacing:0.8,marginBottom:6,fontFamily:S.body,textTransform:"uppercase"}}>{kpi.label}</div>
                <div style={{fontSize:30,fontWeight:400,fontFamily:S.display,color:kpi.color}}>{kpi.value}</div>
              </div>
              <div style={{width:48,height:48,borderRadius:S.sm,background:`${kpi.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{kpi.icon}</div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginBottom:24}}>
        <Card>
          <SectionTitle icon="📈" title="Tendencia de Estado Anímico" subtitle="Últimos 7 días — check-in diario"/>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={moodTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={S.mist}/>
              <XAxis dataKey="date" tick={{fontSize:11,fontFamily:S.body}}/>
              <YAxis domain={[0,5]} tick={{fontSize:11,fontFamily:S.body}}/>
              <Tooltip contentStyle={{fontFamily:S.body,borderRadius:S.sm}}/>
              {children.map((c,i)=>(
                <Area key={c.id} type="monotone" dataKey={c.fullName.split(" ")[0]}
                  stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.08} strokeWidth={2.5}/>
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle icon="🎯" title="Dominios de Vida" subtitle="Promedios del programa"/>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={domainData}>
              <PolarGrid stroke={S.mist}/>
              <PolarAngleAxis dataKey="domain" tick={{fontSize:10,fontFamily:S.body}}/>
              <PolarRadiusAxis angle={90} domain={[0,100]} tick={{fontSize:9}}/>
              <Radar dataKey="value" stroke={S.red} fill={S.red} fillOpacity={0.15} strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card style={{marginBottom:24}}>
        <SectionTitle icon="👦" title="Residentes" subtitle="Vista rápida — clic para perfil completo"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {children.map(child=>{
            const mood = child.moodHistory[child.moodHistory.length-1].mood;
            return (
              <Card key={child.id} hover onClick={()=>onSelectChild(child.id)} style={{padding:18,border:`1px solid ${S.mist}`}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                  <Avatar name={child.fullName} size={44} color={S.teal}/>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,color:S.ink,fontFamily:S.body}}>{child.fullName.split(" ").slice(0,2).join(" ")}</div>
                    <div style={{fontSize:11,color:S.slate,fontFamily:S.mono}}>{child.id} · {child.age} años · {child.schoolGrade}</div>
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <MoodDot value={mood} size={36}/>
                  <ProgressRing value={child.coeProgress.modulesCompleted} max={child.coeProgress.totalModules} size={46} color={S.teal}/>
                </div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {child.objectives.map(obj=>(<StatusBadge key={obj.id} status={obj.status}/>))}
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
      <Card>
        <SectionTitle icon="🧑‍⚕️" title="Bienestar del Equipo" subtitle="Check-in diario del personal cuidador"/>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={STAFF_MOOD_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke={S.mist}/>
            <XAxis dataKey="date" tick={{fontSize:11,fontFamily:S.body}} tickFormatter={v=>v.slice(5)}/>
            <YAxis domain={[0,5]} tick={{fontSize:11}}/>
            <Tooltip contentStyle={{fontFamily:S.body,borderRadius:S.sm}}/>
            <Bar dataKey="avgMood" fill={S.teal} radius={[6,6,0,0]} name="Ánimo Promedio"/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

// ── CHILDREN LIST VIEW ─────────────────────────────────────────

const ChildrenListView = ({ children, onSelectChild }) => (
  <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <div>
        <h1 style={{fontSize:28,fontWeight:400,fontFamily:S.display,color:S.ink,margin:0}}>Residentes</h1>
        <p style={{color:S.slate,fontSize:13,margin:"4px 0 0",fontFamily:S.body}}>{children.length} jóvenes en cuidado residencial</p>
      </div>
      <Button variant="primary" icon="➕">Nuevo Ingreso</Button>
    </div>
    <Card>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:S.ink}}>
              {["Residente","Caso","Grado","Agencia","Ingreso","Ánimo","Objetivos","Acciones"].map((h,i)=>(
                <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:10,fontWeight:800,color:"#FFF",fontFamily:S.body,letterSpacing:0.8,textTransform:"uppercase",borderRadius:i===0?`${S.sm}px 0 0 0`:i===7?`0 ${S.sm}px 0 0`:0}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {children.map((child,i)=>{
              const mood = child.moodHistory[child.moodHistory.length-1].mood;
              return (
                <tr key={child.id} style={{borderBottom:`1px solid ${S.mist}`,background:i%2===0?S.white:S.parchment,transition:"background 0.15s",cursor:"pointer"}}
                  onClick={()=>onSelectChild(child.id)}
                  onMouseEnter={e=>e.currentTarget.style.background=S.tealGhost}
                  onMouseLeave={e=>e.currentTarget.style.background=i%2===0?S.white:S.parchment}>
                  <td style={{padding:"12px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <Avatar name={child.fullName} size={34} color={S.teal}/>
                      <div>
                        <div style={{fontWeight:700,fontSize:13,color:S.ink,fontFamily:S.body}}>{child.fullName.split(" ").slice(0,2).join(" ")}</div>
                        <div style={{fontSize:10,color:S.slate,fontFamily:S.mono}}>{child.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:"12px 16px",fontSize:12,fontFamily:S.mono,color:S.slate}}>{child.caseNumber}</td>
                  <td style={{padding:"12px 16px",fontSize:12,fontFamily:S.body,color:S.ink}}>{child.schoolGrade}</td>
                  <td style={{padding:"12px 16px",fontSize:12,fontFamily:S.body,color:S.ink}}>{child.referralAgency}</td>
                  <td style={{padding:"12px 16px",fontSize:12,fontFamily:S.mono,color:S.slate}}>{child.dateEntered}</td>
                  <td style={{padding:"12px 16px"}}><MoodDot value={mood} size={30}/></td>
                  <td style={{padding:"12px 16px"}}>
                    <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                      {child.objectives.map(o=>(<StatusBadge key={o.id} status={o.status}/>))}
                    </div>
                  </td>
                  <td style={{padding:"12px 16px"}}>
                    <Button size="sm" variant="ghostTeal" onClick={e=>{e.stopPropagation();onSelectChild(child.id);}}>Ver</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

// ── CHILD DETAIL VIEW ──────────────────────────────────────────

const ChildDetailView = ({ child, onBack }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = [
    {id:"overview",icon:"📋",label:"General"},
    {id:"health",icon:"🏥",label:"Salud"},
    {id:"education",icon:"📚",label:"Educación"},
    {id:"family",icon:"👨‍👩‍👧",label:"Familia"},
    {id:"plan",icon:"🎯",label:"Plan MIMP"},
    {id:"wellness",icon:"💚",label:"Bienestar"},
    {id:"transition",icon:"🚀",label:"Transición"},
  ];
  const radarData = [
    {skill:"Vida Diaria",value:child.lifeDomains.lifeSkills.dailyLiving*20},
    {skill:"Relaciones",value:child.lifeDomains.lifeSkills.relationships*20},
    {skill:"Estudio",value:child.lifeDomains.lifeSkills.studyHabits*20},
    {skill:"Comunidad",value:child.lifeDomains.lifeSkills.communityResources*20},
    {skill:"Dinero",value:child.lifeDomains.lifeSkills.moneyMgmt*20},
    {skill:"Tecnología",value:child.lifeDomains.lifeSkills.computerLiteracy*20},
  ];
  const mood = child.moodHistory[child.moodHistory.length-1].mood;
  return (
    <div>
      <button onClick={onBack} style={{background:"none",border:"none",color:S.red,fontWeight:700,cursor:"pointer",fontSize:13,marginBottom:16,padding:0,fontFamily:S.body,display:"flex",alignItems:"center",gap:6}}>
        ← Volver a la lista
      </button>
      <div style={{background:S.gradBridge,borderRadius:S.lg,padding:24,marginBottom:24,position:"relative",overflow:"hidden"}}>
        <AndeanPattern opacity={0.06} color="#FFF"/>
        <div style={{position:"absolute",bottom:-20,right:40,opacity:0.1}}><BridgeArch width={320} height={120} color="#FFF"/></div>
        <div style={{display:"flex",alignItems:"center",gap:20,position:"relative",zIndex:1}}>
          <Avatar name={child.fullName} size={72} color={S.redLight}/>
          <div style={{flex:1}}>
            <h2 style={{margin:0,fontSize:24,fontFamily:S.display,color:"#FFF",fontWeight:400}}>{child.fullName}</h2>
            <div style={{display:"flex",gap:16,marginTop:8,fontSize:12,color:"rgba(255,255,255,0.7)",fontFamily:S.body,flexWrap:"wrap"}}>
              <span style={{fontFamily:S.mono}}>🆔 {child.id}</span>
              <span>📅 {child.age} años</span>
              <span>🎓 {child.schoolGrade}</span>
              <span style={{fontFamily:S.mono}}>📎 {child.caseNumber}</span>
              <span>🏛️ {child.referralAgency}</span>
            </div>
          </div>
          <div style={{textAlign:"center"}}><MoodDot value={mood} size={52}/><div style={{fontSize:10,color:"rgba(255,255,255,0.6)",marginTop:4,fontFamily:S.body}}>Estado Hoy</div></div>
          <div style={{textAlign:"center"}}><ProgressRing value={child.coeProgress.modulesCompleted} max={child.coeProgress.totalModules} size={52} color={S.goldLight}/><div style={{fontSize:10,color:"rgba(255,255,255,0.6)",marginTop:4,fontFamily:S.body}}>CoE</div></div>
        </div>
      </div>
      <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab}/>
      {activeTab==="overview"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Card>
            <h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:14}}>📋 Datos del Caso</h3>
            <InfoRow label="DNI" value={child.dni} mono/><InfoRow label="Fecha de Nacimiento" value={child.dob} mono/>
            <InfoRow label="Tipo de Protección" value={child.protectionType}/><InfoRow label="Fecha de Ingreso" value={child.dateEntered} mono/>
            <InfoRow label="Agencia de Referencia" value={child.referralAgency}/>
          </Card>
          <Card>
            <h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:4}}>📊 Habilidades de Vida</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={S.mist}/><PolarAngleAxis dataKey="skill" tick={{fontSize:9,fontFamily:S.body}}/>
                <PolarRadiusAxis domain={[0,100]} tick={{fontSize:8}}/>
                <Radar dataKey="value" stroke={S.teal} fill={S.teal} fillOpacity={0.2} strokeWidth={2}/>
              </RadarChart>
            </ResponsiveContainer>
          </Card>
          <Card style={{gridColumn:"1 / -1"}}>
            <h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:10}}>📝 Diagnóstico Psicosocial</h3>
            <p style={{fontSize:13,lineHeight:1.7,color:S.inkSoft,margin:0,fontFamily:S.body}}>{child.psychDiagnosis}</p>
          </Card>
          <Card><h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:10}}>📜 Historia Familiar</h3><p style={{fontSize:13,lineHeight:1.7,color:S.inkSoft,margin:0,fontFamily:S.body}}>{child.familyHistory}</p></Card>
          <Card><h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:10}}>📌 Situación Actual</h3><p style={{fontSize:13,lineHeight:1.7,color:S.inkSoft,margin:0,fontFamily:S.body}}>{child.currentSituation}</p></Card>
          {child.incidents.length>0&&(
            <Card variant="red" style={{gridColumn:"1 / -1"}}>
              <h3 style={{fontSize:15,fontWeight:700,color:S.redDark,marginBottom:10,fontFamily:S.body}}>⚠️ Incidentes Registrados</h3>
              {child.incidents.map((inc,i)=>(
                <div key={i} style={{padding:12,background:S.white,borderRadius:S.sm,marginBottom:8,border:`1px solid ${S.mist}`}}>
                  <div style={{fontSize:11,fontFamily:S.mono,color:S.slate,marginBottom:4}}>{inc.date}</div>
                  <div style={{fontSize:13,fontWeight:600,color:S.ink,fontFamily:S.body,marginBottom:4}}>{inc.description}</div>
                  <div style={{fontSize:12,color:S.slate,fontFamily:S.body}}>Plan: {inc.actionPlan} · Seguimiento: {inc.followUp}</div>
                </div>
              ))}
            </Card>
          )}
        </div>
      )}
      {activeTab==="health"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Card>
            <h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:14}}>🏥 Salud Física</h3>
            <InfoRow label="Última consulta" value={`${child.health.lastMdVisit} — ${child.health.visitReason}`}/>
            <InfoRow label="Diagnóstico" value={child.health.diagnosis}/><InfoRow label="Vacunas" value={child.health.vaccines}/>
            <InfoRow label="Talla" value={`${child.health.height} cm`} mono/><InfoRow label="Peso" value={`${child.health.weight} kg`} mono/>
            <InfoRow label="IMC" value={child.health.bmi} mono/>
          </Card>
          <Card>
            <h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:14}}>🦷 Salud Dental</h3>
            <InfoRow label="Última visita" value={child.health.dental.lastVisit} mono/>
            <InfoRow label="Caries" value={child.health.dental.cavities}/><InfoRow label="Extracciones" value={child.health.dental.extractions}/>
            <InfoRow label="Prevención" value={child.health.dental.prevention}/>
          </Card>
          <Card style={{gridColumn:"1 / -1"}}>
            <h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:14}}>🧠 Salud Conductual</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
              {[{label:"Diagnóstico",value:child.health.behavioral.diagnosis},{label:"Tratamiento",value:child.health.behavioral.treatment},{label:"Proveedor",value:child.health.behavioral.provider},{label:"Plan",value:child.health.behavioral.plan}].map((item,i)=>(
                <div key={i} style={{padding:14,background:S.infoGhost,borderRadius:S.sm,border:`1px solid ${S.info}20`}}>
                  <div style={{fontSize:10,fontWeight:700,color:S.info,textTransform:"uppercase",letterSpacing:0.8,fontFamily:S.body,marginBottom:6}}>{item.label}</div>
                  <div style={{fontSize:13,color:S.ink,fontFamily:S.body,lineHeight:1.5}}>{item.value}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      {activeTab==="education"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Card>
            <h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:14}}>📚 Indicadores Educativos</h3>
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12,fontFamily:S.body}}><span style={{color:S.slate,fontWeight:600}}>Asistencia</span><span style={{color:S.ink,fontFamily:S.mono,fontWeight:700}}>{child.lifeDomains.educational.attendance}%</span></div>
              <ProgressBar value={child.lifeDomains.educational.attendance} color={child.lifeDomains.educational.attendance>=90?S.success:child.lifeDomains.educational.attendance>=80?S.warning:S.danger}/>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12,fontFamily:S.body}}><span style={{color:S.slate,fontWeight:600}}>Nivel de Lectura</span><span style={{color:S.ink,fontFamily:S.mono,fontWeight:700}}>{child.lifeDomains.educational.readingLevel} PPM</span></div>
              <ProgressBar value={child.lifeDomains.educational.readingLevel} color={S.teal}/>
            </div>
            <InfoRow label="Notas" value={child.lifeDomains.educational.grades}/>
            <InfoRow label="Conectividad Social" value={`${child.lifeDomains.educational.socialConnectedness}/5`}/>
          </Card>
          <Card>
            <h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:14}}>📈 Tendencia Anímica</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={child.moodHistory.map(m=>({date:m.date.slice(5),mood:m.mood}))}>
                <CartesianGrid strokeDasharray="3 3" stroke={S.mist}/><XAxis dataKey="date" tick={{fontSize:10,fontFamily:S.body}}/><YAxis domain={[0,5]} tick={{fontSize:10}}/>
                <Tooltip contentStyle={{fontFamily:S.body,borderRadius:S.sm}}/>
                <Area type="monotone" dataKey="mood" stroke={S.teal} fill={S.teal} fillOpacity={0.1} strokeWidth={2.5} name="Estado"/>
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
      {activeTab==="family"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {[{title:"👩 Madre",data:child.mother},{title:"👨 Padre",data:child.father}].map(({title,data},i)=>(
            <Card key={i}>
              <h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:14}}>{title}</h3>
              {data.name&&<InfoRow label="Nombre" value={data.name}/>}{data.dob&&<InfoRow label="F. Nacimiento" value={data.dob} mono/>}
              {data.dni&&<InfoRow label="DNI" value={data.dni} mono/>}{data.address&&<InfoRow label="Dirección" value={data.address}/>}
              {data.phone&&<InfoRow label="Teléfono" value={data.phone} mono/>}{data.occupation&&<InfoRow label="Ocupación" value={data.occupation}/>}
            </Card>
          ))}
          {child.guardian&&(
            <Card>
              <h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:14}}>🏠 Tutor/Guardián</h3>
              <InfoRow label="Nombre" value={child.guardian.name}/>{child.guardian.dni&&<InfoRow label="DNI" value={child.guardian.dni} mono/>}{child.guardian.phone&&<InfoRow label="Teléfono" value={child.guardian.phone} mono/>}
            </Card>
          )}
          <Card>
            <h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:14}}>📊 Indicadores Familiares</h3>
            <InfoRow label="Frecuencia de Visitas" value={child.lifeDomains.family.visitFrequency}/>
            <InfoRow label="Nivel de Comodidad" value={`${child.lifeDomains.family.comfortLevel}/5`}/>
            <InfoRow label="Idioma" value={child.lifeDomains.family.language}/>
          </Card>
          <Card style={{gridColumn:"1 / -1"}}>
            <h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:10}}>🤝 Situación Familiar</h3>
            <p style={{fontSize:13,lineHeight:1.7,color:S.inkSoft,margin:0,fontFamily:S.body}}>{child.familySituation}</p>
          </Card>
        </div>
      )}
      {activeTab==="plan"&&(
        <div>
          <Card style={{marginBottom:20,background:S.gradBridge,position:"relative",overflow:"hidden"}}>
            <AndeanPattern opacity={0.06} color="#FFF"/>
            <div style={{position:"relative",zIndex:1}}>
              <div style={{fontFamily:S.display,fontSize:20,color:"#FFF",marginBottom:4}}>Plan de Trabajo Individual — Anexo N° 01</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",fontFamily:S.body,marginBottom:12}}>MIMP · UPE · Caso: {child.caseNumber}</div>
              <Button variant="gold" icon="📄" size="sm">Exportar PDF</Button>
            </div>
          </Card>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {child.objectives.map((obj,i)=>(
              <Card key={obj.id} style={{borderLeft:`4px solid ${CHART_COLORS[i]}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:10}}>
                  <h3 style={{fontSize:15,fontWeight:700,color:S.ink,margin:0,fontFamily:S.body,flex:1,paddingRight:12}}>{obj.text}</h3>
                  <StatusBadge status={obj.status}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                  {[{label:"Actividades",value:obj.activities},{label:"Servicio",value:obj.service},{label:"Responsable",value:obj.responsible},{label:"Seguimiento",value:obj.followUp}].map((item,j)=>(
                    <div key={j} style={{padding:"8px 10px",background:S.cloud,borderRadius:S.sm}}>
                      <div style={{fontSize:9,fontWeight:700,color:S.slate,textTransform:"uppercase",letterSpacing:0.8,fontFamily:S.body,marginBottom:4}}>{item.label}</div>
                      <div style={{fontSize:12,color:S.ink,fontFamily:S.body}}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:8,fontSize:11,color:S.slate,fontFamily:S.mono}}>Plazo: {obj.deadline}</div>
              </Card>
            ))}
          </div>
        </div>
      )}
      {activeTab==="wellness"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {[
            {label:"WIT-Y Score",value:child.lifeDomains.wellness.witY,max:100,color:S.teal,desc:"Bienestar integral"},
            {label:"ACE Score",value:child.lifeDomains.wellness.aceScore,max:10,color:S.red,desc:"Experiencias adversas"},
            {label:"Casey Life Skills",value:child.lifeDomains.lifeSkills.caseyScore,max:100,color:S.gold,desc:"Habilidades de vida"},
            {label:"Conectividad Social",value:child.lifeDomains.transition.socialConnectedness,max:100,color:S.info,desc:"Red de apoyo"},
          ].map((metric,i)=>(
            <Card key={i} style={{display:"flex",alignItems:"center",gap:20}}>
              <ProgressRing value={metric.value} max={metric.max} size={72} color={metric.color}/>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:S.ink,fontFamily:S.body}}>{metric.label}</div>
                <div style={{fontSize:12,color:S.slate,fontFamily:S.body,marginTop:2}}>{metric.desc}</div>
                <div style={{fontFamily:S.mono,fontSize:18,fontWeight:700,color:metric.color,marginTop:4}}>{metric.value}{metric.max===10?"/10":""}</div>
              </div>
            </Card>
          ))}
          <Card style={{gridColumn:"1 / -1"}}>
            <h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:10}}>🌟 Actividades Extracurriculares</h3>
            <p style={{fontSize:14,color:S.ink,fontFamily:S.body,margin:0}}>{child.lifeDomains.wellness.extracurricular}</p>
          </Card>
        </div>
      )}
      {activeTab==="transition"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Card>
            <h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:14}}>📄 Documentación</h3>
            {[{label:"Acta de Nacimiento",value:child.lifeDomains.transition.birthCert},{label:"DNI",value:child.lifeDomains.transition.dni},{label:"CV Elaborado",value:child.lifeDomains.transition.cv},{label:"Plan de Seguridad",value:child.lifeDomains.transition.safetyPlan}].map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${S.mist}`}}>
                <span style={{fontSize:13,color:S.slate,fontFamily:S.body,fontWeight:600}}>{item.label}</span>
                <Badge label={item.value?"✓ Completo":"○ Pendiente"} variant={item.value?"success":"warning"} size="sm"/>
              </div>
            ))}
          </Card>
          <Card>
            <h3 style={{fontSize:15,fontWeight:400,fontFamily:S.display,color:S.ink,marginBottom:14}}>🎓 Progreso Educativo</h3>
            <InfoRow label="Secundaria" value={child.lifeDomains.transition.secondaryProgress}/>
            <InfoRow label="Conectividad" value={`${child.lifeDomains.transition.socialConnectedness}/100`}/>
            <div style={{marginTop:16}}>
              <div style={{fontSize:11,fontWeight:700,color:S.slate,textTransform:"uppercase",letterSpacing:0.8,fontFamily:S.body,marginBottom:8}}>Conectividad Social</div>
              <ProgressBar value={child.lifeDomains.transition.socialConnectedness} color={S.teal} height={10}/>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ── MIMP REPORTS VIEW ──────────────────────────────────────────

const MIMPReportsView = ({ children }) => (
  <div>
    <div style={{marginBottom:24}}>
      <h1 style={{fontSize:28,fontWeight:400,fontFamily:S.display,color:S.ink,margin:0}}>Informes MIMP / UPE</h1>
      <p style={{color:S.slate,fontSize:13,margin:"4px 0 0",fontFamily:S.body}}>Ministerio de la Mujer y Poblaciones Vulnerables del Perú</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
      {[{title:"Plan de Trabajo Individual",subtitle:"Anexo N° 01 — Para cada NNA en situación de riesgo",icon:"📋"},{title:"Informe de Seguimiento",subtitle:"Reporte periódico de avance de objetivos y actividades",icon:"📊"},{title:"Informe de Situación",subtitle:"Diagnóstico psicosocial y situación familiar actualizada",icon:"🏠"},{title:"Notificación de Incidentes",subtitle:"Reporte de incidentes para UPE/DEMUNA",icon:"⚠️"}].map((report,i)=>(
        <Card key={i} hover>
          <div style={{display:"flex",gap:14}}>
            <div style={{width:52,height:52,borderRadius:S.md,background:S.tealGhost,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{report.icon}</div>
            <div style={{flex:1}}>
              <h3 style={{fontSize:15,fontWeight:700,color:S.ink,margin:"0 0 4px",fontFamily:S.body}}>{report.title}</h3>
              <p style={{fontSize:12,color:S.slate,margin:"0 0 14px",fontFamily:S.body,lineHeight:1.5}}>{report.subtitle}</p>
              <Button size="sm" variant={i<2?"secondary":"ghost"}>Generar Informe</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
    <Card>
      <SectionTitle icon="📋" title="Planes de Trabajo Individuales" subtitle="Estado actual de todos los residentes"/>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:S.ink}}>
              {["Residente","Caso","Objetivo 1","Objetivo 2","Objetivo 3","Próx. Seguimiento","PDF"].map((h,i)=>(
                <th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:800,color:"#FFF",fontFamily:S.body,letterSpacing:0.8,textTransform:"uppercase",borderRadius:i===0?`${S.sm}px 0 0 0`:i===6?`0 ${S.sm}px 0 0`:0}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {children.map((child,i)=>(
              <tr key={child.id} style={{borderBottom:`1px solid ${S.mist}`,background:i%2===0?S.white:S.parchment}}>
                <td style={{padding:"11px 14px",fontWeight:700,fontSize:13,fontFamily:S.body,color:S.ink}}>{child.fullName.split(" ").slice(0,2).join(" ")}</td>
                <td style={{padding:"11px 14px",fontSize:11,fontFamily:S.mono,color:S.slate}}>{child.caseNumber}</td>
                {child.objectives.map(obj=>(<td key={obj.id} style={{padding:"11px 14px"}}><StatusBadge status={obj.status}/></td>))}
                <td style={{padding:"11px 14px",fontSize:11,fontFamily:S.mono,color:S.slate}}>{child.objectives.filter(o=>o.status!=="completed").map(o=>o.followUp).sort()[0]||"—"}</td>
                <td style={{padding:"11px 14px"}}><Button size="sm" variant="primary">PDF</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

// ── COE VIEW ───────────────────────────────────────────────────

const COEView = ({ children }) => {
  const avgProgress = Math.round(children.reduce((s,c)=>s+c.coeProgress.modulesCompleted,0)/children.length);
  return (
    <div>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:28,fontWeight:400,fontFamily:S.display,color:S.ink,margin:0}}>Comunidades de Excelencia</h1>
        <p style={{color:S.slate,fontSize:13,margin:"4px 0 0",fontFamily:S.body}}>Modelo de atención basado en trauma, motivación y fortalezas — HBI</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:24}}>
        <Card variant="gold" style={{textAlign:"center",padding:20}}><div style={{fontSize:36,fontWeight:400,fontFamily:S.display,color:S.goldDark}}>{avgProgress}</div><div style={{fontSize:11,color:S.slate,fontWeight:700,fontFamily:S.body,textTransform:"uppercase",letterSpacing:0.8}}>Módulos Completados (Prom.)</div></Card>
        <Card variant="teal" style={{textAlign:"center",padding:20}}><div style={{fontSize:36,fontWeight:400,fontFamily:S.display,color:S.tealDark}}>12</div><div style={{fontSize:11,color:S.slate,fontWeight:700,fontFamily:S.body,textTransform:"uppercase",letterSpacing:0.8}}>Módulos Totales</div></Card>
        <Card variant="success" style={{textAlign:"center",padding:20}}><div style={{fontSize:36,fontWeight:400,fontFamily:S.display,color:"#0d6b35"}}>{children.filter(c=>c.coeProgress.modulesCompleted>=12).length}</div><div style={{fontSize:11,color:S.slate,fontWeight:700,fontFamily:S.body,textTransform:"uppercase",letterSpacing:0.8}}>Programa Completo</div></Card>
      </div>
      <Card style={{marginBottom:20}}>
        <SectionTitle icon="🌟" title="Progreso por Módulo CoE" subtitle="Estado de cada residente en las 12 etapas"/>
        <div style={{overflowX:"auto"}}>
          <table style={{borderCollapse:"collapse",width:"100%"}}>
            <thead>
              <tr>
                <th style={{padding:"8px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:S.slate,fontFamily:S.body,minWidth:110}}>Residente</th>
                {COE_SECTIONS.map((s,i)=>(
                  <th key={i} style={{padding:"8px 8px",textAlign:"center",fontSize:9,fontWeight:700,color:S.slate,fontFamily:S.body,minWidth:60,letterSpacing:0.3}}>{s.length>8?s.slice(0,8)+"…":s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {children.map(child=>(
                <tr key={child.id} style={{borderBottom:`1px solid ${S.mist}`}}>
                  <td style={{padding:"10px 14px",fontWeight:700,fontSize:13,fontFamily:S.body,color:S.ink}}>{child.fullName.split(" ")[0]}</td>
                  {COE_SECTIONS.map((_,i)=>(
                    <td key={i} style={{padding:"10px 8px",textAlign:"center"}}>
                      <div style={{width:24,height:24,borderRadius:"50%",margin:"0 auto",background:i<child.coeProgress.modulesCompleted?S.success:i===child.coeProgress.modulesCompleted?S.warning:S.mist,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#FFF",fontWeight:700,boxShadow:i<child.coeProgress.modulesCompleted?`0 2px 4px ${S.success}40`:"none"}}>
                        {i<child.coeProgress.modulesCompleted?"✓":i===child.coeProgress.modulesCompleted?"→":""}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <SectionTitle icon="📖" title="Principios Fundamentales CoE" subtitle="La excelencia no es hacer. Es ser."/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[{title:"Trauma-Informado",desc:"Comprender cómo el trauma afecta el cerebro, el cuerpo y el comportamiento de los NNA.",icon:"🧠",color:S.red},{title:"Basado en Fortalezas",desc:"Cada persona tiene fortalezas innatas que pueden ser descubiertas y desarrolladas.",icon:"💪",color:S.teal},{title:"Motivación Mejorada",desc:"El cambio nace de la motivación intrínseca, no de la coerción externa.",icon:"🔥",color:S.gold},{title:"Conexión Relacional",desc:"La sanación ocurre en el contexto de relaciones seguras y auténticas.",icon:"🤝",color:S.success}].map((p,i)=>(
            <Card key={i} hover style={{padding:16,borderLeft:`4px solid ${p.color}`}}>
              <div style={{fontSize:28,marginBottom:8}}>{p.icon}</div>
              <div style={{fontSize:14,fontWeight:700,color:S.ink,marginBottom:4,fontFamily:S.body}}>{p.title}</div>
              <div style={{fontSize:12,color:S.slate,lineHeight:1.6,fontFamily:S.body}}>{p.desc}</div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ── ARTICULATE VIEW ────────────────────────────────────────────

const ArticulateView = ({ children }) => {
  const modules = [
    {id:"mod-1",name:"Entendiendo el Trauma Infantil",duration:"45 min",category:"Fundamentos",color:S.red},
    {id:"mod-2",name:"Comunicación Empática",duration:"30 min",category:"Habilidades",color:S.teal},
    {id:"mod-3",name:"Habilidades de Vida Diaria",duration:"40 min",category:"Desarrollo",color:S.gold},
    {id:"mod-4",name:"Manejo de Crisis",duration:"35 min",category:"Seguridad",color:S.danger},
    {id:"mod-5",name:"Fortalecimiento Familiar",duration:"50 min",category:"Familia",color:S.info},
    {id:"mod-6",name:"Plan de Transición",duration:"45 min",category:"Transición",color:S.success},
  ];
  return (
    <div>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:28,fontWeight:400,fontFamily:S.display,color:S.ink,margin:0}}>Módulos Educativos</h1>
        <p style={{color:S.slate,fontSize:13,margin:"4px 0 0",fontFamily:S.body}}>Capacitación en línea vía Articulate Rise — Integrado con el modelo CoE</p>
      </div>
      <Card style={{marginBottom:24,background:S.gradBridge,position:"relative",overflow:"hidden"}}>
        <AndeanPattern opacity={0.06} color="#FFF"/>
        <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:20}}>
          <div style={{fontSize:48}}>📚</div>
          <div>
            <h3 style={{margin:0,fontSize:18,fontFamily:S.display,color:"#FFF",fontWeight:400}}>Plataforma Articulate Rise</h3>
            <p style={{margin:"4px 0 12px",fontSize:13,color:"rgba(255,255,255,0.7)",fontFamily:S.body}}>Módulos interactivos de capacitación para cuidadores y personal</p>
            <a href="https://share.articulate.com/kj749MHRmtcvi4sr0Jyk2" target="_blank" rel="noopener" style={{background:S.gold,color:S.ink,padding:"9px 20px",borderRadius:S.sm,fontWeight:700,fontSize:12,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:6,fontFamily:S.body}}>🔗 Abrir en Articulate Rise</a>
          </div>
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
        {modules.map(mod=>{
          const scores = children.map(c=>c.articulateModules.find(m=>mod.name.includes(m.name.split(" ")[0]))?.score).filter(Boolean);
          const avgScore = scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):null;
          return (
            <Card key={mod.id} hover style={{borderTop:`3px solid ${mod.color}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <Badge label={mod.category} variant="silver" size="sm"/>
                <span style={{fontSize:11,color:S.slate,fontFamily:S.body}}>⏱ {mod.duration}</span>
              </div>
              <h4 style={{fontSize:14,fontWeight:700,color:S.ink,margin:"0 0 14px",fontFamily:S.body,lineHeight:1.4}}>{mod.name}</h4>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                {children.map(c=>{
                  const modData = c.articulateModules.find(m=>mod.name.includes(m.name.split(" ")[0]));
                  return (
                    <div key={c.id} style={{textAlign:"center"}}>
                      <div style={{width:30,height:30,borderRadius:"50%",fontSize:11,fontWeight:700,background:modData?.completed?S.success:S.mist,color:modData?.completed?"#FFF":S.silver,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:modData?.completed?`0 2px 4px ${S.success}40`:"none"}}>{modData?.completed?"✓":"○"}</div>
                      <div style={{fontSize:9,color:S.slate,marginTop:2,fontFamily:S.body}}>{c.fullName.split(" ")[0]}</div>
                    </div>
                  );
                })}
              </div>
              {avgScore&&<div style={{fontSize:11,color:S.slate,fontFamily:S.mono}}>Puntaje prom.: <strong style={{color:mod.color}}>{avgScore}</strong></div>}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ── AI PLANS VIEW ──────────────────────────────────────────────

const AIPlansView = ({ children }) => {
  const [selectedChild, setSelectedChild] = useState(children[0].id);
  const [planType, setPlanType] = useState("treatment");
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const child = children.find(c=>c.id===selectedChild);

  const generatePlan = async () => {
    setLoading(true); setAiResponse(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:`Eres un especialista en bienestar infantil con expertise en cuidado residencial en Perú, trauma informado, y el modelo Comunidades de Excelencia de Health Bridges International. Responde SOLO en JSON con esta estructura exacta: {"title":"string","sections":[{"heading":"string","content":"string"}]} — sin markdown, sin texto fuera del JSON.`,
          messages:[{role:"user",content:`Genera un plan de tipo "${planType}" para: ${child.fullName}, ${child.age} años. Diagnóstico: ${child.psychDiagnosis}. ACE: ${child.lifeDomains.wellness.aceScore}, WIT-Y: ${child.lifeDomains.wellness.witY}, Casey: ${child.lifeDomains.lifeSkills.caseyScore}. Tratamiento: ${child.health.behavioral.treatment}. Actividades: ${child.lifeDomains.wellness.extracurricular}. CoE: ${child.coeProgress.modulesCompleted}/${child.coeProgress.totalModules}. 4 secciones con emojis. Específico y culturalmente apropiado para Cusco, Perú.`}],
        })
      });
      const data = await res.json();
      const text = data.content.map(b=>b.text||"").join("");
      setAiResponse(JSON.parse(text.replace(/```json|```/g,"").trim()));
    } catch(e) {
      const plans = {
        treatment:{title:`Plan de Atención — ${child.fullName.split(" ").slice(0,2).join(" ")}`,sections:[
          {heading:"🧠 Enfoque Terapéutico",content:`Basado en el perfil de ${child.fullName.split(" ")[0]} (ACE: ${child.lifeDomains.wellness.aceScore}, WIT-Y: ${child.lifeDomains.wellness.witY}), se recomienda ${child.health.behavioral.treatment} combinado con enfoque en fortalezas. Las fortalezas identificadas deben ser el pilar central del plan terapéutico.`},
          {heading:"🌻 Actividades Basadas en Fortalezas",content:`Incorporar ${child.lifeDomains.wellness.extracurricular} como herramientas terapéuticas. El deporte y actividades creativas facilitan la regulación emocional y construyen autoeficacia. Terapia asistida con actividades al aire libre aprovechando el entorno natural andino.`},
          {heading:"👨‍👩‍👧 Intervención Familiar",content:`Visitas: ${child.lifeDomains.family.visitFrequency}. Comodidad: ${child.lifeDomains.family.comfortLevel}/5. Se recomienda incrementar gradualmente la frecuencia de contacto familiar con actividades compartidas que faciliten la reconexión segura.`},
          {heading:"📚 Recursos CoE Aplicables",content:`Aplicar los principios de las Secciones 4 (Principios) y 7 (Integración) del modelo CoE. Enfatizar la co-regulación emocional. Progreso actual: ${child.coeProgress.modulesCompleted}/${child.coeProgress.totalModules} módulos completados.`},
        ]},
        resources:{title:`Guía de Recursos — ${child.fullName.split(" ").slice(0,2).join(" ")}`,sections:[
          {heading:"🏥 Recursos de Salud",content:`Coordinar con centro de salud MINSA para seguimiento. Verificar SIS vigente. Dental: última visita ${child.health.dental.lastVisit}, caries: ${child.health.dental.cavities}. Diagnóstico actual: ${child.health.diagnosis}.`},
          {heading:"🎓 Apoyo Educativo",content:`Asistencia: ${child.lifeDomains.educational.attendance}%. Lectura: ${child.lifeDomains.educational.readingLevel} PPM. Programa de lectura complementario y evaluación de NEE recomendada.`},
          {heading:"🤝 Red Comunitaria",content:"Programas deportivos municipales de Cusco, bibliotecas comunitarias, grupos juveniles. Explorar becas deportivas regionales y nacionales disponibles para jóvenes talentosos."},
          {heading:"📋 Servicios MIMP",content:"Verificar: Programa Juntos, Qali Warma, BECA 18, programas MIMP para NNA en cuidado alternativo. Coordinar con UPE/DEMUNA para seguimiento y gestión de documentos pendientes."},
        ]},
        caregiver:{title:`Guía para Cuidadores — ${child.fullName.split(" ").slice(0,2).join(" ")}`,sections:[
          {heading:"💚 Co-Regulación",content:`Para ${child.health.behavioral.diagnosis}: priorizar la autorregulación del cuidador antes de intervenir. Técnicas: respiración 4-7-8, pausas conscientes, modelo PACE (Playfulness, Acceptance, Curiosity, Empathy).`},
          {heading:"🔥 Motivación Mejorada",content:"Entrevista motivacional: expresar empatía, desarrollar discrepancia, evitar argumentación, fomentar autoeficacia. Escala de motivación 1-10 en conversaciones diarias. Celebrar avances pequeños."},
          {heading:"📖 Capacitación",content:`Completar módulos Articulate Rise: trauma infantil y comunicación empática prioritariamente. CoE del NNA: ${child.coeProgress.modulesCompleted}/${child.coeProgress.totalModules} secciones. Supervisión de cuidadores bimensual recomendada.`},
          {heading:"⚡ Respuesta a Crisis",content:"1) Seguridad física, 2) Reducir estimulación, 3) Voz calmada + postura abierta, 4) Opciones limitadas, 5) Documentar post-estabilización. No confrontar en estado de activación."},
        ]},
      };
      setAiResponse(plans[planType]);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:28,fontWeight:400,fontFamily:S.display,color:S.ink,margin:0}}>IA — Planes de Atención</h1>
        <p style={{color:S.slate,fontSize:13,margin:"4px 0 0",fontFamily:S.body}}>Generación inteligente de planes de tratamiento, guías de recursos y estrategias para cuidadores</p>
      </div>
      <Card style={{marginBottom:20}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:16}}>
          <div>
            <label style={{fontSize:11,fontWeight:700,color:S.slate,display:"block",marginBottom:6,fontFamily:S.body,textTransform:"uppercase",letterSpacing:0.8}}>Residente</label>
            <select value={selectedChild} onChange={e=>setSelectedChild(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:S.sm,border:`1.5px solid ${S.mist}`,fontSize:13,fontFamily:S.body,color:S.ink,background:S.white}}>
              {children.map(c=>(<option key={c.id} value={c.id}>{c.fullName}</option>))}
            </select>
          </div>
          <div>
            <label style={{fontSize:11,fontWeight:700,color:S.slate,display:"block",marginBottom:6,fontFamily:S.body,textTransform:"uppercase",letterSpacing:0.8}}>Tipo de Plan</label>
            <select value={planType} onChange={e=>setPlanType(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:S.sm,border:`1.5px solid ${S.mist}`,fontSize:13,fontFamily:S.body,color:S.ink,background:S.white}}>
              <option value="treatment">🧠 Plan de Tratamiento Creativo</option>
              <option value="resources">📋 Guía de Recursos</option>
              <option value="caregiver">💚 Opciones para Cuidadores</option>
            </select>
          </div>
          <div style={{display:"flex",alignItems:"flex-end"}}>
            <Button onClick={generatePlan} disabled={loading} variant="primary" icon={loading?"⏳":"🤖"} style={{width:"100%",justifyContent:"center"}}>{loading?"Generando…":"Generar con IA"}</Button>
          </div>
        </div>
        {child&&(<div style={{padding:"10px 14px",background:S.cloud,borderRadius:S.sm,fontSize:12,color:S.slate,fontFamily:S.mono}}><strong style={{fontFamily:S.body,color:S.ink}}>{child.fullName}</strong> · {child.age} años · {child.health.behavioral.diagnosis} · ACE: {child.lifeDomains.wellness.aceScore} · WIT-Y: {child.lifeDomains.wellness.witY} · CoE: {child.coeProgress.modulesCompleted}/{child.coeProgress.totalModules}</div>)}
      </Card>
      {loading&&(<Card style={{textAlign:"center",padding:48}}><div style={{fontSize:40,marginBottom:16}}>🤖</div><div style={{fontFamily:S.display,fontSize:20,color:S.ink,marginBottom:8}}>Generando plan con IA…</div><div style={{fontSize:13,color:S.slate,fontFamily:S.body}}>Analizando el perfil de {child?.fullName?.split(" ")[0]} y generando recomendaciones personalizadas</div></Card>)}
      {aiResponse&&!loading&&(
        <Card>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <div style={{width:40,height:40,borderRadius:S.md,background:S.gradBridge,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🤖</div>
            <h2 style={{fontSize:19,fontWeight:400,fontFamily:S.display,color:S.ink,margin:0}}>{aiResponse.title}</h2>
          </div>
          {aiResponse.sections.map((section,i)=>(
            <div key={i} style={{marginBottom:16,padding:16,background:S.parchment,borderRadius:S.sm,borderLeft:`4px solid ${CHART_COLORS[i%CHART_COLORS.length]}`}}>
              <h3 style={{fontSize:14,fontWeight:700,color:S.ink,margin:"0 0 8px",fontFamily:S.body}}>{section.heading}</h3>
              <p style={{fontSize:13,lineHeight:1.7,color:S.inkSoft,margin:0,fontFamily:S.body}}>{section.content}</p>
            </div>
          ))}
          <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
            <Button size="sm" variant="primary" icon="📄">Exportar PDF</Button>
            <Button size="sm" variant="secondary" icon="📋">Agregar al Plan MIMP</Button>
            <Button size="sm" variant="ghost" icon="🔄" onClick={generatePlan}>Regenerar</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

// ── WELLNESS VIEW ──────────────────────────────────────────────

const WellnessView = ({ children }) => {
  const witYData = children.map(c=>({name:c.fullName.split(" ")[0],witY:c.lifeDomains.wellness.witY,ace:c.lifeDomains.wellness.aceScore*10,social:c.lifeDomains.transition.socialConnectedness}));
  return (
    <div>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:28,fontWeight:400,fontFamily:S.display,color:S.ink,margin:0}}>Panel de Bienestar</h1>
        <p style={{color:S.slate,fontSize:13,margin:"4px 0 0",fontFamily:S.body}}>Monitoreo integral del bienestar emocional, social y de desarrollo</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
        <Card>
          <SectionTitle icon="💛" title="WIT-Y · ACE · Conectividad Social"/>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={witYData}>
              <CartesianGrid strokeDasharray="3 3" stroke={S.mist}/><XAxis dataKey="name" tick={{fontSize:12,fontFamily:S.body}}/><YAxis domain={[0,100]} tick={{fontSize:11}}/>
              <Tooltip contentStyle={{fontFamily:S.body,borderRadius:S.sm}}/><Legend wrapperStyle={{fontFamily:S.body,fontSize:12}}/>
              <Bar dataKey="witY" name="WIT-Y" fill={S.teal} radius={[4,4,0,0]}/><Bar dataKey="ace" name="ACE (×10)" fill={S.red} radius={[4,4,0,0]}/><Bar dataKey="social" name="Conectividad" fill={S.gold} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle icon="📊" title="Distribución Casey Life Skills"/>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={[{name:"Alto (>70)",value:Math.max(children.filter(c=>c.lifeDomains.lifeSkills.caseyScore>70).length,0.01)},{name:"Medio (50-70)",value:Math.max(children.filter(c=>c.lifeDomains.lifeSkills.caseyScore>=50&&c.lifeDomains.lifeSkills.caseyScore<=70).length,0.01)},{name:"Bajo (<50)",value:Math.max(children.filter(c=>c.lifeDomains.lifeSkills.caseyScore<50).length,0.01)}]} cx="50%" cy="50%" outerRadius={90} label={({name,value})=>value>0.01?name:""}>
                {[S.success,S.warning,S.danger].map((c,i)=>(<Cell key={i} fill={c}/>))}
              </Pie>
              <Tooltip contentStyle={{fontFamily:S.body,borderRadius:S.sm}}/><Legend wrapperStyle={{fontFamily:S.body,fontSize:12}}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <SectionTitle icon="😊" title="Check-in de Estado Anímico — Hoy" subtitle="Monitoreo diario de cada residente"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {children.map(child=>{
            const mood = child.moodHistory[child.moodHistory.length-1].mood;
            const bg = mood>=4?S.successGhost:mood>=3?S.warningGhost:S.dangerGhost;
            const border = mood>=4?`1px solid ${S.success}30`:mood>=3?`1px solid ${S.warning}30`:`1px solid ${S.danger}30`;
            return (<div key={child.id} style={{padding:20,borderRadius:S.md,textAlign:"center",background:bg,border}}><MoodDot value={mood} size={56}/><div style={{fontSize:15,fontWeight:700,color:S.ink,marginTop:12,fontFamily:S.body}}>{child.fullName.split(" ").slice(0,2).join(" ")}</div><div style={{fontSize:12,color:S.slate,fontFamily:S.mono,marginTop:2}}>Nivel: {mood}/5</div></div>);
          })}
        </div>
      </Card>
    </div>
  );
};

// ── REPORTS VIEW ───────────────────────────────────────────────

const ReportsView = () => {
  const reports = [
    {title:"Plan de Trabajo Individual",desc:"Anexo N° 01 MIMP — Formato oficial por cada NNA",icon:"📋",color:S.red},
    {title:"Informe de Seguimiento",desc:"Avance de objetivos y cumplimiento de plazos",icon:"📊",color:S.teal},
    {title:"Reporte de Bienestar",desc:"WIT-Y, ACE, estado anímico y conectividad social",icon:"💚",color:S.success},
    {title:"Informe de Salud",desc:"Estado médico, dental y conductual por residente",icon:"🏥",color:S.info},
    {title:"Reporte Educativo",desc:"Asistencia, notas, nivel de lectura y habilidades",icon:"📚",color:S.gold},
    {title:"Progreso CoE",desc:"Avance en el modelo Comunidades de Excelencia",icon:"🌟",color:S.goldDark},
    {title:"Módulos Articulate",desc:"Completitud y puntajes de capacitación en línea",icon:"📖",color:"#8B5CF6"},
    {title:"Registro de Incidentes",desc:"Notificaciones a UPE/DEMUNA y planes de acción",icon:"⚠️",color:S.danger},
    {title:"Informe Consolidado",desc:"Resumen ejecutivo de todos los dominios de vida",icon:"📄",color:S.ink},
  ];
  return (
    <div>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:28,fontWeight:400,fontFamily:S.display,color:S.ink,margin:0}}>Centro de Reportes</h1>
        <p style={{color:S.slate,fontSize:13,margin:"4px 0 0",fontFamily:S.body}}>Generación y exportación de informes para MIMP, UPE, DEMUNA, y gestión interna</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:24}}>
        {reports.map((report,i)=>(
          <Card key={i} hover style={{cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"start",gap:12}}>
              <div style={{width:48,height:48,borderRadius:S.md,flexShrink:0,background:`${report.color}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{report.icon}</div>
              <div><h3 style={{fontSize:14,fontWeight:700,color:S.ink,margin:"0 0 4px",fontFamily:S.body}}>{report.title}</h3><p style={{fontSize:11,color:S.slate,margin:0,lineHeight:1.5,fontFamily:S.body}}>{report.desc}</p></div>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <SectionTitle icon="📤" title="Exportación Programada" subtitle="Configure envío automático de reportes"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
          {["Semanal","Quincenal","Mensual","Trimestral"].map(freq=>(
            <button key={freq} style={{padding:"12px 16px",borderRadius:S.sm,border:`1.5px solid ${S.mist}`,background:S.parchment,fontSize:13,fontWeight:700,cursor:"pointer",color:S.ink,fontFamily:S.body,transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=S.teal;e.currentTarget.style.background=S.tealGhost;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=S.mist;e.currentTarget.style.background=S.parchment;}}>{freq}</button>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ── MAIN APP ───────────────────────────────────────────────────

export default function Page() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(()=>{ injectFonts(); },[]);

  const handleSelectChild = (id) => { setSelectedChildId(id); setActiveView("child_detail"); };
  const selectedChild = MOCK_CHILDREN.find(c=>c.id===selectedChildId);

  const renderView = () => {
    switch(activeView) {
      case "dashboard": return <DashboardView children={MOCK_CHILDREN} onSelectChild={handleSelectChild}/>;
      case "children": return <ChildrenListView children={MOCK_CHILDREN} onSelectChild={handleSelectChild}/>;
      case "child_detail": return selectedChild?<ChildDetailView child={selectedChild} onBack={()=>setActiveView("children")}/>:null;
      case "mimp": return <MIMPReportsView children={MOCK_CHILDREN}/>;
      case "coe": return <COEView children={MOCK_CHILDREN}/>;
      case "articulate": return <ArticulateView children={MOCK_CHILDREN}/>;
      case "ai_plans": return <AIPlansView children={MOCK_CHILDREN}/>;
      case "wellness": return <WellnessView children={MOCK_CHILDREN}/>;
      case "reports": return <ReportsView/>;
      default: return <DashboardView children={MOCK_CHILDREN} onSelectChild={handleSelectChild}/>;
    }
  };

  return (
    <div style={{display:"flex",minHeight:"100vh",background:S.cloud,fontFamily:S.body}}>
      <Sidebar activeView={activeView} onNavigate={setActiveView} collapsed={sidebarCollapsed} onToggle={()=>setSidebarCollapsed(!sidebarCollapsed)}/>
      <main style={{flex:1,marginLeft:sidebarCollapsed?64:240,padding:"28px 32px",transition:"margin-left 0.3s ease",maxWidth:`calc(100vw - ${sidebarCollapsed?64:240}px)`}}>
        {renderView()}
      </main>
    </div>
  );
}
