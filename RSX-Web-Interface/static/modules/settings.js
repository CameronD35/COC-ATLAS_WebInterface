import SettingsOption from "./settingsOption.js";

/** The list of all settings. */
let settings = [
    new SettingsOption("Light Mode On", "checkbox", false),
    new SettingsOption("Max Log Messages", "number", 50),
];

export default settings;