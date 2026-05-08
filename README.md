# dev-task-tracker

A tiny CLI to track your dev tasks, right from your terminal.

I built this because small TODOs kept getting scattered across sticky notes, random text files, and forgotten Slack messages to myself. Now they all live in one place - locally, no accounts, no cloud, no nonsense.

Tasks are stored in `~/.mytask/tasks.json`, so the same task list is available no matter which directory you run the command from.


> Built by **[Raj Dave](https://www.linkedin.com/in/raj-dave-03-rh/)** · [GitHub](https://github.com/Raj-Dave-1) · [LinkedIn](https://www.linkedin.com/in/raj-dave-03-rh/)



<img width="749" height="535" alt="image" src="https://github.com/user-attachments/assets/21d690b1-3e20-4ebd-8602-f488d1000798" />


## Install

```bash
npm i -g dev-task-tracker
```

That gives you a `mytask` command available everywhere.

## Usage

```bash
mytask <command> [args]
```

Running `mytask` with no arguments prints a friendly welcome banner (figlet wordmark + a brief rainbow animation) followed by a quick reference of all commands.

### Add a task

```bash
mytask add "fix the login bug"
```

Prints back the new task's ID. Wrap the description in quotes if it has spaces, otherwise only the first word gets picked up.

### List tasks

```bash
mytask list
```

By default this shows all tasks. You can pass one or more statuses to filter:

```bash
mytask list to-do
mytask list in-progress done
```

`to-do` items render in plain bold (it's the default state, so the noise of a tag isn't useful). `in-progress` items show in orange with an `[IN-PROGRESS]` tag, and `done` items show in green with a `[DONE]` tag.

### Update a task's description

```bash
mytask update <id> "new description"
```

Both the ID and the new description are required.

### Delete a task

```bash
mytask delete <id>
```

Gone. There's no undo, so be sure. (IDs of remaining tasks are renumbered after a delete so the list stays compact.)

### Change status

```bash
mytask mark:ip <id>           # in-progress (short)
mytask mark:in-progress <id>  # in-progress (long)
mytask mark:done <id>         # done
```

## Where tasks are stored

Tasks live at:

```
~/.mytask/tasks.json
```

This means the list is the same regardless of which directory you invoke `mytask` from. The directory is created automatically the first time you run the tool.

Each task looks like:

```json
{
  "id": 0,
  "description": "fix the login bug",
  "status": "to-do",
  "createdAt": "2026-04-29T04:22:38.316Z",
  "updatedAt": "2026-04-29T04:23:33.197Z"
}
```

Status is one of: `to-do`, `in-progress`, `done`.

The file is written with `JSON.stringify(..., null, 2)`, so it's perfectly fine to open and tweak by hand if you ever need to.

### Custom storage location

If you want to point `mytask` at a different file (e.g. for testing, or to keep separate task lists per-project), set the `MYTASK_FILE` environment variable:

```bash
MYTASK_FILE=./project-tasks.json mytask list
```

You can put this in your shell profile or per-project `.envrc` if you want it to stick.

## Development

Want to hack on it? Clone the repo and install deps:

```bash
git clone https://github.com/Raj-Dave-1/dev-task-tracker-CLI-Tool.git
cd dev-task-tracker-CLI-Tool
npm install
```

Then the usual scripts:

```bash
npm run dev      # watch mode with tsx
npm run build    # compile TypeScript to dist/
npm start        # run the built version
```

To test your local build as the actual `mytask` command:

```bash
npm run build
npm link
```

Source lives in `src/index.ts`. It's a single file at the moment - pretty minimal on purpose.

## Releases

Releases to npm are fully automated. Every push to `main` triggers a GitHub Actions workflow that runs [semantic-release](https://semantic-release.gitbook.io/), which:

- reads the commit messages since the last release,
- decides the next version (patch / minor / major) based on [Conventional Commits](https://www.conventionalcommits.org/),
- updates `CHANGELOG.md` and `package.json`,
- publishes the new version to [npm](https://www.npmjs.com/package/dev-task-tracker),
- and cuts a matching [GitHub Release](https://github.com/Raj-Dave-1/dev-task-tracker-CLI-Tool/releases) with auto-generated notes.

In short: I don't run `npm publish` by hand. I just write commits like `feat: add search command` or `fix: handle empty task list`, merge to `main`, and the rest happens on its own.

The pipeline lives in [`.github/workflows/release.yml`](./.github/workflows/release.yml), and the release config in [`.releaserc.json`](./.releaserc.json).

## Roadmap

Things I might add later:

- search by keyword in description
- due dates / reminders
- a `clear` command for done tasks
- `--help` / `--version` flags
- per-project task lists via auto-detected `.mytaskrc`

PRs welcome if any of that scratches an itch for you.

## Author

**Raj Dave**

Built with love (and a lot of caffeine) to scratch a personal itch. If it's useful to you, that's a bonus.

- LinkedIn: [linkedin.com/in/raj-dave-03-rh](https://www.linkedin.com/in/raj-dave-03-rh/)
- GitHub: [@Raj-Dave-1](https://github.com/Raj-Dave-1)
- Repo: [dev-task-tracker-CLI-Tool](https://github.com/Raj-Dave-1/dev-task-tracker-CLI-Tool)

Feel free to reach out for feedback, bug reports, or just to say hi.

## License

ISC - see [package.json](./package.json) for details.
Inspired by - https://roadmap.sh/projects/task-tracker