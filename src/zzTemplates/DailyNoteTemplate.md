---
created: <% tp.file.creation_date() %>
tags:
  - dailynote
description: Daily Note - <% moment(tp.file.title, 'YYYY-MM-DD').format("dddd, MMMM DD, YYYY") %>
week-number: <% moment(tp.file.title, 'YYYY-MM-DD').week()  %>
year: <% moment(tp.file.title, 'YYYY-MM-DD').year() %>
---
# :LiCalendarFold: Daily Note - <% moment(tp.file.title, 'YYYY-MM-DD').format("dddd, MMMM DD, YYYY") %>
| Sun | Mon | Tue | Wed | Thu | Fri | Sat | Week |
|----:|----:|----:|----:|----:|----:|----:|:----:|
<%*
const currentDate = moment(tp.file.title, "YYYY-MM-DD"); // Parse file.name as a date
const startOfLastWeek = currentDate.clone().startOf('week').subtract(1, 'weeks'); // Start of last week (Sunday)
const startOfThisWeek = currentDate.clone().startOf('week'); // Start of this week (Sunday)
const startOfNextWeek = currentDate.clone().startOf('week').add(1, 'weeks'); // Start of next week (Sunday)

// Function to calculate the week number (American Standard)
function getAmericanWeekNumber(date) {
    const firstDayOfYear = date.clone().startOf('year');
    const firstSunday = firstDayOfYear.day() === 0 ? firstDayOfYear : firstDayOfYear.add(7 - firstDayOfYear.day(), 'days');
    const diffInDays = date.diff(firstSunday, 'days');
    return Math.floor(diffInDays / 7) + 1;
}

// Function to generate a single week row with week link
function generateWeekRow(startDate) {
    let isCurrentWeek = false
    let row = "|";
    for (let i = 0; i < 7; i++) {
        const day = startDate.clone().add(i, 'days'); // Add i days to the start date
        const dayNumber = day.format("DD"); // Format day as two-digit number
        const dayString = day.format("YYYY-MM-DD"); // Format full date
        if (currentDate.format("YYYY-MM-DD") === dayString) {
            row += ` **${dayNumber}** |`; // Bold and unlink the current date
            isCurrentWeek = true
        } else {
            row += ` [[${dayString}\\|${dayNumber}]] |`; // Link other dates
        }
    }
    // Append the weekly link
    const weekNumber = getAmericanWeekNumber(startDate); // Use American week numbering
    const year = startDate.year(); // Get year
    const weekFileName = `Week ${weekNumber} (${startDate.format("MMM D")}-${startDate.clone().endOf('week').format("MMM D, YYYY")})`;
    const weekFilePath = `Daily Notes/${year}/Weeks/${weekFileName}`;

	if ( isCurrentWeek ) {
	    row += ` **[[${weekFilePath}\\|Week ${weekNumber}]]** |`; // Add week link
    } else {
	    row += ` *[[${weekFilePath}\\|Week ${weekNumber}]]* |`; // Add week link
    }
    return row;
}

// Generate rows for last week, this week, and next week
tR += generateWeekRow(startOfLastWeek) + "\n";
tR += generateWeekRow(startOfThisWeek) + "\n";
tR += generateWeekRow(startOfNextWeek) + "\n";
%>

---
## :LiListTodo: Planned vs Did
- [ ] <% tp.file.cursor(1) %>*Add planned items and check them off as completed. Add metadata too please*

```meta-bind-button
style: primary
label: Push Unfinished to TODAY
action:
  type: js
  file: zzScripts/move-tasks.js
  args:
    buttonClick: true
```
---
### :LiTrophy: Wins
- Win:: *Add any wins today or remove this section*

### :LiBrain: Learned
- Learned:: *Add things your learned or remove this section*

### :LiSquirrel: Distractions
- Distraction:: *Add distractions or remove this section*

### :LiHeartHandshake: Gratitude
- Gratitude:: *Add at least ONE per day. At LEAST!*
---
## :LiFilePlus2: Notes created today
```dataview
Table file.mtime as "Modified", file.folder as "Folder" FROM "" WHERE file.cday = date(this.file.name) SORT file.ctime asc
```
## :LiFileEdit: Notes modified today
```dataview
Table file.cday as "Created", file.folder as "Folder" FROM "" WHERE file.mday = date(this.file.name) SORT file.mtime asc
```
