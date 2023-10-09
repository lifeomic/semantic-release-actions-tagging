import semver from 'semver';
import { Octokit } from '@octokit/rest';
import type { PublishContext } from 'semantic-release';

type UpdateTagParams = {
  owner: string;
  repo: string;
  tag: string;
  sha: string;
};

const updateTag = async (
  octokit: Octokit,
  { owner, repo, tag, sha }: UpdateTagParams,
) => {
  await octokit.git
    .deleteRef({
      owner,
      repo,
      ref: `tags/${tag}`,
    })
    // Ignore errors -- any error is almost certainly "the tag does not exist",
    // in which case we should just continue on.
    .catch(() => null);

  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/tags/${tag}`,
    sha,
  });
};

const requireEnviromentVariable = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `@lifeomic/semantic-release-actions-tagging requires ${name} environment variable`,
    );
  }
  return value;
};

export const publish = async (ctx: PublishContext) => {
  const [owner, repo] =
    requireEnviromentVariable('GITHUB_REPOSITORY').split('/');

  const sha = requireEnviromentVariable('GITHUB_SHA');

  const token = requireEnviromentVariable('GITHUB_TOKEN');

  const version = semver.parse(ctx.nextRelease.version);
  if (!version) {
    throw new Error('Could not parse version');
  }

  const octokit = new Octokit({ auth: token });

  // Move major version tag.
  await updateTag(octokit, { owner, repo, tag: `v${version.major}`, sha });
  // Move minor version tag.
  await updateTag(octokit, {
    owner,
    repo,
    tag: `v${version.major}.${version.minor}`,
    sha,
  });
};
