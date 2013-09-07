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

<aui:script position="inline" use="aui-io-plugin,aui-io,baui-io-plugin">

<aui:script position="inline" use="aui-io-plugin,aui-io,aui-dialog,baui-io-plugin">

<script type="text/javascript" charset="utf-8">
    function onCSSHelp(){
      AUI().use('aui-dialog', 'event', 'event-custom', function(A) {

          var dialog = new A.Dialog({
                  title: '<spring:message1 code="cssStyle.help.text.title" />',
                  centered: true,
                  draggable: true,
                  modal: true,
                  height: 400,
                  width: 650,
          }).plug(A.Plugin.IO, {uri: '/carousel-portlet/html/carousel/cssStyleHelp.jsp'}).render();
              dialog.show();
          });
  }
    function onConfigHelp(){
      AUI().use('event', 'aui-dialog', 'event-custom', function(A) {

          var dialog = new A.Dialog({
                  title: '<spring:message2 code="config.help.text.title" />',
                  centered: true,
                  draggable: true,
                  modal: true,
                  height: 600,
          width: 840,
         }).plug(A.Plugin.IO, {uri: '/carousel-portlet/html/carousel/setupHelp.jsp'}).render();
             dialog.show();
        });
  }
</script>
