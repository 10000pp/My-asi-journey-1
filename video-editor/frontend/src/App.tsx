import { useRef, useState } from 'react';
import Timeline from './components/Timeline';
import { useEditorStore } from './store/editorStore';

export default function App() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const addClip = useEditorStore((state) => state.addClip);
  const addAudioClip = useEditorStore((state) => state.addAudioClip);
  const addTextOverlay = useEditorStore((state) => state.addTextOverlay);
  const setPlayhead = useEditorStore((state) => state.setPlayhead);

  const handleVideoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const handleAudioUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    const audio = document.createElement('audio');
    audio.src = url;

    audio.onloadedmetadata = () => {
      addAudioClip({
        id: crypto.randomUUID(),
        name: file.name,
        url,
        start: 0,
        end: audio.duration || 10,
        duration: audio.duration || 10,
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

        <div className="toolbar-actions">
          <label className="upload-button">
            Upload Video
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              hidden
            />
          </label>

          <label className="upload-button secondary">
            Upload Audio
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              hidden
            />
          </label>

          <button className="upload-button secondary" onClick={addTextOverlay}>
            Add Text
          </button>
        </div>
      </header>

      <main className="workspace">
        <section className="preview-panel">
          {videoUrl ? (
            <div className="preview-stage">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                onTimeUpdate={handleTimeUpdate}
              />

              {audioUrl && <audio ref={audioRef} src={audioUrl} controls />}
            </div>
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
