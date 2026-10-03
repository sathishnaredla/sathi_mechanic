import { useContext, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  CarFront,
  Check,
  CheckCheck,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  Headset,
  Image,
  MapPin,
  MessageSquareText,
  Paperclip,
  Phone,
  Send,
  ShieldCheck,
  Star,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  ContactActions,
  Eta,
  JobSummary,
  MechanicAvatar,
  MechanicCard,
  Rating,
  SafetyBanner,
  ScreenTitle,
  SectionTitle,
  StatusPill,
  StatusTimeline,
  TrackingMap,
  VerificationBadge,
} from "./components.jsx";
import { booking, mechanic } from "./data.js";
import { chatService, mechanicService, trackingService } from "./services.js";
import { RoadsideContext } from "./App.jsx";

const paths = {
  matching: "/roadside/c16",
  assigned: "/roadside/c17",
  profile: "/roadside/c18",
  tracking: "/roadside/c19",
  chat: "/roadside/c20",
  arrived: "/roadside/c21",
  job: "/roadside/c22",
};

function MatchingSteps() {
  const steps = [
    ["Request confirmed", "We've received your request"],
    ["Searching nearby", "Finding the closest mechanics"],
    ["Checking availability", "Confirming who can help now"],
    ["Assigning mechanic", "Finalizing your match"],
  ];
  return <div className="matching-steps">{steps.map(([label, text], index) => (
    <div className={`matching-step ${index < 1 ? "done" : index === 1 ? "active" : ""}`} key={label}>
      <span className="step-circle">{index === 0 ? <Check size={17} /> : index + 1}</span>
      <strong>{label}</strong><small>{text}</small>
    </div>
  ))}</div>;
}

export function C16Matching() {
  const navigate = useNavigate();
  const { status, setStatus, setTrackingProgress } = useContext(RoadsideContext);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [cancelled, setCancelled] = useState(status === "cancelled");

  useEffect(() => {
    if (cancelled) return undefined;
    let active = true;
    mechanicService.findMechanic()
      .then(() => {
        if (active) {
          setStatus("assigned");
          navigate(paths.assigned);
        }
      })
      .catch((error) => {
        console.error("Unable to find a mechanic.", error);
        if (active) setSearchError("We couldn't find an available mechanic. Please try again.");
      });
    return () => { active = false; };
  }, [cancelled, navigate, setStatus]);

  if (cancelled) {
    return <section className="cancelled-panel panel">
      <StatusPill tone="blue">Request cancelled</StatusPill>
      <h1>Your request was cancelled</h1>
      <p>No mechanic has been dispatched. You can start a new roadside request whenever you’re ready.</p>
      <button className="primary-button" onClick={() => { setStatus("searching"); setTrackingProgress(0.16); setCancelled(false); }}>Start a new search</button>
    </section>;
  }

  return (
    <div className="matching-layout">
      <section className="matching-panel panel">
        <StatusPill tone="blue">Live matching</StatusPill>
        <h1 className="matching-title">Matching you with the <span>best nearby mechanic.</span></h1>
        <p className="matching-copy">We’re finding a verified, available mechanic near your location.<br />This usually takes 1–2 minutes.</p>
        <MatchingSteps />
        <div className="matching-metrics">
          <div><span className="metric-icon blue-text"><Wrench size={32} /></span><b>5</b><strong>Nearby Mechanics</strong><small>Within 10 km</small></div>
          <div><span className="metric-icon green-text"><ShieldCheck size={32} /></span><b>2</b><strong>Available Now</strong><small>Can reach you quickly</small></div>
          <div><span className="metric-icon blue-text"><Clock3 size={32} /></span><b>1–2 min</b><strong>Estimated Match</strong><small>Finding the best fit</small></div>
        </div>
        <div className="request-strip"><CarFrontIcon /><span><strong>{booking.vehicle}</strong><small>{booking.plate} · White</small></span><span className="request-divider" /><Zap size={25} /><span><strong>{booking.service}</strong><small>Car won’t start</small></span></div>
        {searchError && <div className="inline-error" role="alert">{searchError}<button onClick={() => window.location.reload()}>Retry</button></div>}
        <div className="cancel-row"><button onClick={() => setCancelOpen(true)}><X size={18} /> Cancel Request</button><small>You can cancel anytime while we’re searching.</small></div>
      </section>
      <section className="matching-map-wrap">
        <TrackingMap progress={0} matching />
        <div className="matching-map-profile"><MechanicAvatar /><div><strong>{mechanic.name}</strong><Rating compact /><VerificationBadge /><span className="arrival-chip"><Clock3 size={14} /> 12 min est. arrival</span></div><ContactActions onCall={() => window.location.href = `tel:${mechanic.phone}`} onChat={() => navigate(paths.chat)} /></div>
      </section>
      {cancelOpen && <div className="modal-backdrop" role="presentation" onClick={() => setCancelOpen(false)}><div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="cancel-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close" onClick={() => setCancelOpen(false)}><X /></button><h2 id="cancel-title">Cancel your request?</h2><p>Your roadside assistance request is still being matched. You can continue waiting or cancel now.</p><div className="modal-actions"><button className="secondary-button" onClick={() => setCancelOpen(false)}>Keep waiting</button><button className="danger-button" onClick={() => { setCancelOpen(false); setStatus("cancelled"); setCancelled(true); }}>Cancel request</button></div></div></div>}
    </div>
  );
}

function CarFrontIcon() {
  return <span className="car-thumb"><img src="/assets/vehicle.png" alt="" /></span>;
}

export function C17Assigned() {
  const navigate = useNavigate();
  const { setStatus } = useContext(RoadsideContext);
  const go = (route) => { setStatus("assigned"); navigate(route); };
  return <div className="assigned-layout">
    <section className="assigned-left">
      <ScreenTitle eyebrow="Help is on the way" title="Mechanic assigned" subtitle={`${mechanic.name} is on his way to your location.`} />
      <MechanicCard onCall={() => window.location.href = `tel:${mechanic.phone}`} onChat={() => go(paths.chat)} />
      <button className="secondary-button full-button" onClick={() => go(paths.profile)}>View mechanic profile <ArrowRight size={17} /></button>
      <div className="assigned-details">
        <div><span className="detail-icon"><Clock3 /></span><span><small>ETA</small><strong>{mechanic.eta}</strong></span></div>
        <div><span className="detail-icon"><MapPin /></span><span><small>Distance</small><strong>{mechanic.distance}</strong></span></div>
      </div>
      <div className="assignment-cards"><div><h3>Your Vehicle</h3><CarFrontIcon /><strong>{booking.vehicle}</strong><small>{booking.plate}</small></div><div><h3>Service Requested</h3><Wrench /><strong>{booking.service}</strong><small>On-road assistance and diagnosis</small></div></div>
      <div className="assignment-status"><SectionTitle>Live Status</SectionTitle><StatusTimeline /></div>
      <button className="primary-button wide-button" onClick={() => go(paths.tracking)}><MapPin size={19} /> Track mechanic live <ArrowRight size={19} /></button>
    </section>
    <section className="assigned-map-column">
      <TrackingMap progress={0.16} />
      <div className="map-mechanic-strip"><MechanicAvatar /><div><strong>{mechanic.name}</strong><Rating compact /><VerificationBadge /></div><div className="strip-vehicle"><CarFrontIcon /><span><strong>{booking.vehicle}</strong><small>{booking.plate}</small></span></div><ContactActions onCall={() => window.location.href = `tel:${mechanic.phone}`} onChat={() => go(paths.chat)} /></div>
      <SafetyBanner />
    </section>
  </div>;
}

export function C18Profile() {
  const navigate = useNavigate();
  return <div className="profile-page">
    <div className="breadcrumbs"><Link to={paths.assigned}>Assignment</Link><ChevronRight size={15} /><span>Mechanic profile</span></div>
    <div className="profile-columns">
      <section className="profile-main panel">
        <div className="profile-hero">
          <div className="profile-photo-wrap"><MechanicAvatar size="profile" /><VerificationBadge /></div>
          <div className="profile-intro"><h1>{mechanic.name}</h1><div className="profile-rating"><Rating /><span className="vertical-divider" /><span><Wrench size={21} /><strong>6 Years</strong><small>Experience</small></span></div><p>Professional roadside mechanic providing fast, reliable and friendly assistance. Available across Hyderabad and nearby areas.</p>
            <div className="profile-stats"><div><CarFront /><span><strong>320+</strong><small>Completed Rescues</small></span></div><div><ShieldCheck /><span><strong>6 Years</strong><small>Experience</small></span></div><div><Star /><span><strong>4.9</strong><small>Average Rating</small></span></div></div>
          </div>
        </div>
        <div className="profile-services"><h2>Service Specialties</h2><div className="specialty-grid">{[["Car Repair", "On-road & minor repairs", <Wrench />], ["Battery Jump Start", "Quick battery assistance", <BatteryCharging />], ["Puncture Service", "Tyre change & repair", <Zap />], ["Towing Service", "Safe towing to nearest garage", <CarFrontIcon />]].map(([name, description, icon]) => <div className="specialty" key={name}><span>{icon}</span><div><strong>{name}</strong><small>{description}</small></div></div>)}</div></div>
        <div className="profile-extras"><div><MessageSquareText /><strong>Languages Spoken</strong><small>English, Hindi, Telugu</small></div><div><ShieldCheck /><strong>Background Checked</strong><small>Verified by OmegaNexora</small><strong>Identity Verified</strong><small>Aadhaar & license verified</small></div></div>
        <div className="reviews-block"><SectionTitle>Customer Reviews</SectionTitle><div className="review-grid">{[["Sandeep R.", "“Very professional and reached within 15 minutes. Fixed the issue quickly.”"], ["Priya M.", "“Polite, knowledgeable and helped with battery jump start. Excellent service!”"], ["Arjun K.", "“Reached on time and handled the puncture very efficiently.”"]].map(([name, quote]) => <article className="review-card" key={name}><strong>{name}</strong><span>★★★★★</span><p>{quote}</p></article>)}</div></div>
      </section>
      <aside className="profile-side">
        <section className="panel current-assignment"><div className="section-title"><h2>Current Assignment</h2><StatusPill>On the way</StatusPill></div><div className="assignment-eta"><Eta value={mechanic.eta} /><span className="vertical-divider" /><Eta label="Distance" value={mechanic.distance} /></div><div className="mini-map"><TrackingMap progress={0.23} compact={true} controls={false} /></div><ContactActions large onCall={() => window.location.href = `tel:${mechanic.phone}`} onChat={() => navigate(paths.chat)} /><button className="secondary-button full-button" onClick={() => navigate(paths.tracking)}><MapPin size={18} /> View Live Tracking</button></section>
        <section className="panel trust-panel"><h2>Trust &amp; Safety</h2><div className="trust-items"><span><ShieldCheck /><strong>Verified<br />Mechanics</strong><small>Trained &amp; background checked</small></span><span><ShieldCheck /><strong>Identity<br />Verified</strong><small>Aadhaar &amp; license verification</small></span><span><ShieldCheck /><strong>Safe &amp; Secure<br />Service</strong><small>Your safety is our priority</small></span></div></section>
      </aside>
    </div>
  </div>;
}

export function C19Tracking() {
  const navigate = useNavigate();
  const { setStatus, trackingProgress: progress, setTrackingProgress } = useContext(RoadsideContext);
  const [copied, setCopied] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  useEffect(() => {
    const timer = window.setInterval(() => setTrackingProgress((value) => Math.min(1, Number((value + .045).toFixed(3)))), 2200);
    return () => window.clearInterval(timer);
  }, [setTrackingProgress]);
  useEffect(() => {
    if (progress >= 1) {
      setStatus("arrived");
      navigate(paths.arrived);
    }
  }, [navigate, progress, setStatus]);
  const estimate = trackingService.getLocation(progress);
  const goChat = () => navigate(paths.chat);
  return <div className="tracking-page">
    <section className="tracking-sidebar panel">
      <div className="service-id-row"><button className="back-link" onClick={() => navigate(paths.assigned)}><ArrowLeft size={17} /> Back to request</button><button className="service-id" onClick={() => { navigator.clipboard?.writeText(booking.id); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }}>Job #{booking.id} {copied ? <Check size={15} /> : <Copy size={15} />}</button></div>
      <ScreenTitle title="Mechanic is on the way" subtitle={`${mechanic.name} is heading to your location. You can track his live location below.`} />
      <MechanicCard compact onCall={() => window.location.href = `tel:${mechanic.phone}`} onChat={goChat} />
      <div className="tracking-timeline"><StatusTimeline compact /></div>
      <div className="tracking-facts"><Eta value={estimate.eta} /><span className="vertical-divider" /><Eta label="Distance" value={estimate.distance} /></div>
      <JobSummary />
      <div className="tracking-bottom-actions"><button className="danger-outline" onClick={() => setCancelOpen(true)}><X size={16} /> Cancel Request</button><button className="secondary-button" onClick={() => window.location.href = "tel:1800123456"}><Headset size={16} /> Get Help</button></div>
      <small className="fine-print">You can cancel free of charge before the mechanic arrives.</small>
    </section>
    <section className="tracking-map-column"><TrackingMap progress={progress} /><div className="tracking-map-footer"><MechanicAvatar /><div><strong>{mechanic.name}</strong><Rating compact /><VerificationBadge /></div><span className="footer-divider" /><CarFrontIcon /><span><strong>{booking.vehicle}</strong><small>{booking.plate}</small></span><ContactActions onCall={() => window.location.href = `tel:${mechanic.phone}`} onChat={goChat} /></div></section>
    {cancelOpen && <div className="modal-backdrop" role="presentation" onClick={() => setCancelOpen(false)}><div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="tracking-cancel-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close" onClick={() => setCancelOpen(false)}><X /></button><h2 id="tracking-cancel-title">Cancel your roadside request?</h2><p>Your mechanic is already on the way. If you cancel, the mechanic will be notified and your request will end.</p><div className="modal-actions"><button className="secondary-button" onClick={() => setCancelOpen(false)}>Keep request</button><button className="danger-button" onClick={() => { setStatus("cancelled"); navigate(paths.matching); }}>Cancel request</button></div></div></div>}
  </div>;
}

function MessageBubble({ message }) {
  const mine = message.from === "customer";
  return <div className={`message-row ${mine ? "mine" : ""}`}>{!mine && <MechanicAvatar size="xs" />}<div className="message-content"><div className="message-bubble">{message.text}</div><small>{message.time}{mine && <CheckCheck size={14} />}</small></div></div>;
}

export function C20Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => chatService.getMessages());
  const [draft, setDraft] = useState("");
  const [noticeOpen, setNoticeOpen] = useState(true);
  const send = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((items) => [...items, chatService.sendMessage(text)]);
    setDraft("");
  };
  return <div className="chat-page">
    <aside className="chat-sidebar panel">
      <div className="chat-sidebar-title"><button className="back-link" onClick={() => navigate(paths.tracking)}><ArrowLeft size={18} />Active Roadside Job</button><button className="service-id" onClick={() => navigator.clipboard?.writeText(booking.id)}>Job #{booking.id}</button></div>
      <MechanicCard onCall={() => window.location.href = `tel:${mechanic.phone}`} onChat={() => {}} />
      <div className="chat-eta-card"><div><span className="detail-icon"><CarFront /></span><Eta value={mechanic.eta} /></div><div className="chat-map-preview"><TrackingMap progress={0.38} compact controls={false} /></div></div>
      <div className="chat-job-list">{[["Current Service", booking.service, "Get back on the road in minutes"], ["Your Vehicle", booking.vehicle, `${booking.vehicleColor} · ${booking.plate}`], ["Your Location", "Near IKEA Hitec City", booking.location]].map(([label, value, sub], index) => <div key={label}><span>{index === 0 ? <Wrench /> : index === 1 ? <CarFrontIcon /> : <MapPin />}</span><small>{label}</small><strong>{value}</strong><em>{sub}</em></div>)}</div>
      <h3>Job Status</h3><StatusTimeline compact />
    </aside>
    <section className="chat-conversation panel">
      <header className="chat-header"><MechanicAvatar /><div><h1>Chat with {mechanic.name}</h1><StatusPill>Online · Verified Mechanic</StatusPill></div><button className="primary-button" onClick={() => window.location.href = `tel:${mechanic.phone}`}><Phone size={17} /> Call</button></header>
      {noticeOpen && <div className="chat-safety"><ShieldCheck size={22} /><span>For your safety: Never share OTP, payment PIN, or banking details with anyone, including mechanics.</span><button aria-label="Close safety notice" onClick={() => setNoticeOpen(false)}><X size={18} /></button></div>}
      <div className="messages-list">{messages.map((message) => <MessageBubble key={message.id} message={message} />)}</div>
      <form className="chat-composer" onSubmit={send}><button type="button" className="attach-button" aria-label="Attach a photo" onClick={() => document.getElementById("chat-file").click()}><Paperclip size={21} /></button><input id="chat-file" type="file" accept="image/*" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) setMessages((items) => [...items, chatService.sendMessage(`Photo shared: ${file.name}`)]); }} /><input aria-label="Message" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Type a message to ${mechanic.name}...`} /><button type="button" className="composer-aux" onClick={() => setMessages((items) => [...items, chatService.sendMessage("I'm sharing my current location.")])}><MapPin size={17} />Share Location</button><button type="button" className="composer-aux photo-aux" onClick={() => document.getElementById("chat-file").click()}><Image size={17} />Share Photo</button><button type="submit" className="send-button" disabled={!draft.trim()}><Send size={18} />Send</button></form>
    </section>
  </div>;
}

export function C21Arrived() {
  const navigate = useNavigate();
  const [otpVisible, setOtpVisible] = useState(false);
  return <div className="arrived-layout">
    <section className="arrived-left panel">
      <StatusPill>Live service</StatusPill>
      <h1 className="arrived-title">Your mechanic<br /><span>has arrived <Check size={42} /></span></h1>
      <p className="arrived-lead">{mechanic.name} has reached your location and is ready to help. Your vehicle support will begin shortly.</p>
      <div className="arrived-mechanic"><MechanicAvatar /><div><strong>{mechanic.name}</strong><Rating /><VerificationBadge /></div><ContactActions onCall={() => window.location.href = `tel:${mechanic.phone}`} onChat={() => navigate(paths.chat)} /></div>
      <div className="arrived-summary">{[[<CarFront />, "Your Vehicle", booking.vehicle, booking.plate], [<Wrench />, "Service Request", booking.service, "Get back on the road in minutes"], [<MapPin />, "Meeting Point", "IKEA Hitec City", "Main entrance parking area"]].map(([icon, label, value, sub]) => <div key={label}><span className="summary-icon">{icon}</span><small>{label}</small><strong>{value}</strong><em>{sub}</em></div>)}</div>
      <div className="arrival-progress"><div className="progress-point done"><Check /></div><span className="progress-line" /><div className="progress-point done"><Check /></div><span className="progress-line" /><div className="progress-point arrived"><Wrench /></div><span className="progress-line muted" /><div className="progress-point muted"><Wrench /></div><div className="progress-labels"><span>Request<br />Confirmed</span><span>Mechanic<br />on the Way</span><span>Mechanic<br />Arrived</span><span>Service in<br />Progress</span></div></div>
      <SafetyBanner />
    </section>
    <section className="arrived-right">
      <div className="arrived-map-card"><TrackingMap progress={1} arrived /><div className="same-location"><StatusPill>Both at the same location</StatusPill><strong>{booking.location}</strong><small>{booking.address}</small></div></div>
      <div className="otp-card panel"><div className="otp-head"><ShieldCheck /><span><strong>Share start-service OTP only after you meet the mechanic</strong><small>For your safety, share this OTP in person after verifying your mechanic.</small></span></div><div className="otp-actions"><strong>{otpVisible ? "4 8 2 1" : "••••"}</strong><button className="primary-button" onClick={() => setOtpVisible((visible) => !visible)}><Check size={18} />{otpVisible ? "Hide OTP" : "View OTP"}</button></div><button className="secondary-button full-button" onClick={() => window.location.href = "tel:1800123456"}><CircleHelp size={18} /> I can’t find the mechanic</button></div>
      <button className="primary-button wide-button" onClick={() => navigate(paths.job)}>View current job status <ArrowRight size={18} /></button>
    </section>
  </div>;
}

const jobStages = [
  ["Request Confirmed", "Your request has been received.", "10:12 AM", "done"],
  ["Mechanic Assigned", `${mechanic.name} has been assigned to your job.`, "10:14 AM", "done"],
  ["Arrived at Location", "Mechanic has arrived and started inspection.", "10:28 AM", "done"],
  ["Diagnosis in progress", "Mechanic is checking and diagnosing the issue.", "10:35 AM", "current"],
  ["Quote Approval", "You’ll receive a repair estimate for approval.", "Pending", "pending"],
  ["Work in Progress", "Repairs will begin after your approval.", "Pending", "pending"],
  ["Completion", "Your vehicle will be ready soon.", "Pending", "pending"],
];

export function C22CurrentJob() {
  const navigate = useNavigate();
  return <div className="job-page">
    <div className="job-page-heading"><button className="back-link" onClick={() => navigate(paths.arrived)}><ArrowLeft size={17} /> Back to arrival</button><div className="job-head-row"><div><h1>Service in progress</h1><p>We’re on it! Your vehicle is being diagnosed. You’ll receive live updates at every step.</p></div><div className="diagnostic-time"><Clock3 /><span><small>Estimated diagnosis time</small><strong>10 – 15 min</strong></span><span className="live-updates"><i /> Live Updates<small>Real-time tracking</small></span></div></div></div>
    <div className="job-columns">
      <section className="job-vehicle-card panel"><div className="job-id-status"><span><small>Job ID</small><strong>{booking.id}</strong></span><StatusPill tone="blue">In Progress</StatusPill></div><div className="vehicle-display"><CarFrontIcon /><span><strong>{booking.vehicle}</strong><small>{booking.plate}</small></span></div><div className="job-info-line"><Wrench /><span><strong>{booking.service}</strong><small>Vehicle will not start</small></span></div><div className="job-info-line"><MapPin /><span><strong>{booking.location}</strong><small>{booking.address}</small></span></div><div className="job-mechanic"><h3>Your Mechanic</h3><MechanicCard onCall={() => window.location.href = `tel:${mechanic.phone}`} onChat={() => navigate(paths.chat)} /></div></section>
      <section className="job-timeline-card panel"><SectionTitle>Service Timeline</SectionTitle><p>Track your service progress in real time.</p><div className="job-stages">{jobStages.map(([title, description, time, state], index) => <div className={`job-stage ${state}`} key={title}><span className="stage-marker">{state === "done" ? <Check size={17} /> : state === "current" ? <span /> : null}</span><div className="stage-card"><span className="stage-icon">{index === 0 ? <Copy /> : index === 1 ? <Wrench /> : index === 2 ? <MapPin /> : index === 3 ? <CircleHelp /> : index === 4 ? <ShieldCheck /> : index === 5 ? <Wrench /> : <Check />}</span><span className="stage-copy"><strong>{title}</strong><small>{description}</small></span><span className="stage-time">{time}</span></div></div>)}</div></section>
      <aside className="job-updates panel"><SectionTitle>Live Updates</SectionTitle><div className="updated-time"><i /> Last updated 2 min ago</div><article className="live-update-card"><small>10:35 AM</small><strong>Diagnosis in progress</strong><p>Mechanic is checking the engine and scanning for fault codes. We’ll share the estimate shortly.</p></article><article className="estimate-card"><Clock3 /><span><strong>Estimated diagnosis time</strong><small>You’ll be notified once the diagnosis is complete.</small></span><b>10 – 15 min</b></article><article className="mechanic-note"><MessageSquareText /><div><strong>Mechanic’s Note</strong><small>10:35 AM</small><p>“Checking battery, starter and engine sensors. Will confirm the exact cause shortly.”</p><em>– {mechanic.name}</em></div></article><article className="photo-update"><Image /><strong>Photo from Mechanic</strong><span>10:35 AM</span><div className="engine-image"><BatteryCharging /><span>Vehicle inspection<br />photo update</span></div></article><button className="secondary-button full-button" onClick={() => window.location.href = "tel:1800123456"}><Headset size={18} /> Contact Support</button></aside>
    </div>
    <div className="job-emergency"><span><ShieldCheck /><strong>SOS Emergency Assistance</strong><small>In a dangerous situation? Get immediate help now.</small></span><button className="danger-button" onClick={() => window.location.href = "tel:112"}><Phone size={16} /> Emergency SOS</button><small>For life-threatening situations only.</small></div>
  </div>;
}
