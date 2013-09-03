new A.Dialog(
    {
        centered: true,
        cssClass: 'mail-dialog',
        destroyOnClose: true,
        modal: true,
        title: Liferay.Language.get('add-account'),
        width: 600
    }
).plug(
    A.Plugin.IO,
    {
        uri: themeDisplay.getLayoutURL() + '/-/mail/add_account'
    }
).render();



addAccount: function() {
    var instance = this;
    var test = new A.Dialog(
        {
            centered: true,
            cssClass: 'mail-dialog',
            destroyOnClose: true,
            modal: true,
            title: Liferay.Language.get('add-account'),
            width: 600
        }
    );
