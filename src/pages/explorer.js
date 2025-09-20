import '../app/globals.css';
import { NavBar } from "../components/navigation/NavBar.js";
import TravelGlobe from "../components/gallery/TravelGlobe.js";

export default function ExplorerPage() {
  return (
      <NavBar>
        <TravelGlobe />
      </NavBar>
  )
}