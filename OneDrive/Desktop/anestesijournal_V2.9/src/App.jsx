import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Syringe, Activity, ClipboardCheck, FolderOpen, Plus, Minus, Trash2, Printer, Calendar,
  CheckCircle2, Clock, AlertTriangle, PawPrint,
} from "lucide-react";

/* ================================ STYLE ================================ */
const CSS = `
:root{
  --ink:#1c2430; --muted:#647089; --paper:#fff; --bg:#eef1f6;
  --line:#cdd6e4; --line2:#e3e9f2;
  --blue:#3a7bc8; --blue-d:#2a5d9c; --blue-bg:#eaf2fb; --blue-line:#bcd4ec;
  --red:#9e2a2a; --red-bg:#fbeae7; --red-line:#e7b9b2; --yellow:#f5e6b0;
  --green:#2e6b34; --green-d:#235227; --green-bg:#e6f1e6; --green-line:#bcd9bc;
  --navy:#1f3a5f;
}
*{box-sizing:border-box}
.aj{font-family:'Inter','Segoe UI',system-ui,-apple-system,sans-serif;color:var(--ink);
  background:var(--bg);min-height:100vh;-webkit-font-smoothing:antialiased;
  font-variant-numeric:tabular-nums}
.aj input,.aj select,.aj textarea{font-family:inherit;font-variant-numeric:tabular-nums}

/* header + tabs */
.hd{background:var(--navy);color:#eaf0fa;padding:11px 16px;position:sticky;top:0;z-index:30}
.hd-row{display:flex;align-items:center;gap:11px;max-width:1100px;margin:0 auto}
.hd-mark{width:32px;height:32px;border-radius:8px;background:#2f5b91;display:flex;
  align-items:center;justify-content:center;flex:0 0 auto}
.hd-t{font-size:16px;font-weight:700}
.hd-pt{margin-left:auto;text-align:right;font-size:11.5px;color:#b9c7e2;line-height:1.3;max-width:50%}
.hd-pt b{color:#fff}
.tabs{background:#27486f;display:flex;gap:2px;overflow-x:auto;padding:0 8px;
  position:sticky;top:54px;z-index:29;scrollbar-width:none}
.tabs::-webkit-scrollbar{display:none}
.tab{flex:0 0 auto;display:flex;align-items:center;gap:7px;border:none;background:transparent;
  color:#a9bbdb;padding:11px 13px;font-size:13px;font-weight:600;cursor:pointer;
  border-bottom:3px solid transparent;white-space:nowrap}
.tab.on{color:#fff;border-bottom-color:#7fb0e6}
.tab.on.red{border-bottom-color:#e07a72}
.tab.on.green{border-bottom-color:#7fc285}

.wrap{max-width:1100px;margin:0 auto;padding:15px 13px 92px}

/* sheet shell */
.sheet{background:var(--paper);border:1px solid var(--line);border-radius:12px;
  overflow:hidden;margin-bottom:15px}
.sheet-title{padding:14px 16px;border-bottom:2px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.sheet-title .eyebrow{font-size:11px;letter-spacing:3px;color:var(--muted);font-weight:700}
.sheet-title h2{margin:2px 0 0;font-size:21px;font-weight:800;letter-spacing:.3px}
.t-blue h2{color:var(--blue-d)} .t-blue{border-bottom-color:var(--blue-line)}
.t-red h2{color:var(--red)} .t-red{border-bottom-color:var(--red-line)}
.t-green h2{color:var(--green)} .t-green{border-bottom-color:var(--green-line)}

/* section bars */
.sec{display:flex;align-items:center;gap:8px;font-weight:700;letter-spacing:.4px;
  padding:9px 14px;font-size:13px;text-transform:uppercase}
.sec.blue{background:var(--blue-bg);color:var(--blue-d);border-top:1px solid var(--blue-line);border-bottom:1px solid var(--blue-line)}
.sec.redblock{background:var(--red);color:#fff}
.sec.green{background:var(--green);color:#fff}
.sec.green .n{background:rgba(255,255,255,.22);border-radius:4px;padding:1px 8px;margin-right:2px}
.body{padding:14px}

.grid{display:grid;gap:11px}
@media(min-width:560px){.g2{grid-template-columns:1fr 1fr}.g3{grid-template-columns:1fr 1fr 1fr}.g4{grid-template-columns:repeat(4,1fr)}}

.field label{display:block;font-size:11px;font-weight:600;color:var(--muted);margin-bottom:4px}
.field input,.field select,.field textarea{width:100%;border:1px solid var(--line);
  border-radius:8px;padding:9px 10px;font-size:14.5px;background:#fff;color:var(--ink);outline:none}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--blue);
  box-shadow:0 0 0 3px rgba(58,123,200,.14)}
.field textarea{resize:vertical;min-height:54px;line-height:1.45}
.inline{display:flex;align-items:center;gap:7px;font-size:14px}
.chk{display:inline-flex;align-items:center;gap:7px;font-size:14px;cursor:pointer;
  padding:6px 9px;border:1px solid var(--line);border-radius:8px;background:#fff;user-select:none}
.chk input{width:17px;height:17px;accent-color:var(--blue)}
.chk.on{background:var(--blue-bg);border-color:var(--blue-line)}
.chk.gon{background:var(--green-bg);border-color:var(--green-line)}
.chkrow{display:flex;flex-wrap:wrap;gap:8px}

/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:none;
  border-radius:8px;padding:10px 14px;font-size:14px;font-weight:600;cursor:pointer;line-height:1}
.btn:active{transform:translateY(1px)}
.btn-blue{background:var(--blue);color:#fff} .btn-blue:hover{background:var(--blue-d)}
.btn-green{background:var(--green);color:#fff} .btn-green:hover{background:var(--green-d)}
.btn-gh{background:#fff;color:var(--navy);border:1px solid var(--line)} .btn-gh:hover{background:#f3f6fb}
.btn-dn{background:#fff;color:var(--red);border:1px solid var(--red-line)} .btn-dn:hover{background:var(--red-bg)}
.btn-sm{padding:8px 11px;font-size:13px}
.btn-ic{padding:8px;border-radius:7px}
.bar{display:flex;flex-wrap:wrap;gap:9px;align-items:center}

/* tables */
.tw{overflow-x:auto;-webkit-overflow-scrolling:touch}
table.t{width:100%;border-collapse:collapse;font-size:13px}
table.t th{font-weight:600;font-size:10.5px;text-transform:uppercase;letter-spacing:.4px;
  padding:8px 9px;text-align:left;white-space:nowrap;color:#fff;background:var(--navy)}
table.t.blue th{background:var(--blue-d)}
table.t.red th{background:var(--red)}
table.t.green th{background:var(--green)}
table.t td{padding:7px 9px;border-bottom:1px solid var(--line2);white-space:nowrap}
table.t tbody tr:nth-child(even){background:#fafbfd}
table.t input,table.t select{border:1px solid var(--line);border-radius:6px;padding:6px 7px;
  font-size:13px;width:100%;min-width:64px;background:#fff;outline:none}
table.t input:focus{border-color:var(--blue)}
.vol{background:var(--yellow)!important}
.vol input{background:transparent;border-color:#dcca7e;font-weight:700}
.emrow td{background:var(--red-bg)}
.emrow .nm{color:var(--red);font-weight:700;white-space:normal}

.note{display:flex;gap:9px;background:var(--red-bg);border:1px solid var(--red-line);
  border-radius:9px;padding:10px 12px;font-size:12px;color:#7a2420;line-height:1.5;margin:0 0 13px}
.note .ic{flex:0 0 auto;margin-top:1px}

/* graph */
.legendrow{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:10px}
.lg{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:5px 9px;
  border:1px solid var(--line);border-radius:18px;cursor:pointer;background:#fff;color:var(--ink)}
.lg.off{opacity:.4}
.lg svg{display:block}
.graphwrap{border:1px solid var(--blue-line);border-radius:10px;padding:10px 6px 4px;background:#fff}
.empty{text-align:center;color:var(--muted);padding:24px;font-size:13.5px}
.legendkey{display:flex;flex-wrap:wrap;gap:13px;font-size:12px;color:var(--muted);margin-top:9px}
.legendkey span{display:inline-flex;align-items:center;gap:6px}

.savecard{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--line);
  border-radius:11px;margin-bottom:9px;background:#fff}
.savecard .av{width:40px;height:40px;border-radius:10px;background:var(--blue-bg);color:var(--blue-d);
  display:flex;align-items:center;justify-content:center;flex:0 0 auto}
.savecard .meta{flex:1;min-width:0}
.savecard .nm{font-weight:700;font-size:15px}
.savecard .sm{font-size:12px;color:var(--muted)}

.savebar{position:fixed;left:0;right:0;bottom:0;background:#fff;border-top:1px solid var(--line);
  padding:9px 13px;display:flex;gap:9px;align-items:center;z-index:28;box-shadow:0 -2px 12px rgba(20,30,60,.07)}
.savebar .st{font-size:12px;color:var(--muted);margin-right:auto;display:flex;align-items:center;gap:6px}
.savebar .st.ok{color:var(--green)}

.subh{font-size:12px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.4px;margin:4px 0 8px}
.disclaim{font-size:10.5px;color:var(--muted);text-align:center;line-height:1.6;padding:4px 10px}
.printbtn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:#fff;color:var(--navy);border-radius:8px;padding:8px 12px;font-size:13px;font-weight:600;cursor:pointer}
.printbtn:hover{background:#f3f6fb}

/* journal-style giva table */
.gtbl{border:1px solid #c4c8cd;border-radius:8px;overflow-x:auto}
.gtbl-inner{min-width:760px}
.grow{display:grid;grid-template-columns:minmax(190px,1.3fr) 180px 150px 210px 104px;align-items:center}
.grow>div{padding:8px 12px;display:flex;align-items:center;gap:8px}
.ghead{background:#c9ccd1;font-weight:700;font-size:11.5px;color:#3a3f45}
.gmed{background:#e7e9ec;border-top:1px solid #d3d6da}
.gmed .gname{color:var(--blue);font-weight:700}
.ggiva{background:#fff;border-top:1px solid #eceef1}
.ggiva .gname{color:#555;font-weight:600}
.gbox{min-width:66px;text-align:left;background:#dcdfe3;border:1px solid #c4c8cd;border-radius:4px;padding:7px 9px;font-weight:700;color:#3a3f45}
.ginp{width:74px;border:1px solid #b7bcc2;border-radius:4px;padding:7px 8px;font-size:14px;outline:none}
.ginp:focus{border-color:var(--blue)}
.gunit{color:#7a7f86;font-size:12.5px}
.gtime{position:relative}
.gtime .cal{color:var(--blue)}
.groute{width:100%;background:#e9ebed;border:1px solid #c4c8cd;border-radius:4px;padding:8px 9px;font-size:13.5px;color:#4a4f56;outline:none}
.gminus,.gplus{border:none;border-radius:5px;padding:8px 12px;font-weight:800;color:#fff;cursor:pointer;display:inline-flex;align-items:center}
.gminus{background:#e8563d}.gminus:hover{background:#d3402a}
.gplus{background:#2b8fd6}.gplus:hover{background:#1f77b8}
.gdelmed{background:#fff;border:1px solid var(--red-line);color:var(--red);border-radius:5px;padding:7px 9px;cursor:pointer}

.printall{display:none}
@media print{
  .hd,.tabs,.savebar,.no-print{display:none!important}
  .aj,.wrap{background:#fff}
  .wrap{padding:0;max-width:100%}
  .sheet{border:none;margin:0}
  .graphwrap{border:1px solid #999}
  .gtbl-inner{min-width:0}
  .printing-all .tabcontent{display:none}
  .printing-all .printall{display:block}
  .printall .sheet{break-after:page;page-break-after:always}
  .printall .sheet:last-child{break-after:auto;page-break-after:auto}
  @page{margin:12mm}
}
`;

/* ================================ DATA ================================ */
const todayStr = () => new Date().toISOString().slice(0, 10);
const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const num = (v) => { if (v === "" || v == null) return null; const n = parseFloat(String(v).replace(",", ".")); return Number.isFinite(n) ? n : null; };
const vol1Str = (w, mgkg, konc) => { if (w == null || num(mgkg) == null || !num(konc)) return ""; return "(= " + (w * num(mgkg) / num(konc)).toLocaleString("sv-SE", { maximumFractionDigits: 2 }) + " ml)"; };

const EMERGENCY = [
  { namn: "Adrenalin (låg dos)", mgkg: "0.01", mgml: "1", vag: "IV", klar: false },
  { namn: "Adrenalin (hög dos)", mgkg: "0.1", mgml: "1", vag: "IV", klar: false },
  { namn: "Atropin", mgkg: "0.04", mgml: "0.5", vag: "IV", klar: false },
  { namn: "Glykopyrrolat", mgkg: "0.01", mgml: "0.2", vag: "IV", klar: false },
  { namn: "Lidokain 2%", mgkg: "2", mgml: "20", vag: "IV", klar: false },
];

// Läkemedelsformulär ur klinikens doseringsschema. konc = mg/mL.
// µg/kg-doser är omräknade till mg/kg. Alla värden går att ändra per rad.
const FORMULARY = [
  // α₂-agonist / sedering
  { grupp: "α₂-agonist / sedering", namn: "Cepedex (dexmedetomidin)", konc: "0.5", doser: [
      { label: "Katt äldre/sjuk – sedering 5 µg/kg", mgkg: "0.005" },
      { label: "Katt frisk – sedering 10 µg/kg", mgkg: "0.010" },
      { label: "Katt frisk – sedering 15 µg/kg", mgkg: "0.015" },
      { label: "Djup sedering hund 2,5 µg/kg", mgkg: "0.0025" },
      { label: "Djup sedering hund 5 µg/kg", mgkg: "0.005" },
      { label: "Djup sedering katt 40 µg/kg", mgkg: "0.040" },
  ] },
  { grupp: "α₂-agonist / sedering", namn: "Dexdomitor (dexmedetomidin)", konc: "0.5", doser: [
      { label: "Katt äldre/sjuk – sedering 5 µg/kg", mgkg: "0.005" },
      { label: "Katt frisk – sedering 10 µg/kg", mgkg: "0.010" },
      { label: "Katt frisk – sedering 15 µg/kg", mgkg: "0.015" },
      { label: "Djup sedering hund 2,5 µg/kg", mgkg: "0.0025" },
      { label: "Djup sedering hund 5 µg/kg", mgkg: "0.005" },
      { label: "Djup sedering katt 40 µg/kg", mgkg: "0.040" },
  ] },
  // Opioider
  { grupp: "Opioider", namn: "Insistor (metadon)", konc: "10", doser: [
      { label: "0,2 mg/kg", mgkg: "0.2" }, { label: "0,3 mg/kg", mgkg: "0.3" }, { label: "0,4 mg/kg", mgkg: "0.4" },
  ] },
  { grupp: "Opioider", namn: "Metadon (Semfortan)", konc: "10", doser: [
      { label: "0,2 mg/kg", mgkg: "0.2" }, { label: "0,3 mg/kg", mgkg: "0.3" }, { label: "0,4 mg/kg", mgkg: "0.4" },
  ] },
  { grupp: "Opioider", namn: "Buprenorfin (Vetergesic/Bupaq)", konc: "0.3", doser: [
      { label: "6 µg/kg", mgkg: "0.006" }, { label: "8 µg/kg", mgkg: "0.008" }, { label: "10 µg/kg", mgkg: "0.010" }, { label: "12 µg/kg", mgkg: "0.012" },
  ] },
  { grupp: "Opioider", namn: "Fentanyl (Fentadon)", konc: "0.05", doser: [
      { label: "Bolus 1 µg/kg", mgkg: "0.001" }, { label: "Bolus 2,5 µg/kg (start)", mgkg: "0.0025" }, { label: "Bolus 5 µg/kg", mgkg: "0.005" },
  ] },
  { grupp: "Opioider", namn: "Butorfanol", konc: "10", doser: [
      { label: "0,05 mg/kg", mgkg: "0.05" }, { label: "0,1 mg/kg", mgkg: "0.1" }, { label: "0,2 mg/kg", mgkg: "0.2" },
  ] },
  // NSAID & analgesi
  { grupp: "NSAID & analgesi", namn: "Karprofen (Rimadyl/Norokarp)", konc: "50", doser: [
      { label: "4 mg/kg (inj.)", mgkg: "4" }, { label: "2 mg/kg p.o.", mgkg: "2" },
  ] },
  { grupp: "NSAID & analgesi", namn: "Meloxicam (Metacam)", konc: "5", doser: [
      { label: "1:a dos 0,2 mg/kg", mgkg: "0.2" }, { label: "Underhåll 0,1 mg/kg", mgkg: "0.1" },
  ] },
  { grupp: "NSAID & analgesi", namn: "Metamizolnatrium (Vetalgin)", konc: "500", doser: [
      { label: "25 mg/kg (ej katt)", mgkg: "25" }, { label: "50 mg/kg (ej katt)", mgkg: "50" },
  ] },
  { grupp: "NSAID & analgesi", namn: "Onsior (robenacoxib)", konc: "20", doser: [
      { label: "2 mg/kg s.c.", mgkg: "2" },
  ] },
  { grupp: "NSAID & analgesi", namn: "Prevomax (maropitant)", konc: "10", doser: [
      { label: "1 mg/kg s.c./i.v.", mgkg: "1" },
  ] },
  // Lokalanestetika
  { grupp: "Lokalanestetika", namn: "Bupivacain (Marcain)", konc: "5", doser: [
      { label: "1 mg/kg", mgkg: "1" }, { label: "2 mg/kg", mgkg: "2" },
  ] },
  { grupp: "Lokalanestetika", namn: "Lidokain (Xylokain 20)", konc: "20", doser: [
      { label: "Bolus 0,5 mg/kg", mgkg: "0.5" }, { label: "Bolus 1 mg/kg", mgkg: "1" }, { label: "Bolus 2 mg/kg", mgkg: "2" },
      { label: "Lokalbedövning 1–2 mg/kg", mgkg: "2" }, { label: "Antiarytmi bolus 2 mg/kg", mgkg: "2" },
  ] },
  // Bensodiazepiner
  { grupp: "Bensodiazepiner", namn: "Diazepam (Stesolid)", konc: "5", doser: [
      { label: "0,1 mg/kg", mgkg: "0.1" }, { label: "0,3 mg/kg", mgkg: "0.3" }, { label: "0,5 mg/kg", mgkg: "0.5" },
  ] },
  { grupp: "Bensodiazepiner", namn: "Midazolam", konc: "5", doser: [
      { label: "0,1 mg/kg", mgkg: "0.1" }, { label: "0,2 mg/kg", mgkg: "0.2" }, { label: "0,3 mg/kg", mgkg: "0.3" },
  ] },
  // Induktion
  { grupp: "Induktion", namn: "Alfaxalon (Alfaxan)", konc: "10", doser: [
      { label: "Hund premed 2 mg/kg", mgkg: "2" }, { label: "Hund ej premed 3 mg/kg", mgkg: "3" },
      { label: "Katt premed 2–3 mg/kg", mgkg: "2.5" }, { label: "Katt ej premed 4–5 mg/kg", mgkg: "4.5" },
  ] },
  { grupp: "Induktion", namn: "Ketaminol (ketamin)", konc: "50", doser: [
      { label: "Bolus 0,5 mg/kg i.v.", mgkg: "0.5" }, { label: "Bolus 1 mg/kg i.v.", mgkg: "1" },
      { label: "Induktion 3 mg/kg", mgkg: "3" }, { label: "Induktion 5 mg/kg", mgkg: "5" },
      { label: "Diss. anestesi katt 4 mg/kg i.m.", mgkg: "4" },
  ] },
  { grupp: "Induktion", namn: "Propovet (propofol)", konc: "10", doser: [
      { label: "Hund premed 2 mg/kg", mgkg: "2" }, { label: "Hund premed 4 mg/kg", mgkg: "4" },
      { label: "Hund ej premed 6 mg/kg", mgkg: "6" }, { label: "Katt premed 4 mg/kg", mgkg: "4" },
  ] },
  // Reverseringsmedel
  { grupp: "Reverseringsmedel", namn: "Revetor (atipamezol)", konc: "5", doser: [] },
  { grupp: "Reverseringsmedel", namn: "Flumazenil", konc: "0.1", doser: [
      { label: "0,01 mg/kg (1×/tim)", mgkg: "0.01" },
  ] },
  { grupp: "Reverseringsmedel", namn: "Naloxon", konc: "0.4", doser: [
      { label: "0,01 mg/kg", mgkg: "0.01" }, { label: "0,02 mg/kg", mgkg: "0.02" }, { label: "Återupplivning 0,04 mg/kg", mgkg: "0.04" },
  ] },
];
const DRUG_GROUPS = ["α₂-agonist / sedering", "Opioider", "NSAID & analgesi", "Lokalanestetika", "Bensodiazepiner", "Induktion", "Reverseringsmedel"];
const ADM_ROUTES = ["Intravenöst", "Intramuskulärt", "Intramuskulärt annan plats", "Subkutant", "Per os", "Inhalation", "Lokalt", "Epidural", "OTM"];

// Färdiga protokoll ur klinikens egna sheets. Varje med-rad: [läkemedel, konc(mg/ml), mg/kg, adm.väg, notering].
// mg/kg omräknat från ml/kg där sheetet angav volym. Riktvärden – kontrollera mot vial/rutiner, individanpassa.
const PROTOCOLS = [
  { namn: "Kastration katt (NK)", art: "Katt", varning: "Hankatt (NK ♂) och honkatt/OHE (NK ♀). Ketamin endast till honkatt (OHE). Ketamindos ungefärlig – individanpassa. Lokalbedövning + maropitant/NSAID till båda.", meds: [
    ["Dexdomitor (dexmedetomidin)", "0.5", "0.025", "Intramuskulärt", "α₂-agonist · 0,05 ml/kg"],
    ["Metadon (Semfortan)", "10", "0.3", "Intramuskulärt", "Opioid · 0,03 ml/kg"],
    ["Midazolam", "5", "0.15", "Intramuskulärt", "Bensodiazepin · 0,03 ml/kg"],
    ["Ketaminol (ketamin)", "50", "3", "Intravenöst", "Endast honkatt/OHE · ~0,06 ml/kg"],
  ] },
  { namn: "Pyometra (hund & katt)", art: "Båda", varning: "Högrisk-/akutpatient, ofta nedsatt allmäntillstånd, hemodynamiskt instabil. Stabilisera och övervaka noga; titrera. Opioid = välj en. CRI Lidokain EJ till katt.", meds: [
    ["Midazolam", "5", "0.1", "Intravenöst", "Sedering · 0,02–0,06 ml/kg"],
    ["Butorfanol", "10", "0.1", "Intramuskulärt", "Opioid (välj en) · 0,005–0,02 ml/kg"],
    ["Metadon (Semfortan)", "10", "0.2", "Intramuskulärt", "Opioid (välj en) · 0,02–0,04 ml/kg"],
    ["Fentanyl (Fentadon)", "0.05", "0.002", "Intravenöst", "Opioid (välj en) · 0,02–0,1 ml/kg"],
    ["Propovet (propofol)", "10", "2", "Intravenöst", "Induktion + lågdos Ketalar + Midazolam"],
  ] },
  { namn: "Urinstopp – katt", art: "Katt", varning: "Totalt urinstopp – akut prioriteringspatient. UNDVIK Ketalar (takykardi, ↑BT, njurpåverkan). NO NSAID tills njurvärden klara och patienten rehydrerad. Preoxygenera 4–5 min. RAC 3 ml/kg/h – undvik bolusar.", meds: [
    ["Buprenorfin (Vetergesic/Bupaq)", "0.3", "0.009", "Subkutant", "Smärtlindring · 0,02–0,04 ml/kg"],
    ["Metadon (Semfortan)", "10", "0.2", "Intravenöst", "Om mycket ont · 0,02 ml/kg"],
    ["Midazolam", "5", "0.15", "Intravenöst", "Induktion"],
    ["Propovet (propofol)", "10", "2", "Intravenöst", "Sakta i.v. till effekt 1–3 mg/kg"],
  ] },
  { namn: "Cirkulatoriskt påverkad katt", art: "Katt", varning: "Ostabil cirkulation (sepsis/SIRS, trauma, blödning). Stabilisera blodtryck och temperatur INNAN anestesi. Höga doser fentanyl → andningsdepression, var beredd på övertrycksventilation.", meds: [
    ["Metadon (Semfortan)", "10", "0.1", "Intramuskulärt", "Premed · 0,1–0,5 mg/kg"],
    ["Ketaminol (ketamin)", "50", "5", "Intravenöst", "Induktion + Diazepam i samma spruta"],
    ["Diazepam (Stesolid)", "5", "0.3", "Intravenöst", "Induktion med Ketalar"],
    ["Fentanyl (Fentadon)", "0.05", "0.002", "Intravenöst", "Bolus 2 µg/kg → infusion 10–20 µg/kg/h"],
  ] },
  { namn: "Leverpatologi (hund & katt)", art: "Båda", varning: "Nedsatt leverfunktion → minskad läkemedelsmetabolism: HALV DOS. Koagulationsprofil innan kirurgi. Håll varmt. Ofta hypoglykemi → monitorera glukos. Hypoalbuminemi → risk för lungödem.", meds: [
    ["Metadon (Semfortan)", "10", "0.1", "Intramuskulärt", "Premed (halv dos) · 0,1–0,5 mg/kg"],
    ["Midazolam", "5", "0.1", "Intravenöst", "Med förnuft – lägre dos"],
    ["Propovet (propofol)", "10", "1", "Intravenöst", "Till effekt 1–3 mg/kg"],
    ["Fentanyl (Fentadon)", "0.05", "0.002", "Intravenöst", "Bolus 2 µg/kg → infusion 5–15 µg/kg/h"],
  ] },
  { namn: "Njurpatologi (hund & katt)", art: "Båda", varning: "Njursvikt. NSAID KONTRAINDICERAT. Ketamin/norketamin utsöndras renalt → använd INTE. Undvik Medetomidin. Kalium >6,0 → stabilisera innan sövning. MAP >70.", meds: [
    ["Metadon (Semfortan)", "10", "0.1", "Intramuskulärt", "Premed · 0,1–0,5 mg/kg"],
    ["Midazolam", "5", "0.1", "Intravenöst", "0,1–0,2 mg/kg"],
    ["Propovet (propofol)", "10", "1", "Intravenöst", "Hund 1–5 mg/kg till effekt"],
    ["Alfaxalon (Alfaxan)", "10", "2.5", "Intravenöst", "Hund 2–3 mg/kg (alternativ)"],
  ] },
  { namn: "Unga & geriatriska (hund & katt)", art: "Båda", varning: "Åldersrelaterade skillnader. Unga: fasta INTE neonatala/sucklings, hypoglykemi-risk – mät glukos. Sänk doser (lever/njur omogna). Geriatriska: reglera doser efter organfunktion, hantera varsamt.", meds: [
    ["Butorfanol", "10", "0.1", "Intramuskulärt", "Premed"],
    ["Midazolam", "5", "0.1", "Intramuskulärt", "Premed / kan reverseras"],
    ["Propovet (propofol)", "10", "2", "Intravenöst", "Induktion (metaboliseras i lungorna)"],
  ] },
  { namn: "Traumapatient (hund & katt)", art: "Båda", varning: "Fysiologiskt instabila, ofta hypovolemi. Stabilisera FÖRST, kirurgi sedan. Ej fastande → aspirationsrisk, intubera snabbt. Vid kardiovaskulär instabilitet: INTE NSAID, acepromazin eller alfa-2!", meds: [
    ["Metadon (Semfortan)", "10", "0.2", "Intramuskulärt", "Opioid +/- bensodiazepin"],
    ["Midazolam", "5", "0.2", "Intravenöst", "+/- bensodiazepin"],
    ["Propovet (propofol)", "10", "2", "Intravenöst", "Eller Alfaxan – låg dos, intubera snabbt"],
    ["Alfaxalon (Alfaxan)", "10", "2", "Intravenöst", "Alternativ till propofol"],
  ] },
  { namn: "Mitralisinsufficiens (MI) – hund", art: "Hund", varning: "MÅL: minska vasokonstriktion, bevara/lätt höj HF, bibehåll kontraktilitet. UNDVIK bradykardi, takykardi, vasokonstriktion. Använd INTE α₂. Ge EJ Ketalar vid takykardi. Lidokain kontraindicerat vid 3:e gradens AV-block. Preoxygenera.", meds: [
    ["Butorfanol", "10", "0.2", "Intramuskulärt", "Opioid i.m."],
    ["Metadon (Semfortan)", "10", "0.2", "Intramuskulärt", "Alternativ opioid · 0,2–0,5 mg/kg"],
    ["Midazolam", "5", "0.2", "Intravenöst", "Induktion"],
    ["Alfaxalon (Alfaxan)", "10", "2", "Intravenöst", "Bra val – bibehåller kontraktilitet & HF"],
    ["Ketaminol (ketamin)", "50", "2", "Intravenöst", "2–5 mg/kg – EJ vid takykardi"],
  ] },
  { namn: "Hypertrofisk kardiomyopati (HCM) – katt", art: "Katt", varning: "Vanligaste hjärtsjukdomen hos katt, ofta med hypertyreos. Ketalar KONTRAINDICERAT. Undvik acepromazin. Stressa INTE – premedicinera väl. Eftersträva normal–lätt ökad vaskulär resistens, normal–lägre HF.", meds: [
    ["Butorfanol", "10", "0.3", "Intramuskulärt", "0,2–0,4 mg/kg"],
    ["Metadon (Semfortan)", "10", "0.2", "Intramuskulärt", "Alternativ opioid"],
    ["Midazolam", "5", "0.2", "Intramuskulärt", "Premed"],
    ["Propovet (propofol)", "10", "2", "Intravenöst", "Eller Alfaxan"],
    ["Fentanyl (Fentadon)", "0.05", "0.0015", "Intravenöst", "1–2 µg/kg"],
  ] },
];


// graphable series matching her teckenförklaring
const SERIES = [
  { k: "hf", label: "HF", sym: "fill", color: "#c0392b" },
  { k: "af", label: "AF", sym: "open", color: "#2a6fb5" },
  { k: "sap", label: "SAP", sym: "down", color: "#2e8b57" },
  { k: "map", label: "MAP", sym: "dash", color: "#6b46c1" },
  { k: "dap", label: "DAP", sym: "up", color: "#d97a16" },
  { k: "doppler", label: "Doppler", sym: "dop", color: "#0e8a8a" },
];

const blankReading = () => ({
  id: uid("v_"), tid: "", hf: "", af: "", sap: "", map: "", dap: "", doppler: "",
  isosevo: "", o2n2o: "", ogon: "", palp: "", kak: "", etco2: "", spo2: "", temp: "", note: "",
});
const blankRecovery = () => ({ id: uid("u_"), tid: "", hf: "", af: "", temp: "", smarta: "" });

const emptyCase = () => ({
  id: uid("case_"), createdAt: new Date().toISOString(),
  patient: {
    datum: todayStr(), atgard: "", veterinar: "", namn: "", agare: "", ras: "",
    alder: "", kon: "", vikt: "",
    anamnes: "", temperament: "", hf: "", af: "", mm: "", crt: "", bp: "", temp: "", avvikande: "",
    asa: "",
  },
  setup: {
    ivTyp: "", ivHastighet: "", ivKateter: "", ivPlacering: "", overvaganden: "",
    tub: "", kuffad: "", storlek: "", ogonSmorda: "", andningssystem: "",
    dropp: "", estBlodvolym: "", ivLage: "",
  },
  premed: { drugs: [], emergency: EMERGENCY.map((e) => ({ ...e })), local: [], kommentarer: "" },
  monitor: {
    startTime: null, readings: [], anteckningar: "",
    svalgPlacerad: false, svalgBorttagen: false, kompressIn: "", kompressUt: "",
    uppvakInstr: "", recovery: [],
  },
  timeout: {
    namn: false, procedur: false, steril: false, optid: "", lokal: "", lokalVar: "", risker: "",
    rows: [{ datum: "", vikt: "", preparat: "", tid: "" }], kompresserStart: "",
    ratt: false, kompGivna: "", kompAvr: "", nalGivna: "", nalAvr: "",
    problem: "", risk: "", hantering: "", urinblasa: "", urinblasaKl: "",
    behov: {}, extuberad: "", vaken: "", vatske: "", kopplasBort: "", cri: "", sanks: "", totalRAC: "",
    monrows: [{ tid: "", temp: "", allman: "", pulse: "", blodtryck: "", af: "", slhcrt: "", blodning: "" }],
    matOk: "", matVad: "", erbjudits: "", matKl: "", villeAta: "", rastad: "", urin: "", avf: "", notis: "",
    overDV: "", overDSS: "", kanyl: "", hemgang: "", hemgangKl: "", inskrivning: "", bur: "", overTill: "",
    checklist: {}, ovrigKomm: "",
  },
});

/* ============================ STORAGE (localStorage) ============================ */
async function storeSet(c) {
  try { localStorage.setItem("case:" + c.id, JSON.stringify(c)); return true; } catch (e) { return false; }
}
async function storeList() {
  try {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf("case:") === 0) { try { out.push(JSON.parse(localStorage.getItem(k))); } catch (e) {} }
    }
    return out.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  } catch (e) { return []; }
}
async function storeDel(id) {
  try { localStorage.removeItem("case:" + id); return true; } catch (e) { return false; }
}
async function loadCustom() { try { const v = localStorage.getItem("customdoses"); return v ? JSON.parse(v) : {}; } catch (e) { return {}; } }
async function saveCustom(obj) { try { localStorage.setItem("customdoses", JSON.stringify(obj)); return true; } catch (e) { return false; } }
async function loadProtocols() { try { const v = localStorage.getItem("protocols"); return v ? JSON.parse(v) : []; } catch (e) { return []; } }
async function saveProtocols(a) { try { localStorage.setItem("protocols", JSON.stringify(a)); return true; } catch (e) { return false; } }

/* ============================ UI ATOMS ============================ */
const Field = ({ label, children }) => <div className="field"><label>{label}</label>{children}</div>;
const Txt = ({ value, onChange, ...p }) => <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...p} />;
const N = ({ value, onChange, ...p }) => <input inputMode="decimal" value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...p} />;
const Sel = ({ value, onChange, opts, ...p }) => (
  <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...p}>
    {opts.map((o) => <option key={o} value={o}>{o || "—"}</option>)}
  </select>
);
const Check = ({ on, onChange, children, tone }) => (
  <label className={"chk" + (on ? (tone === "green" ? " gon" : " on") : "")}>
    <input type="checkbox" checked={!!on} onChange={(e) => onChange(e.target.checked)} />{children}
  </label>
);
const Sec = ({ tone, n, children }) => (
  <div className={"sec " + tone}>{n != null && <span className="n">{n}</span>}{children}</div>
);

/* ============================ GRAPH ============================ */
function symbolDot(sym, color) {
  return function Dot(props) {
    const { cx, cy } = props;
    if (cx == null || cy == null) return null;
    const k = props.key;
    if (sym === "fill") return <circle key={k} cx={cx} cy={cy} r={4} fill={color} />;
    if (sym === "open") return <circle key={k} cx={cx} cy={cy} r={4} fill="#fff" stroke={color} strokeWidth={1.7} />;
    if (sym === "down") return <path key={k} d={`M${cx - 4.5},${cy - 4} L${cx + 4.5},${cy - 4} L${cx},${cy + 4.5} Z`} fill={color} />;
    if (sym === "up") return <path key={k} d={`M${cx - 4.5},${cy + 4} L${cx + 4.5},${cy + 4} L${cx},${cy - 4.5} Z`} fill={color} />;
    if (sym === "dash") return <rect key={k} x={cx - 5.5} y={cy - 1.4} width={11} height={2.8} fill={color} />;
    if (sym === "dop") return <g key={k}><circle cx={cx} cy={cy} r={5.2} fill="#fff" stroke={color} strokeWidth={1.4} /><path d={`M${cx - 2.6},${cy - 2.2} L${cx},${cy + 2.6} L${cx + 2.6},${cy - 2.2}`} stroke={color} fill="none" strokeWidth={1.3} /></g>;
    return <circle key={k} cx={cx} cy={cy} r={3} fill={color} />;
  };
}
function Sym({ sym, color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      {sym === "fill" && <circle cx="8" cy="8" r="4" fill={color} />}
      {sym === "open" && <circle cx="8" cy="8" r="4" fill="#fff" stroke={color} strokeWidth="1.7" />}
      {sym === "down" && <path d="M3.5,4 L12.5,4 L8,12.5 Z" fill={color} />}
      {sym === "up" && <path d="M3.5,12 L12.5,12 L8,3.5 Z" fill={color} />}
      {sym === "dash" && <rect x="2.5" y="6.6" width="11" height="2.8" fill={color} />}
      {sym === "dop" && <g><circle cx="8" cy="8" r="5.2" fill="#fff" stroke={color} strokeWidth="1.4" /><path d="M5.4,5.8 L8,10.6 L10.6,5.8" stroke={color} fill="none" strokeWidth="1.3" /></g>}
    </svg>
  );
}

function VitalsGraph({ readings, show, setShow }) {
  const data = readings.map((r, i) => ({
    i, tid: r.tid || (i + 1),
    hf: num(r.hf), af: num(r.af), sap: num(r.sap), map: num(r.map), dap: num(r.dap), doppler: num(r.doppler),
  }));
  const hasPoints = data.some((d) => SERIES.some((s) => d[s.k] != null));
  return (
    <>
      <div className="legendrow">
        {SERIES.map((s) => (
          <button key={s.k} className={"lg" + (show[s.k] ? "" : " off")} onClick={() => setShow((p) => ({ ...p, [s.k]: !p[s.k] }))}>
            <Sym sym={s.sym} color={s.color} />{s.label}
          </button>
        ))}
      </div>
      <div className="graphwrap">
        {data.length && hasPoints ? (
          <div style={{ width: "100%", height: 360 }}>
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 8, right: 10, left: -10, bottom: 4 }}>
                <CartesianGrid stroke="#dbe6f3" />
                <XAxis dataKey="i" type="number" domain={[-0.3, data.length - 0.7]}
                  ticks={data.map((d) => d.i)} tickFormatter={(v) => (data[v] ? data[v].tid : "")}
                  tick={{ fontSize: 10.5 }} stroke="#9fb2cd"
                  label={{ value: "TID", position: "insideBottomRight", fontSize: 10, fill: "#9fb2cd" }} />
                <YAxis domain={[0, 220]} ticks={[10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210]}
                  tick={{ fontSize: 10.5 }} stroke="#9fb2cd" width={34} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--line)" }}
                  labelFormatter={(v) => "Tid: " + (data[v] ? data[v].tid : v)} />
                {SERIES.filter((s) => show[s.k]).map((s) => (
                  <Line key={s.k} type="linear" dataKey={s.k} name={s.label} stroke={s.color} strokeWidth={1.6}
                    dot={symbolDot(s.sym, s.color)} connectNulls isAnimationActive={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty"><Activity size={28} style={{ opacity: .4 }} /><br />Kurvan ritas automatiskt så snart du lägger till en mätning med HF/AF/blodtryck.</div>
        )}
      </div>
      <div className="legendkey">
        {SERIES.map((s) => <span key={s.k}><Sym sym={s.sym} color={s.color} /> {s.label}</span>)}
      </div>
    </>
  );
}

/* ============================ APP ============================ */
export default function App() {
  const [tab, setTab] = useState("premed");
  const [c, setC] = useState(emptyCase);
  const [saved, setSaved] = useState([]);
  const [saveState, setSaveState] = useState("idle");
  const [show, setShow] = useState({ hf: true, af: true, sap: true, map: true, dap: true, doppler: false });
  const [customDoses, setCustomDoses] = useState({});
  const [ownProtocols, setOwnProtocols] = useState([]);
  const [activeWarning, setActiveWarning] = useState("");
  const [printAll, setPrintAll] = useState(false);
  const first = useRef(true); const timer = useRef(null);

  const refresh = useCallback(async () => setSaved(await storeList()), []);
  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { loadCustom().then(setCustomDoses); loadProtocols().then(setOwnProtocols); }, []);
  useEffect(() => {
    const done = () => setPrintAll(false);
    window.addEventListener("afterprint", done);
    return () => window.removeEventListener("afterprint", done);
  }, []);
  const printAllPages = () => { setPrintAll(true); setTimeout(() => window.print(), 200); };

  const applyProtocol = (p) => {
    const rows = (p.meds || []).map((m) => {
      const inForm = FORMULARY.find((f) => f.namn === m[0]);
      return { id: uid("d_"), medicin: inForm ? m[0] : "__annat__", custom: inForm ? "" : (m[0] || ""), konc: m[1] || "", mgkg: m[2] || "", dosText: m[4] || "", admvag: m[3] || "", tid: "", klar: false, givor: [] };
    });
    setC((prev) => ({ ...prev, premed: { ...prev.premed, drugs: rows } }));
    setActiveWarning(p.varning || "");
  };
  const saveOwnProtocol = async (namn) => {
    const meds = c.premed.drugs.filter((d) => d.medicin).map((d) => [
      d.medicin === "__annat__" ? (d.custom || "") : d.medicin, d.konc || "", d.mgkg || "", d.admvag || "", d.dosText || "",
    ]);
    if (!namn || !meds.length) return;
    const next = [...ownProtocols, { id: uid("pr_"), namn, art: "", varning: "Eget protokoll – kontrollera doser mot rutiner och individanpassa.", meds, own: true }];
    setOwnProtocols(next); await saveProtocols(next);
  };
  const deleteOwnProtocol = async (id) => { const next = ownProtocols.filter((p) => p.id !== id); setOwnProtocols(next); await saveProtocols(next); };

  const addCustomDose = async (medicin, label, mgkg) => {
    if (!medicin || medicin === "__annat__" || !mgkg) return;
    const clean = { label: (label && label.trim()) ? label.trim() : (mgkg + " mg/kg"), mgkg: String(mgkg) };
    const list = customDoses[medicin] || [];
    if (list.some((o) => o.mgkg === clean.mgkg && o.label === clean.label)) return;
    const next = { ...customDoses, [medicin]: [...list, clean] };
    setCustomDoses(next); await saveCustom(next);
  };
  const clearCustomDoses = async (medicin) => {
    const next = { ...customDoses }; delete next[medicin];
    setCustomDoses(next); await saveCustom(next);
  };
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const m = c.patient.namn || c.monitor.readings.length || c.premed.drugs.length || c.patient.atgard;
    if (!m) return;
    setSaveState("saving"); clearTimeout(timer.current);
    timer.current = setTimeout(async () => { await storeSet(c); setSaveState("saved"); refresh(); }, 700);
    return () => clearTimeout(timer.current);
  }, [c, refresh]);

  const set = (section, k, v) => setC((p) => ({ ...p, [section]: { ...p[section], [k]: v } }));
  const newCase = () => { setC(emptyCase()); setTab("premed"); setSaveState("idle"); };
  const loadCase = (cc) => { setC(JSON.parse(JSON.stringify(cc))); setTab("premed"); setSaveState("saved"); };
  const delCase = async (id) => { await storeDel(id); refresh(); if (id === c.id) newCase(); };

  const TABS = [
    { k: "premed", label: "Premed & induktion", Icon: Syringe, tone: "red" },
    { k: "monitor", label: "Övervakningsblad", Icon: Activity, tone: "" },
    { k: "timeout", label: "Time-out & uppvak", Icon: ClipboardCheck, tone: "green" },
    { k: "saved", label: "Sparade fall", Icon: FolderOpen, tone: "" },
  ];

  return (
    <div className="aj">
      <style>{CSS}</style>
      <header className="hd">
        <div className="hd-row">
          <div className="hd-mark"><PawPrint size={18} color="#fff" /></div>
          <div className="hd-t">Anestesijournal · Veteriet</div>
          {c.patient.namn && (
            <div className="hd-pt"><b>{c.patient.namn}</b>{c.patient.ras ? " · " + c.patient.ras : ""}<br />
              {c.patient.vikt ? c.patient.vikt + " kg" : ""}{c.patient.asa ? " · ASA " + c.patient.asa : ""}</div>
          )}
        </div>
      </header>
      <nav className="tabs">
        {TABS.map(({ k, label, Icon, tone }) => (
          <button key={k} className={"tab" + (tab === k ? " on " + tone : "")} onClick={() => setTab(k)}><Icon size={15} />{label}</button>
        ))}
      </nav>

      <main className={"wrap" + (printAll ? " printing-all" : "")}>
        <div className="tabcontent">
          {tab === "premed" && <PremedSheet c={c} set={set} setC={setC} customDoses={customDoses} addCustomDose={addCustomDose} clearCustomDoses={clearCustomDoses} ownProtocols={ownProtocols} applyProtocol={applyProtocol} saveOwnProtocol={saveOwnProtocol} deleteOwnProtocol={deleteOwnProtocol} activeWarning={activeWarning} />}
          {tab === "monitor" && <MonitorSheet c={c} set={set} setC={setC} show={show} setShow={setShow} />}
          {tab === "timeout" && <TimeoutSheet c={c} set={set} setC={setC} />}
          {tab === "saved" && <SavedTab saved={saved} curId={c.id} loadCase={loadCase} delCase={delCase} newCase={newCase} />}
        </div>
        {printAll && (
          <div className="printall">
            <PremedSheet c={c} set={set} setC={setC} customDoses={customDoses} addCustomDose={addCustomDose} clearCustomDoses={clearCustomDoses} ownProtocols={ownProtocols} applyProtocol={applyProtocol} saveOwnProtocol={saveOwnProtocol} deleteOwnProtocol={deleteOwnProtocol} activeWarning={activeWarning} />
            <MonitorSheet c={c} set={set} setC={setC} show={show} setShow={setShow} />
            <TimeoutSheet c={c} set={set} setC={setC} />
          </div>
        )}
      </main>

      <div className="savebar no-print">
        <div className={"st" + (saveState === "saved" ? " ok" : "")}>
          {saveState === "saving" && <><Clock size={14} /> Sparar…</>}
          {saveState === "saved" && <><CheckCircle2 size={14} /> Sparat automatiskt</>}
          {saveState === "idle" && <>Nytt fall</>}
        </div>
        <button className="btn btn-gh btn-sm" onClick={newCase}><Plus size={15} /> Nytt fall</button>
        <button className="btn btn-gh btn-sm" onClick={() => window.print()}><Printer size={15} /> Denna sida</button>
        <button className="btn btn-nav btn-sm" onClick={printAllPages}><Printer size={15} /> Alla sidor</button>
      </div>
    </div>
  );
}

/* ===================== PATIENT HEADER (shared) ===================== */
function PatientHead({ c, set }) {
  const p = c.patient;
  return (
    <div className="body grid">
      <div className="grid g3">
        <Field label="Datum"><Txt type="date" value={p.datum} onChange={(v) => set("patient", "datum", v)} /></Field>
        <Field label="Procedur / åtgärd"><Txt value={p.atgard} onChange={(v) => set("patient", "atgard", v)} /></Field>
        <Field label="Veterinär / DSS"><Txt value={p.veterinar} onChange={(v) => set("patient", "veterinar", v)} /></Field>
      </div>
      <div className="grid g3">
        <Field label="Namn"><Txt value={p.namn} onChange={(v) => set("patient", "namn", v)} /></Field>
        <Field label="Ägare"><Txt value={p.agare} onChange={(v) => set("patient", "agare", v)} /></Field>
        <Field label="Ras"><Txt value={p.ras} onChange={(v) => set("patient", "ras", v)} /></Field>
        <Field label="Ålder"><Txt value={p.alder} onChange={(v) => set("patient", "alder", v)} /></Field>
        <Field label="Kön"><Sel value={p.kon} onChange={(v) => set("patient", "kon", v)} opts={["", "Hane", "Hona", "Kastrerad hane", "Kastrerad hona"]} /></Field>
        <Field label="Vikt (kg)"><N value={p.vikt} onChange={(v) => set("patient", "vikt", v)} placeholder="kg" /></Field>
      </div>
      <Field label="Anamnes / pågående medicinering"><textarea value={p.anamnes} onChange={(e) => set("patient", "anamnes", e.target.value)} /></Field>
      <div>
        <div className="subh">Temperament & status</div>
        <div className="grid g4">
          <Field label="Temperament"><Txt value={p.temperament} onChange={(v) => set("patient", "temperament", v)} /></Field>
          <Field label="HF"><N value={p.hf} onChange={(v) => set("patient", "hf", v)} /></Field>
          <Field label="AF"><N value={p.af} onChange={(v) => set("patient", "af", v)} /></Field>
          <Field label="MM"><Txt value={p.mm} onChange={(v) => set("patient", "mm", v)} /></Field>
          <Field label="CRT"><Txt value={p.crt} onChange={(v) => set("patient", "crt", v)} /></Field>
          <Field label="Blodtryck (mmHg)"><Txt value={p.bp} onChange={(v) => set("patient", "bp", v)} /></Field>
          <Field label="Temp (°C)"><N value={p.temp} onChange={(v) => set("patient", "temp", v)} /></Field>
          <Field label="Avvikande prover"><Txt value={p.avvikande} onChange={(v) => set("patient", "avvikande", v)} /></Field>
        </div>
      </div>
    </div>
  );
}

/* ===================== PREMED & INDUKTION SHEET ===================== */
const ASA_TEXT = ["I: Normal, frisk", "II: Mild systemisk sjukdom", "III: Allvarlig systemisk sjukdom", "IV: Allvarlig sjukdom (konstant livshot)", "V: Moribund (döende)"];

function PremedSheet({ c, set, setC, customDoses, addCustomDose, clearCustomDoses, ownProtocols, applyProtocol, saveOwnProtocol, deleteOwnProtocol, activeWarning }) {
  const w = num(c.patient.vikt);
  const [selProto, setSelProto] = useState("");
  const [protoName, setProtoName] = useState("");
  const allProtos = [...PROTOCOLS.map((p, i) => ({ ...p, id: "builtin_" + i })), ...ownProtocols];
  const applySelected = () => {
    const p = allProtos.find((x) => x.id === selProto);
    if (!p) return;
    const hasDrugs = c.premed.drugs.some((d) => d.medicin);
    if (hasDrugs && !window.confirm("Ersätta nuvarande läkemedelslista med protokollet \"" + p.namn + "\"?")) return;
    applyProtocol(p);
  };
  const addDrug = () => setC((p) => ({ ...p, premed: { ...p.premed, drugs: [...p.premed.drugs, { id: uid("d_"), medicin: "", custom: "", konc: "", mgkg: "", dosText: "", admvag: "", tid: "", klar: false, givor: [] }] } }));
  const updDrug = (id, k, v) => setC((p) => ({ ...p, premed: { ...p.premed, drugs: p.premed.drugs.map((d) => d.id === id ? { ...d, [k]: v } : d) } }));
  const addGiva = (id) => setC((p) => ({ ...p, premed: { ...p.premed, drugs: p.premed.drugs.map((d) => {
    if (d.id !== id) return d;
    const calc = (w != null && num(d.mgkg) != null && num(d.konc)) ? String(Math.round((w * num(d.mgkg) / num(d.konc)) * 1000) / 1000) : "";
    return { ...d, givor: [...(d.givor || []), { id: uid("g_"), ml: calc, tid: "", vag: d.admvag || "" }] };
  }) } }));
  const updGiva = (id, gid, k, v) => setC((p) => ({ ...p, premed: { ...p.premed, drugs: p.premed.drugs.map((d) => d.id === id ? { ...d, givor: (d.givor || []).map((g) => g.id === gid ? { ...g, [k]: v } : g) } : d) } }));
  const delGiva = (id, gid) => setC((p) => ({ ...p, premed: { ...p.premed, drugs: p.premed.drugs.map((d) => d.id === id ? { ...d, givor: (d.givor || []).filter((g) => g.id !== gid) } : d) } }));
  const chooseDrug = (id, val) => setC((p) => ({ ...p, premed: { ...p.premed, drugs: p.premed.drugs.map((d) => {
    if (d.id !== id) return d;
    const f = FORMULARY.find((x) => x.namn === val);
    return { ...d, medicin: val, konc: f ? f.konc : (val === "__annat__" ? d.konc : ""), mgkg: "" };
  }) } }));
  const doserFor = (medicin) => { const f = FORMULARY.find((x) => x.namn === medicin); return f ? f.doser : []; };
  const delDrug = (id) => setC((p) => ({ ...p, premed: { ...p.premed, drugs: p.premed.drugs.filter((d) => d.id !== id) } }));
  const updEm = (i, k, v) => setC((p) => ({ ...p, premed: { ...p.premed, emergency: p.premed.emergency.map((e, j) => j === i ? { ...e, [k]: v } : e) } }));
  const addLocal = () => setC((p) => ({ ...p, premed: { ...p.premed, local: [...p.premed.local, { id: uid("l_"), teknik: "", sida: "", lm1: "", dos1: "", enh1: "", lm2: "", dos2: "", enh2: "", tid: "" }] } }));
  const updLocal = (id, k, v) => setC((p) => ({ ...p, premed: { ...p.premed, local: p.premed.local.map((l) => l.id === id ? { ...l, [k]: v } : l) } }));
  const delLocal = (id) => setC((p) => ({ ...p, premed: { ...p.premed, local: p.premed.local.filter((l) => l.id !== id) } }));

  return (
    <div className="sheet">
      <div className="sheet-title t-red"><div><div className="eyebrow">ANESTESIÖVERVAKNING</div><h2>Premedicinering & Induktion</h2></div><button className="btn btn-gh btn-sm no-print" onClick={() => window.print()}><Printer size={15} /> Skriv ut denna sida</button></div>

      <Sec tone="blue"><ClipboardCheck size={15} /> Protokoll / mall</Sec>
      <div className="body">
        <div className="bar">
          <select value={selProto} onChange={(e) => setSelProto(e.target.value)} style={{ minWidth: 240, border: "1px solid var(--line)", borderRadius: 8, padding: "9px 10px", fontSize: 14, background: "#fff" }}>
            <option value="">Välj protokoll…</option>
            <optgroup label="Färdiga protokoll">
              {PROTOCOLS.map((p, i) => <option key={i} value={"builtin_" + i}>{p.namn}</option>)}
            </optgroup>
            {ownProtocols.length > 0 && <optgroup label="Egna protokoll">{ownProtocols.map((p) => <option key={p.id} value={p.id}>{p.namn}</option>)}</optgroup>}
          </select>
          <button className="btn btn-blue btn-sm" disabled={!selProto} onClick={applySelected}><ClipboardCheck size={15} /> Använd protokoll</button>
          {selProto && selProto.indexOf("builtin_") !== 0 && (
            <button className="btn btn-dn btn-sm" onClick={() => { if (window.confirm("Radera eget protokoll?")) { deleteOwnProtocol(selProto); setSelProto(""); } }}><Trash2 size={14} /> Radera</button>
          )}
        </div>
        <div className="bar" style={{ marginTop: 10 }}>
          <input value={protoName} onChange={(e) => setProtoName(e.target.value)} placeholder="Namn på eget protokoll" style={{ minWidth: 220, border: "1px solid var(--line)", borderRadius: 8, padding: "9px 10px", fontSize: 14 }} />
          <button className="btn btn-gh btn-sm" disabled={!protoName || !c.premed.drugs.some((d) => d.medicin)} onClick={() => { saveOwnProtocol(protoName); setProtoName(""); }}><Plus size={15} /> Spara nuvarande som protokoll</button>
        </div>
        {activeWarning && (
          <div className="note" style={{ marginTop: 12 }}><AlertTriangle size={16} className="ic" /><span><b>Protokoll:</b> {activeWarning}</span></div>
        )}
        <div className="disclaim" style={{ textAlign: "left" }}>Protokollen fyller läkemedelslistan – doserna räknas om mot patientens vikt. Allt går att ändra: byt dos via "Välj dos…", lägg till/ta bort läkemedel, och spara din egen version. Kontrollera alltid mot vial och klinikens rutiner; individanpassa.</div>
      </div>

      <PatientHead c={c} set={set} />

      <Sec tone="blue">ASA-klassificering</Sec>
      <div className="body grid g2">
        <Field label="ASA-klass">
          <select value={c.patient.asa} onChange={(e) => set("patient", "asa", e.target.value)}>
            <option value="">Välj ASA-klass…</option>
            <option value="I">I – Normal, frisk</option>
            <option value="II">II – Mild systemisk sjukdom</option>
            <option value="III">III – Allvarlig systemisk sjukdom</option>
            <option value="IV">IV – Allvarlig sjukdom (konstant livshot)</option>
            <option value="V">V – Moribund (döende)</option>
            <option value="I E">I E – akut</option>
            <option value="II E">II E – akut</option>
            <option value="III E">III E – akut</option>
            <option value="IV E">IV E – akut</option>
            <option value="V E">V E – akut</option>
          </select>
        </Field>
        <Field label="Estimerad blodvolym (hund, mL)"><Txt value={c.setup.estBlodvolym} onChange={(v) => set("setup", "estBlodvolym", v)} placeholder={w ? "≈ " + Math.round(w * 88) + " mL (88 ml/kg)" : ""} /></Field>
        <Field label="IV-kateter (J/N)"><Sel value={c.setup.ivKateter} onChange={(v) => set("setup", "ivKateter", v)} opts={["", "J", "N"]} /></Field>
        <Field label="Läge"><Txt value={c.setup.ivLage} onChange={(v) => set("setup", "ivLage", v)} /></Field>
      </div>

      <Sec tone="blue">Premedicinering & induktion <span style={{ marginLeft: "auto", textTransform: "none", fontWeight: 600, fontSize: 12 }}>Dropp: {c.setup.dropp || "—"}</span></Sec>
      <div className="body">
        <Field label="Dropp / vätska"><Txt value={c.setup.dropp} onChange={(v) => set("setup", "dropp", v)} placeholder="t.ex. Ringer-Acetat, hastighet…" /></Field>
        <div className="tw" style={{ marginTop: 10 }}>
          <table className="t red">
            <thead><tr><th>Läkemedel</th><th>Konc (mg/mL)</th><th>Dos (mg/kg)</th><th>Volym (mL)</th><th>Dos (fritext)</th><th>Adm.väg</th><th>Tid</th><th>Klar</th><th></th></tr></thead>
            <tbody>
              {c.premed.drugs.map((d) => {
                const vol = w != null && num(d.mgkg) != null && num(d.konc) ? (w * num(d.mgkg) / num(d.konc)) : null;
                return (
                <tr key={d.id}>
                  <td>
                    <select value={d.medicin} onChange={(e) => chooseDrug(d.id, e.target.value)} style={{ minWidth: 170 }}>
                      <option value="">Välj läkemedel…</option>
                      {DRUG_GROUPS.map((g) => (
                        <optgroup key={g} label={g}>
                          {FORMULARY.filter((f) => f.grupp === g).map((f) => <option key={f.namn} value={f.namn}>{f.namn} ({f.konc} mg/mL)</option>)}
                        </optgroup>
                      ))}
                      <option value="__annat__">Annat läkemedel…</option>
                    </select>
                    {d.medicin === "__annat__" && <input value={d.custom} onChange={(e) => updDrug(d.id, "custom", e.target.value)} placeholder="Skriv namn" style={{ marginTop: 5, minWidth: 170 }} />}
                  </td>
                  <td><input value={d.konc} onChange={(e) => updDrug(d.id, "konc", e.target.value)} inputMode="decimal" style={{ minWidth: 66 }} /></td>
                  <td>
                    {(() => {
                      const preset = doserFor(d.medicin);
                      const egna = (customDoses && customDoses[d.medicin]) || [];
                      const canSave = d.medicin && d.medicin !== "__annat__" && d.mgkg;
                      return (
                        <>
                          {(preset.length + egna.length) > 0 && (
                            <select value="" onChange={(e) => { if (e.target.value !== "") updDrug(d.id, "mgkg", e.target.value); }} style={{ minWidth: 200, marginBottom: 5 }}>
                              <option value="">Välj dos…</option>
                              {preset.length > 0 && <optgroup label="Doser">{preset.map((o, oi) => <option key={"p" + oi} value={o.mgkg}>{o.label}</option>)}</optgroup>}
                              {egna.length > 0 && <optgroup label="Egna doser">{egna.map((o, oi) => <option key={"e" + oi} value={o.mgkg}>{o.label}</option>)}</optgroup>}
                            </select>
                          )}
                          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                            <input value={d.mgkg} onChange={(e) => updDrug(d.id, "mgkg", e.target.value)} inputMode="decimal" placeholder="mg/kg" style={{ minWidth: 80 }} />
                            {canSave && <button type="button" className="btn btn-gh btn-sm" title="Spara detta som ett eget dosval i listan" onClick={() => addCustomDose(d.medicin, d.dosText, d.mgkg)}>★ spara</button>}
                          </div>
                          {egna.length > 0 && <button type="button" className="btn btn-dn btn-sm" style={{ marginTop: 5 }} onClick={() => { if (window.confirm("Rensa egna doser för " + d.medicin + "?")) clearCustomDoses(d.medicin); }}>Rensa egna doser</button>}
                        </>
                      );
                    })()}
                  </td>
                  <td className="vol"><input readOnly value={vol != null ? vol.toLocaleString("sv-SE", { maximumFractionDigits: 2 }) : ""} placeholder="—" style={{ minWidth: 66 }} /></td>
                  <td><input value={d.dosText || ""} onChange={(e) => updDrug(d.id, "dosText", e.target.value)} placeholder="skriv fritt" style={{ minWidth: 130 }} /></td>
                  <td><input value={d.admvag} onChange={(e) => updDrug(d.id, "admvag", e.target.value)} style={{ minWidth: 60 }} /></td>
                  <td><input value={d.tid} onChange={(e) => updDrug(d.id, "tid", e.target.value)} style={{ minWidth: 66 }} /></td>
                  <td style={{ textAlign: "center" }}><input type="checkbox" checked={d.klar} onChange={(e) => updDrug(d.id, "klar", e.target.checked)} style={{ width: 18, height: 18 }} /></td>
                  <td><button className="btn btn-dn btn-ic" onClick={() => delDrug(d.id)}><Trash2 size={14} /></button></td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button className="btn btn-gh btn-sm" style={{ marginTop: 10 }} onClick={addDrug}><Plus size={15} /> Lägg till rad</button>
        {c.premed.drugs.some((d) => d.medicin) && (
          <div style={{ marginTop: 14 }}>
            <div className="subh">Givor & totalt givet (journalvy)</div>
            <div className="gtbl"><div className="gtbl-inner">
              <div className="grow ghead"><div>Läkemedel</div><div>Antal</div><div>Tid</div><div>Adm.väg</div><div>Ta bort</div></div>
              {c.premed.drugs.filter((d) => d.medicin).map((d) => {
                const namn = d.medicin === "__annat__" ? (d.custom || "Annat läkemedel") : d.medicin;
                const givor = d.givor || [];
                const mls = givor.map((g) => num(g.ml)).filter((x) => x != null);
                const totalMl = mls.reduce((a, b) => a + b, 0);
                const hasTotal = mls.length > 0;
                const totalMg = num(d.konc) && hasTotal ? totalMl * num(d.konc) : null;
                return (
                  <React.Fragment key={d.id}>
                    <div className="grow gmed">
                      <div className="gname">+ {namn}{d.konc ? (", inj., " + d.konc + " mg/ml") : ""}</div>
                      <div><span className="gbox">{hasTotal ? totalMl.toLocaleString("sv-SE", { maximumFractionDigits: 3 }) : "0"}</span><span className="gunit">milliliter</span></div>
                      <div>{totalMg != null ? <span className="gunit">{totalMg.toLocaleString("sv-SE", { maximumFractionDigits: 2 })} mg</span> : null}</div>
                      <div></div>
                      <div><button className="gdelmed" title="Ta bort läkemedel" onClick={() => delDrug(d.id)}><Trash2 size={14} /></button></div>
                    </div>
                    {givor.map((g, gi) => (
                      <div className="grow ggiva" key={g.id}>
                        <div className="gname">Giva:</div>
                        <div><input className="ginp" value={g.ml} onChange={(e) => updGiva(d.id, g.id, "ml", e.target.value)} inputMode="decimal" placeholder="0" /><span className="gunit">milliliter</span></div>
                        <div className="gtime"><input className="ginp" style={{ width: 70 }} value={g.tid} onChange={(e) => updGiva(d.id, g.id, "tid", e.target.value)} placeholder="00:00" /><Calendar size={16} className="cal" /></div>
                        <div><select className="groute" value={g.vag} onChange={(e) => updGiva(d.id, g.id, "vag", e.target.value)}><option value="">Adm.väg…</option>{ADM_ROUTES.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
                        <div><button className="gminus" title="Ta bort giva" onClick={() => delGiva(d.id, g.id)}><Minus size={15} /></button><button className="gplus" title="Lägg till giva" style={{ marginLeft: 6 }} onClick={() => addGiva(d.id)}><Plus size={15} /></button></div>
                      </div>
                    ))}
                    {givor.length === 0 && (
                      <div className="grow ggiva">
                        <div className="gname">Giva:</div>
                        <div style={{ color: "var(--muted)", fontSize: 13 }}>—</div>
                        <div></div><div></div>
                        <div><button className="gplus" onClick={() => addGiva(d.id)}><Plus size={15} /> Giva</button></div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div></div>
          </div>
        )}
        <div className="disclaim">Välj läkemedel så fylls koncentrationen i. Välj sedan en dos ur "Välj dos…" så räknas volymen ut automatiskt (Volym = vikt × mg/kg ÷ mg/mL); mg/kg går även att skriva själv. Använd "Ge dos igen" för upprepade givor – totalen räknas ihop per läkemedel. Revetor (atipamezol 0,5→5 mg/ml): ge samma volym som given Dexdomitor/Cepedex (0,5 mg/ml). Kontrollera alltid mot ampull och aktuell litteratur (PLUMB/FASS) – doserna är riktvärden och går att ändra per rad.</div>
      </div>

      <Sec tone="redblock"><AlertTriangle size={15} /> Akutläkemedel {w ? "· uträknade för " + w + " kg" : "· ange vikt så räknas volymen ut"}</Sec>
      <div className="body" style={{ paddingTop: 12 }}>
        <div className="tw">
          <table className="t red">
            <thead><tr><th>Läkemedel</th><th>mg/kg</th><th>mg/mL</th><th>Volym (mL)</th><th>Adm.väg</th><th>Klar</th></tr></thead>
            <tbody>
              {c.premed.emergency.map((e, i) => {
                const vol = w != null && num(e.mgkg) != null && num(e.mgml) ? (w * num(e.mgkg) / num(e.mgml)) : null;
                return (
                  <tr key={i} className="emrow">
                    <td className="nm">{e.namn}</td>
                    <td><input value={e.mgkg} onChange={(ev) => updEm(i, "mgkg", ev.target.value)} inputMode="decimal" /></td>
                    <td><input value={e.mgml} onChange={(ev) => updEm(i, "mgml", ev.target.value)} inputMode="decimal" /></td>
                    <td className="vol"><input readOnly value={vol != null ? vol.toLocaleString("sv-SE", { maximumFractionDigits: 2 }) : ""} placeholder="—" /></td>
                    <td><input value={e.vag} onChange={(ev) => updEm(i, "vag", ev.target.value)} style={{ minWidth: 56 }} /></td>
                    <td style={{ textAlign: "center" }}><input type="checkbox" checked={e.klar} onChange={(ev) => updEm(i, "klar", ev.target.checked)} style={{ width: 18, height: 18 }} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="disclaim">Volym = vikt × mg/kg ÷ mg/mL. Doserna är generella referensvärden – verifiera mot klinikens rutiner och FASS innan administrering. Ansvarig veterinär fastställer protokollet.</div>
      </div>

      <Sec tone="blue">Lokal / lokoregional anestesi</Sec>
      <div className="body">
        <div className="tw">
          <table className="t blue">
            <thead><tr><th>Teknik</th><th>Sida</th><th>Läkemedel 1</th><th>Dos</th><th>Enh</th><th>Läkemedel 2 / adjuvans</th><th>Dos</th><th>Enh</th><th>Tid</th><th></th></tr></thead>
            <tbody>
              {c.premed.local.map((l) => (
                <tr key={l.id}>
                  <td><input value={l.teknik} onChange={(e) => updLocal(l.id, "teknik", e.target.value)} style={{ minWidth: 100 }} /></td>
                  <td><input value={l.sida} onChange={(e) => updLocal(l.id, "sida", e.target.value)} style={{ minWidth: 50 }} /></td>
                  <td><input value={l.lm1} onChange={(e) => updLocal(l.id, "lm1", e.target.value)} /></td>
                  <td><input value={l.dos1} onChange={(e) => updLocal(l.id, "dos1", e.target.value)} /></td>
                  <td><input value={l.enh1} onChange={(e) => updLocal(l.id, "enh1", e.target.value)} style={{ minWidth: 50 }} /></td>
                  <td><input value={l.lm2} onChange={(e) => updLocal(l.id, "lm2", e.target.value)} /></td>
                  <td><input value={l.dos2} onChange={(e) => updLocal(l.id, "dos2", e.target.value)} /></td>
                  <td><input value={l.enh2} onChange={(e) => updLocal(l.id, "enh2", e.target.value)} style={{ minWidth: 50 }} /></td>
                  <td><input value={l.tid} onChange={(e) => updLocal(l.id, "tid", e.target.value)} style={{ minWidth: 60 }} /></td>
                  <td><button className="btn btn-dn btn-ic" onClick={() => delLocal(l.id)}><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn-gh btn-sm" style={{ marginTop: 10 }} onClick={addLocal}><Plus size={15} /> Lägg till rad</button>
      </div>

      <Sec tone="blue">Kommentarer</Sec>
      <div className="body"><Field label=""><textarea value={c.premed.kommentarer} onChange={(e) => set("premed", "kommentarer", e.target.value)} style={{ minHeight: 90 }} /></Field></div>
    </div>
  );
}

/* ===================== ÖVERVAKNINGSBLAD SHEET ===================== */
function MonitorSheet({ c, set, setC, show, setShow }) {
  const [d, setD] = useState(blankReading);
  const m = c.monitor;
  const startNow = () => set("monitor", "startTime", new Date().toISOString());
  const elapsed = () => m.startTime ? Math.max(0, Math.round((Date.now() - new Date(m.startTime).getTime()) / 60000)) : 0;

  const addReading = () => {
    const tid = d.tid || new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
    setC((p) => ({ ...p, monitor: { ...p.monitor, startTime: p.monitor.startTime || new Date().toISOString(), readings: [...p.monitor.readings, { ...d, tid }] } }));
    setD(blankReading());
  };
  const delReading = (id) => setC((p) => ({ ...p, monitor: { ...p.monitor, readings: p.monitor.readings.filter((r) => r.id !== id) } }));
  const addRec = () => setC((p) => ({ ...p, monitor: { ...p.monitor, recovery: [...p.monitor.recovery, blankRecovery()] } }));
  const updRec = (id, k, v) => setC((p) => ({ ...p, monitor: { ...p.monitor, recovery: p.monitor.recovery.map((r) => r.id === id ? { ...r, [k]: v } : r) } }));
  const delRec = (id) => setC((p) => ({ ...p, monitor: { ...p.monitor, recovery: p.monitor.recovery.filter((r) => r.id !== id) } }));

  return (
    <div className="sheet">
      <div className="sheet-title t-blue"><h2>Anestesiövervakningsblad</h2><button className="btn btn-gh btn-sm no-print" onClick={() => window.print()}><Printer size={15} /> Skriv ut denna sida</button></div>
      <PatientHead c={c} set={set} />

      <Sec tone="blue">IV vätsketerapi & intubation</Sec>
      <div className="body grid">
        <div className="grid g3">
          <Field label="IV vätsketerapi – typ"><Txt value={c.setup.ivTyp} onChange={(v) => set("setup", "ivTyp", v)} /></Field>
          <Field label="Hastighet"><Txt value={c.setup.ivHastighet} onChange={(v) => set("setup", "ivHastighet", v)} /></Field>
          <Field label="IV-kateter placering"><Txt value={c.setup.ivPlacering} onChange={(v) => set("setup", "ivPlacering", v)} /></Field>
          <Field label="Endotrakealtub / mask"><Txt value={c.setup.tub} onChange={(v) => set("setup", "tub", v)} /></Field>
          <Field label="Kuffad / okuffad"><Sel value={c.setup.kuffad} onChange={(v) => set("setup", "kuffad", v)} opts={["", "Kuffad", "Okuffad", "Mask"]} /></Field>
          <Field label="Storlek"><Txt value={c.setup.storlek} onChange={(v) => set("setup", "storlek", v)} /></Field>
          <Field label="Ögon smorda?"><Sel value={c.setup.ogonSmorda} onChange={(v) => set("setup", "ogonSmorda", v)} opts={["", "Ja", "Nej"]} /></Field>
          <Field label="Andningssystem"><Txt value={c.setup.andningssystem} onChange={(v) => set("setup", "andningssystem", v)} /></Field>
        </div>
        <Field label="Anestesiöverväganden (åtgärds-/patientspecifika)"><textarea value={c.setup.overvaganden} onChange={(e) => set("setup", "overvaganden", e.target.value)} /></Field>
      </div>

      <Sec tone="blue"><Clock size={15} /> Narkostid</Sec>
      <div className="body">
        {m.startTime ? (
          <div className="bar"><div style={{ fontSize: 14 }}>Start: <b>{new Date(m.startTime).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}</b> · förfluten tid ca <b>{elapsed()} min</b></div><button className="btn btn-gh btn-sm" onClick={startNow}>Återställ start</button></div>
        ) : (
          <button className="btn btn-blue" onClick={startNow}><Clock size={15} /> Starta narkostid</button>
        )}
      </div>

      <Sec tone="blue"><Plus size={15} /> Ny mätning</Sec>
      <div className="body">
        <div className="subh">Plottas på kurvan</div>
        <div className="grid g4">
          <Field label="Tid (blank = nu)"><Txt value={d.tid} onChange={(v) => setD({ ...d, tid: v })} placeholder={new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })} /></Field>
          <Field label="HF ●"><N value={d.hf} onChange={(v) => setD({ ...d, hf: v })} /></Field>
          <Field label="AF ○"><N value={d.af} onChange={(v) => setD({ ...d, af: v })} /></Field>
          <Field label="SAP ▾"><N value={d.sap} onChange={(v) => setD({ ...d, sap: v })} /></Field>
          <Field label="MAP –"><N value={d.map} onChange={(v) => setD({ ...d, map: v })} /></Field>
          <Field label="DAP ▴"><N value={d.dap} onChange={(v) => setD({ ...d, dap: v })} /></Field>
          <Field label="Doppler"><N value={d.doppler} onChange={(v) => setD({ ...d, doppler: v })} /></Field>
        </div>
        <div className="subh" style={{ marginTop: 12 }}>Övriga parametrar (tabell)</div>
        <div className="grid g4">
          <Field label="Iso/Sevo %"><Txt value={d.isosevo} onChange={(v) => setD({ ...d, isosevo: v })} /></Field>
          <Field label="O₂/N₂O L/min"><Txt value={d.o2n2o} onChange={(v) => setD({ ...d, o2n2o: v })} /></Field>
          <Field label="Ögonposition ↓/→"><Txt value={d.ogon} onChange={(v) => setD({ ...d, ogon: v })} /></Field>
          <Field label="Palpebralreflex –/+"><Txt value={d.palp} onChange={(v) => setD({ ...d, palp: v })} /></Field>
          <Field label="Käktonus –/+/++"><Txt value={d.kak} onChange={(v) => setD({ ...d, kak: v })} /></Field>
          <Field label="ETCO₂ kPa/mmHg"><N value={d.etco2} onChange={(v) => setD({ ...d, etco2: v })} /></Field>
          <Field label="SpO₂ %"><N value={d.spo2} onChange={(v) => setD({ ...d, spo2: v })} /></Field>
          <Field label="Temp °C"><N value={d.temp} onChange={(v) => setD({ ...d, temp: v })} /></Field>
        </div>
        <Field label="Anteckning"><Txt value={d.note} onChange={(v) => setD({ ...d, note: v })} /></Field>
        <button className="btn btn-blue" style={{ marginTop: 11 }} onClick={addReading}><Plus size={15} /> Lägg till mätning</button>
      </div>

      <Sec tone="blue"><Activity size={15} /> Kurva (ritas automatiskt)</Sec>
      <div className="body"><VitalsGraph readings={m.readings} show={show} setShow={setShow} /></div>

      <Sec tone="blue">Mätningar ({m.readings.length})</Sec>
      <div className="body" style={{ padding: 0 }}>
        {m.readings.length === 0 ? <div className="empty">Inga mätningar ännu.</div> : (
          <div className="tw"><table className="t blue">
            <thead><tr><th>Tid</th><th>HF</th><th>AF</th><th>SAP</th><th>MAP</th><th>DAP</th><th>Dopp</th><th>Iso/Sevo</th><th>O₂/N₂O</th><th>Ögon</th><th>Palp</th><th>Käk</th><th>ETCO₂</th><th>SpO₂</th><th>Temp</th><th>Ant.</th><th></th></tr></thead>
            <tbody>{m.readings.map((r) => (
              <tr key={r.id}><td><b>{r.tid}</b></td><td>{r.hf}</td><td>{r.af}</td><td>{r.sap}</td><td>{r.map}</td><td>{r.dap}</td><td>{r.doppler}</td><td>{r.isosevo}</td><td>{r.o2n2o}</td><td>{r.ogon}</td><td>{r.palp}</td><td>{r.kak}</td><td>{r.etco2}</td><td>{r.spo2}</td><td>{r.temp}</td><td style={{ whiteSpace: "normal" }}>{r.note}</td><td><button className="btn btn-dn btn-ic" onClick={() => delReading(r.id)}><Trash2 size={14} /></button></td></tr>
            ))}</tbody>
          </table></div>
        )}
      </div>

      <Sec tone="blue">Anteckningar, svalgtampong & kompressräkning</Sec>
      <div className="body grid">
        <Field label="Anteckningar"><textarea value={m.anteckningar} onChange={(e) => set("monitor", "anteckningar", e.target.value)} /></Field>
        <div className="chkrow">
          <Check on={m.svalgPlacerad} onChange={(v) => set("monitor", "svalgPlacerad", v)}>Svalgtampong placerad</Check>
          <Check on={m.svalgBorttagen} onChange={(v) => set("monitor", "svalgBorttagen", v)}>Svalgtampong borttagen</Check>
        </div>
        <div className="grid g2">
          <Field label="Kompressräkning IN"><Txt value={m.kompressIn} onChange={(v) => set("monitor", "kompressIn", v)} /></Field>
          <Field label="Kompressräkning UT"><Txt value={m.kompressUt} onChange={(v) => set("monitor", "kompressUt", v)} /></Field>
        </div>
      </div>

      <Sec tone="blue">Uppvakningsinstruktioner & uppvak</Sec>
      <div className="body grid">
        <Field label="Uppvakningsinstruktioner"><textarea value={m.uppvakInstr} onChange={(e) => set("monitor", "uppvakInstr", e.target.value)} /></Field>
        <div className="tw"><table className="t blue">
          <thead><tr><th>Tid</th><th>HF</th><th>AF</th><th>Temp</th><th>Smärtskattning</th><th></th></tr></thead>
          <tbody>{m.recovery.map((r) => (
            <tr key={r.id}><td><input value={r.tid} onChange={(e) => updRec(r.id, "tid", e.target.value)} style={{ minWidth: 70 }} /></td><td><input value={r.hf} onChange={(e) => updRec(r.id, "hf", e.target.value)} /></td><td><input value={r.af} onChange={(e) => updRec(r.id, "af", e.target.value)} /></td><td><input value={r.temp} onChange={(e) => updRec(r.id, "temp", e.target.value)} /></td><td><input value={r.smarta} onChange={(e) => updRec(r.id, "smarta", e.target.value)} style={{ minWidth: 110 }} /></td><td><button className="btn btn-dn btn-ic" onClick={() => delRec(r.id)}><Trash2 size={14} /></button></td></tr>
          ))}</tbody>
        </table></div>
        <button className="btn btn-gh btn-sm" onClick={addRec}><Plus size={15} /> Lägg till uppvaksrad</button>
      </div>
    </div>
  );
}

/* ===================== TIME-OUT SHEET ===================== */
const BEHOV = ["Plåster", "Bandage", "Kyla", "Glukosmätning", "Laktatmätning", "IVA-uppvak", "Näringssond", "Syrgassond", "Urinkateter", "CVK"];
const CHECK_OUT = ["Body", "Krage", "Debiterad", "Beh. lista", "Burkort"];

function TimeoutSheet({ c, set, setC }) {
  const t = c.timeout;
  const tg = (k, v) => set("timeout", k, v);
  const behov = (b, v) => setC((p) => ({ ...p, timeout: { ...p.timeout, behov: { ...p.timeout.behov, [b]: v } } }));
  const chk = (b, v) => setC((p) => ({ ...p, timeout: { ...p.timeout, checklist: { ...p.timeout.checklist, [b]: v } } }));
  const updTRow = (i, k, v) => setC((p) => ({ ...p, timeout: { ...p.timeout, rows: p.timeout.rows.map((r, j) => j === i ? { ...r, [k]: v } : r) } }));
  const updMon = (i, k, v) => setC((p) => ({ ...p, timeout: { ...p.timeout, monrows: p.timeout.monrows.map((r, j) => j === i ? { ...r, [k]: v } : r) } }));
  const addMon = () => setC((p) => ({ ...p, timeout: { ...p.timeout, monrows: [...p.timeout.monrows, { tid: "", temp: "", allman: "", pulse: "", blodtryck: "", af: "", slhcrt: "", blodning: "" }] } }));

  return (
    <div className="sheet">
      <div className="sheet-title t-green"><div><div className="eyebrow">PERIOPERATIV CHECKLISTA · UPPVAK · ÖVERLÄMNING</div><h2>Time-out</h2></div><button className="btn btn-gh btn-sm no-print" onClick={() => window.print()}><Printer size={15} /> Skriv ut denna sida</button></div>

      <Sec tone="green" n="1">Time-out</Sec>
      <div className="body grid">
        <div style={{ fontSize: 12.5, color: "var(--muted)", fontStyle: "italic" }}>Genomförs av kirurg och anestesör innan operationen påbörjas.</div>
        <div className="chkrow">
          <Check tone="green" on={t.namn} onChange={(v) => tg("namn", v)}>Alla känner varandra till namn och uppgift</Check>
          <Check tone="green" on={t.procedur} onChange={(v) => tg("procedur", v)}>Procedur och incisionsplats konfirmeras</Check>
          <Check tone="green" on={t.steril} onChange={(v) => tg("steril", v)}>Sterilitet konfirmeras</Check>
        </div>
        <div className="grid g3">
          <Field label="Beräknad operationstid"><Txt value={t.optid} onChange={(v) => tg("optid", v)} /></Field>
          <Field label="Lokalanalgetika anlagd? (J/N)"><Sel value={t.lokal} onChange={(v) => tg("lokal", v)} opts={["", "Ja", "Nej"]} /></Field>
          <Field label="Var?"><Txt value={t.lokalVar} onChange={(v) => tg("lokalVar", v)} /></Field>
        </div>
        <Field label="Risker vid operation och anestesi"><Txt value={t.risker} onChange={(v) => tg("risker", v)} /></Field>
        <div className="tw"><table className="t green">
          <thead><tr><th>Datum (dd/mm)</th><th>Patientens vikt</th><th>Preparat</th><th>Tid</th></tr></thead>
          <tbody><tr>
            <td><input value={t.rows[0].datum} onChange={(e) => updTRow(0, "datum", e.target.value)} /></td>
            <td><input value={t.rows[0].vikt} onChange={(e) => updTRow(0, "vikt", e.target.value)} /></td>
            <td><input value={t.rows[0].preparat} onChange={(e) => updTRow(0, "preparat", e.target.value)} style={{ minWidth: 150 }} /></td>
            <td><input value={t.rows[0].tid} onChange={(e) => updTRow(0, "tid", e.target.value)} /></td>
          </tr></tbody>
        </table></div>
        <Field label="Kompresser i galler vid op-start (st)"><Txt value={t.kompresserStart} onChange={(v) => tg("kompresserStart", v)} /></Field>
      </div>

      <Sec tone="green" n="2">Avslut och uppvak</Sec>
      <div className="body grid">
        <div style={{ fontSize: 12.5, color: "var(--muted)", fontStyle: "italic" }}>Gås igenom av kirurg och anestesör efter operationen, innan uppvak.</div>
        <Check tone="green" on={t.ratt} onChange={(v) => tg("ratt", v)}>Rätt ingrepp utfört</Check>
        <div className="grid g4">
          <Field label="Kompresser givna intra-op"><Txt value={t.kompGivna} onChange={(v) => tg("kompGivna", v)} /></Field>
          <Field label="Kompresser avräknade"><Txt value={t.kompAvr} onChange={(v) => tg("kompAvr", v)} /></Field>
          <Field label="Nålar givna intra-op"><Txt value={t.nalGivna} onChange={(v) => tg("nalGivna", v)} /></Field>
          <Field label="Nålar avräknade"><Txt value={t.nalAvr} onChange={(v) => tg("nalAvr", v)} /></Field>
        </div>
        <Field label="Problem med instrument / utrustning?"><Txt value={t.problem} onChange={(v) => tg("problem", v)} /></Field>
        <div className="grid g2">
          <Field label="Risk för komplikation vid uppvak?"><Txt value={t.risk} onChange={(v) => tg("risk", v)} /></Field>
          <Field label="Hur ska detta hanteras"><Txt value={t.hantering} onChange={(v) => tg("hantering", v)} /></Field>
        </div>
        <div className="grid g2">
          <Field label="Tömning av urinblåsa"><Sel value={t.urinblasa} onChange={(v) => tg("urinblasa", v)} opts={["", "Ja", "Nej", "Glömt kolla"]} /></Field>
          <Field label="Kl."><Txt value={t.urinblasaKl} onChange={(v) => tg("urinblasaKl", v)} /></Field>
        </div>
        <div><div className="subh">Finns behov av:</div><div className="chkrow">{BEHOV.map((b) => <Check key={b} tone="green" on={t.behov[b]} onChange={(v) => behov(b, v)}>{b}</Check>)}</div></div>
      </div>

      <Sec tone="green" n="3">Postop</Sec>
      <div className="body grid">
        <div className="grid g3">
          <Field label="Extuberad"><Txt value={t.extuberad} onChange={(v) => tg("extuberad", v)} /></Field>
          <Field label="Vaken på bröstet"><Txt value={t.vaken} onChange={(v) => tg("vaken", v)} /></Field>
          <Field label="Vätsketerapi (ml/h)"><Txt value={t.vatske} onChange={(v) => tg("vatske", v)} /></Field>
          <Field label="Kopplas bort"><Txt value={t.kopplasBort} onChange={(v) => tg("kopplasBort", v)} /></Field>
          <Field label="CRI (ml/h)"><Txt value={t.cri} onChange={(v) => tg("cri", v)} /></Field>
          <Field label="Sänks / kopplas bort"><Txt value={t.sanks} onChange={(v) => tg("sanks", v)} /></Field>
        </div>
        <Field label="Totalmängd RAC OP → Journal!"><Txt value={t.totalRAC} onChange={(v) => tg("totalRAC", v)} /></Field>
        <div className="subh">Monitorering</div>
        <div className="tw"><table className="t green">
          <thead><tr><th>Tid</th><th>Temp</th><th>Allmäntillstånd</th><th>Pulse</th><th>Blodtryck</th><th>Andningsfrekvens</th><th>Slh-färg & CRT</th><th>Blödningskoll</th></tr></thead>
          <tbody>{t.monrows.map((r, i) => (
            <tr key={i}>
              <td><input value={r.tid} onChange={(e) => updMon(i, "tid", e.target.value)} style={{ minWidth: 64 }} /></td>
              <td><input value={r.temp} onChange={(e) => updMon(i, "temp", e.target.value)} /></td>
              <td><input value={r.allman} onChange={(e) => updMon(i, "allman", e.target.value)} style={{ minWidth: 110 }} /></td>
              <td><input value={r.pulse} onChange={(e) => updMon(i, "pulse", e.target.value)} /></td>
              <td><input value={r.blodtryck} onChange={(e) => updMon(i, "blodtryck", e.target.value)} /></td>
              <td><input value={r.af} onChange={(e) => updMon(i, "af", e.target.value)} /></td>
              <td><input value={r.slhcrt} onChange={(e) => updMon(i, "slhcrt", e.target.value)} style={{ minWidth: 100 }} /></td>
              <td><input value={r.blodning} onChange={(e) => updMon(i, "blodning", e.target.value)} style={{ minWidth: 100 }} /></td>
            </tr>
          ))}</tbody>
        </table></div>
        <button className="btn btn-gh btn-sm" onClick={addMon}><Plus size={15} /> Lägg till rad</button>
        <div className="grid g4">
          <Field label="Ok att få mat?"><Sel value={t.matOk} onChange={(v) => tg("matOk", v)} opts={["", "Ja", "Nej"]} /></Field>
          <Field label="Vad"><Txt value={t.matVad} onChange={(v) => tg("matVad", v)} /></Field>
          <Field label="Erbjudits vad?"><Txt value={t.erbjudits} onChange={(v) => tg("erbjudits", v)} /></Field>
          <Field label="Kl."><Txt value={t.matKl} onChange={(v) => tg("matKl", v)} /></Field>
          <Field label="Ville äta?"><Sel value={t.villeAta} onChange={(v) => tg("villeAta", v)} opts={["", "Ja", "Nej"]} /></Field>
          <Field label="Rastad kl."><Txt value={t.rastad} onChange={(v) => tg("rastad", v)} /></Field>
          <Field label="Urin"><Txt value={t.urin} onChange={(v) => tg("urin", v)} /></Field>
          <Field label="Avf"><Txt value={t.avf} onChange={(v) => tg("avf", v)} /></Field>
        </div>
        <Field label="Övrig notis"><Txt value={t.notis} onChange={(v) => tg("notis", v)} /></Field>
      </div>

      <Sec tone="green" n="4">Överlämning</Sec>
      <div className="body grid">
        <div className="grid g3">
          <Field label="Överlämnad till DV"><Txt value={t.overDV} onChange={(v) => tg("overDV", v)} /></Field>
          <Field label="Överlämnad till DSS"><Txt value={t.overDSS} onChange={(v) => tg("overDSS", v)} /></Field>
          <Field label="Kanyl bort när? / kvar"><Txt value={t.kanyl} onChange={(v) => tg("kanyl", v)} /></Field>
          <Field label="Hemgångstid idag"><Txt value={t.hemgang} onChange={(v) => tg("hemgang", v)} /></Field>
          <Field label="Kl."><Txt value={t.hemgangKl} onChange={(v) => tg("hemgangKl", v)} /></Field>
          <Field label="Inskrivning vård?"><Sel value={t.inskrivning} onChange={(v) => tg("inskrivning", v)} opts={["", "Ja", "Nej"]} /></Field>
          <Field label="Bur"><Txt value={t.bur} onChange={(v) => tg("bur", v)} /></Field>
          <Field label="Överlämnad till"><Txt value={t.overTill} onChange={(v) => tg("overTill", v)} /></Field>
        </div>
        <div className="chkrow">{CHECK_OUT.map((b) => <Check key={b} tone="green" on={t.checklist[b]} onChange={(v) => chk(b, v)}>{b}</Check>)}</div>
        <Field label="Övrig kommentar"><textarea value={t.ovrigKomm} onChange={(e) => tg("ovrigKomm", e.target.value)} /></Field>
      </div>
    </div>
  );
}

/* ===================== SAVED ===================== */
function SavedTab({ saved, curId, loadCase, delCase, newCase }) {
  return (
    <div className="sheet"><div className="sheet-title t-blue"><h2>Sparade fall</h2></div>
      <div className="body">
        <div className="bar" style={{ marginBottom: 14 }}>
          <button className="btn btn-blue" onClick={newCase}><Plus size={15} /> Nytt fall</button>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>Fall sparas automatiskt i denna webbläsare.</span>
        </div>
        {saved.length === 0 ? <div className="empty"><FolderOpen size={30} style={{ opacity: .4 }} /><br />Inga sparade fall ännu.</div> :
          saved.map((s) => (
            <div className="savecard" key={s.id}>
              <div className="av"><PawPrint size={18} /></div>
              <div className="meta">
                <div className="nm">{s.patient?.namn || "Namnlös patient"} {s.id === curId && <span style={{ fontSize: 11, color: "var(--blue-d)" }}>· öppen</span>}</div>
                <div className="sm">{[s.patient?.ras, s.patient?.atgard, s.patient?.datum].filter(Boolean).join(" · ")} · {(s.monitor?.readings?.length || 0)} mätn.</div>
              </div>
              <div className="bar">
                <button className="btn btn-gh btn-sm" onClick={() => loadCase(s)}><FolderOpen size={14} /> Öppna</button>
                <button className="btn btn-dn btn-ic" onClick={() => { if (window.confirm("Radera " + (s.patient?.namn || "fallet") + "?")) delCase(s.id); }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
