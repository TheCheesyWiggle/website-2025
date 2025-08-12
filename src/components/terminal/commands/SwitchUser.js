export default function SwitchUser({ cmd, switchUser }) {
  const cmdParts = cmd.split(" ");
  if (cmdParts.length > 1) {
    const newName = cmdParts.slice(1).join(" ");
    switchUser(newName);
    return `Name set to ${newName}`;
  } else {
    return `Usage: su <your_name>`;
  }
}