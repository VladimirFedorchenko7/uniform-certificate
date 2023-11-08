import { FC, PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { useUniformCurrentComposition } from '@uniformdev/canvas-react';
import { NextFont } from 'next/dist/compiled/@next/font';
import { appFonts } from '../fonts';

type ComponentStartKitContextProps = {
  breadcrumbs?: Types.ProjectMapLink[];
  primaryFont?: NextFont;
  secondaryFont?: NextFont;
  themeName?: Types.SupportedThemes;
  isJavaDrip?: boolean;
  [key: string]: unknown;
};

type Props = PropsWithChildren<Record<string, unknown>>;

export const ComponentStarterKitContext = createContext<ComponentStartKitContextProps>({});

const ComponentStarterKitContextProvider: FC<Props> = ({ children, ...rest }) => {
  const { data: composition } = useUniformCurrentComposition();

  const params = composition?.slots?.pageHeader?.[0]?.parameters;

  const primaryFontValue = params?.primaryFont?.value;
  const secondaryFontValue = params?.secondaryFont?.value;

  const themeNameValue = (params?.theme?.value as Types.ThemeValue)?.themeName;

  const primaryFont = appFonts[primaryFontValue as Types.SupportedFonts];
  const secondaryFont = appFonts[secondaryFontValue as Types.SupportedFonts];
  const themeName = themeNameValue as Types.SupportedThemes;

  //TODO get rid of isJavaDrip
  const value = useMemo(
    () => ({ primaryFont, secondaryFont, themeName, isJavaDrip: themeName === 'javadrip', ...rest }),
    [rest, primaryFont, themeName, secondaryFont]
  );
  return <ComponentStarterKitContext.Provider value={value}>{children}</ComponentStarterKitContext.Provider>;
};

export default ComponentStarterKitContextProvider;

export const useComponentStarterKitContext = () => useContext(ComponentStarterKitContext);
