export default function GenerateCode() {
  const codeIndeces = [];
  for (let i = 0; i < 5; i++) {
    let idx = Math.floor(Math.random() * 26);
    codeIndeces.push(idx);
  }

  const code = codeIndeces.map(i => String.fromCharCode(65 + i)).join('');
  return code;
}