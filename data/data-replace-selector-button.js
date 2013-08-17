A.one('#<portlet:namespace />selectAssetFm').delegate(
    'click',
    function(event) {
        var result = Util.getAttributes(event.currentTarget, 'data-');

        Util.getOpener().Liferay.fire('<%= HtmlUtil.escapeJS(eventName) %>', result);

        testDelegate()},
    '.selector-button input'
);


A.one('#<portlet:namespace />selectAssetFm').delegate(
    'click',
    test123,
    '.selector-button input'
);

A.one('#<portlet:namespace />selectAssetFm').delegate('click', test123, '.selector-button input');

function test123(event) {
    var result = Util.getAttributes(event.currentTarget, 'data-');

    Util.getOpener().Liferay.fire('<%= HtmlUtil.escapeJS(eventName) %>', result);

    Util.getWindow().hide();
}


A.one('#<portlet:namespace />selectAssetFm').on(
    'click',
    function(event) {
        var result = Util.getAttributes(event.currentTarget, 'data-');

        Util.getOpener().Liferay.fire('<%= HtmlUtil.escapeJS(eventName) %>', result);

    teston();},
    '.selector-button input'
);;;
