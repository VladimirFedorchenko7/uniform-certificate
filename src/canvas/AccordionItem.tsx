import { FC, useCallback, useState } from 'react';
import classNames from 'classnames';
import {
  ComponentProps,
  registerUniformComponent,
  UniformPlaygroundDecorator,
  UniformText,
} from '@uniformdev/canvas-react';
import { useComponentStarterKitContext } from '../context/ComponentStarterKitContext';

type Props = ComponentProps<{
  title: string;
  description: string;
}>;

const AccordionItem: FC<Props> = () => {
  const [isOpened, setOpened] = useState(false);
  const { secondaryFont, isJavaDrip } = useComponentStarterKitContext();
  const toggleAccordion = useCallback(() => setOpened(isOpened => !isOpened), []);

  return (
    <div className={classNames('card rounded-none mb-6 last:mb-0', { 'border-secondary border-b-2': isJavaDrip })}>
      <button
        onClick={toggleAccordion}
        className={classNames(
          'flex flex-row justify-between items-center p-4 md:p-8 text-2xl font-bold bg-primary w-full',
          {
            '!pl-2': isJavaDrip,
          }
        )}
      >
        <UniformText
          placeholder="Title goes here"
          parameterId="title"
          as="p"
          className="text-start pr-2 text-primary-content"
        />
        <div className="flex items-center">
          {isOpened ? (
            <svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.50013 0L0 7.13651L1.95843 9L7.5 3.7271L13.0416 9L15 7.13651L7.50013 0Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.49987 9L15 1.86349L13.0416 0L7.5 5.2729L1.95843 0L0 1.86349L7.49987 9Z"
                fill="white"
              />
            </svg>
          )}
        </div>
      </button>
      {isOpened && (
        <UniformText
          placeholder="Description goes here"
          parameterId="description"
          as="p"
          className={classNames('p-10 text-secondary-content', secondaryFont?.className, {
            '!pt-0': isJavaDrip,
            '!text-primary-content': isJavaDrip,
          })}
        />
      )}
    </div>
  );
};

registerUniformComponent({
  type: 'accordionItem',
  component: AccordionItem,
});

export const AccordionItemDecorator: UniformPlaygroundDecorator = ({ data, children }) => {
  const ItemPlaceholder = useCallback(
    (count = 1) =>
      new Array(count).fill(0).map((_item, index) => (
        <div key={`item-${index}`} className="card rounded-none blur-xs mt-6">
          <button className="flex flex-row justify-between items-center p-4 md:p-8 text-2xl font-bold bg-primary w-full">
            <p className="text-start pr-2 text-primary-content">{`Accordion item #${index + 2} title`}</p>
            <div className="flex items-center">
              <svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.49987 9L15 1.86349L13.0416 0L7.5 5.2729L1.95843 0L0 1.86349L7.49987 9Z"
                  fill="white"
                />
              </svg>
            </div>
          </button>
        </div>
      )),
    []
  );

  return data.type !== 'accordionItem' ? (
    <>{children}</>
  ) : (
    <div className="text-secondary-content">
      <p className="text-3xl font-extrabold blur-xs">Accordion title</p>
      <p className="text-xl pb-6 blur-xs">Some compelling text</p>
      {children}
      {ItemPlaceholder(2)}
    </div>
  );
};

export default AccordionItem;
