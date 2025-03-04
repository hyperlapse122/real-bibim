import prism from 'prism-media';
import { spawn } from 'child_process';
import { Readable } from 'node:stream';

export default function createAudioReadable(url: string) {
  const ffmpeg = new prism.FFmpeg({
    args: [
      '-analyzeduration',
      '0',
      '-loglevel',
      '0',
      '-i',
      'pipe:',
      '-acodec',
      'libopus',
      '-f',
      'opus',
      '-af',
      'loudnorm=I=-16:TP=-1.5:LRA=11',
      '-ar',
      '48000',
      '-ac',
      '2',
    ],
  });

  const ytDlpProcess = spawn('yt-dlp', ['-f', 'bestaudio', '-o', '-', url]);
  ytDlpProcess.stdout.pipe(ffmpeg);

  // Optional: Handle errors or process lifecycle events
  ytDlpProcess.on('error', (error) => {
    console.error('yt-dlp Error:', error);
  });

  ytDlpProcess.on('exit', (code) => {
    console.log('yt-dlp Process exited with code:', code);
  });
  ffmpeg.process.addListener('error', (err) =>
    console.error('FFMPEG error:', err.message),
  );
  ffmpeg.process.addListener('exit', (code) =>
    console.log('FFMPEG process exited with code:', code),
  );

  return ffmpeg as Readable;
}
