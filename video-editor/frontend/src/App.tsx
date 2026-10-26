import { useRef, useState } from 'react';
import Timeline from './components/Timeline';
import { useEditorStore } from './store/editorStore';

export default function App() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const addClip = useEditorStore((state) => state.addClip);
  const setPlayhead = useEditorStore((state) => state.setPlayhead);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    const video = document.createElement('video');
    video.src = url;

    video.onloadedmetadata = () => {
      addClip({
        id: crypto.randomUUID(),
        name: file.name,
        url,
        start: 0,
        end: video.duration || 10,
        duration: video.duration || 10,
      });
    };
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setPlayhead(videoRef.current.currentTime);
    }
  };

  return (
    <div className="editor">
      <header className="toolbar">
        <h1>Studio Video Editor</h1>
        <label className="upload-button">
          Upload Video
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            hidden
          />
        </label>
      </header>

      <main className="workspace">
        <section className="preview-panel">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              onTimeUpdate={handleTimeUpdate}
            />
          ) : (
            <div className="empty-preview">
              <p>Upload a video to start editing</p>
            </div>
          )}
        </section>

        <Timeline />
      </main>
    </div>
  );
}
