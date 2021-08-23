/**
 * From https://github.com/lagden/svelte-editor-quill, used under the MIT license.
 * 
 * Import a custom Quill editor to display current data in the edit sidebar view. This
 * is necessary so presenters can edit descriptions with source formatting preserved.
 */
import Quill from 'quill';

export default function quill(node, options) {
    const toolbar = [
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'ordered' }],
        ['clean'],
    ];

    
    const q = new Quill(node, {
        modules: {
            toolbar
        },
        theme: 'snow',
        placeholder: 'Your description here...',
        ...options
    })
    
    // Accept a `value` param to pre-load formatted text into the editor
    if(options?.value) {
        const delta = q.clipboard.convert(options.value)
        q.setContents(delta, 'silent')
    }
    const _container = node.querySelector('.ql-editor');

    const onTextChange = () => {
        const html = _container?.innerHTML ?? '';
        const customEvent = new CustomEvent('text-change', {
            detail: {
                html,
                text: q.getText()
            }
        })
        node.dispatchEvent(customEvent)
    }

    q.on('text-change', onTextChange)
}