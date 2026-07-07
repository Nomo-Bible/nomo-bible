import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../app/public/assets/study-guides/how-to-study-the-bible');

const images = [
  {
    file: 'hero-banner.png',
    url: 'https://codaio.imgix.net/docs/Ske_Heg2Kf/blobs/bl-BGjmTdw_bY/3b3c341c3d289ee73044d3b41d972580dfe6bea043f95bf087ba8d8876db7cec30c9df0a4ba2bd00948cf1ee96dc9e16045b1a5746d2467f1060c5e094d189769acf546a0260834c3e60afb19ad1a4df5d162b2a58016e70ff97725810405919f6e4caba?format=png',
  },
  {
    file: 'chapter-1-christ-centered.png',
    url: 'https://codaio.imgix.net/docs/Ske_Heg2Kf/blobs/bl-A_wFUCLM9_/56f77fc92c1c1e7a8e01ffd159a6e5fe3256e68fd66ff22d3f026b5d0552d65228c4ed8b50b7b0ab6cd777e6f3297f7569b1dc8c5d1eded75ec937f5273fc3fd93d1b91518a108ef58f06e76ccf73f27a333c1dd5c50ee1cfed72c30ea11596c375e2a89?format=png',
  },
  {
    file: 'chapter-2-symbol-lexicon.png',
    url: 'https://codaio.imgix.net/docs/Ske_Heg2Kf/blobs/bl-bcrau1KeYb/3e0ef1726d5d97bff79979291e6f64391a04caccffd7426735824465c24e3eec9e9dfbe65513be980bb434575f5c494bc866143d34ca190e4705c53f4d816fe1f6a9cc1316949198f9163250f666e9fbd182137f5926f656431c896d4e7e17cb2e768057?format=png',
  },
  {
    file: 'chapter-3-repeat-and-enlarge.png',
    url: 'https://codaio.imgix.net/docs/Ske_Heg2Kf/blobs/bl-6O7Hv6moYr/16591ef81a24463ac013739cef29ac4d4e56a609f2d04c8ba271d9e7c7f08d956f7c886c392ce189f924848097a236d4abc1a4abc1015493b4011cc749a3df5a07fe45ccfd734cbf0b4e735b2c8668d5a3a8e6b820e6f9b115f1a39daf2f588d4ab2fdae?format=png',
  },
  {
    file: 'chapter-6-chiastic-structure.png',
    url: 'https://codaio.imgix.net/docs/Ske_Heg2Kf/blobs/bl-4IDeV8YLRb/2752748f098df47dcf1514fca774895c033c9368c6d7710f658ac79f8fbcfa759127645892f55cff310ac17072beb0fe5fabce4eef4b7cebe258e08acc657cc98c644d9f81f84f3f2fcfa2eff617afe99917c71cd3093a4c51e0f6fc0c0eb0858f3f8221?format=png',
  },
  {
    file: 'chapter-7-compare-scripture.png',
    url: 'https://codaio.imgix.net/docs/Ske_Heg2Kf/blobs/bl-w17MtThn8Q/22c0e3e382d0597380aba50bf1b809e1bf47c6858e3c92680fe15181a59a809e4bc6badc9e9945370e6691f0e7e8ea8a81fe56abf232a1dbad48013ce9fee2769a435b5b10e216c42d8699ca189c8231c9b16557d999f57060129f15ad420ef82fde7b47?format=png',
  },
  {
    file: 'chapter-9-living-truth.png',
    url: 'https://codaio.imgix.net/docs/Ske_Heg2Kf/blobs/bl-_nw-O2aH-M/472ef5a16b7aa9891a3347461ee2b35c76e4858361589153a253c55c5cff2f10b866f2c06d028b8fac811296bb5fc9a07e1da4363dec305ce65eecc362c3a75e43404e6ed30758ea16f50c6f5a6f137c4a876aa55845d7c5b53d191938d3c2910910caf9?format=png',
  },
];

fs.mkdirSync(outDir, { recursive: true });

for (const image of images) {
  const target = path.join(outDir, image.file);
  const response = await fetch(image.url);
  if (!response.ok) {
    throw new Error(`Failed to download ${image.file}: ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(target, buffer);
  console.log(`Saved ${image.file} (${buffer.length} bytes)`);
}

console.log('All images downloaded.');
