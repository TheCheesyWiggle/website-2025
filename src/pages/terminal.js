import '../app/globals.css';
import { NavBar } from "../components/navigation/NavBar.js";
import Terminal from "../app/Terminal.js";

export default function TerminalPage() {
  return (
      <NavBar>
        <Terminal />
      </NavBar>
  )
}