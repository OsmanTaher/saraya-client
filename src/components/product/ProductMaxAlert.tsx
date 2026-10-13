"use client";

import { useState, useEffect, useCallback } from "react";

interface AlertItemData {
  id: string;
  maxQty?: number | null;
}

interface ProductMaxAlertProps {
  trigger?: number;
  isVisible?: boolean;
  maxQty?: number | null;
}

function AlertToastItem({
  item,
  onRemove,
}: {
  item: AlertItemData;
  onRemove: (id: string) => void;
}) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => setIsActive(true), 20);

    const exitTimer = setTimeout(() => setIsActive(false), 2600);

    const removeTimer = setTimeout(() => onRemove(item.id), 2950);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [item.id, onRemove]);

  return (
    <div
      className={`flex items-center gap-3 bg-rose-600 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-bold transition-all duration-300 ease-out transform pointer-events-auto ${
        isActive
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-5 opacity-0 scale-95"
      }`}
    >
      <span>عفواً، الحد الأقصى لهذا المنتج هو {item.maxQty} قطع!</span>
      <div className="w-5 h-5 bg-white text-rose-600 rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-sm">
        !
      </div>
    </div>
  );
}

export default function ProductMaxAlert({
  trigger,
  isVisible,
  maxQty,
}: ProductMaxAlertProps) {
  const [alerts, setAlerts] = useState<AlertItemData[]>([]);

  useEffect(() => {
    if (trigger && trigger > 0) {
      const newAlert: AlertItemData = {
        id: `${Date.now()}-${Math.random()}`,
        maxQty,
      };

      // This effect creates a toast in response to an external trigger.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAlerts((prev) => [...prev, newAlert]);
    }
  }, [trigger, maxQty]);

  useEffect(() => {
    if (isVisible) {
      const newAlert: AlertItemData = {
        id: `${Date.now()}-${Math.random()}`,
        maxQty,
      };

      // This effect creates a toast in response to an external visibility change.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAlerts((prev) => [...prev, newAlert]);
    }
  }, [isVisible, maxQty]);

  const handleRemove = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 pointer-events-none">
      {alerts.map((alert) => (
        <AlertToastItem key={alert.id} item={alert} onRemove={handleRemove} />
      ))}
    </div>
  );
}
