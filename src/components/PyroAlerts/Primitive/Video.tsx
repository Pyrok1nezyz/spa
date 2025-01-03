import { useRef, useState } from "react";

import { getRandomRotation } from "../../../shared/Utils";
import { getCoordinates, MediaDto, replaceEmotes } from "../..";
import styles from "./Media.module.scss";

interface Props {
  callback: () => any;
  MediaInfo: MediaDto;
}

export function Video({ MediaInfo, callback }: Props) {
  const {
    emotes,
    fileInfo,
    id,
    isWithGenericEmotes,
    positionInfo,
    textInfo,
    metaInfo,
  } = MediaInfo.mediaInfo;

  const player = useRef<HTMLVideoElement>(null);

  const [baseStyles, setBaseStyles] = useState<React.CSSProperties>({
    width: positionInfo.width + "px",
    height: positionInfo.height + "px",
  });

  return (
    <div id={id} className={styles.media} style={baseStyles}>
      <div>
        <span style={{ color: textInfo.textColor }}>
          {isWithGenericEmotes
            ? replaceEmotes(emotes, textInfo.text)
            : textInfo.text}
        </span>
      </div>
      <video
        ref={player}
        src={fileInfo.localFilePath}
        controls={false}
        autoPlay
        style={baseStyles}
        onLoadedMetadata={(event) => {
          if (player.current) {
            const newCords = getCoordinates(
              player.current,
              MediaInfo.mediaInfo
            );
            const bazestyles = { ...baseStyles };
            setBaseStyles({
              ...bazestyles,
              ...newCords,
              ...getRandomRotation(MediaInfo.mediaInfo),
            });
          }

          if (event.currentTarget.duration < metaInfo.duration) {
            if (metaInfo.isLooped) {
              event.currentTarget.loop = true;
              setTimeout(() => {
                player.current?.pause();
                callback();
              }, metaInfo.duration * 1000);
            } else {
              event.currentTarget.onended = () => callback();
            }
          } else {
            event.currentTarget.onended = () => callback();
          }

          event.currentTarget.play();
        }}
      />
    </div>
  );
}
