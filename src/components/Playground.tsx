import { FC } from 'react';
import { RootComponentInstance } from '@uniformdev/canvas';
import { createUniformApiEnhancer, UniformPlayground } from '@uniformdev/canvas-react';
import CSKDecorators from './Decorators';
import ThemeProvider from './ThemeProvider';

export type PlaygroundPageProps = {
  data?: RootComponentInstance | null;
  defaultTheme?: Types.ThemeValue | null;
};

const Playground: FC<PlaygroundPageProps> = ({ data, defaultTheme }) => {
  const contextualEditingEnhancer = createUniformApiEnhancer({ apiUrl: '/api/preview' });

  return (
    <ThemeProvider data={data} defaultTheme={defaultTheme}>
      <UniformPlayground
        contextualEditingEnhancer={contextualEditingEnhancer}
        decorators={CSKDecorators}
        behaviorTracking="onLoad"
      />
    </ThemeProvider>
  );
};

export default Playground;
