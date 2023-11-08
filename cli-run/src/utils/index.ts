import childProcess from 'child_process';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

export const execPromise = (command: string) => {
  return new Promise(function (resolve, reject) {
    childProcess.exec(command, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(stdout.trim());
    });
  });
};

export const remove = (path: string) => fs.promises.rm(path, { recursive: true, force: true });

export const fetchThemePackThemes = async (selectedThemeName: string, data: any) => {
  const { apiHost = '' } = data || {};

  const baseUrl = apiHost.includes('canary')
    ? 'https://canary-theme-pack-mesh-integration.netlify.app'
    : 'https://theme-pack.mesh.uniform.app';

  const StaticThemes = await fetch(`${baseUrl}/staticThemes.json`).then(res => res.json());

  const uniformTheme = (StaticThemes as CLI.ThemePackTheme[]).find(theme => theme.themeName === 'uniform');
  const javadripTheme = (StaticThemes as CLI.ThemePackTheme[]).find(theme => theme.themeName === 'javadrip');

  return {
    selectedThemeName,
    themes: {
      uniform: uniformTheme,
      javadrip: javadripTheme,
    },
  };
};

export const composeGetEnvFns =
  (
    ...getEnvFunctions: Array<
      (project: CLI.AvailableProjects, variant: CLI.CommonVariants) => Promise<Record<string, string>>
    >
  ) =>
  async (project: CLI.AvailableProjects, variant: CLI.CommonVariants) => {
    // We are not able to use Promise all because don't want to run functions in parallel
    let envs = {};
    for (const fn of getEnvFunctions) {
      const result = await fn(project, variant);
      envs = { ...envs, ...result };
    }
    return envs;
  };

export const addExamplesCanvasCache = async (projectPath: string) => {
  const listOfCanvasCache = await fs.promises.readdir(path.resolve(projectPath, 'content', 'examples'));
  await Promise.all(
    listOfCanvasCache.map(async cache => {
      await fs.promises.cp(
        path.resolve(projectPath, 'content', 'examples', cache),
        path.resolve(projectPath, 'content', cache),
        { recursive: true }
      );
    })
  );
  const pathToCanvasFile = path.resolve(projectPath, 'src', 'canvas', 'index.ts');
  const canvas = await fs.promises.readFile(pathToCanvasFile, 'utf-8');
  await fs.promises.writeFile(pathToCanvasFile, `import '../modules/coveo';\n${canvas}`);
};
