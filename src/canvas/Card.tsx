import { FC, useCallback, PropsWithChildren } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import {
  ComponentProps,
  registerUniformComponent,
  UniformPlaygroundDecorator,
  UniformText,
  useUniformCurrentComposition,
} from '@uniformdev/canvas-react';
import Button from '../components/Button';
import { formatProjectMapLink, getMediaUrl } from '../utilities';
import {
  getImageOverlayColorStyle,
  getImageOverlayOpacityStyle,
  getLineClampClass,
  getObjectFitClass,
} from '../utilities/styling';
import { useComponentStarterKitContext } from '../context/ComponentStarterKitContext';
import AnimatedContainer, { AnimationVariant } from '../components/AnimatedContainer';

export type Props = ComponentProps<{
  image: string | Types.CloudinaryImage;
  badge?: string;
  badgeStyle?: Types.BadgeStyles;
  badgeSize?: Types.BadgeSize;
  title: string;
  description: string;
  buttonCopy?: string;
  buttonLink?: Types.ProjectMapLink;
  buttonStyle: Types.ButtonStyles;
  buttonAnimationType?: Types.AnimationType;
  lineCountRestriction: Types.AvailableMaxLineCount;
  useCustomTextElements?: boolean;
  overlayColor?: Types.AvailableColor;
  overlayOpacity?: Types.AvailableOpacity;
  objectFit?: Types.AvailableObjectFit;
  textColor?: Types.AvailableTextColor;
  animationType?: Types.AnimationType;
  duration?: Types.DurationType;
}>;

export enum CardVariants {
  BackgroundImage = 'backgroundImage',
  Featured = 'featured',
}

const getContentClass = (variantId?: string) => {
  switch (variantId) {
    case CardVariants.BackgroundImage:
      return 'image-full';
    default:
      return '';
  }
};

const getTextClass = (variantId?: string) => {
  switch (variantId) {
    case CardVariants.Featured:
      return 'mb-4';
    default:
      return '';
  }
};

const getDescriptionClass = (variantId?: string) => {
  switch (variantId) {
    case CardVariants.Featured:
      return 'mt-4';
    default:
      return '';
  }
};

const getBadgeStyleClass = (badgeStyle: Props['badgeStyle']) => {
  switch (badgeStyle) {
    case 'outline':
      return 'badge-outline';
    case 'primary':
      return 'badge-primary text-primary-content';
    case 'secondary':
      return 'badge-secondary text-secondary-content';
    case 'accent':
      return 'badge-accent text-accent-content';
    default:
      return '';
  }
};

const getBadgeSizeClass = (badgeSize: Props['badgeSize']) => {
  switch (badgeSize) {
    case 'xs':
      return 'badge-xs';
    case 'sm':
      return 'badge-sm';
    case 'md':
      return 'badge-md';
    case 'lg':
      return 'badge-lg';
    default:
      return '';
  }
};

const getImageSizeClassName = (variantId: string | undefined, isJavaDrip?: boolean) => {
  switch (variantId) {
    case CardVariants.BackgroundImage:
      return 'h-full';
    case CardVariants.Featured:
      return 'h-[80px]';
    default:
      return isJavaDrip ? 'h-96' : 'h-48';
  }
};

const getAnimationElements = (animationType: string | undefined, duration: Types.DurationType) => {
  const animationSpeed = {
    fast: 1,
    slow: 3,
    medium: 1.8,
  };

  const CardWrapper = ({ children, className }: PropsWithChildren<{ className: string }>) => {
    switch (animationType) {
      case 'dynamic':
        return (
          <motion.div
            className={className}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ margin: '-400px', once: true }}
          >
            {children}
          </motion.div>
        );
      case 'static':
      default:
        return <div className={className}>{children}</div>;
    }
  };

  const ImageWrapper = ({ children }: PropsWithChildren) => {
    switch (animationType) {
      case 'static':
        return (
          <AnimatedContainer animationVariant={AnimationVariant.FadeIn} duration={duration}>
            {children}
          </AnimatedContainer>
        );
      case 'dynamic':
        return (
          <motion.div
            variants={{
              offscreen: {
                y: 120,
                zIndex: 0,
                transition: {
                  type: 'spring',
                  bounce: 0.2,
                  duration: animationSpeed[duration],
                },
              },
              onscreen: {
                y: 0,
                transition: {
                  type: 'spring',
                  bounce: 0.2,
                  duration: animationSpeed[duration],
                },
              },
            }}
          >
            {children}
          </motion.div>
        );
      default:
        return <>{children}</>;
    }
  };

  const TitleWrapper = ({ children }: PropsWithChildren) => {
    switch (animationType) {
      case 'static':
        return (
          <AnimatedContainer animationVariant={AnimationVariant.FadeIn} duration={duration}>
            {children}
          </AnimatedContainer>
        );
      case 'dynamic':
        return (
          <motion.div
            variants={{
              offscreen: {
                y: 100,
                opacity: 0,
              },
              onscreen: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: animationSpeed[duration],
                },
              },
            }}
          >
            {children}
          </motion.div>
        );
      default:
        return <>{children}</>;
    }
  };

  return {
    CardWrapper,
    ImageWrapper,
    TitleWrapper,
  };
};

const Card: FC<Props> = ({
  image,
  badge = '',
  badgeSize = 'md',
  badgeStyle = 'secondary',
  buttonLink,
  buttonStyle,
  buttonAnimationType,
  title,
  buttonCopy,
  description,
  lineCountRestriction,
  useCustomTextElements,
  overlayOpacity,
  overlayColor,
  objectFit = 'cover',
  component: { variant } = {},
  textColor,
  animationType,
  duration = 'medium',
}) => {
  const imageUrl = getMediaUrl(image);
  const { isJavaDrip, secondaryFont } = useComponentStarterKitContext();
  const { isContextualEditing } = useUniformCurrentComposition();

  const defaultTextColor = textColor ? textColor : isJavaDrip ? 'Light' : 'Dark';

  const badgeClassNames = classNames('badge', getBadgeStyleClass(badgeStyle), getBadgeSizeClass(badgeSize));

  const titleClassNames = classNames(
    'card-title',
    getTextClass(variant),
    defaultTextColor === 'Dark' ? 'text-secondary-content' : 'text-primary-content',
    isJavaDrip && variant === CardVariants.Featured ? 'text-secondary' : ''
  );

  const descriptionClassNames = classNames(
    getLineClampClass(lineCountRestriction),
    getDescriptionClass(variant),
    defaultTextColor === 'Dark' ? 'text-secondary-content' : 'text-primary-content',
    secondaryFont?.className
  );

  const isBackgroundImage = variant === CardVariants.BackgroundImage;

  const { CardWrapper, ImageWrapper, TitleWrapper } = getAnimationElements(animationType, duration);

  return (
    <CardWrapper
      className={classNames(
        'card w-96 max-w-full min-h-full mx-0 md:mx-2 border border-gray-200',
        getContentClass(variant),
        {
          relative: isBackgroundImage,
          '!border-0 !rounded-none': variant === CardVariants.Featured || isJavaDrip,
        }
      )}
    >
      <ImageWrapper>
        <figure
          className={classNames({
            relative: !isBackgroundImage,
            'flex !justify-start p-8': variant === CardVariants.Featured,
          })}
        >
          {Boolean(imageUrl) && (
            <Image
              alt="image"
              src={imageUrl}
              width={variant === CardVariants.Featured ? 80 : 384}
              height={variant === CardVariants.Featured ? 80 : 384}
              className={classNames(
                getObjectFitClass(objectFit || 'cover'),
                getImageSizeClassName(variant, isJavaDrip)
              )}
            />
          )}

          <div
            className={classNames(
              'absolute top-0 left-0 right-0 bottom-0 rounded-xl',
              getImageOverlayOpacityStyle(overlayOpacity),
              getImageOverlayColorStyle(overlayColor)
            )}
          />
        </figure>
      </ImageWrapper>
      <div
        className={classNames('card-body', {
          'px-2': variant === CardVariants.Featured,
          'bg-gradient-to-t from-[#000] from-[0%] to-[#55493B] to-[150.76%]':
            isJavaDrip && !variant && defaultTextColor !== 'Dark',
          'px-0': isJavaDrip && !variant && defaultTextColor !== 'Light',
        })}
      >
        <TitleWrapper>
          {useCustomTextElements ? (
            <div className={badgeClassNames}>{badge}</div>
          ) : (
            <UniformText placeholder="Badge goes here" parameterId="badge" as="div" className={badgeClassNames} />
          )}

          {useCustomTextElements ? (
            <h2 className={titleClassNames}>{title}</h2>
          ) : (
            <UniformText placeholder="Title goes here" parameterId="title" as="h2" className={titleClassNames} />
          )}
        </TitleWrapper>
        {useCustomTextElements ? (
          <div className={descriptionClassNames} dangerouslySetInnerHTML={{ __html: description }} />
        ) : (
          <UniformText
            placeholder="Description goes here"
            parameterId="description"
            className={descriptionClassNames}
            render={(value = '') => <div dangerouslySetInnerHTML={{ __html: value }} />}
          />
        )}

        <div className="card-actions justify-end mt-auto">
          {buttonLink && (
            <Button
              href={formatProjectMapLink(buttonLink)}
              style={buttonStyle}
              animationType={buttonAnimationType}
              copy={
                useCustomTextElements ? (
                  <div onClick={isContextualEditing ? e => e.preventDefault() : undefined}>{buttonCopy}</div>
                ) : (
                  <UniformText
                    placeholder="Button copy goes here"
                    parameterId="buttonCopy"
                    onClick={isContextualEditing ? e => e.preventDefault() : undefined}
                  />
                )
              }
            />
          )}
        </div>
      </div>
    </CardWrapper>
  );
};

[undefined, CardVariants.BackgroundImage, CardVariants.Featured].forEach(variantId => {
  registerUniformComponent({
    type: 'card',
    component: Card,
    variantId,
  });
});

export const CardDecorator: UniformPlaygroundDecorator = ({ data, children }) => {
  const ItemPlaceholder = useCallback(
    (count = 1) =>
      new Array(count).fill(0).map((_item, index) => (
        <div
          key={`item-${index}`}
          className="card w-96 max-w-full min-h-full mx-0 md:mx-2 border border-gray-200 blur-xs"
        >
          <figure>
            <Image
              alt="image"
              src="https://res.cloudinary.com/uniform-demos/image/upload/v1692276539/csk-marketing/Hero-Rectangle_nof1km_qy2ow6.png"
              width={384}
              height={384}
              className={getObjectFitClass('cover')}
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-xl" />
          </figure>
          <div className="card-body">
            <div className="badge badge-primary text-primary-content">New</div>
            <h2 className="card-title">Default variant</h2>
            <div dangerouslySetInnerHTML={{ __html: 'description' }} />
            <div className="card-actions justify-end mt-auto">
              <Button style="primary" copy="Button Copy" />
            </div>
          </div>
        </div>
      )),
    []
  );

  return data.type !== 'card' ? (
    <>{children}</>
  ) : (
    <div className="flex items-center justify-between py-2 gap-2 flex-wrap">
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between px-3 pb-6 blur-xs">
        <div className="basis-2/3 xl:basis-auto">
          <h1 className="font-bold text-3xl">Default Card Block</h1>
        </div>
        <Button copy="Button Copy" style="primary" />
      </div>
      {children}
      {ItemPlaceholder(2)}
    </div>
  );
};

export default Card;
