import "../app/globals.css";

export default function BaseLayoutPage() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "60px 1fr",
        gridTemplateColumns: "300px 1fr",
        gridTemplateAreas: `"nav nav" "profile main" "summary main"`,
        minHeight: "100vh",
        background: "#111",
        color: "#fff",
      }}
    >
      {/* Navigation Bar */}
      <div
        style={{
          gridArea: "nav",
          borderBottom: "2px solid #333",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          background: "#181818",
        }}
      >
        {/* Paste your <Navigation /> component here */}
        Navigation
      </div>

      {/* Profile Section */}
      <div
        style={{
          gridArea: "profile",
          borderRight: "2px solid #333",
          padding: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {/* Paste your <Profile /> component here */}
        Profile
      </div>

      {/* Summary Section */}
      <div
        style={{
          gridArea: "summary",
          borderRight: "2px solid #333",
          borderTop: "2px solid #333",
          padding: "2rem",
          minHeight: "150px",
        }}
      >
        {/* Paste your <Summary /> component here */}
        Summary
      </div>

      {/* Main Content Area */}
      <main style={{ gridArea: "main", padding: "2rem" }}>
        {/* Paste your main content/components here */}
        Terminal
      </main>
    </div>
  );
  y;
}
