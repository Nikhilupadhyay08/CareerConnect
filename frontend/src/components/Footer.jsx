function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        {/* Brand */}
        <div style={styles.brandSection}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>C</span>

            <span style={styles.logoText}>
              Career<span style={styles.highlight}>Connect</span>
            </span>
          </div>

          <p style={styles.description}>
            Connecting talented people with meaningful career
            opportunities.
          </p>
        </div>

        {/* Right side */}
        <div style={styles.rightSection}>
          <span style={styles.tagline}>
            Find. Connect. Grow.
          </span>

          <span style={styles.copyright}>
            © 2026 CareerConnect. All rights reserved.
          </span>
        </div>

      </div>

      <div style={styles.bottomLine}></div>

      <div style={styles.bottomText}>
        Built for better career opportunities.
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#0f172a",
    color: "#ffffff",
    marginTop: "70px",
  },

  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "42px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
  },

  brandSection: {
    maxWidth: "400px",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "13px",
  },

  logoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "9px",
    background: "linear-gradient(135deg, #4f46e5, #2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
    fontWeight: "800",
  },

  logoText: {
    fontSize: "18px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },

  highlight: {
    color: "#818cf8",
  },

  description: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  rightSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
  },

  tagline: {
    color: "#c7d2fe",
    fontSize: "13px",
    fontWeight: "700",
  },

  copyright: {
    color: "#64748b",
    fontSize: "11px",
  },

  bottomLine: {
    height: "1px",
    background: "#1e293b",
    maxWidth: "1180px",
    margin: "0 auto",
  },

  bottomText: {
    textAlign: "center",
    padding: "17px 24px",
    color: "#475569",
    fontSize: "10px",
  },
};

export default Footer;