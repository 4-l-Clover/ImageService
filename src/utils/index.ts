export default function adjustFontSize(text: any) {
  function getLines(token: string, maxLength: number) {
    let lineCounter = 0;
    let words: any = [];
    if (typeof token === 'string') {
      words = token.split(/\s/);
    }
    for (let index = 0; index < words.length; index++) {
      let length = -1;
      do {
        length += 1 + words[index];
      } while (length < maxLength && ++index < words.length);
      --index;
      lineCounter++;
    }
    return lineCounter;
  }

  let fontSize = 52;
  let lines: number;
  let maxLength: number;
  let maxLines: number;
  do {
    fontSize -= 2;
    maxLength = Math.floor(800 / fontSize);
    maxLines = Math.ceil(200 / fontSize);

    const tokenArr = text.split('/[\n]+/');
    lines = 0;
    for (let index = 0; index < tokenArr.length && lines < maxLines; index++) {
      const token = tokenArr[index];
      lines += getLines(token, maxLength);
    }
  } while (lines >= maxLines);
  return fontSize;
}
