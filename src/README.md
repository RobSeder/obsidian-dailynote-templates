# Template and Script Documentation

The folders can be put in the root of your [Obsidian](https://www.obsidian.md). When you use the Daily Notes plug-in, you can set some options. For me, I have:

| Setting                | Value                            | Example                                       |
| ---------------------- | -------------------------------- | --------------------------------------------- |
| Date Format            | `YYYY/MM-MMM/YYYY-MM-DD`         | Renders to: `2024/12-Dec/2024-12-15`          |
| New File Location      | `Daily Notes`                    | `MyNotesVault\Daily Notes\`                   |
| Template File Location | `zzTemplates/DailyNotesTemplate` | `MyNotesVaule\zzTemplates\DailyNotesTemplate` |

Meaning that when I click the "Open today's daily note" button in the left navigation of Obsidian, this plug-in will read the contents of:

```text
MyNotesVault/zzTemplates/DailyNotesTest
```

Process the Templater code in there and generate a new file:

```text
MyNotesVaule/Daily Notes/2024/12-Dec/2024-12-12
```

Which is already pre-filled with a lot of date-specific things.

## :file_folder: `zzScripts`

The `zzScripts` directory contains various scripts that automate and enhance the functionality of your daily notes in Obsidian. These scripts are designed to streamline your workflow and ensure that your notes are consistently formatted and organized.

### :page_facing_up: move-tasks.js

The `move-tasks.js` script is designed to move unfinished Tasks from the "Planned vs Did" section of the current daily note that you are viewing and PUSHES them to today's daily note. This helps in keeping track of tasks that were not completed on the intended day and ensures they are carried forward to the current day.

> [!NOTE] 
> This requires you [install an Obsidian plugin](https://www.stephanmiller.com/how-to-install-obsidian-plugins/) named [Meta Bind](https://github.com/mProjectsCode/obsidian-meta-bind-plugin). This replaces the old "Button" plugin and allows you to add a button to your Obsidian note pages, and have it do something, like run some Javascript.

To add this to a Daily Note page, or ideally a Daily Note template, add a [Meta Bind](https://github.com/mProjectsCode/obsidian-meta-bind-plugin) code block like this:

```markdown
    ```meta-bind-button
    style: primary
    label: Push Unfinished to TODAY
    action:
    type: js
    file: zzScripts/move-tasks.js
    args:
        buttonClick: true
    ```
```

#### Key Features
- **Trigger by Button Click**: The script is triggered by a button click within the daily note. Without this, simply loading the Javascript file would execute it (and it is Loaded whenever it is referenced on the page)
- **Identify Source and Destination**: Determines the current note and today's note based on the date.
- **Task Separation**: Surgically REMOVES the Task items from from the current page and prepends them to the Task list on the current Daily Note.
- **Error Handling**: Provides notifications and logs errors for better debugging and user feedback.

## :file_folder: `zzTemplates`

The `zzTemplates` directory contains various templates that you can use for your daily notes in Obsidian. These templates provide a consistent structure for your notes, making it easier to organize and review your information.

### :page_facing_up: `DailyNoteTemplate.md`
The `DailyNoteTemplate.md` template is designed to create a daily note with predefined sections for planning, tracking tasks, and reflecting on the day's activities.

> [!TIP]
> This `DailyNoteTemplate.md` is used by the Daily Notes plug-in via the settings for that plug-in. The `WeeklyNoteTemplate.md` is NOT, and is handled differently.

#### Key Features
- **Date and Metadata**: Automatically includes the creation date, tags, and other metadata.
- **Week Navigation**: Provides links to navigate between days of the current, previous, and next weeks.
- **Planned vs Did**: Section to list planned tasks and mark them as completed.
- **Wins, Learned, Distractions, Gratitude**: Sections to document daily wins, lessons learned, distractions, and things you are grateful for.
- **Notes Created and Modified**: Automatically lists notes created and modified on the current day using Dataview queries.

The Daily Note generates sections:

1. **Calendar** that lets you quickly navigate to days: last week, this week, and next week - and also has links to the Weekly Summaries for each week too.
1. **Planned vs Did** - this is where you can queue up your work and mark it off when it's done. Below this tasks list is a button for "Push Unfinished to TODAY" for when you go back to previous days, see unfinished tasks, you can carry them forward. That functionality is a combination of the `meta bind` plug-in for the button and the script in `zzScripts`, in this repository.
1. **Wins** - for recording when something goes right. It's so easy to focus on the things that go wrong, but we should also be celebrating the wins that we get.
1. **Learned** - I truly do "learn something new every day", or almost every day, but I never remember what or when. So, this is to document that and reflect at the weekly, monthly, or even yearly level!
1. **Gratitude** - similar to Wins, it's incredibly easy for any human to feel like a "victim", but that path leads nowhere; it's dead. Instead, there is only upside to counting your blessings, and making note of things for which you are grateful. Again, imagine if you captured this daily, and then could look back (and summarize with a DataView) at the weekly, monthly, quarterly, or yearly level!?

Here is a snapshot of what an empty day looks like:

![alt text](/docs/assets/dailyview.png)

### :page_facing_up: `WeeklyNoteTemplate.md`
The `WeeklyNoteTemplate.md` template is designed to create a weekly summary note with sections for task overview, wins, lessons learned, distractions, and gratitude.

> [!TIP]
> This `DailyNoteTemplate.md` above is used by the Daily Notes plug-in via the settings for that plug-in. The `WeeklyNoteTemplate.md` is NOT, and is handled differently. For this, go into the settings of the Templater plug-in and go to "Enable Folder Templates. You can set up a pairing like this:

| Folder                   | Template                            |
| ------------------------ | ----------------------------------- |
| `Daily Notes/2024/Weeks` | `zzTemplates/WeeklyNoteTemplate.md` |
| `Daily Notes/2025/Weeks` | `zzTemplates/WeeklyNoteTemplate.md` |

What this does is if anyone creates a new note in that `Weeks` folder, Templater will run the `WeeklyNoteTemplate.md` to generate the page. In this case, that template will prompt you for the Week Number of the year, and the year that you want to generate, and it takes care of the rest.

#### Key Features
- **Week and Year Input**: Prompts for the week number and year to generate the weekly summary.
- **Week Navigation**: Provides links to navigate between the current, previous, and next weeks.
- **Tasks Overview**: Summarizes tasks from daily notes within the week.
- **Wins, Learned, Distractions, Gratitude**: Sections to document weekly wins, lessons learned, distractions, and things you are grateful for.