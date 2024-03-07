'use client';

import { cn } from '@/utils/cn';
import { Slot } from '@radix-ui/react-slot';
import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  type HTMLAttributes,
  type PropsWithChildren,
} from 'react';

const MouseEnterContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(
  undefined,
);

export const ThreeDCardContainer = ({
  children,
  innerProps,
  outerProps,
}: PropsWithChildren<{
  innerProps?: HTMLAttributes<HTMLDivElement>;
  outerProps?: HTMLAttributes<HTMLDivElement>;
}>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const handleMouseEnter = (_e: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseEntered(true);
    if (!containerRef.current) return;
  };

  const handleMouseLeave = (_e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };
  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        {...outerProps}
        className={cn('flex items-center justify-center', outerProps?.className)}
        style={{
          perspective: '1000px',
          ...outerProps?.style,
        }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          {...innerProps}
          className={cn(
            'flex items-center justify-center relative transition-all duration-200 ease-linear',
            innerProps?.className,
          )}
          style={{
            transformStyle: 'preserve-3d',
            ...innerProps?.style,
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const ThreeDCardBody = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn('[transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d]', className)}>
      {children}
    </div>
  );
};

export const ThreeDCardItem = ({
  asChild = false,
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    handleAnimations();
  }, [isMouseEntered]);

  const handleAnimations = () => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
  };

  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cn('w-fit transition duration-200 ease-linear', className)}
      {...rest}
    >
      {children}
    </Comp>
  );
};

// Create a hook to use the context
export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error('useMouseEnter must be used within a MouseEnterProvider');
  }
  return context;
};
