import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CarFront,
  Check,
  CheckCheck,
  CircleHelp,
  Clock3,
  Copy,
  Crosshair,
  Headset,
  MapPin,
  MessageSquareText,
  Minus,
  Navigation,
  Phone,
  Plus,
  ShieldCheck,
  Star,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { booking, mechanic } from "./data.js";

export function Header() {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/roadside/c16" aria-label="OmegaNexora Roadside home">
          <span className="brand-mark">◢</span>
          <span><strong>OmegaNexora</strong><small>Roadside</small></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link className="selected" to="/roadside/c16">Home</Link><Link to="/roadside/c22">Services</Link>
          <Link to="/roadside/c16">How It Works</Link><Link to="/roadside/c21">Safety</Link>
          <Link to="/roadside/c18">Become a Mechanic</Link><a href="tel:1800123456">Support</a>
        </nav>
        <div className="header-actions"><button className="login-button" onClick={() => setLoginOpen(true)}>Login</button><button className="help-button" onClick={() => navigate("/roadside/c16")}><CarFront size={17} /> Get Roadside Help</button></div>
      </header>
      {loginOpen && <div className="modal-backdrop" role="presentation" onClick={() => setLoginOpen(false)}><section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="login-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close" onClick={() => setLoginOpen(false)}><X /></button><h2 id="login-title">Customer login</h2><p>Account sign-in isn’t connected in this preview. You can still follow your roadside request here.</p><button className="primary-button" onClick={() => { setLoginOpen(false); navigate("/roadside/c16"); }}>Continue to request</button></section></div>}
    </>
  );
}

export function ScreenTitle({ backTo, backLabel = "Back to request", title, subtitle, eyebrow }) {
  const navigate = useNavigate();
  return (
    <div className="screen-heading">
      {backTo && <button className="back-link" onClick={() => navigate(backTo)}><ArrowLeft size={17} />{backLabel}</button>}
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1>{title}</h1>{subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export function StatusPill({ children, tone = "green" }) {
  return <span className={`status-pill ${tone}`}><span className="status-dot" />{children}</span>;
}

export function VerificationBadge({ children = "Verified Mechanic" }) {
  return <span className="verified-badge"><ShieldCheck size={16} fill="currentColor" />{children}</span>;
}

export function Rating({ compact = false }) {
  return <span className={`rating ${compact ? "compact" : ""}`}><Star size={compact ? 16 : 19} fill="currentColor" /> <strong>{mechanic.rating}</strong><span>({mechanic.jobs})</span></span>;
}

export function Eta({ label = "ETA", value = mechanic.eta, icon = true }) {
  return <div className="eta">{icon && <span className="eta-icon"><Clock3 size={22} /></span>}<span><small>{label}</small><strong>{value}</strong></span></div>;
}

export function MechanicAvatar({ size = "md" }) {
  return <img className={`mechanic-avatar ${size}`} src={mechanic.photo} alt={`${mechanic.name}, verified mechanic`} />;
}

export function MechanicCard({ actions = true, compact = false, onChat, onCall }) {
  return (
    <section className={`mechanic-card ${compact ? "compact-card" : ""}`}>
      <MechanicAvatar size={compact ? "sm" : "md"} />
      <div className="mechanic-info">
        <strong className="mechanic-name">{mechanic.name}</strong>
        <Rating compact />
        <VerificationBadge />
      </div>
      {actions && <div className="mechanic-actions">
        <button className="round-action blue" onClick={onCall} aria-label="Call mechanic"><Phone size={20} /></button>
        <button className="round-action outline" onClick={onChat} aria-label="Message mechanic"><MessageSquareText size={20} /></button>
        <small>Call&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Message</small>
      </div>}
    </section>
  );
}

function RoadLines() {
  return (
    <svg className="map-art" viewBox="0 0 1000 680" preserveAspectRatio="xMidYMid slice" aria-label="Illustrated map of Hitec City">
      <rect width="1000" height="680" fill="#f0f3f3" />
      <path d="M720 0h130l-45 85-100 40-35 120 65 62-44 101 60 50-9 222H580l-5-135 50-79-70-95 75-116-27-106z" fill="#d6edcf" />
      <path d="M0 420c130-60 212-18 318 16s177 42 267 9 177-25 415 76v159H0z" fill="#e0f0dc" />
      <g className="map-blocks">
        <path d="M40 80h160v74H40zM230 34h110v102H230zM380 23h130v92H380zM20 190h112v88H20zM160 170h150v95H160zM357 150h115v80H357zM520 170h128v90H520zM800 160h140v94H800zM80 315h155v83H80zM270 298h108v78H270zM424 285h90v90H424zM685 360h145v82H685zM860 315h105v94H860zM28 490h130v94H28zM198 450h125v94H198zM390 442h112v88H390zM505 575h139v78H505zM720 500h132v86H720zM880 530h94v94H880z" />
      </g>
      <g className="minor-roads">
        <path d="M-10 150L1010 260M-10 282L1010 375M-10 510L1010 446M105 0L240 680M295 0L355 680M488 0L450 680M650 0L545 680M826 0L700 680M940 0L810 680M0 615L1000 90" />
      </g>
      <g className="major-roads">
        <path d="M-30 590L995 40" /><path d="M30 -15L940 700" />
      </g>
      <path className="route-outline" d="M250 535C330 500 370 490 405 455S475 420 515 410 565 365 600 360s58-18 80-60 46-42 66-58 46-55 76-70" />
      <path className="route-line" d="M250 535C330 500 370 490 405 455S475 420 515 410 565 365 600 360s58-18 80-60 46-42 66-58 46-55 76-70" />
      <g className="map-labels">
        <text x="70" y="213">HITEC CITY</text><text x="622" y="126">Kondapur</text>
        <text x="388" y="342">Madhapur</text><text x="756" y="474">Jubilee Hills</text>
        <text x="725" y="310">Durgam Cheruvu</text><text x="192" y="584">Raidurg</text>
        <text x="493" y="216">Cyber Towers</text><text x="111" y="412">Hitec City Main Rd</text>
        <text x="680" y="595" className="green-label">Botanical Garden</text>
      </g>
      <g className="map-landmarks">
        <circle cx="550" cy="245" r="13" /><circle cx="806" cy="397" r="13" /><circle cx="285" cy="314" r="12" />
      </g>
    </svg>
  );
}

export function TrackingMap({ progress = 0.2, compact = false, controls = true, matching = false, arrived = false }) {
  const [zoom, setZoom] = React.useState(1);
  const [satellite, setSatellite] = React.useState(false);
  const mechanicLeft = 75 - Math.min(progress, 1) * 55;
  const mechanicTop = 22 + Math.min(progress, 1) * 54;
  return (
    <section className={`tracking-map ${compact ? "map-compact" : ""} ${satellite ? "satellite" : ""}`}>
      <div className="map-inner" style={{ transform: `scale(${zoom})` }}><RoadLines /></div>
      <div className="map-switch"><button className={!satellite ? "active" : ""} onClick={() => setSatellite(false)}>Map</button><button className={satellite ? "active" : ""} onClick={() => setSatellite(true)}>Satellite</button></div>
      <div className="map-callout eta-callout"><StatusPill>{matching ? "Searching for a mechanic" : arrived ? "Both at the same location" : "Mechanic on the way"}</StatusPill><div><strong>{matching ? "1–2 min" : arrived ? "Arrived" : `${progress > .68 ? "4" : progress > .34 ? "8" : "12"} min`}</strong>{!arrived && <><span> • </span><strong>{progress > .68 && !matching ? "0.8" : progress > .34 && !matching ? "1.6" : "2.4"} km</strong></>}</div><small>{matching ? "Finding the best available mechanic near your location" : arrived ? "Rajesh Kumar has reached your location" : "Rajesh Kumar is coming to your location"}</small></div>
      <div className="map-marker customer-marker"><MapPin size={31} fill="currentColor" /><span>Your Location</span></div>
      <div className="map-marker mechanic-marker" style={{ left: `${mechanicLeft}%`, top: `${mechanicTop}%` }}><MechanicAvatar size="xs" /><span>Rajesh Kumar</span></div>
      {!arrived && <div className="map-eta-bubble" style={{ left: `${Math.min(mechanicLeft + 2, 82)}%`, top: `${Math.max(mechanicTop + 7, 27)}%` }}>ETA<br /><strong>{matching ? "6" : progress > .68 ? "4" : progress > .34 ? "8" : "12"} min</strong></div>}
      {controls && <div className="map-tools">
        <button aria-label="My location" onClick={() => setZoom(1)}><Crosshair size={19} /></button>
        <button aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(1.3, value + .1))}><Plus size={19} /></button>
        <button aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(.9, value - .1))}><Minus size={19} /></button>
      </div>}
      <div className="map-attribution">Map data · Hyderabad</div>
    </section>
  );
}

export function StatusTimeline({ current = 2, compact = false }) {
  const items = [
    ["Request Received", "We've received your request for roadside assistance.", "10:24 AM"],
    ["Mechanic Assigned", `${mechanic.name} has been assigned to your job.`, "10:26 AM"],
    ["Mechanic on the way", `ETA ${mechanic.eta} · ${mechanic.distance} away`, "In progress"],
    ["Arriving at your location", "We'll notify you when the mechanic arrives.", "Pending"],
  ];
  return <div className={`status-timeline ${compact ? "timeline-compact" : ""}`}>{items.map(([title, detail, time], i) => (
    <div className={`timeline-row ${i < current ? "complete" : i === current ? "current" : ""}`} key={title}>
      <span className="timeline-icon">{i < current ? <Check size={15} /> : i === current ? <CarFront size={16} /> : <span />}</span>
      <div><strong>{title}</strong><p>{detail}</p></div><small>{i === current && current === 2 ? "In Progress" : time}</small>
    </div>
  ))}</div>;
}

export function ContactActions({ onChat, onCall, large = false }) {
  return <div className={`contact-actions ${large ? "large-actions" : ""}`}>
    <button className="primary-button" onClick={onCall}><Phone size={19} fill="currentColor" />Call</button>
    <button className="secondary-button" onClick={onChat}><MessageSquareText size={19} fill="currentColor" />Message</button>
  </div>;
}

export function JobSummary() {
  return <section className="job-summary">
    <h3>Service Details</h3>
    <div className="summary-line"><Wrench /><span><strong>{booking.service}</strong><small>On-road assistance and diagnosis</small></span></div>
    <div className="summary-line"><CarFront /><span><strong>{booking.vehicle}</strong><small>{booking.plate} · {booking.vehicleColor}</small></span></div>
    <div className="summary-line"><MapPin /><span><strong>{booking.location}</strong><small>{booking.address}</small></span></div>
  </section>;
}

export function SafetyBanner() {
  return <div className="safety-banner"><ShieldCheck size={22} /><span><strong>Your safety comes first</strong><small>Never share an OTP or payment PIN until you meet your verified mechanic.</small></span><CircleHelp size={20} /></div>;
}

export function BackButton({ to = "/roadside/c16", children = "Back" }) {
  return <Link className="back-link" to={to}><ArrowLeft size={17} />{children}</Link>;
}

export function SectionTitle({ children, action }) {
  return <div className="section-title"><h2>{children}</h2>{action}</div>;
}
