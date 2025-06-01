/** @jsxImportSource @revideo/2d */
import { makeScene2D, Video, Rect, Audio, Txt, Layout } from "@revideo/2d";
import {
  createRef,
  waitFor,
  chain,
  useScene,
  all,
  Reference,
  easeOutCubic,
  easeInCubic,
  delay,
  sequence,
  tween,
  map,
  easeInOutCubic,
  useTime,
  loop,
} from "@revideo/core";

// Import type definitions for our config
type VideoKeyPoints = {
  keyActionTime?: number;
  typingStartTime?: number;
  typingEndTime?: number;
  productImageClickTime?: number;
  logoClickTime?: number;
  selectionEndTime?: number;
  createClickTime?: number;
  loadingClipStartTime?: number;
  loadingEndTime?: number;
  resultsAppearTime?: number;
  resultsEndTime?: number;
};

type VideoSequenceItem = {
  clipName: string;
  duration: number;
  keyPoints: VideoKeyPoints;
};

type DemoConfig = {
  theme: {
    colors: {
      white: string;
      black: string;
      background: string;
      primaryHighlight: string;
      secondaryHighlight: string;
      overlayText: string;
      overlayShadow: string;
    };
    animation: {
      crossFadeDuration: number;
      keyActionPause: number;
      defaultEndWait: number;
      introTextDuration: number;
      introHoldDuration: number;
      overlayFadeDuration: number;
      loadingOverlayTotalDisplayTime: number;
    };
    audio: {
      initialVolume: number;
    };
    layout: {
      introFontSizeLarge: number;
      introFontSizeSmall: number;
      overlayTextSize: number;
      loadingTextSize: number;
    };
  };
  assets: {
    videos: Array<{
      name: string;
      url: string;
    }>;
    audio: {
      backgroundMusic: string;
    };
  };
  content: {
    intro: {
      line1: string;
      line2: string;
      line3: string;
    };
    overlays: {
      typingPrompt: string;
      loadingSteps: Array<{ name: string }>;
    };
  };
  videoSequence: VideoSequenceItem[];
};

// Import configuration with type
const defaultConfig = {
  "theme": {
    "colors": {
      "white": "#ffffff",
      "black": "#000000",
      "background": "#141414",
      "primaryHighlight": "#EC4899",
      "secondaryHighlight": "#6366F1",
      "overlayText": "#FFFFFF",
      "overlayShadow": "rgba(0, 0, 0, 0.6)"
    },
    "animation": {
      "crossFadeDuration": 0.2,
      "keyActionPause": 0.3,
      "defaultEndWait": 1.0,
      "introTextDuration": 1.0,
      "introHoldDuration": 1.5,
      "overlayFadeDuration": 0.3,
      "loadingOverlayTotalDisplayTime": 4.0
    },
    "audio": {
      "initialVolume": 0.8
    },
    "layout": {
      "introFontSizeLarge": 6,
      "introFontSizeSmall": 4,
      "overlayTextSize": 2.5,
      "loadingTextSize": 3.5
    }
  },
  "assets": {
    "videos": [
      {
        "name": "1_SelectUseCase",
        "url": "https://cdn.hailuoai.video/moss/prod/2025-04-14-02/video/1744569199352948383-video_watermark_91649947e6f3c7217cfa15b58d55f81e_367894563442290696.mp4"
      },
      {
        "name": "3_TypePrompt",
        "url": "https://cdn.hailuoai.video/moss/prod/2025-04-14-02/video/1744569570610635749-video_watermark_a9df87d5e024d6cda3d4ef933ef8efab_367896144397115393.mp4"
      },
      {
        "name": "4_SelectAssets",
        "url": "https://cdn.hailuoai.video/moss/prod/2025-04-14-02/video/1744569749146955942-video_watermark_ace945e555200a93db332b937518d209_367896374802796551.mp4"
      },
      {
        "name": "5_SetVariantsAndCreate",
        "url": "https://cdn.hailuoai.video/moss/prod/2025-04-14-02/video/1744569888320158388-video_watermark_99dff24549d63655701443417a2821fc_367896387415064585.mp4"
      },
      {
        "name": "6_LoadingSequence",
        "url": "https://cdn.hailuoai.video/moss/prod/2025-04-14-02/video/1744569749146955942-video_watermark_ace945e555200a93db332b937518d209_367896374802796551.mp4"
      },
      {
        "name": "7_ShowResults",
        "url": "https://cdn.hailuoai.video/moss/prod/2025-04-14-02/video/1744569199352948383-video_watermark_91649947e6f3c7217cfa15b58d55f81e_367894563442290696.mp4"
      }
    ],
    "audio": {
      "backgroundMusic": "https://storage.googleapis.com/revideo-assets/dark-mystery-trailer-taking-our-time-131566.mp3"
    }
  },
  "content": {
    "intro": {
      "line1": "Create",
      "line2": "Stunning Product Videos",
      "line3": "with AI"
    },
    "overlays": {
      "typingPrompt": "Crafting the perfect prompt...",
      "loadingSteps": [
        { "name": "Understanding" },
        { "name": "Analyzing" },
        { "name": "Processing" },
        { "name": "Identifying" }
      ]
    }
  },
  "videoSequence": [
    {
      "clipName": "1_SelectUseCase",
      "duration": 2.0,
      "keyPoints": {
        "keyActionTime": 1.5
      }
    },
    {
      "clipName": "3_TypePrompt",
      "duration": 50.0,
      "keyPoints": {
        "typingStartTime": 0.1,
        "typingEndTime": 49.5
      }
    },
    {
      "clipName": "4_SelectAssets",
      "duration": 8.0,
      "keyPoints": {
        "productImageClickTime": 0.8,
        "logoClickTime": 4.5,
        "selectionEndTime": 7.0
      }
    },
    {
      "clipName": "5_SetVariantsAndCreate",
      "duration": 5.0,
      "keyPoints": {
        "createClickTime": 2.8
      }
    },
    {
      "clipName": "6_LoadingSequence",
      "duration": 26.0,
      "keyPoints": {
        "loadingClipStartTime": 8.0,
        "loadingEndTime": 25.5
      }
    },
    {
      "clipName": "7_ShowResults",
      "duration": 30.0,
      "keyPoints": {
        "resultsAppearTime": 12.0,
        "resultsEndTime": 16.0
      }
    }
  ]
}

// --- Theme Hook ---
export function useTheme(config) {
  const scene = useScene();
  const size = scene.getSize();
  const width = size.width;
  const height = size.height;
  const aspectRatio = width / height;
  const unit = width / 100;

  return {
    width,
    height,
    aspectRatio,
    unit,
    colors: config.theme.colors,
    animation: config.theme.animation,
    audio: config.theme.audio,
    layout: {
      ...config.theme.layout,
      introFontSizeLarge: config.theme.layout.introFontSizeLarge * unit,
      introFontSizeSmall: config.theme.layout.introFontSizeSmall * unit,
      overlayTextSize: config.theme.layout.overlayTextSize * unit,
      loadingTextSize: config.theme.layout.loadingTextSize * unit
    }
  };
}

// Helper function for safe video seeking
function seekTime(videoRef: Reference<Video>, time: number | undefined) {
  if (typeof time === 'number') {
    videoRef().time(time);
  }
}

// --- Main Scene Definition ---
export default makeScene2D("ProductDemoWithIntroAndEffectsMovingBg", function* (view) {
  const config = useScene().variables.get('config', defaultConfig)();
  const theme = useTheme(config);
  const { crossFadeDuration, overlayFadeDuration } = theme.animation;
  
  // --- Create References ---
  const videoRefs = config.assets.videos.map(() => createRef<Video>());
  const audioRef = createRef<Audio>();
  const typingOverlayRef = createRef<Txt>();
  const loadingStatusRef = createRef<Txt>();

  // --- Add Video Nodes ---
  config.assets.videos.forEach((clip, index) => {
    view.add(
      <Video 
        key={clip.name} 
        ref={videoRefs[index]} 
        src={clip.url}
        width={theme.width} 
        height={theme.height} 
        opacity={0}
        loop={false} 
        volume={0} 
        preload="auto" 
      />
    );
  });

  // --- Add Audio Node ---
  view.add(
    <Audio 
      ref={audioRef} 
      src={config.assets.audio.backgroundMusic}
      volume={theme.audio.initialVolume} 
      preload="auto" 
    />
  );

  // --- Add Overlay Text Nodes ---
  view.add(
    <Txt 
      ref={typingOverlayRef} 
      key="typing-overlay" 
      text={config.content.overlays.typingPrompt}
      fill={theme.colors.overlayText}
      shadowOffset={[theme.unit * 0.1, theme.unit * 0.1]} 
      shadowBlur={theme.unit * 0.3} 
      shadowColor={theme.colors.overlayShadow}
      fontSize={theme.layout.overlayTextSize} 
      fontWeight={300} 
      y={theme.height / 2 - theme.unit * 6} 
      opacity={0} 
    />
  );
  
  view.add(
    <Txt 
      ref={loadingStatusRef} 
      key="loading-status" 
      text={""}
      fill={theme.colors.overlayText}
      shadowOffset={[theme.unit * 0.15, theme.unit * 0.15]} 
      shadowBlur={theme.unit * 0.4} 
      shadowColor={theme.colors.overlayShadow}
      fontSize={theme.layout.loadingTextSize} 
      fontWeight={500} 
      y={0} 
      opacity={0} 
    />
  );

  // --- Helper for Video Transitions ---
  function* transition(fromRef: Reference<Video> | null, toRef: Reference<Video>, seekToTime: number = 0) {
    toRef().time(seekToTime); 
    yield* waitFor(0.01);
    yield* all(
      fromRef ? fromRef().opacity(0, crossFadeDuration) : waitFor(0),
      toRef().opacity(1, crossFadeDuration)
    );
    if (fromRef) { fromRef().pause(); } 
    toRef().play();
  }

  // --- Intro Text Animation ---
  const { line1, line2, line3 } = config.content.intro;
  const line1Ref = createRef<Txt>();
  const line2Ref = createRef<Txt>();
  const line3Ref = createRef<Txt>();
  const introLayoutRef = createRef<Layout>();
  
  view.add(
    <Layout 
      ref={introLayoutRef} 
      key="intro-layout" 
      layout 
      direction="column" 
      gap={theme.unit * 1.5} 
      justifyContent="center" 
      alignItems="center" 
      width={theme.width * 0.8} 
      opacity={0} 
      y={-theme.unit * 2}
    >
      <Txt 
        ref={line1Ref} 
        key="intro-line-1" 
        text={line1} 
        fontSize={theme.layout.introFontSizeLarge} 
        fontWeight={700} 
        fill={theme.colors.white} 
        opacity={0} 
        scale={1.5} 
        y={-theme.height * 0.2}
      />
      <Txt 
        ref={line2Ref} 
        key="intro-line-2" 
        text={line2} 
        fontSize={theme.layout.introFontSizeLarge} 
        fontWeight={700} 
        fill={theme.colors.primaryHighlight} 
        opacity={0} 
        scale={0.5}
      />
      <Txt 
        ref={line3Ref} 
        key="intro-line-3" 
        text={line3} 
        fontSize={theme.layout.introFontSizeSmall} 
        fontWeight={500} 
        fill={theme.colors.white} 
        opacity={0} 
        y={theme.height * 0.2}
      />
    </Layout>
  );

  // Execute intro animation
  yield* introLayoutRef().opacity(1, 0.1);
  yield* all(
    sequence(
      0,
      line1Ref().opacity(1, 0.1),
      all(
        line1Ref().position.y(0, theme.animation.introTextDuration * 0.6, easeOutCubic),
        line1Ref().scale(1, theme.animation.introTextDuration * 0.6, easeOutCubic)
      )
    ),
    delay(
      theme.animation.introTextDuration * 0.3,
      all(
        line2Ref().opacity(1, theme.animation.introTextDuration * 0.5, easeInCubic),
        line2Ref().scale(1, theme.animation.introTextDuration * 0.7, easeOutCubic)
      )
    ),
    delay(
      theme.animation.introTextDuration * 0.5,
      all(
        line3Ref().opacity(1, theme.animation.introTextDuration * 0.5, easeInCubic),
        line3Ref().position.y(0, theme.animation.introTextDuration * 0.5, easeOutCubic)
      )
    )
  );
  
  yield* waitFor(theme.animation.introHoldDuration);
  yield* introLayoutRef().opacity(0, crossFadeDuration * 2);
  introLayoutRef().remove();

  // --- Main Video Animation Sequence ---
  if (!audioRef().isPlaying()) {
    audioRef().play();
    yield* waitFor(0.1);
  }

  // Process each video in sequence based on configuration
  for (let i = 0; i < config.videoSequence.length; i++) {
    const sequence = config.videoSequence[i];
    const currentRef = videoRefs[i];
    const prevRef = i > 0 ? videoRefs[i - 1] : null;
    const keyPoints = sequence.keyPoints;

    // Handle specific video sequences based on clip name
    switch (sequence.clipName) {
      case "1_SelectUseCase":
        yield* transition(prevRef, currentRef);
        if (keyPoints.keyActionTime !== undefined) {
          yield* waitFor(keyPoints.keyActionTime - crossFadeDuration);
        }
        break;

      case "3_TypePrompt":
        yield* transition(prevRef, currentRef, keyPoints.typingStartTime ?? 0);
        yield* typingOverlayRef().opacity(1, overlayFadeDuration);
        yield* waitFor(2.0);
        yield* typingOverlayRef().opacity(0, overlayFadeDuration);
        seekTime(currentRef, keyPoints.typingEndTime);
        yield* waitFor(0.4);
        break;

      case "4_SelectAssets":
        yield* transition(prevRef, currentRef, 0);
        if (keyPoints.productImageClickTime !== undefined) {
          yield* waitFor(keyPoints.productImageClickTime - crossFadeDuration);
        }
        yield* waitFor(theme.animation.keyActionPause);
        seekTime(currentRef, keyPoints.logoClickTime);
        yield* waitFor(theme.animation.keyActionPause);
        seekTime(currentRef, keyPoints.selectionEndTime);
        yield* waitFor(0.2);
        break;

      case "5_SetVariantsAndCreate":
        yield* transition(prevRef, currentRef, 0);
        if (keyPoints.createClickTime !== undefined) {
          yield* waitFor(keyPoints.createClickTime - crossFadeDuration);
        }
        yield* waitFor(theme.animation.keyActionPause);
        break;

      case "6_LoadingSequence":
        yield* transition(prevRef, currentRef, keyPoints.loadingClipStartTime ?? 0);
        yield* loadingStatusRef().opacity(1, overlayFadeDuration);

        // Process loading steps
        const timePerStep = theme.animation.loadingOverlayTotalDisplayTime / config.content.overlays.loadingSteps.length;
        for (const step of config.content.overlays.loadingSteps) {
          loadingStatusRef().text(step.name + "...");
          yield* chain(
            loadingStatusRef().scale(1.1, 0.1, easeOutCubic),
            loadingStatusRef().scale(1.0, 0.15, easeInCubic)
          );
          yield* waitFor(timePerStep);
        }

        yield* loadingStatusRef().opacity(0, overlayFadeDuration);
        break;

      case "7_ShowResults":
        yield* transition(
          prevRef, 
          currentRef, 
          keyPoints.resultsAppearTime ?? 0
        );
        const showDuration = keyPoints.resultsEndTime && keyPoints.resultsAppearTime 
          ? keyPoints.resultsEndTime - keyPoints.resultsAppearTime 
          : 0.5;
        yield* waitFor(Math.max(0.5, showDuration));
        break;
    }
  }

  // --- Fade Out Sequence ---
  const lastVideoRef = videoRefs[videoRefs.length - 1];
  const initialVolume = audioRef().getVolume();
  yield* all(
    lastVideoRef().opacity(0, crossFadeDuration),
    tween(crossFadeDuration * 2, progress => {
      const currentVolume = map(initialVolume, 0, easeInOutCubic(progress));
      audioRef().setVolume(currentVolume);
    })
  );
  
  lastVideoRef().pause();
  audioRef().pause();

  // Clean up overlay nodes
  typingOverlayRef()?.remove();
  loadingStatusRef()?.remove();

  yield* waitFor(theme.animation.defaultEndWait);
});