import figlet from "figlet";
import chalkAnimation from "chalk-animation";
import fs from "fs";

const args = process.argv.slice(2);
const command = args[0];
const taskFile = "tasks.json";
type TaskStatus = "todo" | "in-progress" | "done";

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
    id: totalTasks + 1,
    description: task,
    status: "todo",
    createdAt: new Date(),
  };
};

let allTasks: Task[];
if (fs.existsSync(taskFile)) {
  allTasks = JSON.parse(fs.readFileSync(taskFile, "utf8"));
} else {
  allTasks = [];
}

switch (command) {
  case undefined:
    const welcomeMsg = await figlet("Welcome !!");
    const rainbow = chalkAnimation.rainbow(welcomeMsg);
    setTimeout(() => rainbow.stop(), 5000); // Stop after 5 seconds
    break;

  case "add":
    const taskDescription = args[1];
    if (!taskDescription) {
      // console.log("Task is required");
      const errorMsg = chalkAnimation.rainbow("Task is required");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      errorMsg.stop();
      process.exit(1); // we don't want to continue if task is not provided, and exit 1 indicates an error
    }
    let listOfTask: Task[] = [];
    if (fs.existsSync(taskFile)) {
      listOfTask = JSON.parse(fs.readFileSync(taskFile, "utf8"));
    }
    const newTask = buildTask(taskDescription, listOfTask.length || -1);

    listOfTask.push({ ...newTask, updatedAt: newTask.createdAt });
    fs.writeFileSync(taskFile, JSON.stringify(listOfTask, null, 2));

    console.log(`Task added successfully (ID: ${newTask.id})`);
    break;
  case "list":
    const statusFilters = args.slice(1);

    let filteredTasks: Task[] = [];
    if (statusFilters.length > 0) {
      filteredTasks = allTasks.filter((task: Task) =>
        statusFilters.includes(task.status),
      );
    } else {
      filteredTasks = allTasks;
    }

    filteredTasks.map((task: Task) =>
      console.log(
        `${task.id}. ${task.description}` +
          `${statusFilters.length > 0 ? ` (${task.status})` : ""}`,
      ),
    );
    break;
  case "update":
    const taskId = args[1];
    if (!taskId) {
      const errorMsg = chalkAnimation.rainbow("Task ID is required");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      errorMsg.stop();
      process.exit(1);
    }

    const task = allTasks.find((task: Task) => task.id === Number(taskId));

    if (!task) {
      const errorMsg = chalkAnimation.rainbow("Task not found");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      errorMsg.stop();
      process.exit(1);
    }

    const updatedTaskDescription = args[2];
    if (!updatedTaskDescription) {
      const errorMsg = chalkAnimation.rainbow("Task description is required");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      errorMsg.stop();
      process.exit(1);
    }

    task.description = updatedTaskDescription;
    task.updatedAt = new Date();

    fs.writeFileSync(taskFile, JSON.stringify(allTasks, null, 2));

    console.log(`Task updated successfully (ID: ${taskId})`);
    break;
  default:
    console.error("Command not found");
    process.exit(1);
}
