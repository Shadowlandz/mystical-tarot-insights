
import { FileText, Video, Library } from "lucide-react";
import React from "react";

export type ContentType = "article" | "video" | "document";

export function getTypeIcon(type: ContentType) {
  switch (type) {
    case "article":
      return <FileText className="h-4 w-4 text-primary" />;
    case "video":
      return <Video className="h-4 w-4 text-blue-500" />;
    case "document":
      return <Library className="h-4 w-4 text-orange-500" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

export function getTypeLabel(type: ContentType) {
  switch (type) {
    case "article":
      return "Artigo";
    case "video":
      return "Vídeo";
    case "document":
      return "Documento";
    default:
      return type;
  }
}

export function getBadgeColor(type: ContentType) {
  switch (type) {
    case "article":
      return "bg-primary/10 text-primary hover:bg-primary/20";
    case "video":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case "document":
      return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
    default:
      return "";
  }
}
