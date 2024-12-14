let dialog = document.getElementById("settingsDialog");
let closeButton = dialog.querySelector("#closeSettingsButton");
let settingsButton = document.getElementById("settingsIcon");

// Listen for user clicking the button.
//settingsButton.addEventListener("click", settingsButtonClicked);

/** The list of settings.
 * Key - The string name of the setting
 * Value - The type of the setting. Currently, only supports 'checkbox' and 'number'.
 */
let settings = { 
    "Test": "checkbox"
};
constructSettings();

/** Open settings when button clicked. */
function settingsButtonClicked(event)
{  
    closeButton.addEventListener("click", closeSettingsButtonClicked);
    dialog.showModal();
}

/** When the close button on the settings panel is clicked. */
function closeSettingsButtonClicked(event)
{
    // Unhook
    closeButton.removeEventListener("click", closeSettingsButtonClicked);
    dialog.close();
}

/** Change the settings panel's HTML */
function constructSettings() 
{
    // https://www.geeksforgeeks.org/how-to-iterate-over-a-javascript-object/
    for (let key in settings)
    {
        if (settings.hasOwnProperty(key)) 
        {
            // value is the type of input
            var value = settings[key];
            switch (value) {
                case "checkbox":
                case "number":
                    constructInput(key, value);
                    break;
                default:
                    break;
            } 
        }
    }
}

/** Create an input element. 
 * @param{name} - The name of the setting.
 * @param{type} - The type of the input element. 
*/
function constructInput(name, type)
{
    closeButton.insertAdjacentHTML(
        "beforebegin",
        "      <div>" + 
        `\n        <input type=\"${type}\" id=\"${name}\" onchange=\"settingChanged('${name}')\" />` +
        `\n        <label for=\"${name}\">${name}</label>` +
        "\n    </div>"
    );
}

/** A callback for when any setting has changed.
    @param{setting} - The name of the setting that was changed. */
function settingChanged(setting) 
{
    alert(setting + " changed");
}