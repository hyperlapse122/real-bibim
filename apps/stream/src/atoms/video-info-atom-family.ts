import {atomFamily} from "jotai/utils";
import {atom} from "jotai";
import {spawn} from "child_process";
import {z} from "zod";

const videoInfoSchema = z.object({
    id: z.string(),
    title: z.string(),
    thumbnail: z.string().url(),
    duration: z.number(),
    description: z.string(),
    uploader: z.string(),
    uploader_url: z.nullable(z.string().url()),
    original_url: z.string().url(),
    extractor: z.string(),
})

export type VideoInfo = z.infer<typeof videoInfoSchema>

const videoInfoAtomFamily = atomFamily((url: string) => {
    return atom(() =>
        new Promise<VideoInfo>((resolve, reject) => {
            const process = spawn('yt-dlp', [
                url,
                '--dump-json',
                '--clean-info-json',
                '--skip-download',
            ]);
            process.on('error', (e) => {
                console.error(e);
                reject(e);
            })
            const stdoutChunks: string[] = [];
            process.on('exit', (code) => {
                console.log('yt-dlp Process exited with code:', code);
                if (code !== 0) return reject(new Error('yt-dlp Process exited with code: ' + code));

                try {
                    resolve(videoInfoSchema.parse(JSON.parse(stdoutChunks.join(''))));
                } catch (e) {
                    reject(e);
                }
            })
            process.stdout.on('data', (data) => {
                stdoutChunks.push(data);
            })
        }));
})
export default videoInfoAtomFamily;