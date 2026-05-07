import figlet from "figlet";
import chalkAnimation from "chalk-animation";
import fs from "fs";
import chalk from "chalk";

const args = process.argv.slice(2);
const command = args[0]?.toLowerCase();
const taskFile = "tasks.json";
type TaskStatus = "to-do" | "in-progress" | "done";

interface Task {
  id: number;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

const buildTask = (
  task: string,
  totalTasks: number,
): Omit<Task, "updatedAt"> => {
  return {
    id: totalTasks,
    description: task,
    status: "to-do",
    createdAt: new Date(),
  };
};

let allTasks: Task[];
if (fs.existsSync(taskFile)) {
  allTasks = JSON.parse(fs.readFileSync(taskFile, "utf8"));
} else {
  allTasks = [];
}

const storeTask = (tasks: Task[]) => {
  return fs.writeFileSync(taskFile, JSON.stringify(tasks, null, 2));
};

switch (command) {
  case undefined:
    const welcomeMsg = await figlet("Welcome !!");
    const rainbow = chalkAnimation.rainbow(welcomeMsg);
    setTimeout(() => rainbow.stop(), 5000); // Stop after 5 seconds
    break;

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

    let filteredTasks: Task[] = [];
    if (statusFilters.length > 0) {
      filteredTasks = allTasks.filter((task: Task) =>
        statusFilters.includes(task.status),
      );
    } else {
      filteredTasks = allTasks;
    }

    for (const task of filteredTasks) {
      if (task.status === "to-do") {
        console.log(chalk.bold(`${task.id}. ${task.description}`));
      } else if (task.status === "in-progress") {
        const inProgressText =
          `${task.id}. ${task.description}`.padEnd(30, " ") +
          ` -  [${task.status.toUpperCase()}]`;
        console.log(chalk.rgb(255, 165, 0).bold(inProgressText));
      } else if (task.status === "done") {
        const doneText =
          `${task.id}. ${task.description}`.padEnd(30, " ") +
          ` -  [${task.status.toUpperCase()}]`;
        console.log(chalk.green.bold(doneText));
      }
    }

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

    const task = allTasks.find((task: Task) => task.id === Number(taskId));

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
    const taskToDelete = allTasks.find(
      (task: Task) => task.id === Number(taskIdToDelete),
    );
    if (!taskToDelete) {
      const errorMsg = chalkAnimation.rainbow(
        "Task with given ID does not exists",
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      errorMsg.stop();
      process.exit(1);
    }

    allTasks = allTasks.filter((task) => task.id !== Number(taskIdToDelete));

    allTasks = allTasks.map((task: Task, index) => {
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

    console.log(
      chalk
        .rgb(255, 165, 0)
        .bold(`[IN-PROGRESS] - ${taskToUpdate.description}`),
    );
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
