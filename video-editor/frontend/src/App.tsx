import { useRef, useState } from 'react';

export default function App() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setVideoUrl(URL.createObjectURL(file));
  };

  return (
    <div className="editor">
      <header className="toolbar">
        <h1>Studio Video Editor</h1>
        <label className="upload-button">
          Upload Video
          <input type="file" accept="video/*" onChange={handleUpload} hidden />
        </label>
      </header>

      <main className="workspace">
        <section className="preview-panel">
          {videoUrl ? (
            <video ref={videoRef} src={videoUrl} controls />
          ) : (
            <div className="empty-preview">
              <p>Upload a video to start editing</p>
            </div>
          )}
        </section>

        <section className="timeline-panel">
          <div className="timeline-track">
            <span>Video Track</span>
          </div>
          <div className="timeline-track">
            <span>Audio Track</span>
          </div>
          <div className="timeline-track">
            <span>Text Track</span>
          </div>
        </section>
      </main>
    </div>
  );
}
