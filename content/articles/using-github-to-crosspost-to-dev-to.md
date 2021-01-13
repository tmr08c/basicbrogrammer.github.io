---
title: Want to crosspost to dev.to? There's a GitHub action for that.
published: false
description: When I create a new markdown article, I don't want to have copy and paste that markdown to multiple other blog sites. So, why not let an octocat handle this work for me with a GitHub action?
tags: typescript, github, opensource, actions
cover_image: https://cdn.nanalyze.com/uploads/2018/07/automation-rpa-teaser.jpg
---

# If a tree falls in the woods, does it make a sound?

The internet is much like a forest with content and sites being like trees. There are thousands of trees growing in the forest off the beaten path that no one knows about. If you want your site or content to be discovered, the easiest way is to plant your tree close to the main trail.

<br>

Over the last 6 years of Software Development, I've learned a lot, but I've never shared it outside of my full-time job.  If there's not an easy way for people to find the blogs I put out, then I'm still not sharing my thoughts with others.  This is where sites like [dev.to](https://dev.to/basicbrogrammer) and [hashnode](https://hashnode.com/@basicbrogrammer) come into play. I can write the markdown for my blog posts in vim then crosspost to other blog distribution platforms. I definitely didn't want to copypasta all my content every time, so I've decided to automate this process and open-source it.

<br>

1. Let's go over the code.
2. Let's take a look at how to use the [GitHub Action](https://github.com/basicbrogrammer/crosspost-markdown).

# DaCode

The first order of business is to find out if your last commit contains articles.

<br>

In order to do so, we first require 2 inputs from the GitHub workflow: github-token & content-dir. These 2 arguments will be retrieved using the [@actions/core](https://github.com/actions/toolkit/tree/main/packages/core) package. The `github-token` argument will be used to initiate an [Octokit Rest client](https://octokit.github.io/rest.js/v18/) using the [@actions/github](https://github.com/actions/toolkit/tree/main/packages/github) package. We can use this instance to request the commit data. Once we have the response, all we have to do is iterate over the list of files and see if the filename match a given content directory (from the `content-dir` argument).

```typescript
import * as core from '@actions/core';
import * as github from '@actions/github';

export const getFiles = async (): Promise<string[]> => {
  const octokit = github.getOctokit(core.getInput('github-token'));

  const commit = await octokit.repos.getCommit({
    ...github.context.repo,
    ref: github.context.sha,
  });

  return (commit?.data?.files || [])
    .map((file: any) => file.filename)
    .filter((filename: string) => filename.includes(core.getInput('content-dir')));
};

```

If this code finds markdown files, we will cycle through each file, sending it into a `publish` function.
We will use node's file system [`readFileSync`](https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options) function to read the file into memory. Then, using the [`@github-docs/frontmatter`](https://github.com/docs/frontmatter) package to parse the markdown so we can checkout the [frontmatter](https://jekyllrb.com/docs/front-matter/) which is just the "data" at the top of markdown files.

<br>

If the frontmatter indicates the post is `published`, we can go ahead and start crossposting.
Let's have a look at the current version of the `publish` function.

```typescript
import * as core from '@actions/core';
import * as fs from 'fs';
import devTo from './dev-to';

const frontmatter = require('@github-docs/frontmatter');

const logResponse = async (title: string, destination: string, publishCallback: Promise<any>): Promise<void> => {
  const {status} = await publishCallback;
  console.table({title, destination, status});
};

const publish = async (path: string): Promise<void> => {
  try {
    const markdown = fs.readFileSync(`./${path}`, 'utf8');
    const {data} = frontmatter(markdown);

    if (data.published) {
      if (core.getInput('dev-to-token').length > 0) {
        logResponse(data.title, 'Dev.to', devTo.publish(markdown));
      }
    } else {
      console.log(`Article ${data.title} NOT published. Skipping.`);
    }
  } catch (err) {
    core.setFailed(err.message);
  }
};

export default publish;
```

Currently, I am only crossposting to [dev.to](https://dev.to/basicbrogrammer), but soon I want to update the GitHub Action to crosspost to [hashnode.com](https://hashnode.com/@basicBrogrammer) as well. 🤙

<br>

To crosspost to dev.to, the publish function passes the markdown into the `publish` method on an authenticated instance of DevTo.
The `devTo.publish` method uses the auth token and [node-fetch](https://www.npmjs.com/package/node-fetch) to POST your markdown to dev.to's api and boom it's done.

<br>

And here is the dead simple code for our DevTo class:

```typescript
import fetch from 'node-fetch';
import * as core from '@actions/core';

class DevTo {
  token: string;
  constructor() {
    this.token = core.getInput('dev-to-token');
  }

  async publish(body_markdown: string): Promise<any> {
    const body = {
      article: {
        body_markdown,
      },
    };

    return fetch('https://dev.to/api/articles', {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.token,
      },
    }).then((response: any) => response.json());
  }
}

export default new DevTo();
```

That's really it. That's all the code needed to keep you from having to copy and paste your blog markdown to multiple distributors!

# DaAction

As I was writing this code, I was like why don't I make it a GitHub Action and share it with anyone that would like to use it. So I did 😎.

<br>

Let's take a look at how you can use this action in your GitHub blog repo.

<br>

Inside your GitHub repo, add a workflow file. Mine is `.github/workflows/crosspost.yml`.

<br>

I'm using [nuxt's content module](https://content.nuxtjs.org/) to build my blog, and have it configured to look for blog posts in the `./content/articles/` directory. So, let's tell our action to only run when a file is changed in that directory:

```yaml
name: CrossPost

on:
  push:
    paths:
    - './content/articles/*'
```

Next, we need to start writing the yaml for the job itself. First, we will check out the code:

```yaml
jobs:
  crosspost:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Code
      uses: actions/checkout@v2
```

Super simple.

<br>

Next step will be to run the crosspost-markdown action and pass in the necessary arguments (content-dir & dev-to-token). These can be set in the [secrets](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets) section of your repo's settings.

```yaml
jobs:
  crosspost:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Code
      uses: actions/checkout@v2

    - uses: basicBrogrammer/crosspost-markdown@v0.1.0 # remember to see what the latest version is 8)
      with:
        content-dir: './content/articles/'
        dev-to-token: ${{ secrets.DEV_TO }}
        github-token: ${{ secrets.GITHUB_TOKEN }}
```

All done. Now when you push to your repo the GitHub Action will run and if you have any new blog posts it will publish them to dev.to.

<br>

## [Cache me on Tweeter, HowBowDat? Click Me. I dare you.](https://twitter.com/basicbrogrammer)
