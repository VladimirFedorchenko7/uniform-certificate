import { FC } from 'react';
import classNames from 'classnames';
import { ComponentProps, UniformSlot, registerUniformComponent, UniformText } from '@uniformdev/canvas-react';
import { useComponentStarterKitContext } from '../context/ComponentStarterKitContext';

type Props = ComponentProps<{
  title: string;
  description: string;
}>;

const Accordion: FC<Props> = () => {
  const { secondaryFont, isJavaDrip } = useComponentStarterKitContext();

  return (
    <div className={isJavaDrip ? 'text-primary-content' : 'text-secondary-content'}>
      <UniformText
        placeholder="Title goes here"
        parameterId="title"
        as="p"
        className={classNames('text-3xl font-extrabold pb-4', secondaryFont?.className, {
          'tracking-[5.5px]': isJavaDrip,
        })}
      />
      <UniformText placeholder="Description goes here" parameterId="description" as="p" className="text-xl pb-6" />
      <UniformSlot name="items" />
    </div>
  );
};

registerUniformComponent({
  type: 'accordion',
  component: Accordion,
});

export default Accordion;
