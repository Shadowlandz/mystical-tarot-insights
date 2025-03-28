
// Utility functions for Acervo type handling

export function getTypeIcon(type: "article" | "video" | "document") {
  switch (type) {
    case "article":
      return "FileText";
    case "video":
      return "Video";
    case "document":
      return "Library";
  }
}

export function getTypeLabel(type: "article" | "video" | "document") {
  switch (type) {
    case "article":
      return "Artigo";
    case "video":
      return "Vídeo";
    case "document":
      return "Documento";
  }
}
