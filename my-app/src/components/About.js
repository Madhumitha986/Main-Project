import React from 'react';
const backendUrl = process.env.REACT_APP_BACKEND_URL;


function About() {
  const containerStyle = {
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    margin: 0,
    padding: 0,
    backgroundColor: '#f4f4f4',
    color: '#333',
  };

  const headerStyle = {
    backgroundColor: '#004080',
    color: 'white',
    textAlign: 'center',
    padding: '30px 20px',
  };

  const navStyle = {
    backgroundColor: '#0066cc',
    padding: '0',
    display: 'flex',
    justifyContent: 'center',
    listStyle: 'none',
    margin: 0,
  };

  const navItemStyle = {
    margin: '0 20px',
  };

  const navLinkStyle = {
    display: 'block',
    padding: '15px 10px',
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
  };

  const navLinkHover = {
    backgroundColor: '#004080',
  };

  const contentStyle = {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '0 20px',
  };

  const sectionTitle = {
    color: '#004080',
    marginBottom: '15px',
    fontSize: '26px',
  };

  const paragraphStyle = {
    lineHeight: '1.8',
    fontSize: '17px',
  };

  const teamContainer = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginTop: '30px',
  };

  const memberCard = {
    flex: '1 1 220px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  };

  const memberImg = {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
    border: '4px solid #004080',
  };

  const footerStyle = {
    backgroundColor: '#004080',
    color: 'white',
    textAlign: 'center',
    padding: '15px',
    marginTop: '60px',
    fontSize: '14px',
  };

  return (
    <div style={containerStyle}>
      <header style={{ backgroundColor: "#003366", color: "white", padding: "30px 10px", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: "40px", letterSpacing: "1px" }}>ACGCET | EEE Department Library</h1>
        <p style={{ fontSize: "18px", color: "#ccc", marginTop: "8px" }}>Explore. Learn. Grow.</p>
      </header>

      <nav style={{ backgroundColor: "#005599", padding: "10px", textAlign: "center" }}>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    <li style={{ display: "inline", margin: "0 20px" }}>
                        <a href="/LibraryHome" style={{ color: "white", textDecoration: "none" }}>Home</a>
                    </li>
                    <li style={{ display: "inline", margin: "0 20px" }}>
                        <a href="/LibLogin" style={{ color: "white", textDecoration: "none" }}>Login</a>
                    </li>
                    <li style={{ display: "inline", margin: "0 20px" }}>
                        <a href="/LibraryRegistration" style={{ color: "white", textDecoration: "none" }}>Register</a>
                    </li>
                    <li style={{ display: "inline", margin: "0 20px" }}>
                        <a href="/About" style={{ color: "white", textDecoration: "none" }}>About Us</a>
                    </li>
                </ul>
            </nav>

      <div style={contentStyle}>
        <h2 style={sectionTitle}>Administrator</h2>
        <p style={paragraphStyle}>
          The ACGCET EEE Library is guided by an experienced administrator committed to maintaining a structured and accessible learning environment. With a focus on excellence, the admin ensures that students and staff have access to the latest resources in the field of Electrical & Electronics Engineering.
        </p>

        <div style={teamContainer}>
          <div style={memberCard}>
            <img style={memberImg} src="/images/l.jpeg" alt="Admin" />
            <h4>Dr.K.Padmanaban</h4>
            <p><em>Library Administrator</em></p>
          </div>
        </div>

        <h2 style={{ ...sectionTitle, marginTop: '50px' }}>Our Development Team</h2>
        <p style={paragraphStyle}>
          This website is developed and maintained by a passionate final-year EEE student team, combining modern design with robust backend functionality to enhance the library experience.
        </p>

        <div style={teamContainer}>
          <div style={memberCard}>
            <img style={memberImg} src="/images/m.jpg.jpeg" alt="Frontend Developer" />
            <h4>MADHUMITHA S</h4>
            <p><em>Frontend Developer</em></p>
          </div>

          <div style={memberCard}>
            <img style={memberImg} src="/images/aa.jpg.jpeg" alt="Backend Developer" />
            <h4>AATHIRARAJ R</h4>
            <p><em>Backend Developer</em></p>
          </div>

          <div style={memberCard}>
            <img style={memberImg} src="/images/am.jpg.jpeg" alt="Database Manager" />
            <h4>AMSA S</h4>
            <p><em>Database Manager</em></p>
          </div>

          <div style={memberCard}>
            <img style={memberImg} src="/images/an.jpg" alt="UI/UX Designer" />
            <h4>ANITHA R</h4>
            <p><em>Frontend developer</em></p>
          </div>
        </div>
      </div>

      <footer style={footerStyle}>
        <p>&copy; 2024 ACGCET Library. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default About;