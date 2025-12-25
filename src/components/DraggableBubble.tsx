'use client';

import { useState, useEffect, useRef, MouseEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type DraggableBubbleProps = {
  children: ReactNode;
  animationDuration: number;
  animationDelay: number;
  size: number;
};

export default function DraggableBubble({
  children,
  animationDuration,
  animationDelay,
  size,
}: DraggableBubbleProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [useAnimation, setUseAnimation] = useState(true);
  const dragInfo = useRef({ offsetX: 0, offsetY: 0 });
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial random position only on the client-side
    setPosition({
      x: Math.random() * 80,
      y: Math.random() * 80,
    });
  }, []);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!bubbleRef.current) return;
    setIsDragging(true);
    setUseAnimation(false); // Stop CSS animation when dragging starts

    const rect = bubbleRef.current.getBoundingClientRect();
    
    // We calculate position relative to the parent, which is a percentage
    // But the click event is in pixels. So we convert.
    const parentRect = bubbleRef.current.parentElement?.getBoundingClientRect();
    if(!parentRect) return;

    const currentX = (rect.left - parentRect.left) / parentRect.width * 100;
    const currentY = (rect.top - parentRect.top) / parentRect.height * 100;
    
    dragInfo.current = {
      offsetX: (e.clientX - rect.left) / parentRect.width * 100,
      offsetY: (e.clientY - rect.top) / parentRect.height * 100,
    };
    
    // Set the position to the current calculated position to avoid jump
    setPosition({ x: currentX, y: currentY });

    e.preventDefault();
  };
  
  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isDragging || !bubbleRef.current || !position) return;

      const parentRect = bubbleRef.current.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

      let newX = ((e.clientX - parentRect.left) / parentRect.width) * 100 - dragInfo.current.offsetX;
      let newY = ((e.clientY - parentRect.top) / parentRect.height) * 100 - dragInfo.current.offsetY;

      // Constrain within parent boundaries (0% to 100% - size)
      const sizeInPercentX = (size / parentRect.width) * 100;
      const sizeInPercentY = (size / parentRect.height) * 100;
      
      newX = Math.max(0, Math.min(newX, 100 - sizeInPercentX));
      newY = Math.max(0, Math.min(newY, 100 - sizeInPercentY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // setUseAnimation(true); // Optional: resume CSS animation on drop
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, size, position]);

  if (!position) {
    // Render nothing on the server and on initial client render
    // to prevent hydration mismatch.
    return null;
  }
  
  const bubbleStyle = useAnimation
    ? {
        width: `${size}px`,
        height: `${size}px`,
        top: `${position.y}%`,
        left: `${position.x}%`,
        animationDuration: `${animationDuration}s`,
        animationDelay: `${animationDelay}s`,
      }
    : {
        width: `${size}px`,
        height: `${size}px`,
        top: `${position.y}%`,
        left: `${position.x}%`,
        animation: 'none',
      };


  return (
    <div
      ref={bubbleRef}
      className={cn('absolute cursor-grab', useAnimation && 'bubble')}
      style={bubbleStyle}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
}
