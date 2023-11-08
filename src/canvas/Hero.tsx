import { FC, PropsWithChildren, Fragment, useCallback, useMemo } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import {
  registerUniformComponent,
  ComponentProps,
  UniformText,
  useUniformCurrentComposition,
} from '@uniformdev/canvas-react';
import { NextFont } from 'next/dist/compiled/@next/font';
import BaseContainer, {
  Props as BaseContainerProps,
  ContainerVariants,
  ScreenContainer,
} from '../components/Container';
import Button from '../components/Button';
import {
  getTextClass,
  getImageOverlayOpacityStyle,
  getImageOverlayColorStyle,
  getObjectFitClass,
} from '../utilities/styling';
import { formatProjectMapLink, getMediaUrl } from '../utilities';
import { useComponentStarterKitContext } from '../context/ComponentStarterKitContext';
import { withoutContainer } from '../hocs/withoutContainer';
import AnimatedContainer, { AnimationVariant, Props as AnimatedContainerProps } from '../components/AnimatedContainer';

export type Props = ComponentProps<
  BaseContainerProps & {
    eyebrowText: string;
    title: string;
    titleStyle: Types.HeadingStyles;
    description: string;
    image?: string;
    video?: string;
    primaryButtonCopy: string;
    primaryButtonLink: Types.ProjectMapLink;
    primaryButtonStyle: Types.ButtonStyles;
    primaryButtonAnimationType?: Types.AnimationType;
    secondaryButtonCopy: string;
    secondaryButtonLink: Types.ProjectMapLink;
    secondaryButtonStyle: Types.ButtonStyles;
    secondaryButtonAnimationType?: Types.AnimationType;
    overlayColor?: Types.AvailableColor;
    overlayOpacity?: Types.AvailableOpacity;
    objectFit?: Types.AvailableObjectFit;
    useCustomTextElements?: boolean;
    fullHeight?: boolean;
    animationType?: Types.AnimationType;
    oneByOneAnimation?: boolean;
    duration?: Types.DurationType;
    textColor: Types.AvailableTextColor;
  }
>;

export enum HeroVariant {
  ImageLeft = 'imageLeft',
  ImageRight = 'imageRight',
  BackgroundImage = 'backgroundImage',
  TwoColumns = 'twoColumns',
}

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

const useHeroItemsKeys = (animationType: string | undefined, duration: string, oneByOneAnimation?: boolean) => {
  const keyPrefix = `${animationType}-${duration}-${oneByOneAnimation}`;

  return {
    eyebrowKey: `${keyPrefix}-eyebrow`,
    titleKey: `${keyPrefix}-title`,
    dividerKey: `${keyPrefix}-divider`,
    descriptionKey: `${keyPrefix}-description`,
    primaryButtonKey: `${keyPrefix}-primaryButtonLink`,
    secondaryButtonKey: `${keyPrefix}-secondaryButtonLink`,
  };
};

const HeroTitle: FC<Pick<Props, 'titleStyle' | 'useCustomTextElements' | 'title'> & { className?: string }> = ({
  titleStyle: TitleTag,
  useCustomTextElements,
  title,
  className,
}) =>
  useCustomTextElements ? (
    <TitleTag className={classNames('font-bold', getTextClass(TitleTag))}>{title}</TitleTag>
  ) : (
    <UniformText
      placeholder="Title goes here"
      parameterId="title"
      as={TitleTag}
      className={classNames('font-bold', getTextClass(TitleTag), className)}
      data-testid="hero-title"
    />
  );

const EyebrowText: FC<
  Pick<Props, 'component'> & { secondaryFont?: NextFont; className?: string; isJavaDrip?: boolean }
> = ({ secondaryFont, className, isJavaDrip }) => {
  const textClassNames = isJavaDrip ? 'text-xl text-secondary' : 'text-sm';
  return (
    <UniformText
      placeholder="Eyebrow text goes here"
      parameterId="eyebrowText"
      as="div"
      className={classNames(
        'font-bold tracking-wider uppercase my-3',
        textClassNames,
        secondaryFont?.className,
        className
      )}
    />
  );
};
const Description: FC<{ secondaryFont?: NextFont; className?: string; isJavaDrip?: boolean }> = ({
  secondaryFont,
  className,
  isJavaDrip,
}) => {
  const fontSizeClassNames = isJavaDrip ? 'text-xl' : '';
  return (
    <UniformText
      placeholder="Description goes here"
      parameterId="description"
      as="div"
      className={classNames('whitespace-break-spaces py-6', fontSizeClassNames, secondaryFont?.className, className)}
    />
  );
};

const DescriptionSeparator: FC = () => (
  <div className="w-full flex justify-center py-5">
    <div className="bg-secondary h-1 w-24" />
  </div>
);

const PrimaryButton: FC<Pick<Props, 'primaryButtonLink' | 'primaryButtonStyle' | 'animationType'>> = ({
  primaryButtonLink,
  primaryButtonStyle,
  animationType,
}) => {
  const { isContextualEditing } = useUniformCurrentComposition();
  return (
    <Button
      className="mx-1"
      animationType={animationType}
      href={formatProjectMapLink(primaryButtonLink)}
      copy={
        <UniformText
          placeholder="Button Copy goes here"
          parameterId="primaryButtonCopy"
          onClick={isContextualEditing ? e => e.preventDefault() : undefined}
        />
      }
      style={primaryButtonStyle}
    />
  );
};

const SecondaryButton: FC<Pick<Props, 'secondaryButtonLink' | 'secondaryButtonStyle' | 'animationType'>> = ({
  secondaryButtonLink,
  secondaryButtonStyle,
  animationType,
}) => {
  const { isContextualEditing } = useUniformCurrentComposition();
  return (
    <Button
      className="mx-1"
      href={formatProjectMapLink(secondaryButtonLink)}
      animationType={animationType}
      copy={
        <UniformText
          placeholder="Button Copy goes here"
          parameterId="secondaryButtonCopy"
          onClick={isContextualEditing ? e => e.preventDefault() : undefined}
        />
      }
      style={secondaryButtonStyle}
    />
  );
};

const BackgroundImage: FC<Pick<Props, 'image' | 'video' | 'objectFit' | 'overlayOpacity' | 'overlayColor'>> = ({
  image,
  video,
  objectFit,
  overlayColor,
  overlayOpacity,
}) => {
  const imageUrl = getMediaUrl(image);
  const videoUrl = getMediaUrl(video);

  if (!imageUrl && !videoUrl) return null;

  return (
    <>
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          src={videoUrl}
          className={classNames(
            'absolute h-full w-full top-0 bottom-0 left-0 right-0 z-10',
            getObjectFitClass(objectFit)
          )}
        />
      ) : (
        <Image
          fill
          alt="hero-image"
          src={imageUrl}
          priority
          className={classNames('absolute top-0 bottom-0 left-0 right-0 z-10', getObjectFitClass(objectFit))}
        />
      )}
      <div
        className={classNames(
          'absolute top-0 bottom-0 left-0 right-0 z-10',
          getImageOverlayOpacityStyle(overlayOpacity),
          getImageOverlayColorStyle(overlayColor)
        )}
      />
    </>
  );
};

const SideImage: FC<Pick<Props, 'image' | 'video' | 'objectFit' | 'overlayOpacity' | 'overlayColor'>> = ({
  image,
  video,
  objectFit,
  overlayColor,
  overlayOpacity,
}) => {
  const { isJavaDrip } = useComponentStarterKitContext();
  const imageUrl = getMediaUrl(image);
  const videoUrl = getMediaUrl(video);

  if (!imageUrl && !videoUrl) return null;

  return (
    <div className="relative shrink-0">
      {video ? (
        <video
          autoPlay
          muted
          loop
          width={isJavaDrip ? 400 : 500}
          height={isJavaDrip ? 300 : 500}
          src={videoUrl}
          className={classNames('rounded-lg md:h-[500px]', getObjectFitClass(objectFit), {
            '!rounded-none': isJavaDrip,
          })}
        />
      ) : (
        <Image
          width={isJavaDrip ? 700 : 500}
          height={isJavaDrip ? 500 : 500}
          alt="hero-image"
          src={imageUrl}
          className={classNames('rounded-lg md:h-[500px]', getObjectFitClass(objectFit), {
            '!rounded-none': isJavaDrip,
          })}
        />
      )}

      <div
        className={classNames(
          'absolute top-0 bottom-0 left-0 right-0 z-10',
          getImageOverlayOpacityStyle(overlayOpacity),
          getImageOverlayColorStyle(overlayColor)
        )}
      ></div>
    </div>
  );
};

const HeroContainer: FC<PropsWithChildren<BaseContainerProps & { fullHeight?: boolean; className?: string }>> = ({
  children,
  className,
  fullHeight,
  containerVariant,
  marginBottom,
  marginTop,
  paddingBottom,
  paddingTop,
  backgroundType,
}) => {
  const isFluentContent = containerVariant === ContainerVariants.FluentContent;

  const Wrapper = isFluentContent ? ScreenContainer : Fragment;

  return (
    <BaseContainer
      containerVariant={containerVariant}
      marginBottom={marginBottom}
      marginTop={marginTop}
      paddingBottom={paddingBottom}
      paddingTop={paddingTop}
      backgroundType={backgroundType}
      backgroundClassName={className}
      className={classNames('hero relative', className, {
        'min-h-[500px]': !fullHeight,
        'min-h-[calc(100vh-64px)]': fullHeight,
      })}
    >
      <Wrapper {...(isFluentContent ? { className: classNames('xl:px-0 px-4', { 'h-full': fullHeight }) } : {})}>
        {children}
      </Wrapper>
    </BaseContainer>
  );
};

const HeroTwoColumns: FC<Props> = ({
  title,
  titleStyle = 'h1',
  image,
  video,
  primaryButtonLink,
  primaryButtonStyle = 'primary',
  primaryButtonAnimationType,
  secondaryButtonLink,
  secondaryButtonStyle = 'primary',
  secondaryButtonAnimationType,
  component,
  overlayOpacity,
  overlayColor,
  objectFit,
  useCustomTextElements = false,
  fullHeight,
  animationType,
  duration = 'medium',
  oneByOneAnimation,
  backgroundType,
  containerVariant,
  paddingBottom,
  paddingTop,
  marginBottom,
  marginTop,
  textColor = 'Light',
}) => {
  const { secondaryFont, isJavaDrip } = useComponentStarterKitContext();

  const baseTextStyle = textColor === 'Light' ? 'text-primary-content' : 'text-secondary-content';

  const ElementWrapper = ({ children, ...props }: PropsWithChildren<AnimatedContainerProps>) =>
    animationType ? <AnimatedContainer {...props}>{children}</AnimatedContainer> : <Fragment>{children}</Fragment>;

  const delayCoefficient = useMemo(() => getDelayCoefficient(duration), [duration]);

  const getDelayValue = useCallback(
    (delayIndex: number) => getDelay(delayIndex, !!oneByOneAnimation, delayCoefficient),
    [oneByOneAnimation, delayCoefficient]
  );

  const { eyebrowKey, titleKey, descriptionKey, primaryButtonKey, secondaryButtonKey } = useHeroItemsKeys(
    animationType,
    duration,
    oneByOneAnimation
  );

  return (
    <HeroContainer
      fullHeight={fullHeight}
      className={baseTextStyle}
      paddingBottom={paddingBottom}
      paddingTop={paddingTop}
      marginBottom={marginBottom}
      marginTop={marginTop}
      backgroundType={backgroundType}
      containerVariant={containerVariant}
    >
      <div
        className={classNames('hero-content text-center p-0', {
          'h-full items-start pt-20': fullHeight,
        })}
      >
        <BackgroundImage
          image={image}
          video={video}
          objectFit={objectFit}
          overlayColor={overlayColor}
          overlayOpacity={overlayOpacity}
        />

        <div className={classNames('flex flex-row mx-1 md:mx-10 z-20')}>
          <div className="grid grid-cols-2 gap-x-28">
            <div className="flex flex-col">
              <ElementWrapper
                key={eyebrowKey}
                duration={duration}
                delay={getDelayValue(1.5)}
                animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInRight}
              >
                <EyebrowText component={component} secondaryFont={secondaryFont} isJavaDrip={isJavaDrip} />
              </ElementWrapper>
              <ElementWrapper
                key={titleKey}
                duration={duration}
                delay={getDelayValue(3)}
                animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInRight}
              >
                <HeroTitle
                  titleStyle={titleStyle}
                  useCustomTextElements={useCustomTextElements}
                  className="text-left"
                  title={title}
                />
              </ElementWrapper>
            </div>

            <div className="text-secondary flex flex-col items-start">
              <ElementWrapper
                key={descriptionKey}
                duration={duration}
                delay={getDelayValue(4.5)}
                animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInLeft}
              >
                <Description secondaryFont={secondaryFont} isJavaDrip={isJavaDrip} className="text-left !py-0" />
              </ElementWrapper>
              <div className="py-6">
                {Boolean(primaryButtonLink) && (
                  <ElementWrapper
                    key={primaryButtonKey}
                    duration={duration}
                    delay={getDelayValue(6)}
                    animationVariant={
                      animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInLeft
                    }
                  >
                    <PrimaryButton
                      animationType={primaryButtonAnimationType}
                      primaryButtonLink={primaryButtonLink}
                      primaryButtonStyle={primaryButtonStyle}
                    />
                  </ElementWrapper>
                )}
                {Boolean(secondaryButtonLink) && (
                  <ElementWrapper
                    key={secondaryButtonKey}
                    duration={duration}
                    delay={getDelayValue(7.5)}
                    animationVariant={
                      animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInLeft
                    }
                  >
                    <SecondaryButton
                      animationType={secondaryButtonAnimationType}
                      secondaryButtonLink={secondaryButtonLink}
                      secondaryButtonStyle={secondaryButtonStyle}
                    />
                  </ElementWrapper>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroContainer>
  );
};

const HeroSideImage: FC<Props> = ({
  title,
  titleStyle = 'h1',
  description,
  image,
  video,
  primaryButtonLink,
  primaryButtonStyle = 'primary',
  primaryButtonAnimationType,
  secondaryButtonLink,
  secondaryButtonStyle = 'primary',
  secondaryButtonAnimationType,
  component,
  overlayOpacity,
  overlayColor,
  objectFit,
  useCustomTextElements = false,
  fullHeight,
  animationType,
  duration = 'medium',
  oneByOneAnimation,
  backgroundType,
  containerVariant,
  paddingBottom,
  paddingTop,
  marginBottom,
  marginTop,
  textColor = 'Light',
}) => {
  const { secondaryFont, isJavaDrip } = useComponentStarterKitContext();
  const { variant } = component || {};

  const baseTextStyle = textColor === 'Light' ? 'text-primary-content' : 'text-secondary-content';

  const { eyebrowKey, titleKey, descriptionKey, primaryButtonKey, secondaryButtonKey } = useHeroItemsKeys(
    animationType,
    duration,
    oneByOneAnimation
  );

  const heroContentClass = variant === HeroVariant.ImageLeft ? 'flex-col lg:flex-row' : 'flex-col lg:flex-row-reverse';
  const contentAlignClass = variant === HeroVariant.ImageLeft ? 'text-start' : isJavaDrip ? 'text-end' : 'text-start';

  const ElementWrapper = ({ children, ...props }: PropsWithChildren<AnimatedContainerProps>) =>
    animationType ? <AnimatedContainer {...props}>{children}</AnimatedContainer> : <Fragment>{children}</Fragment>;

  const delayCoefficient = useMemo(() => getDelayCoefficient(duration), [duration]);

  const getDelayValue = useCallback(
    (delayIndex: number) => getDelay(delayIndex, !!oneByOneAnimation, delayCoefficient),
    [oneByOneAnimation, delayCoefficient]
  );

  const animationSide = useMemo(
    () => (variant === HeroVariant.ImageLeft ? AnimationVariant.FadeInLeft : AnimationVariant.FadeInRight),
    [variant]
  );

  return (
    <HeroContainer
      fullHeight={fullHeight}
      className={baseTextStyle}
      paddingBottom={paddingBottom}
      paddingTop={paddingTop}
      marginBottom={marginBottom}
      marginTop={marginTop}
      backgroundType={backgroundType}
      containerVariant={containerVariant}
    >
      <div
        className={classNames('hero-content text-center p-0', heroContentClass, {
          'h-full items-start pt-20': fullHeight,
        })}
      >
        <SideImage
          video={video}
          image={image}
          objectFit={objectFit}
          overlayColor={overlayColor}
          overlayOpacity={overlayOpacity}
        />

        <div className={classNames('flex flex-col mx-1 md:mx-10 z-20', contentAlignClass)}>
          <ElementWrapper
            key={eyebrowKey}
            duration={duration}
            delay={getDelayValue(1.5)}
            animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : animationSide}
          >
            <EyebrowText
              component={component}
              secondaryFont={secondaryFont}
              isJavaDrip={isJavaDrip}
              className={!isJavaDrip ? '!text-primary' : ''}
            />
          </ElementWrapper>
          <ElementWrapper
            key={titleKey}
            duration={duration}
            delay={getDelayValue(3)}
            animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : animationSide}
          >
            <HeroTitle
              className="py-2"
              titleStyle={titleStyle}
              useCustomTextElements={useCustomTextElements}
              title={title}
            />
          </ElementWrapper>
          <ElementWrapper
            key={descriptionKey}
            duration={duration}
            delay={getDelayValue(4.5)}
            animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : animationSide}
          >
            <Description
              secondaryFont={secondaryFont}
              isJavaDrip={isJavaDrip}
              className={isJavaDrip ? 'pt-14 pb-10' : 'py-10'}
            />
          </ElementWrapper>
          <div className={classNames('pb-6', { 'py-6': !description })}>
            {Boolean(primaryButtonLink) && (
              <ElementWrapper
                key={primaryButtonKey}
                duration={duration}
                delay={getDelayValue(4.5)}
                animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : animationSide}
              >
                <PrimaryButton
                  animationType={primaryButtonAnimationType}
                  primaryButtonLink={primaryButtonLink}
                  primaryButtonStyle={primaryButtonStyle}
                />
              </ElementWrapper>
            )}
            {Boolean(secondaryButtonLink) && (
              <ElementWrapper
                key={secondaryButtonKey}
                duration={duration}
                delay={getDelayValue(4.5)}
                animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : animationSide}
              >
                <SecondaryButton
                  animationType={secondaryButtonAnimationType}
                  secondaryButtonLink={secondaryButtonLink}
                  secondaryButtonStyle={secondaryButtonStyle}
                />
              </ElementWrapper>
            )}
          </div>
        </div>
      </div>
    </HeroContainer>
  );
};

const HeroBackgroundImage: FC<Props> = ({
  title,
  titleStyle = 'h1',
  description,
  image,
  video,
  primaryButtonLink,
  primaryButtonStyle = 'primary',
  primaryButtonAnimationType,
  secondaryButtonLink,
  secondaryButtonStyle = 'primary',
  secondaryButtonAnimationType,
  component,
  overlayOpacity,
  overlayColor,
  objectFit,
  useCustomTextElements = false,
  fullHeight,
  animationType,
  duration = 'medium',
  oneByOneAnimation,
  backgroundType,
  containerVariant,
  paddingBottom,
  paddingTop,
  marginBottom,
  marginTop,
  textColor = 'Light',
}) => {
  const { secondaryFont, isJavaDrip } = useComponentStarterKitContext();
  const { eyebrowKey, titleKey, descriptionKey, dividerKey, primaryButtonKey, secondaryButtonKey } = useHeroItemsKeys(
    animationType,
    duration,
    oneByOneAnimation
  );

  const baseTextStyle = textColor === 'Light' ? 'text-primary-content' : 'text-secondary-content';

  const ElementWrapper = ({ children, ...props }: PropsWithChildren<AnimatedContainerProps>) =>
    animationType ? <AnimatedContainer {...props}>{children}</AnimatedContainer> : <Fragment>{children}</Fragment>;

  const delayCoefficient = useMemo(() => getDelayCoefficient(duration), [duration]);

  const getDelayValue = useCallback(
    (delayIndex: number) => getDelay(delayIndex, !!oneByOneAnimation, delayCoefficient),
    [oneByOneAnimation, delayCoefficient]
  );

  return (
    <HeroContainer
      fullHeight={fullHeight}
      className={baseTextStyle}
      paddingBottom={paddingBottom}
      paddingTop={paddingTop}
      marginBottom={marginBottom}
      marginTop={marginTop}
      backgroundType={backgroundType}
      containerVariant={containerVariant}
    >
      <div
        className={classNames('hero-content text-center p-0', {
          'h-full items-start pt-20': fullHeight,
        })}
      >
        <BackgroundImage
          image={image}
          video={video}
          objectFit={objectFit}
          overlayColor={overlayColor}
          overlayOpacity={overlayOpacity}
        />

        <div className={classNames('flex flex-col mx-1 md:mx-10 z-20')}>
          <ElementWrapper
            key={eyebrowKey}
            duration={duration}
            delay={getDelayValue(1.5)}
            animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
          >
            <EyebrowText
              component={component}
              secondaryFont={secondaryFont}
              isJavaDrip={isJavaDrip}
              className={isJavaDrip ? '!tracking-[5.5px] font-bold' : ''}
            />
          </ElementWrapper>
          <ElementWrapper
            key={titleKey}
            duration={duration}
            delay={getDelayValue(3)}
            animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
          >
            <HeroTitle titleStyle={titleStyle} useCustomTextElements={useCustomTextElements} title={title} />
          </ElementWrapper>
          <ElementWrapper
            key={dividerKey}
            duration={duration}
            delay={getDelayValue(4.5)}
            animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
          >
            {isJavaDrip && description ? <DescriptionSeparator /> : null}
          </ElementWrapper>
          <ElementWrapper
            key={descriptionKey}
            duration={duration}
            delay={getDelayValue(6)}
            animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
          >
            <Description
              secondaryFont={secondaryFont}
              isJavaDrip={isJavaDrip}
              className={isJavaDrip ? 'tracking-[5.5px] uppercase !py-0' : ''}
            />
          </ElementWrapper>

          <div className="py-6">
            {Boolean(primaryButtonLink) && (
              <ElementWrapper
                key={primaryButtonKey}
                duration={duration}
                delay={getDelayValue(7.5)}
                animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
              >
                <PrimaryButton
                  animationType={primaryButtonAnimationType}
                  primaryButtonLink={primaryButtonLink}
                  primaryButtonStyle={primaryButtonStyle}
                />
              </ElementWrapper>
            )}
            {Boolean(secondaryButtonLink) && (
              <ElementWrapper
                key={secondaryButtonKey}
                duration={duration}
                delay={getDelayValue(9)}
                animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
              >
                <SecondaryButton
                  animationType={secondaryButtonAnimationType}
                  secondaryButtonLink={secondaryButtonLink}
                  secondaryButtonStyle={secondaryButtonStyle}
                />
              </ElementWrapper>
            )}
          </div>
        </div>
      </div>
    </HeroContainer>
  );
};

const HeroDefault: FC<Props> = ({
  title,
  titleStyle = 'h1',
  description,
  primaryButtonLink,
  primaryButtonStyle = 'primary',
  primaryButtonAnimationType,
  secondaryButtonLink,
  secondaryButtonStyle = 'primary',
  secondaryButtonAnimationType,
  component,
  useCustomTextElements = false,
  fullHeight,
  animationType,
  duration = 'medium',
  oneByOneAnimation,
  backgroundType,
  containerVariant,
  paddingBottom,
  paddingTop,
  marginBottom,
  marginTop,
  textColor = 'Light',
}) => {
  const { secondaryFont, isJavaDrip } = useComponentStarterKitContext();

  const baseTextStyle = textColor === 'Light' ? 'text-primary-content' : 'text-secondary-content';

  const ElementWrapper = ({ children, ...props }: PropsWithChildren<AnimatedContainerProps>) =>
    animationType ? <AnimatedContainer {...props}>{children}</AnimatedContainer> : <Fragment>{children}</Fragment>;

  const delayCoefficient = useMemo(() => getDelayCoefficient(duration), [duration]);

  const getDelayValue = useCallback(
    (delayIndex: number) => getDelay(delayIndex, !!oneByOneAnimation, delayCoefficient),
    [oneByOneAnimation, delayCoefficient]
  );

  const { eyebrowKey, titleKey, descriptionKey, primaryButtonKey, secondaryButtonKey } = useHeroItemsKeys(
    animationType,
    duration,
    oneByOneAnimation
  );

  return (
    <HeroContainer
      fullHeight={fullHeight}
      className={baseTextStyle}
      paddingBottom={paddingBottom}
      paddingTop={paddingTop}
      marginBottom={marginBottom}
      marginTop={marginTop}
      backgroundType={backgroundType}
      containerVariant={containerVariant}
    >
      <div
        className={classNames('hero-content text-center p-0', {
          'h-full items-start pt-20': fullHeight,
        })}
      >
        <div className={classNames('flex flex-col mx-1 md:mx-10 z-20')}>
          <ElementWrapper
            key={eyebrowKey}
            duration={duration}
            delay={getDelayValue(1.5)}
            animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
          >
            <EyebrowText component={component} secondaryFont={secondaryFont} isJavaDrip={isJavaDrip} />
          </ElementWrapper>
          <ElementWrapper
            key={titleKey}
            duration={duration}
            delay={getDelayValue(3)}
            animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
          >
            <HeroTitle titleStyle={titleStyle} useCustomTextElements={useCustomTextElements} title={title} />
          </ElementWrapper>
          <ElementWrapper
            key={descriptionKey}
            duration={duration}
            delay={getDelayValue(4.5)}
            animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
          >
            <Description secondaryFont={secondaryFont} isJavaDrip={isJavaDrip} />
          </ElementWrapper>
          <div className={classNames('pb-6', { 'py-6': !description })}>
            {Boolean(primaryButtonLink) && (
              <ElementWrapper
                key={primaryButtonKey}
                duration={duration}
                delay={getDelayValue(6)}
                animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
              >
                <PrimaryButton
                  animationType={primaryButtonAnimationType}
                  primaryButtonLink={primaryButtonLink}
                  primaryButtonStyle={primaryButtonStyle}
                />
              </ElementWrapper>
            )}
            {Boolean(secondaryButtonLink) && (
              <ElementWrapper
                key={secondaryButtonKey}
                duration={duration}
                delay={getDelayValue(7.5)}
                animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : AnimationVariant.FadeInTop}
              >
                <SecondaryButton
                  animationType={secondaryButtonAnimationType}
                  secondaryButtonLink={secondaryButtonLink}
                  secondaryButtonStyle={secondaryButtonStyle}
                />
              </ElementWrapper>
            )}
          </div>
        </div>
      </div>
    </HeroContainer>
  );
};

const Hero: FC<Props> = props => {
  const { variant } = props.component || {};
  switch (variant) {
    case HeroVariant.ImageRight:
    case HeroVariant.ImageLeft:
      return <HeroSideImage {...props} />;
    case HeroVariant.BackgroundImage:
      return <HeroBackgroundImage {...props} />;
    case HeroVariant.TwoColumns:
      return <HeroTwoColumns {...props} />;
    default:
      return <HeroDefault {...props} />;
  }
};

[undefined, HeroVariant.ImageLeft, HeroVariant.ImageRight, HeroVariant.BackgroundImage, HeroVariant.TwoColumns].forEach(
  variantId => {
    registerUniformComponent({
      type: 'hero',
      component: withoutContainer(Hero),
      variantId,
    });
  }
);

export default Hero;
