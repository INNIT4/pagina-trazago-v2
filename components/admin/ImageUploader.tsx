"use client";

import { useRef, useState } from "react";

interface Props {
  lugarId: string;
  imagenUrl: string;
  imagenesGaleria: string[];
  onChangeUrl: (url: string) => void;
  onChangeGaleria: (urls: string[]) => void;
}

export default function ImageUploader({
  lugarId,
  imagenUrl,
  imagenesGaleria,
  onChangeUrl,
  onChangeGaleria,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("lugarId", lugarId);

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      setUploadError(data.error ?? "Error al subir imagen");
      return null;
    }
    return data.url as string;
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError("");

    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }

    if (urls.length > 0) {
      if (!imagenUrl && urls.length > 0) {
        onChangeUrl(urls[0]);
        onChangeGaleria([...imagenesGaleria, ...urls.slice(1)]);
      } else {
        onChangeGaleria([...imagenesGaleria, ...urls]);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  function removeGalleryImage(idx: number) {
    onChangeGaleria(imagenesGaleria.filter((_, i) => i !== idx));
  }

  function setAsMain(url: string, idx: number) {
    const prev = imagenUrl;
    onChangeUrl(url);
    const newGallery = imagenesGaleria.filter((_, i) => i !== idx);
    if (prev) onChangeGaleria([prev, ...newGallery]);
    else onChangeGaleria(newGallery);
  }

  return (
    <div className="admin-field">
      <label>Imágenes</label>

      {/* Imagen principal */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 4 }}>URL imagen principal</div>
        <input
          value={imagenUrl}
          onChange={(e) => onChangeUrl(e.target.value)}
          placeholder="https://... o sube una foto abajo"
        />
        {imagenUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagenUrl}
            alt=""
            style={{ marginTop: 8, width: 180, height: 110, objectFit: "cover", borderRadius: 8, border: "1px solid #dde1e7" }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
      </div>

      {/* Zona de subida */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: "2px dashed #dde1e7",
          borderRadius: 10,
          padding: "16px 12px",
          textAlign: "center",
          cursor: "pointer",
          background: "#f8f9fa",
          marginBottom: 12,
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <span style={{ fontSize: 13, color: "var(--fg-3)" }}>Subiendo...</span>
        ) : (
          <span style={{ fontSize: 13, color: "var(--fg-3)" }}>
            Arrastra fotos aquí o <span style={{ color: "var(--primary)", fontWeight: 600 }}>haz clic para seleccionar</span>
            <br />
            <span style={{ fontSize: 11 }}>JPG, PNG o WebP · máx. 10 MB por foto</span>
          </span>
        )}
      </div>

      {uploadError && (
        <div style={{ fontSize: 12, color: "#dc2626", marginBottom: 8 }}>{uploadError}</div>
      )}

      {/* Galería */}
      {imagenesGaleria.length > 0 && (
        <div>
          <div style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 6 }}>
            Galería ({imagenesGaleria.length})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8 }}>
            {imagenesGaleria.map((url, idx) => (
              <div
                key={`${url}-${idx}`}
                style={{ position: "relative", aspectRatio: "1 / 1", borderRadius: 8, overflow: "hidden", border: "1px solid #dde1e7", background: "#f0f2f5" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <div style={{ position: "absolute", top: 4, right: 4, display: "flex", gap: 4 }}>
                  <button
                    type="button"
                    title="Usar como imagen principal"
                    onClick={() => setAsMain(url, idx)}
                    style={{ width: 22, height: 22, borderRadius: "50%", border: "none", background: "rgba(0,0,0,.65)", color: "#fbbf24", cursor: "pointer", fontSize: 11, lineHeight: 1 }}
                  >★</button>
                  <button
                    type="button"
                    title="Eliminar"
                    onClick={() => removeGalleryImage(idx)}
                    style={{ width: 22, height: 22, borderRadius: "50%", border: "none", background: "rgba(0,0,0,.65)", color: "#fff", cursor: "pointer", fontSize: 12, lineHeight: 1 }}
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
