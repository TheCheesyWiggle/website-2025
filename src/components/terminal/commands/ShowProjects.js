const projects = [
  {
    name: "P2P Recipe Sharing",
    description: "A peer-to-peer recipe sharing platform for food enthusiasts.",
  },
  {
    name: "Sentiment Analysis",
    description:
      "A tool that analyzes sentiment from text using machine learning.",
  },
  {
    name: "Portfolio Website",
    description: "This very portfolio site, built with Next.js and React.",
  },
];

export default function ShowProjects({ cmd }) {
  const cmdParts = cmd.split(" ");
  if (cmdParts.length === 1) {
    return projects.map((proj, i) => `${i + 1}. ${proj.name}`).join("\n");
  } else if (cmdParts.length === 2) {
    const index = parseInt(cmdParts[1], 10) - 1;
    if (projects[index]) {
      return `Project: ${projects[index].name}\nDescription: ${projects[index].description}`;
    } else {
      return "Project not found.";
    }
  } else {
    return `Command not found: {cmd}`;
  }
}
