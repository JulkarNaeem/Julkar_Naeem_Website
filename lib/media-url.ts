export const isVideoUrl = (value: string) => {
  if (!value || typeof value !== 'string') return false;
  return /\.(mp4|webm|mov|ogg|m4v|mkv)(\?.*)?$/i.test(value) || /\/video\/upload\//i.test(value);
};
