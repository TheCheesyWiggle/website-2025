const cow = `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`
function wrapText(text, maxLen = 50) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + word).length + (current ? 1 : 0) > maxLen) {
      lines.push(current);
      current = word;
    } else {
      current += (current ? ' ' : '') + word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function cowsayBox(text) {
  const lines = wrapText(text, 50);
  const maxLen = Math.max(...lines.map(line => line.length));
  const top = ' ' + '_'.repeat(maxLen + 2);
  const bottom = ' ' + '-'.repeat(maxLen + 2);

  const box = lines.map((line, i) => {
    let left, right;
    if (lines.length === 1) {
      left = '<'; right = '>';
    } else if (i === 0) {
      left = '/'; right = '\\';
    } else if (i === lines.length - 1) {
      left = '\\'; right = '/';
    } else {
      left = '|'; right = '|';
    }
    return `${left} ${line.padEnd(maxLen, ' ')} ${right}`;
  }).join('\n');

  return `${top}\n${box}\n${bottom}`;
}


export default function CowSay({cmd}){
    const text = cmd.replace(/^cowsay\s*/i, "") || "Moo!";
    return cowsayBox(text) + cow;
}