import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

async function loadFFmpeg() {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  return ffmpeg;
}

export async function exportClipAsMp4(
  videoUrl: string,
  start: number,
  end: number
): Promise<Blob> {
  const ffmpeg = await loadFFmpeg();

  const inputData = await fetchFile(videoUrl);
  await ffmpeg.writeFile('input.mp4', inputData);

  const duration = Math.max(0.1, end - start);

  await ffmpeg.exec([
    '-i',
    'input.mp4',
    '-ss',
    start.toString(),
    '-t',
    duration.toString(),
    '-c',
    'copy',
    'output.mp4',
  ]);

  const data = await ffmpeg.readFile('output.mp4');

  await ffmpeg.deleteFile('input.mp4');
  await ffmpeg.deleteFile('output.mp4');

  return new Blob([data], { type: 'video/mp4' });
}
