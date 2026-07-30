import { useRef, useState } from "react";

interface Attachment {
  id: string;
  name: string;
  size: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function RemarksAttachments() {
  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: "seed-1", name: "quote_v2.pdf", size: 214 * 1024 },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next: Attachment[] = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: file.size,
    }));
    setAttachments((prev) => [...prev, ...next]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="po-footer-cards">
      <section className="card">
        <h2 className="card-title">Internal Remarks</h2>
        <textarea
          className="remarks-textarea"
          rows={4}
          placeholder="Add any internal instructions for the warehouse or finance teams…"
        />
      </section>
      <section className="card">
        <h2 className="card-title">Attachments</h2>
        <div
          className={`dropzone ${isDragging ? "dropzone-active" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          role="button"
          tabIndex={0}
        >
          <span className="dropzone-icon">⬆</span>
          <span>
            Drag &amp; drop files here or <strong>browse</strong>
          </span>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {attachments.length > 0 && (
          <div className="attachment-list">
            {attachments.map((file) => (
              <div key={file.id} className="attachment-chip">
                <span className="attachment-name">
                  📄 {file.name} <small>({formatSize(file.size)})</small>
                </span>
                <button
                  className="icon-btn icon-btn-danger"
                  title="Remove attachment"
                  onClick={() => removeAttachment(file.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
