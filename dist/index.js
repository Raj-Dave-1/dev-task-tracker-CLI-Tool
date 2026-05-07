import figlet from "figlet";
import chalkAnimation from "chalk-animation";
import fs from "fs";
import path from "path";
import os from "os";
import chalk from "chalk";
const args = process.argv.slice(2);
const command = args[0]?.toLowerCase();
const taskDir = path.join(os.homedir(), ".mytask");
const taskFile = process.env.MYTASK_FILE ?? path.join(taskDir, "tasks.json");
if (!fs.existsSync(taskDir)) {
    fs.mkdirSync(taskDir, { recursive: true });
}
const buildTask = (task, totalTasks) => {
    return {
        id: totalTasks,
        description: task,
        status: "to-do",
        createdAt: new Date(),
    };
};
let allTasks;
if (fs.existsSync(taskFile)) {
    allTasks = JSON.parse(fs.readFileSync(taskFile, "utf8"));
}
else {
    allTasks = [];
}
const storeTask = (tasks) => {
    return fs.writeFileSync(taskFile, JSON.stringify(tasks, null, 2));
};
switch (command) {
    case undefined: {
        const title = await figlet("mytask", { font: "Standard" });
        const orange = chalk.rgb(255, 165, 0);
        // Play the rainbow on the title alone. We must let it own the terminal
        // for its duration — any console.log that fires while it's running will
        // collide with the animation's cursor redraws and visually erase it.
        const rainbow = chalkAnimation.rainbow(title);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        rainbow.stop();
        console.log(chalk.gray("  A tiny CLI to track your dev tasks - right from your terminal.\n"));
        const colWidth = 34;
        const cmd = (name) => chalk.cyan.bold(name.padEnd(colWidth, " "));
        const dim = (s) => chalk.gray(s);
        console.log(chalk.white.bold("USAGE"));
        console.log(` ${chalk.cyan("mytask")} ${dim("<command> [arguments]")}\n`);
        console.log(chalk.white.bold("COMMANDS"));
        console.log(` ${cmd("list [status]")}List tasks (filter by ${dim("to-do")}, ${dim("in-progress")}, ${dim("done")})`);
        console.log(` ${cmd('add "<description>"')}Add a new task`);
        console.log(` ${cmd('update <id> "<description>"')}Update a task's description`);
        console.log(` ${cmd("delete <id>")}Delete a task`);
        console.log(` ${cmd("mark:ip <id>")}${orange("Mark a task as in-progress")}`);
        console.log(` ${cmd("mark:in-progress <id>")}${orange("Mark a task as in-progress")}`);
        console.log(` ${cmd("mark:done <id>")}${chalk.green("Mark a task as done")}\n`);
        console.log(chalk.white.bold("EXAMPLES"));
        console.log(` ${dim("$")} mytask add ${chalk.green('"fix the login bug"')}`);
        console.log(` ${dim("$")} mytask list`);
        console.log(` ${dim("$")} mytask list to-do`);
        console.log(` ${dim("$")} mytask mark:ip ${dim("3")}\n`);
        console.log(` ${dim("$")} mytask mark:done ${dim("3")}\n`);
        console.log(chalk.gray("  ---- Built by Raj Dave - https://github.com/Raj-Dave-1/dev-task-tracker-CLI-Tool -----\n"));
        break;
    }
    case "add": {
        const taskDescription = args[1];
        if (!taskDescription) {
            // console.log("Task is required");
            const errorMsg = chalkAnimation.rainbow("Task is required");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            errorMsg.stop();
            process.exit(1); // we don't want to continue if task is not provided, and exit 1 indicates an error
        }
        const newTask = buildTask(taskDescription, allTasks.length);
        allTasks.push({ ...newTask, updatedAt: newTask.createdAt });
        storeTask(allTasks);
        console.log(`Task added successfully (ID: ${newTask.id})`);
        break;
    }
    case "list": {
        const statusFilters = args.slice(1);
        let filteredTasks = [];
        if (statusFilters.length > 0) {
            filteredTasks = allTasks.filter((task) => statusFilters.includes(task.status));
        }
        else {
            filteredTasks = allTasks;
        }
        console.log("\n");
        for (const task of filteredTasks) {
            if (task.status === "to-do") {
                console.log(chalk.bold(`${task.id}. ${task.description}`));
            }
            else if (task.status === "in-progress") {
                const inProgressText = `${task.id}. ${task.description}`.padEnd(50, " ") +
                    ` -  [${task.status.toUpperCase()}]`;
                console.log(chalk.rgb(255, 165, 0).bold(inProgressText));
            }
            else if (task.status === "done") {
                const doneText = `${task.id}. ${task.description}`.padEnd(50, " ") +
                    ` -  [${task.status.toUpperCase()}]`;
                console.log(chalk.green.bold(doneText));
            }
        }
        console.log("\n");
        break;
    }
    case "update": {
        const taskId = args[1];
        if (!taskId) {
            const errorMsg = chalkAnimation.rainbow("Task ID is required");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            errorMsg.stop();
            process.exit(1);
        }
        const task = allTasks.find((task) => task.id === Number(taskId));
        if (!task) {
            const errorMsg = chalkAnimation.rainbow("Task not found");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            errorMsg.stop();
            process.exit(1);
        }
        const updatedTaskDescription = args[2];
        if (!updatedTaskDescription) {
            const errorMsg = chalkAnimation.rainbow("Task description is required");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            errorMsg.stop();
            process.exit(1);
        }
        task.description = updatedTaskDescription;
        task.updatedAt = new Date();
        storeTask(allTasks);
        console.log(`Task updated successfully (ID: ${taskId})`);
        break;
    }
    case "delete": {
        const taskIdToDelete = args[1];
        if (!taskIdToDelete) {
            const errorMsg = chalkAnimation.rainbow("Task ID is required");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            errorMsg.stop();
            process.exit(1);
        }
        const taskToDelete = allTasks.find((task) => task.id === Number(taskIdToDelete));
        if (!taskToDelete) {
            const errorMsg = chalkAnimation.rainbow("Task with given ID does not exists");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            errorMsg.stop();
            process.exit(1);
        }
        allTasks = allTasks.filter((task) => task.id !== Number(taskIdToDelete));
        allTasks = allTasks.map((task, index) => {
            return {
                ...task,
                id: index,
                updatedAt: new Date(),
            };
        });
        storeTask(allTasks);
        break;
    }
    case "mark:ip":
    case "mark:in-progress": {
        const taskId = args[1];
        if (!taskId) {
            const errorMsg = chalkAnimation.rainbow("Task ID is required");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            errorMsg.stop();
            process.exit(1);
        }
        const taskToUpdate = allTasks.find((task) => task.id === Number(taskId));
        if (!taskToUpdate) {
            const errorMsg = chalkAnimation.rainbow("Task with given ID not found");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            errorMsg.stop();
            process.exit(1);
        }
        taskToUpdate.status = "in-progress";
        storeTask(allTasks);
        console.log(chalk
            .rgb(255, 165, 0)
            .bold(`[IN-PROGRESS] - ${taskToUpdate.description}`));
        break;
    }
    case "mark:done": {
        const taskId = args[1];
        if (!taskId) {
            const errorMsg = chalkAnimation.rainbow("Task Id is required");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            errorMsg.stop();
            process.exit(1);
        }
        const taskToUpdate = allTasks.find((task) => task.id === Number(taskId));
        if (!taskToUpdate) {
            const errorMsg = chalkAnimation.rainbow("Task not found");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            errorMsg.stop();
            process.exit(1);
        }
        taskToUpdate.status = "done";
        storeTask(allTasks);
        console.log(chalk.green.bold(`[DONE] - ${taskToUpdate.description}`));
        break;
    }
    default:
        console.error("Command not found");
        process.exit(1);
}
//# sourceMappingURL=index.js.map