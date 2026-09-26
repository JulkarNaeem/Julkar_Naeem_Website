import sharp from 'sharp';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const photo=path.join(root,'public/services/tekla.webp');
const logo=path.join(root,'public/jn-logo-mark.png');
const output=path.join(root,'public/share-card.png');

const photoPanel=await sharp(photo).resize(650,630,{fit:'cover',position:'centre'}).png().toBuffer();
const logoMark=await sharp(logo).resize({width:86}).png().toBuffer();
const overlay=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="fade" x1="0" x2="1">
      <stop offset="0" stop-color="#101c26"/>
      <stop offset=".55" stop-color="#101c26"/>
      <stop offset=".73" stop-color="#101c26" stop-opacity=".9"/>
      <stop offset="1" stop-color="#101c26" stop-opacity=".08"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#fade)"/>
  <rect x="55" y="48" width="4" height="58" fill="#e7b846"/>
  <text x="165" y="75" fill="#f3f1e9" font-family="Arial,sans-serif" font-size="23" font-weight="700" letter-spacing="2.1">JULKAR NAEEM</text>
  <text x="165" y="99" fill="#b9c5cd" font-family="Arial,sans-serif" font-size="11" font-weight="700" letter-spacing="2.6">STRUCTURAL STEEL DETAILER</text>
  <text x="58" y="216" fill="#e7b846" font-family="Arial,sans-serif" font-size="15" font-weight="700" letter-spacing="3">TEKLA STRUCTURES · FABRICATION FIRST</text>
  <text x="55" y="297" fill="#f3f1e9" font-family="Arial,sans-serif" font-size="61" font-weight="700" letter-spacing="-1.6">Steel detailing</text>
  <text x="55" y="370" fill="#f3f1e9" font-family="Arial,sans-serif" font-size="61" font-weight="700" letter-spacing="-1.6">built for fabrication.</text>
  <rect x="58" y="413" width="66" height="4" fill="#e7b846"/>
  <text x="58" y="468" fill="#d4dde1" font-family="Arial,sans-serif" font-size="21">Tekla models · Shop drawings · Erection drawings</text>
  <line x1="58" y1="553" x2="578" y2="553" stroke="#52616c" stroke-width="1"/>
  <text x="58" y="587" fill="#e7b846" font-family="Arial,sans-serif" font-size="19" font-weight="700" letter-spacing=".7">julkarnaeem.com</text>
</svg>`);

await sharp({create:{width:1200,height:630,channels:4,background:'#101c26'}})
  .composite([
    {input:photoPanel,left:550,top:0},
    {input:overlay,left:0,top:0},
    {input:logoMark,left:66,top:47},
  ])
  .png({compressionLevel:9})
  .toFile(output);
console.log(output);
