import { memo, type PropsWithChildren } from 'react';
import { TopNavigation } from './top-navigation';
import { useSpring, animated } from 'react-spring';
import { cn } from '@/utils/cn';

const Container = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-screen bg-background text-foreground',
        'sm:px-6 lg:px-8',
      )}
    >
      {children}
    </div>
  );
};

const AnimatedContainer = animated(Container);

const PageContent = memo(({ children }: PropsWithChildren) => {
  const styles = useSpring({
    config: {
      duration: 300,
    },
    to: { opacity: 1 },
    from: { opacity: 0 },
  });

  return <AnimatedContainer style={styles}>{children}</AnimatedContainer>;
});

export const PageContainer = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen">
    <TopNavigation />
    <PageContent>{children}</PageContent>
    {/* <Footer /> */}
  </div>
);
