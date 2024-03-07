import { memo, type HtmlHTMLAttributes, type PropsWithChildren } from 'react';
import { type AutoAnimateOptions, type AutoAnimationPlugin } from '@formkit/auto-animate';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Slot } from '@radix-ui/react-slot';

export type AutoAnimateProps = {
  config?: Partial<AutoAnimateOptions> | AutoAnimationPlugin;
} & HtmlHTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
  };

export const AutoAnimate = memo(function AutoAnimate({
  children,
  config,
  asChild,
  ...rest
}: PropsWithChildren<AutoAnimateProps>) {
  const [parent] = useAutoAnimate(config);
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      ref={parent}
      {...rest}
    >
      {children}
    </Comp>
  );
});
