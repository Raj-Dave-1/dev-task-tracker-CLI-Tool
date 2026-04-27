import figlet from "figlet";
import chalkAnimation from "chalk-animation";
const args = process.argv.slice(2);
const command = args[0];
switch (command) {
    case undefined:
        figlet("Welcome !!", (err, data) => {
            if (err || !data)
                return console.log(err ?? "Something went wrong");
            const rainbow = chalkAnimation.rainbow(data);
            // The animation starts automatically
            setTimeout(() => rainbow.stop(), 5000); // Stop after 5 seconds
        });
        break;
    case "add":
        const task = args[1];
        console.log("I'll add task", task);
        break;
    case "list":
        console.log("I'll list all tasks");
        break;
    default:
        console.error("Command not found");
        process.exit(1);
}
//# sourceMappingURL=index.js.map