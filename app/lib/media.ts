/**
 * Public media on Supabase Storage.
 *
 * Everything lives at the root of the `Videos` bucket (no local `Public/`
 * folders mirrored). Pass the uploaded filename exactly — spaces, `+`, and the
 * rest are encoded per path segment so the request matches what Storage stored.
 */

export const MEDIA_BASE =
  "https://olegixjqnmghjskciikm.supabase.co/storage/v1/object/public/Videos";

/** Build a public object URL for a file in the Videos bucket. */
export function mediaUrl(filename: string): string {
  return `${MEDIA_BASE}/${encodeURIComponent(filename)}`;
}
