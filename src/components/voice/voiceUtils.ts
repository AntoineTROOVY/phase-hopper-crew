
import { AudioFile } from './AudioPlayer';

/**
 * Parse the voice file URL string into an array of audio files
 */
export const parseVoiceFileUrl = (urlString: string): AudioFile[] => {
  if (!urlString) return [];

  const entries = urlString.split('␞');
  return entries.map(entry => {
    const [filename, url] = entry.split('␟');
    return {
      url,
      filename
    };
  }).filter(file => file.url && file.filename);
};
