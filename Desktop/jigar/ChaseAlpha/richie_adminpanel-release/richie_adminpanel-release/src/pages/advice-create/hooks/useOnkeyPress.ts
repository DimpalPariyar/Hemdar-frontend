import { useEffect } from 'react';
export const useOnkeyPress = (callback: any, targetKey: any) => {
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      for (const shortcut of targetKey) {
        const keys = shortcut.keys.split('+');
        const isMatch = keys.every((key: any) => {
          const normalizedKey = key.toLowerCase();

          // Allow number keys as well
          if (
            normalizedKey === '1' ||
            normalizedKey === '2' ||
            normalizedKey === '3' ||
            normalizedKey === '4' ||
            normalizedKey === '5' ||
            normalizedKey === '6' ||
            normalizedKey === '7' ||
            normalizedKey === '8' ||
            normalizedKey === '9' ||
            normalizedKey === '0'
          ) {
            return event.key === normalizedKey;
          }

          return (
            (normalizedKey === 'ctrl' && event.ctrlKey) ||
            (normalizedKey === 'shift' && event.shiftKey) ||
            (normalizedKey === 'alt' && event.altKey) ||
            (normalizedKey === 'meta' && event.metaKey) ||
            event.key.toLowerCase() === normalizedKey
          );
        });

        if (isMatch) {
          if (shortcut?.formId) {
            callback(shortcut.formId);
          } else {
            callback();
          }
          // Break the loop after calling the callback
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, targetKey]);
};
