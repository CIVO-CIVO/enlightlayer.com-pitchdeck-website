import { photos } from "@/content/photos";
import type { Photo } from "@/content/photos.types";

const ALL = photos as unknown as Record<string, Photo>;

export const getPhoto = (slug: string): Photo | undefined => ALL[slug];
export const allPhotos = (): Photo[] => Object.values(ALL);
