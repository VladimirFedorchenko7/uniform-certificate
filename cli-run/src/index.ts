#! /usr/bin/env node
import 'dotenv/config';
import clear from 'clear';
import color from 'picocolors';
import path from 'path';
import { confirm, spinner, cancel, note } from './promts';
import {
  demosRequiredIntegrationsMap,
  demosVariantsGetEnvsMap,
  demosVariantsModulesRequire,
  demosVariantsRequiredLocales,
  notMeshIntegrations,
} from './mappers';
import {
  buildDemo,
  fillEnvFiles,
  getExistDemoPath,
  installDependencies,
  isMetaDataExist,
  isNodeModulesExist,
  isProjectExist,
  parseMetadata,
  runDemo,
  runPush,
} from './commands/run';
import { getProjectLocation, getUniformEnvs, showDemoHeader, getUniformAccessTokenEnvs } from './informationCollector';
import { setupUniformProject } from './commands/setupUniform';
import { CommonVariants } from './constants';

const progressSpinner = spinner();

const IS_MANUAL_CREATING = false;

const processEnvFile = async (
  uniformCredentials: CLI.UniformCredentials,
  project: CLI.AvailableProjects,
  projectPath: string,
  variant: CLI.CommonVariants = CommonVariants.Default
) => {
  progressSpinner.start('Checking your env file');

  progressSpinner.stop('Your env file is not correct');

  const projectVariantsGetEnvsMap = demosVariantsGetEnvsMap[project];

  const getAdditionalEnvDataFn = projectVariantsGetEnvsMap?.[variant];

  const additionalEnvData = await getAdditionalEnvDataFn?.(project, variant);

  progressSpinner.start('Creating env file');

  const { uniformApiKey, uniformProjectId, uniformCliBaseUrl, uniformEdgeApiHost } = uniformCredentials;

  await fillEnvFiles(
    projectPath,
    uniformApiKey,
    uniformProjectId,
    uniformCliBaseUrl,
    uniformEdgeApiHost,
    additionalEnvData
  );

  progressSpinner.stop('Env file created');
};

const runResetCanvasJourney = async (project: CLI.AvailableProjects, alreadyDefinedProjectPath?: string) => {
  let projectPath = alreadyDefinedProjectPath;

  if (!projectPath) {
    projectPath = await getProjectLocation(path.resolve('.'));
    projectPath = getExistDemoPath(projectPath, project);
  }

  if (!isProjectExist(projectPath)) {
    cancel(`${project} does not exist in ${projectPath}, please run script again and export your demo first`);
    return process.exit(0);
  }

  progressSpinner.start('Pushing canvas configuration');

  await runPush(projectPath);

  progressSpinner.stop('Canvas configuration pushed');
};

const runRunDemoJourney = async (
  project: CLI.AvailableProjects,
  variant: CLI.CommonVariants = CommonVariants.Default
) => {
  const projectPath = path.resolve('../');
  //For Additional Modules
  let uniformAccessData: CLI.AdditionalModulesExecutorProps['uniformAccessData'] | undefined = undefined;

  if (!isProjectExist(projectPath)) {
    cancel(`${project} does not exist in ${projectPath}, please run script again and export your demo first`);
    return process.exit(0);
  }

  const requiredLocales = demosVariantsRequiredLocales[project]?.[variant];

  let hasManualStepsTodo = false;

  if (requiredLocales?.length) {
    hasManualStepsTodo = true;
    note(
      `🚧 🚧 🚧 This demo requires the following locales: \n${requiredLocales.join(
        ', '
      )}.\nPlease add them on the Settings -> Canvas Settings page of your project.\n\nPlease make sure that your Contentful account has the administrator role in order to get locales.`,
      'Locales required'
    );
  }

  const requiredIntegrations = demosRequiredIntegrationsMap[project]?.[variant];

  const notMeshIntegration =
    requiredIntegrations?.filter(integration => notMeshIntegrations.includes(integration.name)) || [];

  if (notMeshIntegration?.length) {
    hasManualStepsTodo = true;
    const buildedIntegrationListString = notMeshIntegration.map(
      integration => `  * ${integration.name}${integration.link ? ` - ${integration.link}` : ''}`
    );

    note(
      `🚧 🚧 🚧 This demo requires \n${buildedIntegrationListString.join('\n')}\n${
        notMeshIntegrations.length > 1 ? 'integrations' : 'integration'
      } to be installed.`,
      'Integration required'
    );
  }

  progressSpinner.start('Checking your dependencies');

  if (isNodeModulesExist(projectPath)) {
    progressSpinner.stop('Dependencies found');
  } else {
    progressSpinner.stop('Dependencies not found');
    progressSpinner.start('Installing dependencies');

    await installDependencies(projectPath);

    progressSpinner.stop('Dependencies installed');
  }

  if (IS_MANUAL_CREATING) {
    const { uniformApiKey, uniformCliBaseUrl, uniformEdgeApiHost, uniformProjectId } = await getUniformEnvs(project);

    await processEnvFile(
      { uniformApiKey, uniformCliBaseUrl, uniformEdgeApiHost, uniformProjectId },
      project,
      projectPath,
      variant
    );
  } else {
    const uniformCredentials = await getUniformAccessTokenEnvs();
    if (!uniformCredentials) return;

    const { uniformTeamId, uniformProjectId, uniformApiKey, uniformHeaders } = await setupUniformProject(
      {
        uniformApiHost: uniformCredentials.uniformCliBaseUrl,
        uniformAccessToken: uniformCredentials.uniformAccessToken,
        project,
        variant,
      },
      progressSpinner
    );

    uniformAccessData = {
      teamId: uniformTeamId,
      projectId: uniformProjectId,
      uniformApiHost: uniformCredentials.uniformCliBaseUrl,
      headers: uniformHeaders,
    };

    if (!uniformProjectId || !uniformApiKey) {
      return;
    }
    await processEnvFile({ ...uniformCredentials, uniformProjectId, uniformApiKey }, project, projectPath, variant);
  }

  const shouldRunPush = await confirm({
    message: `Do you want to push canvas configuration?${
      hasManualStepsTodo
        ? '\n🚧 🚧 🚧 Please make sure you have applied all manual steps which were described above.'
        : ''
    }`,
  });

  if (shouldRunPush) {
    const projectVariantsModulesRequire = demosVariantsModulesRequire[project];
    const installModules = projectVariantsModulesRequire?.[variant];
    await installModules?.({
      progressSpinner,
      projectPath,
      uniformAccessData,
    });

    await runResetCanvasJourney(project, projectPath);
  }

  progressSpinner.start('Running your demo');
  await buildDemo(projectPath);
  progressSpinner.stop('Demo running check localhost:3000');
  runDemo(projectPath);
};

(async () => {
  clear();

  if (!isMetaDataExist()) {
    note(color.red('Looks like you metadata.json file is not configured. Please check it and try again.'));
    return process.exit(0);
  }

  const { project, variant } = await parseMetadata();

  showDemoHeader(project, variant);

  await runRunDemoJourney(project, variant);
})();
