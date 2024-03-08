import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { cn } from '@/utils/cn';
import { getAvatarInitials } from '@/utils/get-avatar-initials';
import type { AvatarFallbackProps, AvatarImageProps, AvatarProps } from '@radix-ui/react-avatar';
import { memo, useMemo } from 'react';

export const FancyAvatar = memo(
  ({
    fallbackProps,
    imageProps,
    src,
    label,
    className,
    color,
    ...rest
  }: AvatarProps & {
    src?: string;
    label: string;
    fallbackProps?: AvatarFallbackProps;
    imageProps?: AvatarImageProps;
    color?: string;
  }) => {
    const initials = useMemo(() => getAvatarInitials(label), [label]);

    return (
      <span>
        <Avatar
          {...rest}
          className={cn({ [`border-2 p-[2px]`]: !!color }, className)}
          style={color ? { borderColor: color, ...rest.style } : rest.style}
        >
          {src && (
            <AvatarImage
              src={src}
              alt={label}
              {...imageProps}
              className={cn('rounded-full', imageProps?.className)}
            />
          )}

          <AvatarFallback {...fallbackProps}>{initials}</AvatarFallback>
        </Avatar>
      </span>
    );
  },
);
