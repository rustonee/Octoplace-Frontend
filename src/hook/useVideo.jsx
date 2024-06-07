import * as React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export const useVideoJS = (videoJsOptions) => {
  const videoNode = React.useRef(null);
  const player = React.useRef(null);
  const key = "srvacc_fp72dqw4ix8r6ad6vr9evm68d";

  React.useEffect(() => {
    player.current = videojs(videoNode.current, videoJsOptions);

    return () => {
      player.current.dispose();
    };
  }, [key]);

  const Video = React.useCallback(
    ({ children, ...props }) => {
      return (
        <div data-vjs-player key={key} style={{ width: "100%", height: 800 }}>
          <video ref={videoNode} className="video-js" {...props}>
            {children}
          </video>
        </div>
      );
    },
    [key]
  );
  return { Video, player: player.current };
};
