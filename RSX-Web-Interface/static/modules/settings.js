import SettingsOption from "./settingsOption.js";

/** The list of all settings. */
let settings = [
    new SettingsOption("Light Mode On", "checkbox", false),
    new SettingsOption("Max Log Messages", "number", 50),
    new SettingsOption("Data Transmission Frequency (seconds)", "number", 2.5)
];

export default settings;