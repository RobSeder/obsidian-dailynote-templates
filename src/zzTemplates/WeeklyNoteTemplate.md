<%*
let summaryWeekNumber = await tp.system.prompt("Enter the week number (e.g., 1-52):");
let summaryYear = await tp.system.prompt("Enter the year (e.g., 2024):");

// Function to calculate the start and end of a Sunday-starting week
function getWeekStartEnd(year, weekNumber) {
    const firstDayOfYear = moment(`${year}-01-01`, "YYYY-MM-DD");
    const firstSunday = firstDayOfYear.day() === 0 ? firstDayOfYear : firstDayOfYear.add(7 - firstDayOfYear.day(), 'days');
    const weekStart = firstSunday.clone().add((weekNumber - 1) * 7, 'days'); // Start of the target week
    const weekEnd = weekStart.clone().add(6, 'days'); // End of the target week
    return { weekStart, weekEnd };
}

// Calculate the start and end of the current week
const { weekStart, weekEnd } = getWeekStartEnd(summaryYear, summaryWeekNumber);

// Calculate the start and end of the previous and next weeks
const { weekStart: prevWeekStart, weekEnd: prevWeekEnd } = getWeekStartEnd(summaryYear, summaryWeekNumber - 1);
const { weekStart: nextWeekStart, weekEnd: nextWeekEnd } = getWeekStartEnd(summaryYear, summaryWeekNumber + 1);

// Handle year transitions
if (prevWeekStart.year() < summaryYear) {
    summaryWeekNumber -= 1;
}
if (nextWeekStart.year() > summaryYear) {
    summaryWeekNumber += 1;
}

// Construct titles for navigation links
const previousWeekTitle = `Week ${summaryWeekNumber - 1} (${prevWeekStart.format("MMM D")}-${prevWeekEnd.format("MMM D, YYYY")})`;
const nextWeekTitle = `Week ${summaryWeekNumber + 1} (${nextWeekStart.format("MMM D")}-${nextWeekEnd.format("MMM D, YYYY")})`;

// Construct the new title for the current file
const newTitle = `Week ${summaryWeekNumber} (${weekStart.format("MMM D")}-${weekEnd.format("MMM D, YYYY")})`;

// Rename the file
await tp.file.rename(newTitle);

// Build the template output
tR += `---
summary-week-number: ${summaryWeekNumber}
summary-year: ${summaryYear}
week-start: ${weekStart.format("YYYY-MM-DD")}
week-end: ${weekEnd.format("YYYY-MM-DD")}
---
# Weekly Summary - Week ${summaryWeekNumber} (${weekStart.format("MMM D")}–${weekEnd.format("MMM D, YYYY")})

[<< ${previousWeekTitle}](../${previousWeekTitle}.md) | [${nextWeekTitle} >>](../${nextWeekTitle}.md)

---

## :LiCalendar: Weekday Navigation
| Sun | Mon | Tue | Wed | Thu | Fri | Sat |
| --- | --- | --- | --- | --- | --- | --- |
`;

for (let i = 0; i < 7; i++) {
    const day = weekStart.clone().add(i, 'days');
    const dayNumber = day.format("D");
    const monthFolder = day.format("MM-MMM");
    const dailyNotePath = `Daily Notes/${summaryYear}/${monthFolder}/${day.format("YYYY-MM-DD")}`;

    tR += `| [[${dailyNotePath}\\|${dayNumber}]] `;
}
tR += "|\n\n";

tR += `---

## :LiListTodo: Tasks Overview
\`\`\`dataview
TASK
FROM "Daily Notes" and #dailynote
WHERE file.frontmatter.week-number = this.summary-week-number AND date(file.name).year = this.summary-year
GROUP BY default(due, "No Due Date")
SORT completed DESC, due ASC
\`\`\`

## :LiTrophy: Wins

\`\`\`dataview
LIST Win
FROM "Daily Notes"
WHERE file.frontmatter.week-number = this.summary-week-number AND date(file.name).year = this.summary-year
SORT file.link
\`\`\`

## :LiBrain: Lessons Learned

\`\`\`dataview
LIST Learned
FROM "Daily Notes"
WHERE file.frontmatter.week-number = this.summary-week-number AND date(file.name).year = this.summary-year
SORT file.link
\`\`\`

## :LiSquirrel: Distractions

\`\`\`dataview
LIST Distraction
FROM "Daily Notes"
WHERE file.frontmatter.week-number = this.summary-week-number AND date(file.name).year = this.summary-year
SORT file.link
\`\`\`

## :LiHeartHandshake: Gratitude

\`\`\`dataview
LIST Gratitude
FROM "Daily Notes"
WHERE file.frontmatter.week-number = this.summary-week-number AND date(file.name).year = this.summary-year
SORT file.link
\`\`\`
`;
%>
