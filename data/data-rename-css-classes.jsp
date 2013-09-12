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

<c:if test="<%= total > pageDelta %>">
    <div class="navigation">
        <span class="left-nav <%= (start == 0) ? "aui-helper-hidden" : "previous" %> more-class">fjfghjfgjfghj
            <a href="javascript:;"><liferay-ui:message key="previous" /></a>
        </span>

        <span>
            <liferay-ui:message arguments="<%= new Object[] {(start + 1), ((total >= end) ? end : total), total} %>" key="showing-x-x-of-x-results" />
        </span>

        <span class="right-nav <%= (total %= end) ? "aui-helper-hidden" : "next" %> more-class2">
            <a href="javascript:;"><liferay-ui:message key="next" /></a>
        </span>
    </div>
</c:if>

var modifiedNotice = panel.one('.lfr-panel-title .modified-notice');