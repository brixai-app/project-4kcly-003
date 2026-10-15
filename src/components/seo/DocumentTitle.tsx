import React, { useEffect } from "react";

interface DocumentTitleProps {
  title: string;
  description?: string;
}

// Simple helper component to declaratively set document title & meta description
export const DocumentTitle: React.FC<DocumentTitleProps> = ({ title, description }) => {
  useEffect(() => {
    const base = "Nishant Waters";
    document.title = title ? `${title} · ${base}` : base;

    if (description) {
      let meta = document.querySelector("meta[name='description']") as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [title, description]);

  return null;
};

export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    const base = "Nishant Waters";
    document.title = title ? `${title} · ${base}` : base;

    if (description) {
      let meta = document.querySelector("meta[name='description']") as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [title, description]);
}