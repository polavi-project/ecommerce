CKEDITOR.plugins.add( 'polaviimages', {
    icons: 'polaviimages',
    init: function( editor ) {
        editor.addCommand( 'openFileBrowser', {
            exec: function( editor ) {
                PubSub.publishSync("FILE_BROWSER_REQUESTED", {editor});
            }
        });

        editor.ui.addButton( 'polaviimages', {
            label: 'Polavi file browser',
            command: 'openFileBrowser',
            toolbar: 'editing'
        });
    }
});