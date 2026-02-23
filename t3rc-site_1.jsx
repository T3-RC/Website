import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────
const PAGES = { HOME: "home", ROBOTICS: "robotics", ENERGY: "energy" };

const ROBOTICS_PROJECTS = [
  {
    id: "quetzalcoatl",
    name: "Quetzalcóatl",
    subtitle: "Search & Rescue VTOL Drone",
    description:
      "Autonomous VTOL drone platform engineered for search and rescue operations. Combining fixed-wing endurance with multirotor precision, Quetzalcóatl deploys AI-driven object detection to locate survivors in disaster zones where every second counts.",
    specs: ["VTOL Tailsitter", "AI Object Detection", "60+ Min Endurance", "Autonomous Nav"],
    status: "In Development",
    number: "01",
  },
  {
    id: "rc-car",
    name: "Tlāloc",
    subtitle: "Autonomous Ground Vehicle",
    description:
      "All-terrain autonomous ground vehicle platform for reconnaissance and payload delivery in environments too dangerous for human operators. Sensor fusion and real-time path planning enable navigation through unstructured terrain.",
    specs: ["All-Terrain", "Sensor Fusion", "Path Planning", "Modular Payload"],
    status: "Research Phase",
    number: "02",
  },
  {
    id: "submarine",
    name: "Cipactli",
    subtitle: "Unmanned Underwater Vehicle",
    description:
      "Submersible autonomous platform for underwater inspection, environmental monitoring, and subsea operations. Pressure-rated hull with multi-axis thruster configuration enables precise maneuvering in confined underwater spaces.",
    specs: ["Depth-Rated Hull", "Multi-Axis Thrust", "Sonar Mapping", "Autonomous Return"],
    status: "Research Phase",
    number: "03",
  },
  {
    id: "robot-arm",
    name: "Tezcatlipoca",
    subtitle: "Collaborative Robot Arm",
    description:
      "Precision robotic manipulator designed for collaborative human-robot workflows. Force-sensing joints and adaptive gripping enable safe operation alongside human operators in manufacturing and research environments.",
    specs: ["6-DOF Articulation", "Force Sensing", "Adaptive Grip", "Human-Safe"],
    status: "Concept Phase",
    number: "04",
  },
];

const ENERGY_PROJECTS = [
  {
    id: "hydrogen-gen",
    name: "Tōnatiuh Reactor",
    subtitle: "Hydrogen Energy Generator",
    description:
      "Compact hydrogen generation system designed for distributed clean energy production. Electrochemical conversion architecture enables on-site hydrogen fuel generation from water, eliminating transportation logistics and reducing infrastructure dependency.",
    specs: ["Electrolysis Core", "Scalable Output", "Zero-Emission", "Grid-Independent"],
    status: "Research Phase",
    number: "01",
  },
];

// ─── STYLES ──────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Inter+Tight:wght@300;400;500;600;700;800;900&family=Familjen+Grotesk:wght@400;500;600;700&display=swap');

  :root {
    --bg-base: #111111;
    --bg-raised: #181818;
    --bg-surface: #1e1e1e;
    --bg-hover: #252525;
    --border: #2a2a2a;
    --border-strong: #3a3a3a;
    --accent: #e8e8e8;
    --accent-warm: #d4a055;
    --accent-warm-dim: rgba(212, 160, 85, 0.15);
    --green: #4a9e6e;
    --green-dim: rgba(74, 158, 110, 0.12);
    --yellow: #c49a3c;
    --yellow-dim: rgba(196, 154, 60, 0.12);
    --text-primary: #d4d4d4;
    --text-secondary: #808080;
    --text-tertiary: #555555;
    --text-faint: #333333;
    --danger: #b5453a;
    --font-display: 'Inter Tight', sans-serif;
    --font-body: 'Familjen Grotesk', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--bg-base);
    color: var(--text-primary);
    font-family: var(--font-body);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  .noise {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    background: rgba(17, 17, 17, 0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
  }

  .nav-mark {
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 13px;
    letter-spacing: 0.5px;
    color: var(--bg-base);
    background: var(--accent);
    padding: 5px 9px;
    line-height: 1;
  }

  .nav-name {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-secondary);
    letter-spacing: 0.5px;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .nav-link {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.5px;
    padding: 8px 18px;
    background: none;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 2px solid transparent;
  }

  .nav-link:hover {
    color: var(--text-primary);
    background: var(--bg-hover);
  }

  .nav-link.active {
    color: var(--accent-warm);
    border-bottom-color: var(--accent-warm);
  }

  .nav-divider {
    width: 1px;
    height: 20px;
    background: var(--border);
    margin: 0 4px;
  }

  .page {
    min-height: 100vh;
    padding-top: 56px;
    position: relative;
    z-index: 1;
  }

  .hero {
    min-height: calc(100vh - 56px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 32px 80px 64px;
    max-width: 900px;
    position: relative;
  }

  .hero-rule {
    width: 48px;
    height: 3px;
    background: var(--accent-warm);
    margin-bottom: 32px;
    opacity: 0;
    animation: slideIn 0.5s ease forwards 0.1s;
  }

  .hero-tag {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    letter-spacing: 1px;
    margin-bottom: 24px;
    opacity: 0;
    animation: slideIn 0.5s ease forwards 0.2s;
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(40px, 6.5vw, 80px);
    font-weight: 900;
    line-height: 0.95;
    letter-spacing: -2px;
    color: var(--accent);
    margin-bottom: 32px;
    opacity: 0;
    animation: slideIn 0.5s ease forwards 0.3s;
  }

  .hero-title .thin {
    font-weight: 300;
    color: var(--text-secondary);
  }

  .hero-desc {
    font-size: 17px;
    font-weight: 400;
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 560px;
    margin-bottom: 48px;
    opacity: 0;
    animation: slideIn 0.5s ease forwards 0.45s;
  }

  .hero-actions {
    display: flex;
    gap: 12px;
    opacity: 0;
    animation: slideIn 0.5s ease forwards 0.6s;
  }

  .btn-solid {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
    padding: 14px 28px;
    background: var(--accent);
    color: var(--bg-base);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-solid:hover {
    background: #fff;
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(255,255,255,0.08);
  }

  .btn-ghost {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
    padding: 14px 28px;
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-strong);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-ghost:hover {
    border-color: var(--text-secondary);
    color: var(--text-primary);
  }

  .hero-sidebar {
    position: absolute;
    right: 32px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 28px;
    opacity: 0;
    animation: slideIn 0.5s ease forwards 0.7s;
  }

  .sidebar-stat { text-align: right; }

  .sidebar-val {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 900;
    color: var(--text-primary);
    line-height: 1;
    margin-bottom: 4px;
  }

  .sidebar-label {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-tertiary);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .segments-section { padding: 0 32px 120px 64px; }

  .section-divider {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 48px;
    padding-top: 80px;
    border-top: 1px solid var(--border);
  }

  .divider-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-tertiary);
    white-space: nowrap;
  }

  .divider-line { flex: 1; height: 1px; background: var(--border); }

  .divider-num {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-faint);
  }

  .segments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 1px;
    background: var(--border);
    max-width: 1100px;
  }

  .segment-card {
    background: var(--bg-raised);
    padding: 40px 36px;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .segment-card:hover {
    background: var(--bg-surface);
  }

  .segment-card:hover .segment-arrow {
    transform: translateX(4px);
    color: var(--accent-warm);
  }

  .segment-num {
    font-family: var(--font-display);
    font-size: 64px;
    font-weight: 900;
    color: var(--text-faint);
    line-height: 1;
    margin-bottom: 20px;
    letter-spacing: -3px;
  }

  .segment-name {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 6px;
    color: var(--accent);
  }

  .segment-count {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    margin-bottom: 16px;
  }

  .segment-desc {
    font-size: 15px;
    line-height: 1.65;
    color: var(--text-secondary);
    margin-bottom: 28px;
  }

  .segment-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }

  .segment-tags { display: flex; gap: 6px; flex-wrap: wrap; }

  .segment-tag {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-tertiary);
    background: rgba(255,255,255,0.03);
    padding: 4px 10px;
    border: 1px solid var(--border);
  }

  .segment-arrow {
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--text-tertiary);
    transition: all 0.25s ease;
  }

  .sub-hero {
    padding: 80px 32px 40px 64px;
    max-width: 800px;
  }

  .sub-breadcrumb {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sub-breadcrumb .crumb-link {
    color: var(--text-tertiary);
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
    font-size: inherit;
    transition: color 0.2s;
  }

  .sub-breadcrumb .crumb-link:hover { color: var(--accent-warm); }

  .sub-hero .hero-rule { animation: none; opacity: 1; }

  .sub-title {
    font-family: var(--font-display);
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 900;
    letter-spacing: -1px;
    color: var(--accent);
    line-height: 1;
    margin-bottom: 20px;
  }

  .sub-desc {
    font-size: 16px;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 580px;
  }

  .projects-section {
    padding: 20px 32px 120px 64px;
    max-width: 1100px;
  }

  .project-card {
    display: grid;
    grid-template-columns: 72px 1fr 320px;
    border: 1px solid var(--border);
    background: var(--bg-raised);
    margin-bottom: 2px;
    transition: all 0.25s ease;
    overflow: hidden;
  }

  .project-card:hover {
    border-color: var(--border-strong);
    background: var(--bg-surface);
  }

  .project-card:hover .proj-num { color: var(--accent-warm); }

  .proj-num-col {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 36px;
    border-right: 1px solid var(--border);
    background: rgba(0,0,0,0.15);
  }

  .proj-num {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 900;
    color: var(--text-faint);
    transition: color 0.25s;
  }

  .proj-body { padding: 32px 36px; }

  .proj-name {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 0.5px;
    color: var(--accent);
    margin-bottom: 2px;
  }

  .proj-sub {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
    margin-bottom: 16px;
  }

  .proj-desc {
    font-size: 14px;
    line-height: 1.7;
    color: var(--text-secondary);
  }

  .proj-sidebar {
    padding: 32px 28px;
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 24px;
    background: rgba(0,0,0,0.1);
  }

  .proj-field-label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-faint);
    margin-bottom: 8px;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 5px 12px;
    width: fit-content;
  }

  .status-pill.dev {
    color: var(--green);
    background: var(--green-dim);
    border: 1px solid rgba(74, 158, 110, 0.2);
  }

  .status-pill.research {
    color: var(--yellow);
    background: var(--yellow-dim);
    border: 1px solid rgba(196, 154, 60, 0.2);
  }

  .status-pill.concept {
    color: var(--text-tertiary);
    background: rgba(80,80,80,0.1);
    border: 1px solid var(--border);
  }

  .status-pip {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }

  .specs-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .spec-row {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-secondary);
    padding: 6px 0;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .spec-row:last-child { border-bottom: none; }

  .spec-dash { color: var(--text-faint); font-size: 10px; }

  .footer {
    border-top: 1px solid var(--border);
    padding: 32px 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-left {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-tertiary);
  }

  .footer-left strong { color: var(--text-secondary); font-weight: 500; }

  .footer-right {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-faint);
    letter-spacing: 1px;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fade-in {
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 900px) {
    .hero { padding: 60px 24px; }
    .hero-sidebar { display: none; }
    .segments-section { padding: 0 24px 80px; }
    .segments-grid { grid-template-columns: 1fr; }
    .sub-hero { padding: 60px 24px 32px; }
    .projects-section { padding: 20px 24px 80px; }
    .project-card { grid-template-columns: 1fr; }
    .proj-num-col { display: none; }
    .proj-sidebar { border-left: none; border-top: 1px solid var(--border); }
    .footer { padding: 24px; flex-direction: column; gap: 12px; }
  }

  @media (max-width: 600px) {
    .nav { padding: 0 16px; }
    .nav-name { display: none; }
    .nav-link { padding: 8px 12px; font-size: 11px; }
  }
`;

// ─── FADE HOOK ───────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`fade-in ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────
function Nav({ page, setPage }) {
  return (
    <nav className="nav">
      <div className="nav-brand" onClick={() => setPage(PAGES.HOME)}>
        <span className="nav-mark">T3</span>
        <span className="nav-name">Research Collective</span>
      </div>
      <div className="nav-links">
        <button className={`nav-link ${page === PAGES.HOME ? "active" : ""}`} onClick={() => setPage(PAGES.HOME)}>
          Index
        </button>
        <div className="nav-divider" />
        <button className={`nav-link ${page === PAGES.ROBOTICS ? "active" : ""}`} onClick={() => setPage(PAGES.ROBOTICS)}>
          Robotics
        </button>
        <div className="nav-divider" />
        <button className={`nav-link ${page === PAGES.ENERGY ? "active" : ""}`} onClick={() => setPage(PAGES.ENERGY)}>
          Energy
        </button>
      </div>
    </nav>
  );
}

// ─── HOME ────────────────────────────────────────────────────
function HomePage({ setPage }) {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-rule" />
        <div className="hero-tag">Research Collective / Est. 2025</div>
        <h1 className="hero-title">
          T3 Research<br />
          <span className="thin">Collective</span>
        </h1>
        <p className="hero-desc">
          Grant-funded research engine building autonomous systems, clean energy platforms, and
          life-saving technology. Urgent problems turned into deployable solutions within 1–3 years.
        </p>
        <div className="hero-actions">
          <button className="btn-solid" onClick={() => setPage(PAGES.ROBOTICS)}>View Projects →</button>
          <button className="btn-ghost">Join the Collective</button>
        </div>
        <div className="hero-sidebar">
          {[
            { val: "5+", label: "Projects" },
            { val: "12", label: "Engineers" },
            { val: "3", label: "PhD Advisors" },
            { val: "2", label: "Segments" },
          ].map((s, i) => (
            <div className="sidebar-stat" key={i}>
              <div className="sidebar-val">{s.val}</div>
              <div className="sidebar-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="segments-section">
        <div className="section-divider">
          <span className="divider-label">Research Segments</span>
          <div className="divider-line" />
          <span className="divider-num">02</span>
        </div>
        <div className="segments-grid">
          <FadeIn>
            <div className="segment-card" onClick={() => setPage(PAGES.ROBOTICS)}>
              <div className="segment-num">01</div>
              <div className="segment-name">Robotics</div>
              <div className="segment-count">{ROBOTICS_PROJECTS.length} active projects</div>
              <p className="segment-desc">
                Autonomous drones, ground vehicles, submersibles, and collaborative manipulators.
                Platforms for search & rescue, reconnaissance, and precision operations in hostile environments.
              </p>
              <div className="segment-footer">
                <div className="segment-tags">
                  <span className="segment-tag">UAV</span>
                  <span className="segment-tag">UGV</span>
                  <span className="segment-tag">UUV</span>
                  <span className="segment-tag">Cobot</span>
                </div>
                <span className="segment-arrow">→</span>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="segment-card" onClick={() => setPage(PAGES.ENERGY)}>
              <div className="segment-num">02</div>
              <div className="segment-name">Energy</div>
              <div className="segment-count">{ENERGY_PROJECTS.length} active project</div>
              <p className="segment-desc">
                Distributed clean energy generation systems. On-site hydrogen production eliminating
                infrastructure dependency and transportation logistics for off-grid applications.
              </p>
              <div className="segment-footer">
                <div className="segment-tags">
                  <span className="segment-tag">H₂ Gen</span>
                  <span className="segment-tag">Electrolysis</span>
                  <span className="segment-tag">Off-Grid</span>
                </div>
                <span className="segment-arrow">→</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
      <Footer />
    </div>
  );
}

// ─── PROJECT CARD ────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const cls = project.status === "In Development" ? "dev" : project.status === "Research Phase" ? "research" : "concept";
  return (
    <FadeIn delay={index * 80}>
      <div className="project-card">
        <div className="proj-num-col">
          <span className="proj-num">{project.number}</span>
        </div>
        <div className="proj-body">
          <div className="proj-name">{project.name}</div>
          <div className="proj-sub">{project.subtitle}</div>
          <p className="proj-desc">{project.description}</p>
        </div>
        <div className="proj-sidebar">
          <div>
            <div className="proj-field-label">Status</div>
            <div className={`status-pill ${cls}`}>
              <span className="status-pip" />
              {project.status}
            </div>
          </div>
          <div>
            <div className="proj-field-label">Specifications</div>
            <div className="specs-list">
              {project.specs.map((s, i) => (
                <div className="spec-row" key={i}>
                  <span className="spec-dash">—</span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ─── ROBOTICS PAGE ───────────────────────────────────────────
function RoboticsPage({ setPage }) {
  return (
    <div className="page">
      <section className="sub-hero">
        <div className="sub-breadcrumb">
          <button className="crumb-link" onClick={() => setPage(PAGES.HOME)}>Index</button>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>Robotics</span>
        </div>
        <div className="hero-rule" />
        <h1 className="sub-title">Robotics</h1>
        <p className="sub-desc">
          Autonomous platforms across air, ground, sea, and workspace. Each system operates
          where human presence is impractical or dangerous.
        </p>
      </section>
      <section className="projects-section">
        <div className="section-divider" style={{ paddingTop: 40 }}>
          <span className="divider-label">Project Registry</span>
          <div className="divider-line" />
          <span className="divider-num">{String(ROBOTICS_PROJECTS.length).padStart(2, "0")}</span>
        </div>
        {ROBOTICS_PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </section>
      <Footer />
    </div>
  );
}

// ─── ENERGY PAGE ─────────────────────────────────────────────
function EnergyPage({ setPage }) {
  return (
    <div className="page">
      <section className="sub-hero">
        <div className="sub-breadcrumb">
          <button className="crumb-link" onClick={() => setPage(PAGES.HOME)}>Index</button>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>Energy</span>
        </div>
        <div className="hero-rule" />
        <h1 className="sub-title">Energy</h1>
        <p className="sub-desc">
          Distributed energy generation. Clean hydrogen production at point of use, eliminating
          grid dependency for remote and off-grid operations.
        </p>
      </section>
      <section className="projects-section">
        <div className="section-divider" style={{ paddingTop: 40 }}>
          <span className="divider-label">Project Registry</span>
          <div className="divider-line" />
          <span className="divider-num">{String(ENERGY_PROJECTS.length).padStart(2, "0")}</span>
        </div>
        {ENERGY_PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </section>
      <Footer />
    </div>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left"><strong>T3 Research Collective</strong> — © 2025</div>
      <div className="footer-right">ALL RIGHTS RESERVED</div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState(PAGES.HOME);
  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  return (
    <>
      <style>{styles}</style>
      <div className="noise" />
      <Nav page={page} setPage={navigate} />
      {page === PAGES.HOME && <HomePage setPage={navigate} />}
      {page === PAGES.ROBOTICS && <RoboticsPage setPage={navigate} />}
      {page === PAGES.ENERGY && <EnergyPage setPage={navigate} />}
    </>
  );
}
