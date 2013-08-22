// test aui:script
<aui:script use="aui-template">
    Liferay.Util.addInputType();

    Liferay.Portlet.ready(
        function(portletId, node) {
            Liferay.Util.addInputType(node);
        }
    );
</aui:script>


<aui:script use="baui-io-plugin2,aui-io-plugin">

<aui:script use="baui-io-plugin2,aui-io-plugin,test123">

<aui:script use="aui-io-plugin,aui-io,baui-io-plugin">

<aui:script use="aui-io-plugin">