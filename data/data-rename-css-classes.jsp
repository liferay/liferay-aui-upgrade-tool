<span class="portlet-msg-error"><%= fieldValidationErrorMessage %></span>


A.all('.portlet-msg-success').hide();

<span class="portlet-msg-error"><liferay-ui:message key="an-error-occurred-while-executing-the-validation.-please-contact-an-administrator" /></span>

<div class="portlet-msg-alert">

<div class="hide portlet-msg-error" id="<portlet:namespace />portletErrorMessage"></div>

<div class="hide portlet-msg-success" id="<portlet:namespace />portletSuccessMessage">
	<liferay-ui:message key="your-request-completed-successfully" />
</div>


<div class="node helper-hidden"></div>

<div class="aui-helper-hidden node"></div>

<liferay-ui:icon
    cssClass='<%= showConnectedIcon ? "connected" : "connected aui-helper-hidden" %>'
    message="connected"
/>

<div class='<%= condition ? someClass : "portlet-msg-info" %>'>


<ul class="tabview-list">