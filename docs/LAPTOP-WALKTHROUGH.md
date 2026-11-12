# Laptop walkthrough

The final walkthrough is published in the [12 November 2026 release](https://github.com/batestguy/AyubaDisabilityProg/releases/tag/walkthrough-2026-11-12). The README links directly to its MP4, English SRT and chapter list.

The video lasts approximately 11 minutes 16 seconds. It shows Home, all eight research slides, a stage explanation and Bayesian explanation, the research reading page and printable discussion brief, the Learning Sandbox roles diagram and monitoring steps, and About. The user requested an overview of the roles, followed by about two minutes showing both authors' profiles side by side. All five Jerry biography paragraphs, six Strong biography paragraphs, both project/responsibility sections and both contact cards are shown.

Recording used the current production build in a fresh Chrome context. The website occupies the top of a 1600 × 900 recording stage; a separate caption band sits below it. The original local export is 1920 × 1080 at 30 frames per second. At the user's request, the public download is compressed to 1280 × 720 at 30 frames per second and 28.1 MB (28,100,647 bytes), using H.264 video, AAC stereo audio and fast-start playback. The full running time, captions and content are retained. Browser profiles and saved owner records were preserved. No application interface, schema or production dependency was changed for the recording.

Music uses the owner-supplied “Cheer Up Song – Panam Percy Paul” excerpt from 0:55 to 1:18, repeated at its original speed with one-second crossfades and opening/closing fades. The compact download measured approximately −24.13 LUFS, with a true peak of −9.64 dBTP. The original audio file is not included in the repository.

## Verification

- Repository preflight: 120 tests, type checking and production build passed.
- The full recording route was rehearsed. The revised About sequence also received an independent visual coverage review.
- The finished file was decoded completely without errors or timing warnings.
- Chapter review sheets and full-resolution frames were inspected. Every author biography paragraph was verified fully visible during the About sequence.
- Separate captions were aligned to the captions actually captured in the picture, accounting for browser capture timing.
- Compact download: 28,100,647 bytes; complete decoding passed, and a separate visual review confirmed readable captions, biography text and slide labels at native 720p. Uploaded MP4, SRT and chapter files matched their local SHA-256 checksums.
- A real-time human watch of the whole video was not performed; checks used complete decoding, timing analysis and sampled visual review.

The release contains the final three deliverables. Raw recordings, intermediate encodes, screenshots, sample browser state and verification receipts remain under the ignored `output/` directory.

## Recording utilities

The `scripts/*laptop-walkthrough*` scripts and `scripts/*walkthrough*` caption/revision utilities are local production tools for this recording, separate from the application's build. They expect the local production server on port 4188, installed Chrome and Playwright, FFmpeg/FFprobe, and—for caption matching—Python with NumPy, Pillow, OpenCV and Tesseract. They read and write local intermediate files under `output/playwright/laptop-walkthrough/`.

The owner-supplied audio must be available locally to rebuild the soundtrack. It is intentionally not added to version control. The final About revision is handled by `record-laptop-walkthrough.mjs --profiles` and `revise-walkthrough-about.py`; the earlier scripts retain the original recording workflow. `compress-laptop-walkthrough.py` creates the compact release copy with two-pass video encoding and a strict 30,000,000-byte size check.
