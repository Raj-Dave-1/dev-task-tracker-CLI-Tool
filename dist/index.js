import figlet from "figlet";
import chalkAnimation from "chalk-animation";
import fs from "fs";
const args = process.argv.slice(2);
const command = args[0];
const taskFile = "tasks.json";
const buildTask = (task, totalTasks) => {
    return {
        id: totalTasks + 1,
        description: task,
        status: "todo",
        createdAt: new Date(),
    };
};
switch (command) {
    case undefined:
        const welcomeMsg = await figlet("Welcome !!");
        const rainbow = chalkAnimation.rainbow(welcomeMsg);
        setTimeout(() => rainbow.stop(), 5000); // Stop after 5 seconds
        break;
    case "add":
        const task = args[1];
        if (!task) {
            // console.log("Task is required");
            const errorMsg = chalkAnimation.rainbow("Task is required");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            errorMsg.stop();
            process.exit(1); // we don't want to continue if task is not provided, and exit 1 indicates an error
        }
        let listOfTask = [];
        if (fs.existsSync(taskFile)) {
            listOfTask = JSON.parse(fs.readFileSync(taskFile, "utf8"));
        }
        const newTask = buildTask(task, listOfTask.length);
        listOfTask.push({ ...newTask, updatedAt: newTask.createdAt });
        fs.writeFileSync(taskFile, JSON.stringify(listOfTask, null, 2));
        console.log(`Task added successfully (ID: ${newTask.id})`);
        break;
    case "list":
        const statusFilters = args.slice(1);
        const allTasks = JSON.parse(fs.readFileSync(taskFile, "utf8"));
        let filteredTasks = [];
        if (statusFilters.length > 0) {
            filteredTasks = allTasks.filter((task) => statusFilters.includes(task.status));
        }
        else {
            filteredTasks = allTasks;
        }
        filteredTasks.map((task) => console.log(`${task.id}. ${task.description}` +
            `${statusFilters.length > 0 ? ` (${task.status})` : ""}`));
        break;
    default:
        console.error("Command not found");
        process.exit(1);
}
//# sourceMappingURL=index.js.map