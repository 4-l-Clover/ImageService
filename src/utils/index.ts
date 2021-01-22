export function adjustFontSize(text: any) {
  let fontSize = 52;
  let lines;
  let maxLength;
  let maxLines;

  do {
    fontSize -= 2;
    maxLength = Math.floor(800 / fontSize);
    maxLines = Math.ceil(200 / fontSize);

    const tokenArr = text.split('/\n+/').filter((v: string) => v.length > 0);
    lines = 0;

    for (let index = 0; index < tokenArr.length && lines < maxLines; index++) {
      const token = tokenArr[index];
      lines += getLines(token, maxLength);
    }
  } while (lines >= maxLines);
  return fontSize;
}

export function getLines(token: string, maxLength: number) {
  let lineCounter = 0;
  let words: string[] = [];
  if (typeof token === 'string') {
    words = token.split(/\s/);
  }
  for (let index = 0; index < words.length; index++) {
    let length = -1;
    do {
      length += 1 + words[index].length;
    } while (length < maxLength && ++index < words.length);
    --index;
    lineCounter++;
  }
  return lineCounter;
}
