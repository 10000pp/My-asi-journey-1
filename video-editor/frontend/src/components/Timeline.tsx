import { useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { exportVideoWithAudio } from '../utils/exportVideo';

const PIXELS_PER_SECOND = 60;

export default function Timeline() {
  const clips = useEditorStore((state) => state.clips);
  const audioClips = useEditorStore((state) => state.audioClips);
  const textOverlays = useEditorStore((state) => state.textOverlays);
  const selectedClipId = useEditorStore((state) => state.selectedClipId);
  const playhead = useEditorStore((state) => state.playhead);
  const selectClip = useEditorStore((state) => state.selectClip);
  const removeClip = useEditorStore((state) => state.removeClip);
  const trimClip = useEditorStore((state) => state.trimClip);
  const splitClipAtPlayhead = useEditorStore(
    (state) => state.splitClipAtPlayhead
  );
  const removeAudioClip = useEditorStore((state) => state.removeAudioClip);
  const updateTextOverlay = useEditorStore(
    (state) => state.updateTextOverlay
  );
  const removeTextOverlay = useEditorStore(
    (state) => state.removeTextOverlay
  );

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const selectedClip = clips.find((clip) => clip.id === selectedClipId);
  const backgroundAudio = audioClips[0];

  const handleExport = async () => {
    if (!selectedClip) return;

    setExporting(true);
    setExportError(null);

    try {
      const blob = await exportVideoWithAudio(
        selectedClip.url,
        selectedClip.start,
        selectedClip.end,
        backgroundAudio?.url
      );

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'edited-video.mp4';
      link.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      setExportError('Export failed. Please try a smaller video.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="timeline-panel">
      <div className="timeline-header">
        <strong>Timeline</strong>
        <span>{playhead.toFixed(1)}s</span>
      </div>

      <div className="timeline-canvas">
        <div
          className="playhead"
          style={{ left: `${playhead * PIXELS_PER_SECOND}px` }}
        />

        <div className="track">
          <span className="track-label">Video</span>

          {clips.map((clip) => (
            <button
              key={clip.id}
              className={`timeline-clip ${
                clip.id === selectedClipId ? 'selected' : ''
              }`}
              style={{
                width: `${(clip.end - clip.start) * PIXELS_PER_SECOND}px`,
                left: `${clip.start * PIXELS_PER_SECOND}px`,
              }}
              onClick={() => selectClip(clip.id)}
            >
              {clip.name}
            </button>
          ))}
        </div>

        <div className="track">
          <span className="track-label">Audio</span>

          {audioClips.map((clip) => (
            <div
              key={clip.id}
              className="timeline-clip audio"
              style={{
                width: `${(clip.end - clip.start) * PIXELS_PER_SECOND}px`,
                left: `${clip.start * PIXELS_PER_SECOND}px`,
              }}
            >
              {clip.name}
              <button onClick={() => removeAudioClip(clip.id)}>×</button>
            </div>
          ))}
        </div>

        <div className="track">
          <span className="track-label">Text</span>

          {textOverlays.map((overlay) => (
            <div
              key={overlay.id}
              className="timeline-clip text"
              style={{
                width: `${(overlay.end - overlay.start) * PIXELS_PER_SECOND}px`,
                left: `${overlay.start * PIXELS_PER_SECOND}px`,
              }}
            >
              {overlay.text}
              <button onClick={() => removeTextOverlay(overlay.id)}>×</button>
            </div>
          ))}
        </div>
      </div>

      {selectedClip && (
        <div className="clip-controls">
          <label>
            Start
            <input
              type="number"
              min={0}
              max={selectedClip.duration}
              step={0.1}
              value={selectedClip.start}
              onChange={(event) =>
                trimClip(
                  selectedClip.id,
                  Number(event.target.value),
                  selectedClip.end
                )
              }
            />
          </label>

          <label>
            End
            <input
              type="number"
              min={0}
              max={selectedClip.duration}
              step={0.1}
              value={selectedClip.end}
              onChange={(event) =>
                trimClip(
                  selectedClip.id,
                  selectedClip.start,
                  Number(event.target.value)
                )
              }
            />
          </label>

          <button className="action-button" onClick={splitClipAtPlayhead}>
            Split at Playhead
          </button>

          <button
            className="export-button"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? 'Exporting…' : 'Export MP4'}
          </button>

          <button
            className="danger-button"
            onClick={() => removeClip(selectedClip.id)}
          >
            Delete Clip
          </button>

          {exportError && <span className="error-text">{exportError}</span>}
        </div>
      )}

      {textOverlays.length > 0 && (
        <div className="text-controls">
          <h3>Text Overlays</h3>

          {textOverlays.map((overlay) => (
            <div key={overlay.id} className="text-control-row">
              <input
                value={overlay.text}
                onChange={(event) =>
                  updateTextOverlay(overlay.id, { text: event.target.value })
                }
              />

              <input
                type="number"
                step={0.1}
                value={overlay.start}
                onChange={(event) =>
                  updateTextOverlay(overlay.id, {
                    start: Number(event.target.value),
                  })
                }
              />

              <input
                type="number"
                step={0.1}
                value={overlay.end}
                onChange={(event) =>
                  updateTextOverlay(overlay.id, {
                    end: Number(event.target.value),
                  })
                }
              />

              <button
                className="danger-button"
                onClick={() => removeTextOverlay(overlay.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
