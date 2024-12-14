
/**
 * An option for the settings. This holds the value and its type and name.
 */
export default class SettingsOption
{

    /** The name of the setting. */
    name;

    /** The type of the input this setting is. */
    type;

    /** The value of this setting. */
    value;

    /**
     * Create a new option for the settings panel.
     * @param {string} name 
     * @param {string} type 
     * @param {any} value 
     */
    constructor(name, type, value)
    {
        this.name = name;
        this.type = type;
        this.value = value;
    }
}