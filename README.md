A [`semantic-release`](https://github.com/semantic-release/semantic-release) plugin for creating Git tags matching GitHub Actions convention. Use this plugin if you want to use semantic-release to version your custom GitHub Actions.

## Installation

```
yarn add -D @lifeomic/semantic-release-actions-tagging
```

## Usage

```js
// release.config.js
module.exports = {
  branches: ['master'],
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    // Declare here.
    '@lifeomic/semantic-release-actions-tagging',
  ],
};
```

## Behavior

The config above will cause major + minor tags to be created when releasing a new version.

e.g. if your recent commits will result in a new `v1.2.3` version being published, this plugin will also:

- create a new (or move an existing) `v1` tag pointed to the same commit
- create a new (or move an existing) `v1.2` tag pointed to the same commit
