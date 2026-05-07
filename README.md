# dev-task-tracker

A tiny CLI to keep track of your dev tasks from the terminal. I built this mostly because I kept losing track of small TODOs scattered across sticky notes and random text files, so now they all live in one `tasks.json` next to my project.

Tasks are stored locally in a `tasks.json` file in whatever directory you run the command from. No accounts, no cloud, no nonsense.

## Install

```bash
npm i -g dev-task-tracker
```

That gives you a `mytask` command available everywhere.

> Heads up: since tasks are saved relative to your current working directory, run the command from the project folder you want to track tasks for.

## Usage

```bash
mytask <command> [args]
```

Running `mytask` with no arguments just prints a friendly welcome banner (figlet + a rainbow animation, because why not).

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

When no filter is applied, `to-do` tasks are shown without the status tag (it's the default state, so the noise isn't useful). Anything filtered or non-todo gets the status appended in parens.

### Update a task's description

```bash
mytask update <id> "new description"
```

Both the id and the new description are required.

### Delete a task

```bash
mytask delete <id>
```

Gone. There's no undo, so be sure.

### Change status

There are a few shortcuts here because typing `in-progress` every time gets old:

```bash
mytask mark:ip <id>          # in-progress (short)
mytask mark:in-progress <id> # in-progress (long)

mytask mark:td <id>          # to-do (short)
mytask mark:todo <id>        # to-do
mytask mark:to-do <id>       # to-do (long)

mytask mark:done <id>
```

## How tasks are stored

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

The file is written with `JSON.stringify(..., null, 2)` so it's perfectly fine to open and tweak by hand if you ever need to.

## Development

Want to hack on it? Clone the repo and install deps:

```bash
git clone https://github.com/Raj-Dave-1/dev-task-tracker-CLI-Tool.git
cd dev-task-tracker
npm install
```

Then the usual scripts:

```bash
npm run dev     # watch mode with tsx
npm run build   # compile to dist/
npm start       # run the built version
```

If you want to test your local build as the actual `mytask` command, run `npm link` after building and you're good.

Source lives in `src/index.ts`. It's a single file at the moment — pretty minimal on purpose.

## Stuff I might add later

- search by keyword in description
- due dates / reminders
- a `clear` command for done tasks
- maybe colors on `list` output

PRs welcome if any of that scratches an itch for you.
