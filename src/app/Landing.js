import dynamic from "next/dynamic";
import ProfileCard from "../components/profile/ProfileCard";

import "../components/profile/ProfileCard.css";
import "../components/lanyard/Lanyard.css";

const Lanyard = dynamic(() => import("../components/lanyard/Lanyard"), { ssr: false });

export default function Home() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          width: 320,
          maxWidth: "90vw",
          pointerEvents: "auto"
        }}
      >
        <ProfileCard
          name="Finn van Montfort"
          title="Software Engineer"
          handle="TheCheeseyWiggle"
          status="Online"
          contactText="Contact Me"
          avatarUrl="/assets/avatar_no_bg.png"
          miniAvatarUrl="/assets/avatar.jpg"
          iconUrl="/assets/iconpattern.png"
          grainUrl="/assets/grain.webp"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          onContactClick={() => alert('Contact clicked')}
        />
      </div>
    </div>
  );
}