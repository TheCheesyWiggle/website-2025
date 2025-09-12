import '../app/globals.css';
import { NavBar } from "../components/navigation/NavBar.js";
import StravaStats from "../components/stravastats/StravaStats.js";

export default function StravaStatsPage() {
  return (
      <NavBar>
        <StravaStats />
      </NavBar>
  )
}