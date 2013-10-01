<liferay-ui:icon
    cssClass='<%= showConnectedRequestedIcon ? "disabled" : "disabled aui-helper-hidden" %>'
/>


<liferay-ui:icon
    cssClass='<%= showConnectedRequestedIcon ? "disabled" : "disabled aui-helper-not-hidden" %>'
/>


<aui:input cssClass='<%= showConnectedRequestedIcon ? "disabled" : "disabled aui-helper-hidden" %>'/>

<li class="<%= phone.isPrimary() ? "primary" : "" %>">

<%
StringBuilder sb = new StringBuilder();

sb.append("<li class=\"aui-tree-node\"></li>");
%>