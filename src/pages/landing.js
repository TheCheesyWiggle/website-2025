import ProfileCard from "../components/profile/ProfileCard";
import Link from 'next/link';

import "../components/profile/ProfileCard.css";
export default function Home() {
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "#111",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        gridTemplateColumns: "1fr",
        padding: "2rem",
      }}
    >
      {/* Header row */}
      <div
        style={{
          gridColumn: "1 / -1",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "2.5rem",
            fontWeight: "700",
            letterSpacing: "0.05em",
            margin: 0,
          }}
        >
          Finn van Montfort
        </h1>
      </div>
      {/* Cards row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "2rem",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Athlete Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "1rem",
            height: "100%",
          }}
        >
          <Link href="/athlete" style={{ textDecoration: "none", width: "100%" }}>
            <ProfileCard
              name="Athlete"
              title="Runner & Cyclist"
              handle=""
              status="Active"
              contactText="Strava"
              avatarUrl="/assets/avatar_no_bg.png"
              miniAvatarUrl="/assets/avatar.jpg"
              iconUrl="/assets/iconpattern.png"
              grainUrl="/assets/grain.webp"
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
            />
          </Link>
        </div>
        {/* Software Engineer Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "1rem",
            height: "100%",
          }}
        >
          <Link href="/terminal" style={{ textDecoration: "none", width: "100%" }}>
            <ProfileCard
              name="Software Engineer"
              title="Hewlett Packard Enterprise"
              handle="TheCheeseyWiggle"
              status="Online"
              contactText="Github"
              avatarUrl="/assets/avatar_no_bg.png"
              miniAvatarUrl="/assets/avatar.jpg"
              iconUrl="/assets/iconpattern.png"
              grainUrl="/assets/grain.webp"
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
            />
          </Link>
        </div>
        {/* Adventurer Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "1rem",
            height: "100%",
          }}
        >
          <Link
            href="/adventurer"
            style={{ textDecoration: "none", width: "100%" }}
          >
            <ProfileCard
              name="Explorer"
              title="Hiking & Mountaineering"
              handle="."
              status="Exploring"
              contactText="Gallery"
              avatarUrl="/assets/avatar_no_bg.png"
              miniAvatarUrl="/assets/avatar.jpg"
              iconUrl="/assets/iconpattern.png"
              grainUrl="/assets/grain.webp"
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
