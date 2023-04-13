# GitHub Action for Salesforce Code Review via AI

This GitHub Action uses the OpenAI api to automate a code review of Salesforce metadata via AI.

## Usage

| Input | Decription | Default |
| --- | --- | --- |
| diff_dir | Temporary directory to store results of diff | `sfDiffOutput` |
| diff_from | Commit SHA from where the diff is done | `HEAD~1` |
| diff_to | Commit SHA from where the diff is done | `HEAD` |
| openai_api_key | OpenAI API Key | `None` |
| openai_model | OpenAI Model | `gpt-3.5-turbo` |
| root_dir | Root directory of git repository | `.` |

| Output | Decription |
| --- | --- |
| ai_comment | Code review comment from AI |

## Examples

### Automated AI Code Review

An example workflow that triggers when a PR review is requested. The action posts a comment to the PR based on the results of the AI code review.

```
on:
  pull_request:
    types:
      [review_requested]
name: AI Code Review
jobs:
  ai_auto_review:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
    - name: sfgpt
      id: sfgpt
      uses: tythonco/actions-sfgpt@v1
      with:
        diff_from: ${{ github.event.pull_request.base.sha }}
        diff_to: ${{ github.event.pull_request.head.sha }}
        openai_api_key: ${{ secrets.OPENAI_API_KEY }}
    - uses: actions/github-script@v6
      with:
        script: |
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: ${{steps.sfgpt.outputs.ai_comment}}
          })
```

### Manual Code Review

An example workflow that triggers when a comment is made on a PR that says `/review`. The action posts a comment to the PR based on the results of the AI code review.

```
on:
  issue_comment: # Note: This event will only trigger a workflow run if the workflow file is on the default branch.
    types:
      [created]
name: AI Code Review
jobs:
  ai_manual_review:
    if: github.event.issue.pull_request && contains(github.event.comment.body, '/review')
    runs-on: ubuntu-latest
    steps:
    - uses: xt0rted/pull-request-comment-branch@v2
      id: comment-branch
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
        ref: ${{ steps.comment-branch.outputs.head_ref }}
    - name: sfgpt
      id: sfgpt
      uses: tythonco/actions-sfgpt@v1
      with:
        diff_from: ${{ steps.comment-branch.outputs.base_sha }}
        diff_to: ${{ steps.comment-branch.outputs.head_sha }}
        openai_api_key: ${{ secrets.OPENAI_API_KEY }}
    - uses: actions/github-script@v6
      with:
        script: |
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: ${{steps.sfgpt.outputs.ai_comment}}
          })
```

## Development

### Getting Started

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution after completing your updates
```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:  
```bash
$ npm test
```

### Publishing

Actions are run from GitHub repos so check in the packed `dist` folder after development of version X is complete.

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run build
$ npm run package
$ git checkout -b releases/vX
$ git add dist
$ git commit -a -m "Updates for vX"
$ git push origin releases/vX
```

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

### Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  openai_api_key: test
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:

### Versioning

After testing you can [create a version tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest version of your action

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE.md).