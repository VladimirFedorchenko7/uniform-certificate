import { ComponentType } from 'react';
import { ComponentProps } from '@uniformdev/canvas-react';
import classNames from 'classnames';

export const CHILDREN_CONTAINER_STYLES = '[&>*]:max-w-screen-xl [&>*]:mx-auto [&>*]:w-full';
export const COMMON_PADDING = '[&>*]:xl:px-0 [&>*]:px-4';

export function withoutContainer<T>(
  Component: ComponentType<ComponentProps<T>>,
  withoutPaddings?: boolean
): ComponentType<ComponentProps<T>> {
  return function wrapper(props: ComponentProps<T>) {
    return (
      <div className={classNames('!max-w-none !px-0', { [COMMON_PADDING]: !withoutPaddings })}>
        <Component {...props} />
      </div>
    );
  };
}
