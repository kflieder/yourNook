"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AlertContextType {
  show: (
    messages: string | string[],
    position: { bottom: number; left?: number; right?: number },
    targetRef?: React.RefObject<HTMLElement>
  ) => void;
  hide: () => void;
  isVisible: boolean;
  messages: string[];
  position: { bottom: number; left?: number; right?: number };
  targetRef?: React.RefObject<HTMLElement>;
}
const AlertContext = createContext<AlertContextType | undefined>(undefined);

function AlertProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [position, setPosition] = useState<{
    bottom: number;
    left?: number;
    right?: number;
  }>({ bottom: 0, left: 0, right: 0 });

  const show = (
    newMessages: string | string[],
    position?: { bottom: number; left?: number; right?: number },
    targetRef?: React.RefObject<HTMLElement>
  ) => {
    setMessages(Array.isArray(newMessages) ? newMessages : [newMessages]);
    setIsVisible(true);
    let newPos = position ?? { bottom: position?.bottom ?? 0 };

    if (targetRef?.current) {
      const rect = targetRef.current.getBoundingClientRect();
      newPos.bottom =
        window.innerHeight - rect.bottom + (position?.bottom ?? 0);

      if (position?.left !== undefined) {
        newPos.left = rect.left + (position?.left ?? 0);
        newPos.right = undefined;
      } else if (position?.right !== undefined) {
        newPos.right = window.innerWidth - rect.right + (position?.right ?? 0);
        newPos.left = undefined;
      } else {
        newPos.left = rect.left;
        newPos.right = undefined;
      }
    } else {
      if (position?.left !== undefined) newPos.left = position.left;
      if (position?.right !== undefined) newPos.right = position.right;
    }
    setPosition(newPos);
  };

  const hide = () => {
    setIsVisible(false);
    setMessages([]);
  };

  function GlobalAlert({
    isVisible,
    messages,
    position,
    onClose,
  }: {
    isVisible: boolean;
    messages: string[];
    position: { bottom: number; left?: number; right?: number };
    onClose: () => void;
  }) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (!isVisible) return;
        const target = event.target as HTMLElement;
        const alertElement = document.getElementById("global-alert");
        if (alertElement && !alertElement.contains(target)) {
          onClose();
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isVisible, onClose]);
    return (
      <div
        id="global-alert"
        className="fixed bg-white rounded-lg shadow-lg z-50 w-50 sm:w-96"
        style={{
          bottom: position.bottom,
          left: position.left !== undefined ? position.left : undefined,
          right: position.right !== undefined ? position.right : undefined,
        }}
      >
        {messages.length === 1 ? (
          <p className="border border-red-400 p-4 rounded-2xl m-2">
            {messages[0]}
          </p>
        ) : (
          <div>
            {messages.map((msg, index) => (
              <p
                key={index}
                className="border border-red-400 p-4 rounded-2xl mb-2 last:mb-0"
              >
                {msg}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <AlertContext.Provider
      value={{ show, hide, isVisible, messages, position }}
    >
      {children}
      <GlobalAlert
        isVisible={isVisible}
        messages={messages}
        position={position}
        onClose={hide}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}

export default AlertProvider;
