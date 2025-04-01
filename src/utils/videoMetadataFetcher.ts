
import { validateLink } from "./linkValidator";
import { getVideoThumbnail, isVideoUrl } from "./videoUtils";

interface VideoMetadata {
  title?: string;
  description?: string;
  thumbnail?: string;
}

/**
 * Fetches metadata from a video URL, including title, description, and thumbnail
 * @param videoUrl The URL of the video to extract metadata from
 * @returns Promise with video metadata object
 */
export async function fetchVideoMetadata(videoUrl: string): Promise<VideoMetadata> {
  if (!videoUrl || !isVideoUrl(videoUrl)) {
    return {};
  }

  try {
    // First check if the URL is valid
    const validation = await validateLink(videoUrl);
    if (!validation.isValid) {
      console.log("Invalid video URL:", validation.message);
      return {};
    }

    const metadata: VideoMetadata = {};
    
    // Get thumbnail directly from our utility function
    const thumbnail = getVideoThumbnail(videoUrl);
    if (thumbnail) {
      metadata.thumbnail = thumbnail;
    }

    // For YouTube videos, we can use the oEmbed API to get title and description
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      try {
        // Format the URL for oEmbed
        const videoId = videoUrl.includes('youtu.be/') 
          ? videoUrl.split('youtu.be/')[1].split('?')[0] 
          : videoUrl.includes('v=') 
            ? videoUrl.split('v=')[1].split('&')[0] 
            : null;
            
        if (videoId) {
          const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
          const response = await fetch(oembedUrl);
          
          if (response.ok) {
            const data = await response.json();
            metadata.title = data.title;
            // YouTube oEmbed doesn't provide description, just title
          }
        }
      } catch (error) {
        console.error("Error fetching YouTube metadata:", error);
      }
    }
    
    // For Vimeo videos, use their oEmbed API
    if (videoUrl.includes('vimeo.com')) {
      try {
        const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}`;
        const response = await fetch(oembedUrl);
        
        if (response.ok) {
          const data = await response.json();
          metadata.title = data.title;
          metadata.description = data.description;
          
          // If we don't have a thumbnail yet, use the one from Vimeo
          if (!metadata.thumbnail && data.thumbnail_url) {
            metadata.thumbnail = data.thumbnail_url;
          }
        }
      } catch (error) {
        console.error("Error fetching Vimeo metadata:", error);
      }
    }

    return metadata;
  } catch (error) {
    console.error("Error fetching video metadata:", error);
    return {};
  }
}
