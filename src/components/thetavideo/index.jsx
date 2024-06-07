import { useEffect } from "react";
import videojs from "video.js";

export const ThetaVideo = (props) => {
    const { url, videoId } = props;
    useEffect(() => {
        const optionalHlsOpts = null;
        const optionalThetaOpts = {
          allowRangeRequests: true,
        };
    
        const player = videojs('my-player', {
          autoplay: true,
          muted: false,
          techOrder: ["theta_hlsjs", "html5"],
          sources: [{
            src: url,
            type: "application/vnd.apple.mpegurl",
            label: "1080p"
          }],
          theta_hlsjs: {
            videoId: videoId,
            userId: "srvacc_fp72dqw4ix8r6ad6vr9evm68d",
            onThetaReady: null,
            onStreamReady: null,
            hlsOpts: optionalHlsOpts,
            thetaOpts: optionalThetaOpts,
          }
        });
        return () => {
            player.dispose();
        };
    }, [url]);

    return(
        <video id="my-player" className="video-js vjs-default-skin" controls />
    )
}