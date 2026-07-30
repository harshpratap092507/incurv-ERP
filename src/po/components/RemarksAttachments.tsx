export function RemarksAttachments() {
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
        <div className="dropzone">
          <span className="dropzone-icon">⬆</span>
          <span>
            Drag &amp; drop files here or <strong>browse</strong>
          </span>
        </div>
        <div className="attachment-chip">
          <span>📄 quote_v2.pdf</span>
          <button className="icon-btn icon-btn-danger">✕</button>
        </div>
      </section>
    </div>
  );
}
