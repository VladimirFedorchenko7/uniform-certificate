import { FC, Fragment, useMemo, useCallback, PropsWithChildren } from 'react';
import { UniformText } from '@uniformdev/canvas-react';
import Image from 'next/image';
import classNames from 'classnames';
import Button from '../components/Button';
import { formatProjectMapLink, getMediaUrl } from '../utilities';
import { getImageOverlayColorStyle, getImageOverlayOpacityStyle, getObjectFitClass } from '../utilities/styling';
import { useComponentStarterKitContext } from '../context/ComponentStarterKitContext';
import AnimatedContainer, { Props as AnimatedContainerProps, AnimationVariant } from './AnimatedContainer';

export const getDelayCoefficient = (duration: Types.DurationType) => {
  switch (duration) {
    case 'slow':
      return 5;
    case 'medium':
      return 7.5;
    case 'fast':
      return 10;
    default:
      return 7.5;
  }
};

export const getDelay = (delayIndex: number, oneByOneAnimation: boolean, delayCoefficient: number) =>
  oneByOneAnimation ? delayIndex / delayCoefficient : 0;

const FeatureIcon = () => (
  <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path id="Vector 1" d="M1 7L4.84314 11L14 1" stroke="#F7DF1E" strokeWidth="2" />
  </svg>
);

export type Props = {
  eyebrowText: string;
  title: string;
  titleStyle: Types.HeadingStyles;
  subTitle: string;
  description: string;
  highlightText: string;
  image?: string;
  primaryButtonCopy: string;
  primaryButtonStyle: Types.ButtonStyles;
  primaryButtonLink?: Types.ProjectMapLink;
  primaryButtonAnimationType?: Types.AnimationType;
  secondaryButtonCopy: string;
  secondaryButtonStyle: Types.ButtonStyles;
  secondaryButtonLink?: Types.ProjectMapLink;
  secondaryButtonAnimationType?: Types.AnimationType;
  overlayColor?: Types.AvailableColor;
  overlayOpacity?: Types.AvailableOpacity;
  objectFit?: Types.AvailableObjectFit;
  onClickPrimaryButton?: () => void;
  onClickSecondaryButton?: () => void;
  features: string[];
  fullHeight?: boolean;
  useCustomTextElements?: boolean;
  animationType?: Types.AnimationType;
  oneByOneAnimation?: boolean;
  duration?: Types.DurationType;
};

const useProductInfoItemsKeys = (animationType: string | undefined, duration: string, oneByOneAnimation?: boolean) => {
  const keyPrefix = `${animationType}-${duration}-${oneByOneAnimation}`;

  return {
    eyebrowKey: `${keyPrefix}-eyebrow`,
    titleKey: `${keyPrefix}-title`,
    subTitleKey: `${keyPrefix}-sub-title`,
    descriptionKey: `${keyPrefix}-description`,
    highlightTextKey: `${keyPrefix}-highlight-text`,
    primaryButtonKey: `${keyPrefix}-primaryButtonLink`,
    secondaryButtonKey: `${keyPrefix}-secondaryButtonLink`,
    featuresKey: `${keyPrefix}-features`,
  };
};

const ProductInfo: FC<Props> = ({
  titleStyle: TitleTag = 'h1',
  primaryButtonStyle = 'primary',
  secondaryButtonStyle = 'primary',
  primaryButtonLink,
  primaryButtonAnimationType,
  secondaryButtonLink,
  secondaryButtonAnimationType,
  image,
  overlayColor,
  overlayOpacity,
  objectFit,
  onClickPrimaryButton,
  onClickSecondaryButton,
  features,
  fullHeight,
  useCustomTextElements,
  eyebrowText,
  title,
  description,
  highlightText,
  subTitle,
  secondaryButtonCopy,
  primaryButtonCopy,
  animationType,
  duration = 'medium',
  oneByOneAnimation,
}) => {
  const imageUrl = getMediaUrl(image);
  const { secondaryFont, isJavaDrip } = useComponentStarterKitContext();

  const {
    eyebrowKey,
    titleKey,
    subTitleKey,
    highlightTextKey,
    descriptionKey,
    primaryButtonKey,
    secondaryButtonKey,
    featuresKey,
  } = useProductInfoItemsKeys(animationType, duration, oneByOneAnimation);

  const ElementWrapper = ({ children, ...props }: PropsWithChildren<AnimatedContainerProps>) =>
    animationType ? <AnimatedContainer {...props}>{children}</AnimatedContainer> : <Fragment>{children}</Fragment>;

  const delayCoefficient = useMemo(() => getDelayCoefficient(duration), [duration]);

  const getDelayValue = useCallback(
    (delayIndex: number) => getDelay(delayIndex, !!oneByOneAnimation, delayCoefficient),
    [oneByOneAnimation, delayCoefficient]
  );

  return (
    <div
      className={classNames('hero relative w-full h-full flex justify-end', {
        'min-h-[700px]': !fullHeight,
        'min-h-[calc(100vh-64px)]': fullHeight,
      })}
    >
      {image && (
        <>
          <Image
            fill
            alt="hero-image"
            src={imageUrl}
            priority
            className={classNames(
              'absolute top-0 bottom-0 left-0 right-0 z-10',
              getObjectFitClass(objectFit || 'cover')
            )}
          />
          <div
            className={classNames(
              'absolute top-0 bottom-0 left-0 right-0 z-10',
              getImageOverlayOpacityStyle(overlayOpacity),
              getImageOverlayColorStyle(overlayColor)
            )}
          />
        </>
      )}
      <div className={classNames('flex w-1/2 flex-col mx-1 md:mx-10 z-20 text-primary-content')}>
        <ElementWrapper
          key={eyebrowKey}
          duration={duration}
          delay={getDelayValue(1.5)}
          animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
        >
          {useCustomTextElements ? (
            <p
              className={classNames(
                'uppercase text-lg mb-5',
                secondaryFont?.className,
                isJavaDrip ? 'tracking-[5.5px]' : ''
              )}
            >
              {eyebrowText}
            </p>
          ) : (
            <UniformText
              placeholder="Eyebrow goes here"
              parameterId="eyebrowText"
              as="p"
              className={classNames(
                'uppercase text-lg mb-5',
                secondaryFont?.className,
                isJavaDrip ? 'tracking-[5.5px]' : ''
              )}
            />
          )}
        </ElementWrapper>
        <ElementWrapper
          key={titleKey}
          duration={duration}
          delay={getDelayValue(3)}
          animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
        >
          {useCustomTextElements ? (
            <TitleTag className="text-secondary font-bold text-4xl mb-5">{title}</TitleTag>
          ) : (
            <UniformText
              placeholder="Title goes here"
              parameterId="title"
              as={TitleTag}
              className="text-secondary font-bold text-4xl mb-5"
            />
          )}
        </ElementWrapper>
        <ElementWrapper
          key={subTitleKey}
          duration={duration}
          delay={getDelayValue(4.5)}
          animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
        >
          {useCustomTextElements ? (
            <div className="text-xl font-light mb-5">{subTitle}</div>
          ) : (
            <UniformText placeholder="Subtitle goes here" parameterId="subTitle" className="text-xl font-light mb-5" />
          )}
        </ElementWrapper>
        <ElementWrapper
          key={descriptionKey}
          duration={duration}
          delay={getDelayValue(6)}
          animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
        >
          {useCustomTextElements ? (
            <div className={classNames('text-lg mb-5', secondaryFont?.className)}>{description}</div>
          ) : (
            <UniformText
              placeholder="Description goes here"
              parameterId="description"
              className={classNames('text-lg mb-5', secondaryFont?.className)}
            />
          )}
        </ElementWrapper>
        <ElementWrapper
          key={highlightTextKey}
          duration={duration}
          delay={getDelayValue(7.5)}
          animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
        >
          {useCustomTextElements ? (
            <div>{highlightText}</div>
          ) : (
            <UniformText placeholder="Highlight Text goes here" parameterId="highlightText" />
          )}
        </ElementWrapper>
        <div className="w-1/3 py-10">
          <ElementWrapper
            key={primaryButtonKey}
            duration={duration}
            delay={getDelayValue(9)}
            animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
          >
            <Button
              className="w-full"
              href={formatProjectMapLink(primaryButtonLink)}
              onClick={onClickPrimaryButton}
              animationType={primaryButtonAnimationType}
              copy={
                useCustomTextElements ? (
                  <div>{primaryButtonCopy}</div>
                ) : (
                  <UniformText placeholder="Button Copy goes here" parameterId="primaryButtonCopy" />
                )
              }
              style={primaryButtonStyle}
            />
          </ElementWrapper>
          <ElementWrapper
            key={secondaryButtonKey}
            duration={duration}
            delay={getDelayValue(11.5)}
            animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
          >
            <Button
              href={formatProjectMapLink(secondaryButtonLink)}
              onClick={onClickSecondaryButton}
              className={classNames('w-full mt-5', { 'border-secondary': !secondaryButtonAnimationType })}
              animationType={secondaryButtonAnimationType}
              copy={
                useCustomTextElements ? (
                  <div>{secondaryButtonCopy}</div>
                ) : (
                  <UniformText placeholder="Button Copy goes here" parameterId="secondaryButtonCopy" />
                )
              }
              style={secondaryButtonStyle}
            />
          </ElementWrapper>
        </div>

        <ElementWrapper
          key={featuresKey}
          duration={duration}
          delay={getDelayValue(13)}
          animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
        >
          <div className="flex justify-between w-3/4">
            {(features || []).map(feature => (
              <div className="flex items-center" key={feature}>
                <FeatureIcon />
                <p className="ml-2">{feature}</p>
              </div>
            ))}
          </div>
        </ElementWrapper>
      </div>
    </div>
  );
};

export default ProductInfo;
