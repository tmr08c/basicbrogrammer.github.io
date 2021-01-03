const { execSync } = require('child_process')
const fs = require('fs')
const fetch = require('node-fetch')
const frontmatter = require('@github-docs/frontmatter')

const publishArticle = (path) => {
  try {
    const markdown = fs.readFileSync(`./${path}`, 'utf8')
    const { data } = frontmatter(markdown)

    if (data.published) {
      console.log(`Article ${data.title} published. Deploying to dev.to`)

      const body = {
        article: {
          body_markdown: markdown,
        },
      }

      fetch('https://dev.to/api/articles', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.DEV_TOKEN,
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json))
    } else {
      console.log(`Article ${data.title} NOT published. Skipping.`)
    }
  } catch (err) {
    console.error(err)
  }
}

const files = execSync(
  'git diff --name-only HEAD HEAD~1 -- ./content/articles/'
)
  .toString()
  .split('\n')
  .filter((f) => f.length > 0)
  .map((f) => f.trim())

if (files.length > 0) {
  files.forEach((f) => publishArticle(f))
} else {
  console.log('No Articles.')
}
