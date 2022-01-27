/**
 * This started as a Quill module, but it can't be used on textareas, so it's a pain
 * to use in a form input. TinyMCE requires an API key now, so instead, we're using
 * Jodit.
 * 
 * https://xdsoft.net/jodit/
 * 
 * Instantiate a editor to display current data in the edit sidebar view. This
 * is necessary so presenters can edit descriptions with source formatting preserved.
 */
import {Jodit} from "jodit";

export default function jodit(node, options) {
    
    const editor = new Jodit(node, {
        toolbarAdaptive: false,
        buttons: "bold,italic,underline,strikethrough,|,ol,ul",
        useSearch: false,
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        tabIndex: 0,
        askBeforePasteHTML: false,
    })
    
    // Accept a `value` param to pre-load formatted text into the editor
    if(options?.value) {
        editor.setEditorValue(options.value)
    }

    const onTextChange = () => {
        const html = editor?.innerHTML ?? '';
        const customEvent = new CustomEvent('text-change', {
            // Write the value to a message
            // https://stackoverflow.com/questions/58729673/how-to-get-contents-from-jodit-text-editor
            detail: {
                html,
                text: editor.value
            }
        })
        node.dispatchEvent(customEvent)
    }

    editor.events.on('change', onTextChange)
}