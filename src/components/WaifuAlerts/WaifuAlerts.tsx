import { useEffect, useReducer } from "react";
import { Textfit } from "react-textfit";

import { SignalRContext } from "../../app";
import { Waifu } from "../../shared/api/generated/baza";
import styles from "./WaifuAlerts.module.scss";

enum StateStatus {
  add,
  remove,
}

interface WaifuAlertProps {
  waifu: Waifu;
  displayName: string;
}

interface State {
  messages: WaifuAlertProps[];
  currentMessage?: WaifuAlertProps;
  isWaifuShowing: boolean;
}

function reducer(
  state: State,
  action: { type: StateStatus; waifu: WaifuAlertProps }
): State {
  switch (action.type) {
    case StateStatus.add:
      if (!state.isWaifuShowing) {
        return {
          messages: [...state.messages],
          currentMessage: action.waifu,
          isWaifuShowing: true,
        };
      }

      return { ...state, messages: [...state.messages, action.waifu] };

    case StateStatus.remove:
      if (state.messages.length > 0) {
        const newWaifu = state.messages
          .filter(
            (message) => message.waifu.shikiId !== action.waifu.waifu.shikiId
          )
          .shift();

        return {
          ...state,
          messages: state.messages,
          currentMessage: newWaifu,
        };
      }

      return {
        ...state,
        currentMessage: undefined,
        isWaifuShowing: false,
      };
  }
}

export default function WaifuAlerts() {
  document.title = "WaifuAlerts";

  const initState: State = {
    messages: [],
    isWaifuShowing: false,
  };
  const [{ currentMessage }, dispatch] = useReducer(reducer, initState);

  SignalRContext.useSignalREffect(
    "waifuroll",
    (message, displayName: string) => {
      const parsedMessage: WaifuAlertProps = { waifu: message, displayName };
      handleAddEvent(parsedMessage);
    },
    []
  );

  SignalRContext.useSignalREffect(
    "addnewwaifu",
    (message, displayName: string) => {
      const parsedMessage: WaifuAlertProps = { waifu: message, displayName };
      handleAddEvent(parsedMessage);
    },
    []
  );

  SignalRContext.useSignalREffect(
    "Mergewaifu",
    (message, displayName: string) => {
      const parsedMessage: WaifuAlertProps = { waifu: message, displayName };
      handleAddEvent(parsedMessage);
    },
    []
  );

  function handleAddEvent(waifu: WaifuAlertProps) {
    dispatch({ type: StateStatus.add, waifu });
  }

  function handleRemoveEvent(waifu: WaifuAlertProps) {
    dispatch({ type: StateStatus.remove, waifu });
  }

  function getText(message: WaifuAlertProps) {
    let text: string;
    if (message.waifu.isAdded) {
      text = "ты добавил";
    } else if (message.waifu.merged) {
      text = "поженился с";
    } else {
      text = "тебе выпал(-а)";
    }

    return text + " " + message.waifu.name;
  }

  function getTitle(message: WaifuAlertProps) {
    if (message.waifu.anime) {
      return `из аниме ${message.waifu.anime}`;
    } else {
      return `из манги ${message.waifu.manga}`;
    }
  }

  useEffect(() => {
    if (currentMessage) {
      setTimeout(() => {
        handleRemoveEvent(currentMessage);
      }, 7000);
    }
  }, [currentMessage]);

  return (
    <>
      {currentMessage && (
        <div className={styles.baza}>
          <div>
            <img
              src={currentMessage.waifu.imageUrl}
              style={{ height: "498px", width: "320px" }}
            ></img>
          </div>
          <div className={styles["alert-box"]}>
            <span className="text-shadow block-text" style={{ color: "white" }}>
              <Textfit min={1} max={1500} forceSingleModeWidth>
                {currentMessage.displayName.toUpperCase()}
              </Textfit>
            </span>
            <span
              className="text-shadow block-text"
              style={{ color: "cornflowerblue" }}
            >
              <Textfit min={1} max={1500} forceSingleModeWidth>
                {getText(currentMessage)}
              </Textfit>
            </span>
            <span className="text-shadow block-text" style={{ color: "red" }}>
              <Textfit min={1} max={1500} forceSingleModeWidth>
                {getTitle(currentMessage)}
              </Textfit>
            </span>
          </div>
        </div>
      )}
    </>
  );
}