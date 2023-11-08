import { FC } from 'react';
import classNames from 'classnames';
import {
  UniformSlot,
  registerUniformComponent,
  ComponentProps,
  UniformText,
  useUniformCurrentComposition,
} from '@uniformdev/canvas-react';
import Button from '../components/Button';
import CardBlockCarousel from './CardBlockCarousel';
import { getTextClass } from '../utilities/styling';
import { formatProjectMapLink } from '../utilities';
import { useComponentStarterKitContext } from '../context/ComponentStarterKitContext';

export type Props = ComponentProps<{
  title: string;
  description?: string;
  titleStyle: Types.HeadingStyles;
  buttonCopy: string;
  buttonLink: Types.ProjectMapLink;
  buttonStyle: Types.ButtonStyles;
  buttonAnimationType?: Types.AnimationType;
  textColor?: Types.AvailableTextColor;
}>;

export enum CardBlockVariants {
  Carousel = 'carousel',
}

const getColorClassName = (textColor?: Types.AvailableTextColor, isJavaDrip?: boolean) => {
  if (isJavaDrip) {
    if (textColor === 'Light') return 'text-secondary';
    return 'text-secondary-content';
  }

  if (textColor === 'Light') return 'text-primary-content';

  return 'text-secondary-content';
};

const CardBlockDefault: FC<Props> = ({
  buttonLink,
  titleStyle: TitleTag = 'h1',
  buttonStyle,
  buttonAnimationType,
  textColor,
}) => {
  const { isContextualEditing } = useUniformCurrentComposition();
  const { secondaryFont, isJavaDrip } = useComponentStarterKitContext();

  const colorClassName = getColorClassName(textColor, isJavaDrip);

  return (
    <div
      className={classNames(
        'flex items-center justify-between py-2 gap-2 flex-wrap',
        secondaryFont?.className,
        {
          'tracking-[5.5px]': isJavaDrip,
        },
        colorClassName
      )}
    >
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between px-3 pb-6">
        <div className="basis-2/3 xl:basis-auto">
          <UniformText
            placeholder="Title goes here"
            parameterId="title"
            as={TitleTag}
            className={classNames('font-bold', getTextClass(TitleTag))}
          />
          <UniformText placeholder="Description goes here" parameterId="description" as="p" className="py-6" />
        </div>
        {Boolean(buttonLink) && (
          <Button
            href={formatProjectMapLink(buttonLink)}
            animationType={buttonAnimationType}
            copy={
              <UniformText
                placeholder="Button copy goes here"
                parameterId="buttonCopy"
                onClick={isContextualEditing ? e => e.preventDefault() : undefined}
              />
            }
            style={buttonStyle}
          />
        )}
      </div>
      <UniformSlot name="cardBlockInner" />
    </div>
  );
};

const CardBlock: FC<Props> = props => {
  const { variant } = props.component || {};
  switch (variant) {
    case CardBlockVariants.Carousel:
      return <CardBlockCarousel {...props} />;
    default:
      return <CardBlockDefault {...props} />;
  }
};

[undefined, CardBlockVariants.Carousel].forEach(variantId => {
  registerUniformComponent({
    type: 'cardBlock',
    component: CardBlock,
    variantId,
  });
});

export default CardBlockDefault;
