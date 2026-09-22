import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, isAuthenticated } = useAuth();

  const dashboardPath =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "employer"
      ? "/employer/dashboard"
      : "/jobseeker/dashboard";

  return (
    <main style={styles.page}>
      <div style={styles.backgroundShapeOne}></div>
      <div style={styles.backgroundShapeTwo}></div>

      {/* ================= HERO ================= */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>

          <div style={styles.badge}>
            <span style={styles.badgeDot}></span>
            Your next opportunity starts here
          </div>

          <h1 style={styles.heroHeading}>
            Find work that
            <br />
            <span style={styles.highlight}>
              moves you forward.
            </span>
          </h1>

          <p style={styles.heroDescription}>
            Discover meaningful opportunities, connect with employers,
            apply with confidence, and manage your career journey from
            one place.
          </p>

          <div style={styles.heroButtons}>
            <Link
              to="/jobs"
              style={styles.primaryButton}
            >
              Explore Jobs
              <span style={styles.buttonArrow}>→</span>
            </Link>

            {!isAuthenticated && (
              <Link
                to="/register"
                style={styles.secondaryButton}
              >
                Create Account
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to={dashboardPath}
                style={styles.secondaryButton}
              >
                Go to Dashboard
              </Link>
            )}
          </div>

          {/* Process */}
          <div style={styles.process}>
            <ProcessItem
              number="01"
              title="Discover"
              text="Find opportunities"
            />

            <div style={styles.processLine}></div>

            <ProcessItem
              number="02"
              title="Connect"
              text="Apply with ease"
            />

            <div style={styles.processLine}></div>

            <ProcessItem
              number="03"
              title="Grow"
              text="Build your career"
            />
          </div>

        </div>

        {/* ================= HERO VISUAL ================= */}
        <div style={styles.heroVisual}>

          <div style={styles.heroGlow}></div>

          <div style={styles.heroCard}>

            <div style={styles.heroCardHeader}>
              <div style={styles.heroCardIcon}>
                💼
              </div>

              <div>
                <span style={styles.cardSmallLabel}>
                  CAREERCONNECT
                </span>

                <strong style={styles.cardHeaderTitle}>
                  Career opportunities
                </strong>
              </div>

              <span style={styles.liveBadge}>
                ● LIVE
              </span>
            </div>

            <div style={styles.cardDivider}></div>

            <div style={styles.heroCardMain}>
              <span style={styles.cardMainLabel}>
                YOUR NEXT MOVE
              </span>

              <h2 style={styles.heroCardTitle}>
                Build your career
                <br />
                with confidence.
              </h2>

              <p style={styles.heroCardDescription}>
                Search for jobs, submit your resume, and keep track
                of your applications from one simple dashboard.
              </p>
            </div>

            <div style={styles.miniSearch}>
              <span style={styles.miniSearchIcon}>
                🔎
              </span>

              <span style={styles.miniSearchText}>
                Search opportunities
              </span>

              <span style={styles.miniSearchArrow}>
                →
              </span>
            </div>

            <div style={styles.heroCardStats}>

              <StatItem
                number="01"
                title="Find jobs"
              />

              <StatItem
                number="02"
                title="Apply easily"
              />

              <StatItem
                number="03"
                title="Track progress"
              />

            </div>

          </div>

        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section style={styles.featuresSection}>

        <div style={styles.sectionHeading}>
          <span style={styles.sectionLabel}>
            WHY CAREERCONNECT?
          </span>

          <h2 style={styles.sectionTitle}>
            Everything you need for your
            <br />
            <span style={styles.highlight}>
              job search.
            </span>
          </h2>

          <p style={styles.sectionDescription}>
            A simple platform designed to connect talented people
            with meaningful opportunities.
          </p>
        </div>

        <div style={styles.featureGrid}>

          <FeatureCard
            number="01"
            icon="🔎"
            title="Find Jobs"
            description="Search and filter jobs by title, company, location, and job type."
          />

          <FeatureCard
            number="02"
            icon="📄"
            title="Easy Applications"
            description="Upload your resume and apply for jobs through a simple application process."
          />

          <FeatureCard
            number="03"
            icon="📊"
            title="Track Applications"
            description="Keep track of your applications and monitor their current status."
          />

        </div>
      </section>

      {/* ================= EMPLOYER ================= */}
      <section style={styles.employerSection}>

        <div style={styles.employerContent}>

          <span style={styles.employerLabel}>
            FOR EMPLOYERS
          </span>

          <h2 style={styles.employerTitle}>
            Find the right talent
            <br />
            <span style={styles.employerHighlight}>
              for your team.
            </span>
          </h2>

          <p style={styles.employerDescription}>
            Create job openings, manage applicants, review resumes,
            and update application statuses from one dashboard.
          </p>

          <Link
            to={
              user?.role === "employer"
                ? "/employer/create-job"
                : "/register"
            }
            style={styles.employerButton}
          >
            {user?.role === "employer"
              ? "Post a Job"
              : "Join as Employer"}

            <span>→</span>
          </Link>

        </div>

        <div style={styles.employerVisual}>

          <div style={styles.employerGlow}></div>

          <div style={styles.employerCard}>

            <div style={styles.employerCardHeader}>

              <div style={styles.companyIcon}>
                🏢
              </div>

              <div style={styles.employerCardHeading}>
                <strong>
                  Build your team
                </strong>

                <span>
                  Find skilled candidates
                </span>
              </div>

            </div>

            <div style={styles.candidateRow}>

              <div style={styles.avatar}>
                👤
              </div>

              <div style={styles.candidateInfo}>
                <strong>
                  Skilled candidates
                </strong>

                <span>
                  Ready for their next opportunity
                </span>
              </div>

              <span style={styles.checkMark}>
                ✓
              </span>

            </div>

            <div style={styles.candidateRow}>

              <div style={styles.avatar}>
                💻
              </div>

              <div style={styles.candidateInfo}>
                <strong>
                  Relevant skills
                </strong>

                <span>
                  Connect with the right talent
                </span>
              </div>

              <span style={styles.checkMark}>
                ✓
              </span>

            </div>

            <div style={styles.candidateRow}>

              <div style={styles.avatar}>
                📈
              </div>

              <div style={styles.candidateInfo}>
                <strong>
                  Manage applications
                </strong>

                <span>
                  Track candidates in one place
                </span>
              </div>

              <span style={styles.checkMark}>
                ✓
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}
      {!isAuthenticated && (
        <section style={styles.ctaSection}>

          <div style={styles.ctaContent}>

            <div style={styles.ctaIcon}>
              🚀
            </div>

            <span style={styles.ctaBadge}>
              GET STARTED
            </span>

            <h2 style={styles.ctaTitle}>
              Ready to take the
              <br />
              <span>next step?</span>
            </h2>

            <p style={styles.ctaDescription}>
              Create your CareerConnect account and start exploring
              opportunities today.
            </p>

            <Link
              to="/register"
              style={styles.ctaButton}
            >
              Create Your Account
              <span>→</span>
            </Link>

          </div>

        </section>
      )}
    </main>
  );
}

/* ================= PROCESS ITEM ================= */

function ProcessItem({ number, title, text }) {
  return (
    <div style={styles.processItem}>
      <strong>{number}</strong>

      <div>
        <span>{title}</span>
        <small>{text}</small>
      </div>
    </div>
  );
}

/* ================= STAT ITEM ================= */

function StatItem({ number, title }) {
  return (
    <div style={styles.statItem}>
      <strong>{number}</strong>
      <span>{title}</span>
    </div>
  );
}

/* ================= FEATURE CARD ================= */

function FeatureCard({
  number,
  icon,
  title,
  description,
}) {
  return (
    <div style={styles.featureCard}>

      <div style={styles.featureTop}>

        <div style={styles.featureIcon}>
          {icon}
        </div>

        <span style={styles.featureNumber}>
          {number}
        </span>

      </div>

      <h3 style={styles.featureTitle}>
        {title}
      </h3>

      <p style={styles.featureDescription}>
        {description}
      </p>

      <div style={styles.featureLine}></div>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 70px)",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)",
    position: "relative",
    overflow: "hidden",
  },

  backgroundShapeOne: {
    position: "absolute",
    width: "540px",
    height: "540px",
    borderRadius: "50%",
    background: "rgba(99, 102, 241, 0.065)",
    top: "-280px",
    left: "-230px",
    pointerEvents: "none",
  },

  backgroundShapeTwo: {
    position: "absolute",
    width: "470px",
    height: "470px",
    borderRadius: "50%",
    background: "rgba(59, 130, 246, 0.05)",
    top: "420px",
    right: "-260px",
    pointerEvents: "none",
  },

  heroSection: {
    maxWidth: "1180px",
    margin: "0 auto",
    minHeight: "650px",
    padding: "70px 24px 65px",
    display: "grid",
    gridTemplateColumns: "1fr 460px",
    gap: "70px",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },

  heroContent: {
    maxWidth: "660px",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "9px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "24px",
    border: "1px solid #e0e7ff",
  },

  badgeDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#4f46e5",
  },

  heroHeading: {
    fontSize: "59px",
    lineHeight: "1.06",
    letterSpacing: "-2.8px",
    color: "#0f172a",
    margin: "0 0 23px",
    fontWeight: "800",
  },

  highlight: {
    color: "#4f46e5",
  },

  heroDescription: {
    maxWidth: "610px",
    color: "#64748b",
    fontSize: "17px",
    lineHeight: "1.7",
    margin: "0 0 30px",
  },

  heroButtons: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    flexWrap: "wrap",
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    background:
      "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    textDecoration: "none",
    padding: "14px 20px",
    borderRadius: "11px",
    fontSize: "13px",
    fontWeight: "700",
    boxShadow:
      "0 9px 22px rgba(79, 70, 229, 0.20)",
  },

  buttonArrow: {
    fontSize: "17px",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
    color: "#334155",
    textDecoration: "none",
    padding: "13px 19px",
    borderRadius: "11px",
    fontSize: "13px",
    fontWeight: "700",
    border: "1px solid #dbe2ea",
    boxShadow:
      "0 5px 15px rgba(15, 23, 42, 0.05)",
  },

  process: {
    display: "flex",
    alignItems: "center",
    gap: "17px",
    marginTop: "42px",
  },

  processItem: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  processLine: {
    width: "28px",
    height: "1px",
    background: "#cbd5e1",
  },

  processItemStrong: {
    color: "#4f46e5",
  },

  heroVisual: {
    position: "relative",
  },

  heroGlow: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background:
      "rgba(99, 102, 241, 0.10)",
    top: "-60px",
    right: "-55px",
    filter: "blur(2px)",
  },

  heroCard: {
    position: "relative",
    background: "#ffffff",
    borderRadius: "26px",
    padding: "30px",
    boxShadow:
      "0 25px 70px rgba(15, 23, 42, 0.12)",
    border: "1px solid rgba(226, 232, 240, 0.9)",
  },

  heroCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    marginBottom: "21px",
  },

  heroCardIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    flexShrink: 0,
  },

  cardSmallLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1px",
    marginBottom: "3px",
  },

  cardHeaderTitle: {
    display: "block",
    color: "#334155",
    fontSize: "12px",
  },

  liveBadge: {
    marginLeft: "auto",
    color: "#15803d",
    background: "#f0fdf4",
    padding: "6px 9px",
    borderRadius: "999px",
    fontSize: "9px",
    fontWeight: "800",
  },

  cardDivider: {
    height: "1px",
    background: "#e2e8f0",
    marginBottom: "25px",
  },

  heroCardMain: {
    marginBottom: "22px",
  },

  cardMainLabel: {
    color: "#4f46e5",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.2px",
  },

  heroCardTitle: {
    margin: "9px 0 12px",
    fontSize: "28px",
    lineHeight: "1.2",
    color: "#111827",
    letterSpacing: "-0.8px",
  },

  heroCardDescription: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.65",
  },

  miniSearch: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 13px",
    borderRadius: "11px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    marginBottom: "23px",
  },

  miniSearchIcon: {
    fontSize: "13px",
  },

  miniSearchText: {
    flex: 1,
    color: "#94a3b8",
    fontSize: "11px",
  },

  miniSearchArrow: {
    color: "#4f46e5",
    fontWeight: "800",
  },

  heroCardStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
  },

  statItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "10px",
    borderRadius: "9px",
    background: "#f8fafc",
  },

  featuresSection: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "80px 24px",
    position: "relative",
    zIndex: 1,
  },

  sectionHeading: {
    maxWidth: "650px",
    marginBottom: "43px",
  },

  sectionLabel: {
    display: "inline-block",
    color: "#4f46e5",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    marginBottom: "11px",
  },

  sectionTitle: {
    margin: "0 0 13px",
    color: "#111827",
    fontSize: "37px",
    lineHeight: "1.15",
    letterSpacing: "-1.3px",
    fontWeight: "800",
  },

  sectionDescription: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.7",
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },

  featureCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "27px",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.05)",
  },

  featureTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
  },

  featureIcon: {
    width: "47px",
    height: "47px",
    borderRadius: "13px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  featureNumber: {
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: "800",
  },

  featureTitle: {
    margin: "0 0 8px",
    color: "#1e293b",
    fontSize: "17px",
    fontWeight: "800",
  },

  featureDescription: {
    margin: "0 0 24px",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "1.7",
  },

  featureLine: {
    width: "34px",
    height: "3px",
    borderRadius: "999px",
    background: "#4f46e5",
  },

  employerSection: {
    maxWidth: "1180px",
    margin: "30px auto 0",
    padding: "65px 55px",
    background: "#111827",
    borderRadius: "27px",
    display: "grid",
    gridTemplateColumns: "1fr 410px",
    gap: "55px",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    zIndex: 1,
  },

  employerContent: {
    position: "relative",
    zIndex: 2,
  },

  employerLabel: {
    display: "inline-block",
    color: "#a5b4fc",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    marginBottom: "11px",
  },

  employerTitle: {
    margin: "0 0 17px",
    color: "#ffffff",
    fontSize: "39px",
    lineHeight: "1.15",
    letterSpacing: "-1.3px",
  },

  employerHighlight: {
    color: "#a5b4fc",
  },

  employerDescription: {
    maxWidth: "570px",
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: "1.7",
    margin: "0 0 27px",
  },

  employerButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "9px",
    background: "#ffffff",
    color: "#111827",
    textDecoration: "none",
    padding: "13px 18px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "800",
  },

  employerVisual: {
    position: "relative",
    zIndex: 2,
  },

  employerGlow: {
    position: "absolute",
    width: "230px",
    height: "230px",
    borderRadius: "50%",
    background:
      "rgba(99, 102, 241, 0.20)",
    right: "-50px",
    top: "-50px",
  },

  employerCard: {
    position: "relative",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "21px",
    boxShadow:
      "0 20px 50px rgba(0, 0, 0, 0.25)",
  },

  employerCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    paddingBottom: "17px",
    borderBottom: "1px solid #e2e8f0",
    marginBottom: "8px",
  },

  companyIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "11px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  employerCardHeading: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  candidateRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    flexShrink: 0,
  },

  candidateInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    flex: 1,
  },

  checkMark: {
    width: "21px",
    height: "21px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "800",
  },

  ctaSection: {
    maxWidth: "1180px",
    margin: "80px auto",
    padding: "0 24px",
    position: "relative",
    zIndex: 1,
  },

  ctaContent: {
    textAlign: "center",
    background: "#eef2ff",
    border: "1px solid #e0e7ff",
    borderRadius: "27px",
    padding: "65px 30px",
  },

  ctaIcon: {
    width: "46px",
    height: "46px",
    margin: "0 auto 13px",
    borderRadius: "13px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    boxShadow:
      "0 7px 18px rgba(79, 70, 229, 0.08)",
  },

  ctaBadge: {
    color: "#4f46e5",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },

  ctaTitle: {
    margin: "12px 0 13px",
    color: "#111827",
    fontSize: "40px",
    lineHeight: "1.15",
    letterSpacing: "-1.4px",
  },

  ctaDescription: {
    maxWidth: "500px",
    margin: "0 auto 26px",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.7",
  },

  ctaButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background:
      "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    textDecoration: "none",
    padding: "14px 20px",
    borderRadius: "11px",
    fontSize: "13px",
    fontWeight: "700",
    boxShadow:
      "0 8px 20px rgba(79, 70, 229, 0.20)",
  },
};

export default Home;