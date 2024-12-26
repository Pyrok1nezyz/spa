import "./Announce.module.scss";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { Textfit } from "react-textfit";

interface Props {
  title: string;
  callback: () => void;
}

const getRandomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function Announce({ title, callback }: Props) {
  const nodeRef = useRef(null);

  const backgroundColor = getRandomColor();

  const defaultStyle: CSSProperties = {
    position: "absolute" /* Абсолютное позиционирование */,
    top: "50%" /* Центрирование по вертикали */,
    left: "50%" /* Центрирование по горизонтали */,
    transform:
      "translate(-50%, -50%)" /* Сдвиг на половину ширины и высоты элемента для центрирования */,
    display: "flex",
    flexDirection: "column" /* Размещение элементов в колонку */,
    justifyContent: "center" /* Центрирование содержимого по вертикали */,
    alignItems: "center" /* Центрирование содержимого по горизонтали */,
    height: "30%" /* Высота блока будет зависеть от содержимого */,
    width: "80%" /* Ширина блока будет 80% от ширины экрана */,
    padding: "20px" /* Добавление отступов внутри блока */,
    backgroundColor: backgroundColor,
  };

  interface FadeOutProps {
    duration: number; // Длительность анимации в миллисекундах
    children: React.ReactNode; // Содержимое элемента
    callback: () => void;
  }

  const FadeOut: React.FC<FadeOutProps> = ({
    duration,
    children,
    callback,
  }) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const element = elementRef.current;
      if (element) {
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = "0";

        const timer = setTimeout(() => {
          setIsVisible(false);
        }, duration);

        return () => {
          clearTimeout(timer);
          callback();
        };
      }
    }, [duration]);

    return isVisible ? <div ref={elementRef}>{children}</div> : null;
  };

  return (
    <FadeOut duration={3000} callback={callback}>
      <Textfit forceSingleModeWidth min={1} max={150}>
        <div ref={nodeRef} style={defaultStyle} className="announce">
          {title}
        </div>
      </Textfit>
    </FadeOut>
  );
}