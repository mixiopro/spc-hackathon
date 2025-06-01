1.  **Update Asset References:**
    *   Confirm `assets.logoAsset` is mapped to Asset #6 (mixio-pro-logo-removebg-preview.png).
    *   Confirm `assets.landingPageVideoAsset` is mapped to Asset #0 (Landing Page Showcase.mp4).
    *   Confirm `assets.imageGenVideoAsset` is mapped to Asset #2 (image-generation-demo.mp4).
    *   Confirm `assets.plannerVideoAsset` is mapped to Asset #4 (planner-result.mp4).
    *   Confirm `assets.videoGenVideoAsset` is mapped to Asset #5 (image-video-generation-outputs.mp4).
    *   Confirm `assets.revideoDemoAsset` is mapped to Asset #3 (revideo-demo.mp4).
    *   Confirm `assets.backgroundMusicAsset` is mapped to Asset #1 (dark-mystery-trailer-taking-our-time-131566.mp3).

2.  **Adjust Global Audio Playback:**
    *   Ensure the `backgroundMusicRef` (Asset #1) is set to `play={true}` and `loop={true}` at the beginning of the script to play continuously. (Already configured in the template).

3.  **Modify Scene Timings and Content:**

    *   **Scene 1: Intro** (Current: 0s - 5s)
        *   Keep duration at 5 seconds.
        *   No changes to content or animations.

    *   **Scene 2: Landing Page Section** (Current: 5s - 7s)
        *   Keep duration at 2 seconds.
        *   No changes to content or animations.

    *   **Scene 3: Landing Page** (Current: 7s - 22s)
        *   Keep duration at 15 seconds.
        *   Set `landingPageVideoRef` (Asset #0) `time` property to `2` seconds (`clip-start="00:02"`).
        *   The video will play for 15 seconds, ending at `00:17`.
        *   Update `waitFor` durations to align with the 15-second scene.

    *   **Scene 4: Image Gen Section** (Current: 22s - 24s)
        *   Keep duration at 2 seconds.
        *   No changes to content or animations.

    *   **Scene 5: Image Generation Part 1 (Navigation)** (Current: 24s - 34s)
        *   Change scene duration to 4 seconds (24s - 28s).
        *   Set `imageGenVideoPart1Ref` (Asset #2) `time` property to `0` seconds (`clip-start="00:00"`).
        *   The video will play for 4 seconds, ending at `00:04`.
        *   Update `imageGenCaptionText1Ref` text to "Choose Your Creative Path".
        *   Adjust `waitFor` durations to align with the 4-second scene.

    *   **Scene 6: Image Generation Part 2 (Prompt Entry)** (Current: 34s - 44s)
        *   Change scene duration to 7 seconds (28s - 35s).
        *   Set `imageGenVideoPart2Ref` (Asset #2) `time` property to `27` seconds (`clip-start="00:27"`).
        *   Add `playbackRate={4}` to `imageGenVideoPart2Ref` to speed up the typing process. The video will play from `00:27` to `00:57` (30 seconds of original footage) in 7.5 seconds. Adjust `clip-end` to `00:57`.
        *   Update `imageGenCaptionText2Ref` text to "Entering Your Creative Prompt".
        *   Adjust `waitFor` durations to align with the 7-second scene.

    *   **Scene 7: Image Generation Part 3 (Output)** (Current: 44s - 54s)
        *   Change scene duration to 20 seconds (35s - 55s).
        *   Set `imageGenVideoPart3Ref` (Asset #2) `time` property to `2` minutes and `13` seconds (`clip-start="02:13"`).
        *   The video will play for 20 seconds, ending at `02:33`.
        *   Update `imageGenCaptionText3Ref` text to "Stunning Visuals, Instantly".
        *   Adjust `waitFor` durations to align with the 20-second scene.

    *   **Scene 8: Planner Section** (Current: 54s - 56s)
        *   Change scene start time to 55 seconds. Keep duration at 2 seconds (55s - 57s).
        *   No changes to content or animations.

    *   **Scene 9: Content Planner** (Current: 56s - 76s)
        *   Change scene start time to 57 seconds. Keep duration at 20 seconds (57s - 77s).
        *   Set `plannerVideoRef` (Asset #4) `time` property to `3` seconds (`clip-start="00:03"`).
        *   The video will play for 20 seconds, ending at `00:23`.
        *   Update `waitFor` durations to align with the 20-second scene.

    *   **Scene 10: Video Gen Section** (Current: 76s - 78s)
        *   Change scene start time to 77 seconds. Keep duration at 2 seconds (77s - 79s).
        *   No changes to content or animations.

    *   **Scene 11: Video Generation Part 1 (Prompt Input)** (Current: 78s - 98s, combines two videos)
        *   Change scene start time to 79 seconds. Change duration to 9 seconds (79s - 88s).
        *   Rename `videoGenVideoRef` to `videoGenInputVideoRef` and `videoGenCaptionTextRef` to `videoGenInputCaptionTextRef` for clarity.
        *   Set `videoGenInputVideoRef` (Asset #3) `src` to `assets.revideoDemoAsset`.
        *   Set `videoGenInputVideoRef` `time` property to `24` seconds (`clip-start="00:24"`).
        *   The video will play for 9 seconds, ending at `00:33`.
        *   Update `videoGenInputCaptionTextRef` text to "From Prompt to Video".
        *   Remove `revideoDemoRef` and its associated `view.add` and animations from this scene, as it will be moved to a new scene.
        *   Adjust `waitFor` durations to align with the 9-second scene.

    *   **Scene 12: Video Generation Part 2 (Output)** (New Scene)
        *   Create a new scene starting at 88 seconds, with a duration of 9 seconds (88s - 97s).
        *   Add new refs: `videoGenOutputVideoRef` and `videoGenOutputCaptionTextRef`.
        *   Add `view.add` for `videoGenOutputVideoRef` and `videoGenOutputCaptionTextRef` with similar styling to previous video/caption elements.
        *   Set `videoGenOutputVideoRef` (Asset #5) `src` to `assets.videoGenVideoAsset`.
        *   Set `videoGenOutputVideoRef` `time` property to `0` seconds (`clip-start="00:00"`).
        *   The video will play for 9 seconds, ending at `00:09`.
        *   Set `videoGenOutputCaptionTextRef` text to "Dynamic Video Creation".
        *   Add animations for `videoGenOutputVideoRef` (fadeIn) and `videoGenOutputCaptionTextRef` (slideIn).
        *   Add `waitFor` durations for this new scene.

    *   **Scene 13: Outro** (Current: 98s - 103s)
        *   Change scene start time to 97 seconds. Keep duration at 5 seconds (97s - 102s).
        *   Adjust `waitFor` durations to align with the 5-second scene.

4.  **Refactor Reference Declarations:**
    *   Add `videoGenInputVideoRef`, `videoGenInputCaptionTextRef`, `videoGenOutputVideoRef`, and `videoGenOutputCaptionTextRef` to the `createRef` declarations at the beginning of the script.
    *   Remove the old `videoGenVideoRef` and `revideoDemoRef` from the `createRef` declarations if they are no longer used or if their names are changed.