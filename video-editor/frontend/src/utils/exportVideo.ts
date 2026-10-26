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

export async function exportVideoWithAudio(
  videoUrl: string,
  start: number,
  end: number,
  audioUrl?: string
): Promise<Blob> {
  const ffmpeg = await loadFFmpeg();

  const videoData = await fetchFile(videoUrl);
  await ffmpeg.writeFile('input.mp4', videoData);

  const duration = Math.max(0.1, end - start);

  if (audioUrl) {
    const audioData = await fetchFile(audioUrl);
    await ffmpeg.writeFile('audio.mp3', audioData);

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-i',
      'audio.mp3',
      '-ss',
      start.toString(),
      '-t',
      duration.toString(),
      '-filter_complex',
      '[0:a]volume=0.8[va];[1:a]volume=0.7[aa];[va][aa]amix=inputs=2:duration=first[aout]',
      '-map',
      '0:v',
      '-map',
      '[aout]',
      '-c:v',
      'copy',
      '-c:a',
      'aac',
      'output.mp4',
    ]);

    await ffmpeg.deleteFile('audio.mp3');
  } else {
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
  }

  const data = await ffmpeg.readFile('output.mp4');

  await ffmpeg.deleteFile('input.mp4');
  await ffmpeg.deleteFile('output.mp4');

  return new Blob([data], { type: 'video/mp4' });
}
