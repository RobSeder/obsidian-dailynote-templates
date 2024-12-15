console.log("move-tasks.js loaded.");

async function pushTasksToToday(args) {
    try {
        console.log("Function triggered with args:", args);

        if (!args || !args.buttonClick) {
            console.log("Script loaded, but not triggered by button click.");
            return;
        }

        console.log("Button clicked with args:", args);

        // Get the current and destination file paths
        const sourceFile = app.workspace.getActiveFile();
        if (!sourceFile) {
            new obsidian.Notice("Error: No active file is currently open.");
            return;
        }

        const today = moment().format("YYYY-MM-DD");
        const todayFilePath = `Daily Notes/${moment(today).format("YYYY")}/${moment(today).format("MM-MMM")}/${today}.md`;

        // Check if the current file is today's note
        if (sourceFile.name === `${today}.md`) {
            new obsidian.Notice("NOTE: You are already in today's note. No tasks to push.");
            console.log("Attempted to push tasks from today's note. Action aborted.");
            return;
        }

        console.log("Source:", sourceFile.name, "-> Destination:", todayFilePath);

        let todayFile = app.vault.getAbstractFileByPath(todayFilePath);
        if (!todayFile) {
            await app.vault.create(todayFilePath, `# Daily Note - ${today}\n\n## Planned vs Did\n`);
            todayFile = app.vault.getAbstractFileByPath(todayFilePath);
        }

        const sourceContent = await app.vault.read(sourceFile);
        const todayContent = await app.vault.read(todayFile);

        // Match the "Planned vs Did" section
        const plannedVsDidRegex = /(##+.*Planned vs Did.*\n)((?:- \[.].*\n*)*)/i;
        const match = sourceContent.match(plannedVsDidRegex);

        if (!match) {
            console.log("Planned vs Did section not found.");
            new obsidian.Notice("No 'Planned vs Did' section found in the source file.");
            return;
        }

        const sectionHeading = match[1]; // The heading (e.g., `## Planned vs Did`)
        const tasksBlock = match[2]; // All tasks under the section

        console.log("Section Heading:", sectionHeading);
        console.log("Tasks Block:", tasksBlock);

        // Separate finished and unfinished tasks
        const unfinishedTasks = [];
        const finishedTasks = [];
        tasksBlock.split("\n").forEach(line => {
            if (line.startsWith("- [ ]")) {
                unfinishedTasks.push(line.trim());
            } else if (line.startsWith("- [x]")) {
                finishedTasks.push(line.trim());
            }
        });

        console.log("Unfinished Tasks:", unfinishedTasks);
        console.log("Finished Tasks:", finishedTasks);

        if (unfinishedTasks.length === 0) {
            new obsidian.Notice("No unfinished tasks found to move.");
            return;
        }

        // Append unfinished tasks to today's file
        const movedTasks = unfinishedTasks.map(task => `${task} *(Moved from ${sourceFile.name.replace(".md", "")})*`);
        const updatedTodayContent = todayContent.replace(
            /##+.*Planned vs Did.*\n/,
            `${sectionHeading}${movedTasks.join("\n")}\n`
        );

        await app.vault.modify(todayFile, updatedTodayContent);
        console.log("Tasks moved to today's file.");

        // Rebuild the source file's "Planned vs Did" section with only finished tasks
        const updatedSourceContent = sourceContent.replace(
            plannedVsDidRegex,
            `${sectionHeading}${finishedTasks.join("\n")}\n\n`
        );

        await app.vault.modify(sourceFile, updatedSourceContent);
        console.log("Source file updated.");

        new obsidian.Notice(`${movedTasks.length} tasks moved to today's note (${today}).`);
    } catch (error) {
        console.error("Error in pushTasksToToday:", error);
        new obsidian.Notice("An error occurred while pushing tasks to today.");
    }
}

if (typeof context !== "undefined" && context.args && context.args.buttonClick) {
    pushTasksToToday(context.args);
} else {
    console.log("Context or args are undefined. Script loaded but not invoked.");
}

module.exports = pushTasksToToday;
