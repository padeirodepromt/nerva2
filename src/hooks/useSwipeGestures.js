/* src/hooks/useSwipeGestures.js
   desc: Hook para detectar swipe gestures em mobile.
   feat: Swipe left/right para ações, long-press para contexto.
*/

import { useState, useRef } from 'react';

export const useSwipeGestures = ({
    onSwipeLeft,
    onSwipeRight,
    onLongPress,
    threshold = 50
}) => {
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isLongPress, setIsLongPress] = useState(false);
    const longPressTimer = useRef(null);

    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
        setIsLongPress(false);

        // Inicia timer para long-press (500ms)
        longPressTimer.current = setTimeout(() => {
            setIsLongPress(true);
            onLongPress?.();
        }, 500);
    };

    const handleTouchEnd = (e) => {
        // Cancela long-press se foi movimentado
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }

        setTouchEnd(e.changedTouches[0].clientX);

        if (!isLongPress && touchStart - touchEnd > threshold) {
            onSwipeLeft?.();
        }
        if (!isLongPress && touchEnd - touchStart > threshold) {
            onSwipeRight?.();
        }
    };

    const handleTouchMove = () => {
        // Cancela long-press ao mover
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    return {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
        onTouchMove: handleTouchMove
    };
};
