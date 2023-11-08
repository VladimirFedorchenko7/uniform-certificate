import { FC } from 'react';
import classNames from 'classnames';
import { useComponentStarterKitContext } from '../context/ComponentStarterKitContext';

const NEXT_PUBLIC_BUILD_TIMESTAMP = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP;

const BuildTimestamp: FC = () => {
  const { isJavaDrip } = useComponentStarterKitContext();
  return NEXT_PUBLIC_BUILD_TIMESTAMP ? (
    <p
      className={classNames('text-gray-400 text-sm text-center lg:text-start', {
        'text-secondary-content': isJavaDrip,
      })}
    >
      Built time: {new Date(NEXT_PUBLIC_BUILD_TIMESTAMP).toLocaleString()}
    </p>
  ) : null;
};

export default BuildTimestamp;
