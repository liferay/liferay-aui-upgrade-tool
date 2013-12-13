// test aui:script
<aui:script use="aui-template">
    Liferay.Util.addInputType();

    Liferay.Portlet.ready(
        function(portletId, node) {
            Liferay.Util.addInputType(node);
        }
    );
</aui:script>

<aui:panel label="Start1" collapsed="false" id="step1">
</aui:panel>

<aui:panel label="Start2" collapsed="true" id="step2">
</aui:panel>

<liferay-ui:panel label="Start1" state="true" id="step1">
</liferay-ui:panel>

<liferay-ui:panel label="Start2" state="false" id="step2">
</liferay-ui:panel>

<liferay-ui:icon
    cssClass='<%= showConnectedRequestedIcon ? "disabled" : "disabled aui-helper-not-hidden" %>'
/>
