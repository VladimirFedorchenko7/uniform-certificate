import { FC, ElementType, Fragment } from 'react';
import classNames from 'classnames';
import {
  createUniformApiEnhancer,
  UniformComposition,
  UniformPlaygroundDecorator,
  UniformSlot,
  useUniformCurrentComposition,
} from '@uniformdev/canvas-react';
import type { RootComponentInstance } from '@uniformdev/canvas';
import UniformPreviewIcon from './UniformPreviewIcon';
import ThemeProvider from './ThemeProvider';
import { getGapClass, getMarginBottomClass, PaddingSize } from '../utilities/styling';
import ComponentStarterKitContextProvider, {
  useComponentStarterKitContext,
} from '../context/ComponentStarterKitContext';
import { CHILDREN_CONTAINER_STYLES, COMMON_PADDING } from '../hocs/withoutContainer';
import { HeaderPlaceholder } from '../canvas/navigation/Header';
import { FooterPlaceholder } from '../canvas/navigation/Footer';

export type PageProps = {
  preview: boolean;
  useUniformComposition?: boolean;
  data: RootComponentInstance;
  providers: ElementType;
  skipContainerWrappersList?: string[];
  context: Record<string, unknown>;
};

const PageContent: FC<Pick<PageProps, 'preview' | 'useUniformComposition' | 'providers'>> = ({
  useUniformComposition,
  preview,
  providers: Providers = Fragment,
}) => {
  const { isJavaDrip } = useComponentStarterKitContext();
  const { data: composition } = useUniformCurrentComposition();

  const gap = composition?.slots?.pageHeader?.[0]?.parameters?.syntheticGap?.value as PaddingSize | undefined;

  return (
    <ThemeProvider>
      <Providers>
        {/* Docs: https://docs.uniform.app/reference/packages/uniformdev-canvas-react#slot */}
        <div className={COMMON_PADDING}>
          <UniformSlot name="pageHeader" />
        </div>
        {/* useUniformComposition is always true only for global composition preview */}
        {useUniformComposition && <h1 className="flex-1 flex justify-center items-center">Page content placeholder</h1>}
        <div
          className={classNames('flex flex-col flex-1', CHILDREN_CONTAINER_STYLES, COMMON_PADDING, getGapClass(gap), {
            [getMarginBottomClass(gap)]: !isJavaDrip,
          })}
        >
          <UniformSlot name="pageContent" />
        </div>
        <div className={COMMON_PADDING}>
          <UniformSlot name="pageFooter" />
        </div>
        {preview && <UniformPreviewIcon />}
      </Providers>
    </ThemeProvider>
  );
};

const Page: FC<PageProps> = ({ data: composition, useUniformComposition, preview, providers = Fragment, context }) => (
  <UniformComposition
    data={composition}
    behaviorTracking="onLoad"
    contextualEditingEnhancer={createUniformApiEnhancer({ apiUrl: '/api/preview' })}
  >
    <ComponentStarterKitContextProvider {...(context || {})}>
      <PageContent useUniformComposition={useUniformComposition} preview={preview} providers={providers} />
    </ComponentStarterKitContextProvider>
  </UniformComposition>
);

export const BackgroundDecorator: UniformPlaygroundDecorator = ({ data, children }) => {
  const isFooterComponents = ['footer'].includes(data.type);
  const isHeaderComponents = ['header'].includes(data.type);

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col relative">
      {!isHeaderComponents && <div className={classNames('blur-sm mb-6', COMMON_PADDING)}>{HeaderPlaceholder()}</div>}
      <div className={classNames('flex flex-col flex-1 [&>*]:my-auto', COMMON_PADDING, CHILDREN_CONTAINER_STYLES)}>
        {children}
      </div>
      {!isFooterComponents && <div className={classNames('blur-sm mt-6', COMMON_PADDING)}>{FooterPlaceholder()}</div>}
    </div>
  );
};

export const WithoutContainerDecorator: UniformPlaygroundDecorator = ({ data, children }) =>
  ['hero', 'banner', 'container', 'header', 'footer', 'productInfo', 'productGallery'].includes(data.type) ? (
    <div className={classNames('!max-w-none !px-0', { '!my-0': ['header'].includes(data.type) })}>{children}</div>
  ) : (
    <>{children}</>
  );

export default Page;
