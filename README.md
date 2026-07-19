# w-scoreboard

Drag-and-drop FiveM scoreboard for **QBX Core**, **QBCore**, and **ESX**. Drop it in, edit `config.lua`, and `ensure`

## Features

- Modern top-bar scoreboard UI
- Auto-detects QBX, QBCore, or ESX (manual override available)
- Job pills with online counts, clickable business sections, and staff count
- Optional player list with search (can be restricted to staff)
- Overhead player IDs while the scoreboard is open
- Heist / robbery availability panel (optional)
- Server-side caching for large player counts
- **HOME** or **/scoreboard** to toggle · **TAB** to release mouse while keeping the board open

## Requirements

- FiveM server (Lua 5.4)
- One of: `qbx_core`, `qb-core`, or `es_extended`

## Installation

1. Drop the `w-scoreboard` folder into your resources directory, for example:

   ```
   resources/[standalone]/w-scoreboard/
   ```

2. Add to your `server.cfg`:

   ```cfg
   ensure w-scoreboard
   ```

3. Open `config.lua` and set your server name, jobs, colors, and toggles.

4. Restart the server or run `ensure w-scoreboard`.

That’s it.

## Server logo (optional)

1. Set `Config.UseServerLogo = true` in `config.lua`.
2. Place your logo image here:

   ```
   public/images/server_logo.png
   ```

3. Restart the resource (`ensure w-scoreboard`).

No UI rebuild is required. Replace the image and restart the resource to update the logo.

## Controls

| Input                              | Action                                                |
| ---------------------------------- | ----------------------------------------------------- |
| **HOME** (default keybind)         | Open / close scoreboard                               |
| **/scoreboard** (default command)  | Open / close scoreboard                               |
| **TAB**                            | Toggle mouse focus (board stays open, IDs still show) |
| **ESC**                            | Close scoreboard                                      |

Enable/disable and rename these in `config.lua`:

```lua
Config.EnableOpenKeybind = true
Config.OpenKey = "HOME"

Config.EnableOpenCommand = true
Config.OpenCommand = "scoreboard"
```

Rebind keys in FiveM settings under **Toggle Scoreboard** and **Toggle Scoreboard Focus**, or change `Config.OpenKey` / `Config.FocusToggleKey`.

## Configuration

All settings are in `config.lua`.

### General

| Option                  | Description                               |
| ----------------------- | ----------------------------------------- |
| `Config.Framework`           | `"auto"`, `"qbx"`, `"qbcore"`, or `"esx"` |
| `Config.ServerName`          | Name shown in the header                  |
| `Config.EnableOpenKeybind`   | Enable the open keybind                   |
| `Config.OpenKey`             | Keybind to open the scoreboard            |
| `Config.EnableOpenCommand`   | Enable the open chat command              |
| `Config.OpenCommand`         | Chat command name (without `/`)           |
| `Config.FocusToggleKey`      | Keybind to toggle UI focus                |
| `Config.UpdateInterval`      | How often server cache refreshes (ms)     |

### Display toggles

| Option                       | Description                        |
| ---------------------------- | ---------------------------------- |
| `Config.ShowPlayerList`      | Show the searchable player list    |
| `Config.PlayerListAdminOnly` | Only staff can see the player list |
| `Config.ShowStaffCount`      | Show the staff pill                |
| `Config.ShowHeists`          | Show heist / robbery availability  |

### Overhead IDs

Shown above player heads while the scoreboard is open:

```lua
Config.OverheadIds = {
    enabled = true,
    maxDistance = 50.0,
    showSelf = true,
    prefix = "",
}
```

### Pill colors

Hex colors for job pills and player job badges. Keys match the `color` field on each job section:

```lua
Config.PillColors = {
    blue = "#3B82F6",
    red = "#EF4444",
    orange = "#F97316",
    green = "#22C55E",
    yellow = "#EAB308",
    gray = "#9CA3AF",
    staff = "#FACC15",
}
```

### Job sections

Each section is a pill in the header. Use `standalone = true` for a simple count chip (Police, EMS). Use `standalone = false` for a clickable pill that expands into a business list (Restaurants).

```lua
Config.JobSections = {
    law_enforcement = {
        label = "Law Enforcement",
        shortLabel = "Police",
        icon = "shield",
        color = "blue",
        order = 1,
        show = true,
        standalone = false,
        businesses = {
            police = {
                label = "Los Santos Police Department",
                icon = "shield",
                ondutyOnly = true,
                show = true,
                order = 1,
                jobs = { "police", "sheriff", "bcso" },
            },
        },
    },
}
```

- `jobs` — framework job names that count toward that business
- `ondutyOnly` — only count players who are on duty (QBX/QBCore)
- `color` — key from `Config.PillColors`

**Icons:** `shield`, `heart-pulse`, `wrench`, `utensils`, `briefcase`, `car`, `users`, `star`, `store`, `landmark`, and more. Unknown icons fall back to `briefcase`.

### Staff

```lua
-- Use 919Admin / amzn_admin for staff detection (ignores Config.StaffGroups)
Config.UseAmznAdminStaff = false

Config.StaffGroups = {
    "admin",
    "superadmin",
    "god",
}
```

When `Config.UseAmznAdminStaff = true`, staff is anyone with a permission group from `exports.amzn_admin:GetPlayerPermissionGroup` other than `"User"`. Framework ACE / `Config.StaffGroups` are not used.

### Robberies

```lua
Config.Robberies = {
    store = {
        label = "Store Robbery",
        icon = "store",
        requiredPolice = 1,
        show = true,
    },
}
```

Police count for availability uses `Config.RobberyPoliceGroup` (job section id).

## Exports

**Client**

```lua
exports['w-scoreboard']:OpenScoreboard()
exports['w-scoreboard']:CloseScoreboard()
exports['w-scoreboard']:ToggleScoreboard()
exports['w-scoreboard']:ToggleScoreboardFocus()
exports['w-scoreboard']:IsScoreboardOpen()
exports['w-scoreboard']:IsScoreboardFocused()
```

**Server**

```lua
exports['w-scoreboard']:GetScoreboardCache()
exports['w-scoreboard']:RefreshScoreboardCache()
```

## Debug

```cfg
setr w-scoreboard-debugMode 1
```

Or set `Config.Debug = true` in `config.lua`.

## Framework notes

- **QBX / QBCore:** Duty uses `PlayerData.job.onduty`
- **ESX:** No native duty — all job members count when `ondutyOnly = true`
- **Staff:** Matched via `Config.StaffGroups` / framework permissions, or `amzn_admin` when `Config.UseAmznAdminStaff` is enabled

## License

MIT

---

_This README was generated with AI assistance and may be updated as the resource changes._
