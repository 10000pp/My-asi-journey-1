import { useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { exportClipAsMp4 } from '../utils/exportVideo';

const PIXELS_PER_SECOND = 60;

export default function Timeline() {
  const clips = useEditorStore((state) => state.clips);
  const selectedClipId = useEditorStore((state) => state.selectedClipId);
  const playhead = useEditorStore((state) => state.playhead);
  const selectClip = useEditorStore((state) => state.selectClip);
  const removeClip = useEditorStore((state) => state.removeClip);
  const trimClip = useEditorStore((state) => state.trimClip);
  const splitClipAtPlayhead = useEditorStore(
    (state) => state.splitClipAtPlayhead
  );

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const selectedClip = clips.find((clip) => clip.id === selectedClipId);

  const handleExport = async () => {
    if (!selectedClip) return;

    setExporting(true);
    setExportError(null);

    try {
      const blob = await exportClipAsMp4(
        selectedClip.url,
        selectedClip.start,
        selectedClip.end
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

        {clips.length === 0 && (
          <p className="timeline-empty">Upload a video to add a clip</p>
        )}

        {clips.map((clip) => {
          const width = (clip.end - clip.start) * PIXELS_PER_SECOND;
          const left = clip.start * PIXELS_PER_SECOND;

          return (
            <button
              key={clip.id}
              className={`timeline-clip ${
                clip.id === selectedClipId ? 'selected' : ''
              }`}
              style={{ width: `${width}px`, left: `${left}px` }}
              onClick={() => selectClip(clip.id)}
            >
              {clip.name}
            </button>
          );
        })}
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
    </section>
  );
}
