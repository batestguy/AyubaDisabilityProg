import { sourceFor, type DocumentaryPhoto } from './showcase';
export function PhotoCaption({ photo }: { photo: DocumentaryPhoto }) {
 return <figcaption><span className="photo-location">{photo.location} · Report: {photo.date}</span><p>{photo.caption}</p><a href={sourceFor(photo.source).url} target="_blank" rel="noreferrer">{photo.credit} · Source ↗</a></figcaption>;
}
