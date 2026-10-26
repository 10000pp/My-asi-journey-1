# Studio Video Editor

A CapCut-style web-based video editing tool for my studio. The goal is to build a simple but powerful editor for Reels, Shorts, and studio videos.

## MVP Features

- Upload video, audio, and image files
- Multi-track timeline for video, audio, text, and images
- Trim, split, delete, and reorder clips
- Drag-and-drop media on the timeline
- Live preview using Canvas and Web Audio API
- Text overlays and basic transitions
- Export final video as MP4
- Save and load editing projects

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TypeScript |
| State management | Zustand or Redux Toolkit |
| Timeline | Custom React timeline components |
| Preview | HTML5 Canvas, Web Audio API |
| Browser processing | FFmpeg.wasm, WebCodecs |
| Server rendering | Node.js, FFmpeg |
| Storage | Cloudflare R2 or AWS S3 |
| Database | PostgreSQL with Prisma |
| Authentication | Clerk, Supabase Auth, or NextAuth |

## Architecture

```text
React Editor
├── Media Upload
├── Timeline Editor
├── Canvas Preview
├── Project State JSON
└── Export Engine
        │
        ├── Small exports: FFmpeg.wasm in browser
        └── Heavy exports: Node.js + FFmpeg render worker
                │
                └── MP4 saved to cloud storage
```

## Folder Structure

```text
video-editor/
├── README.md
├── docs/
│   └── roadmap.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── utils/
│   └── package.json
└── backend/
    ├── src/
    │   ├── routes/
    │   ├── services/
    │   └── workers/
    └── package.json
```

## Build Plan

### Week 1: Foundation

- Create React + Vite + TypeScript project
- Build basic editor layout
- Add media upload
- Show uploaded video in a preview player
- Create a simple timeline UI

### Week 2: Timeline Editing

- Add draggable clips
- Implement trim, split, and delete
- Support multiple tracks
- Add playhead and timeline zoom
- Sync preview with timeline

### Week 3: Creative Tools

- Add text overlays
- Add audio track support
- Add basic transitions
- Save project data as JSON
- Load saved projects

### Week 4: Export and Polish

- Integrate FFmpeg.wasm for browser export
- Export trimmed and merged video as MP4
- Improve performance
- Fix bugs and improve UI
- Prepare backend rendering plan for large videos

## Future Features

- Auto captions and subtitles
- AI background removal
- Ready-made Reels and Shorts templates
- Studio brand kit: logo, fonts, and colors
- Music and sound-effect library
- Watermark support
- 4K export
- Team collaboration
- Mobile-friendly PWA

## Development Commands

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm run dev
```

## First Milestone

Build a browser page where a user can upload one video, trim it on a timeline, add text, and download the edited MP4.
