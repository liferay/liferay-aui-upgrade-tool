<span class="tabview-list"><%= fieldValidationErrorMessage %></span>


A.all('.lfr-panel-title').hide();

<span class="tabview-list"><liferay-ui:message key="an-error-occurred-while-executing-the-validation.-please-contact-an-administrator" /></span>

<div class="helper-hidden">

<div class="hide tabview-list" id="<portlet:namespace />portletErrorMessage"></div>

<div class="hide aui-helper-hidden" id="<portlet:namespace />portletSuccessMessage">
	<liferay-ui:message key="your-request-completed-successfully" />
</div>


<div class="node helper-hidden"></div>

<div class="aui-helper-hidden node"></div>

<liferay-ui:icon
    cssClass='<%= showConnectedIcon ? "connected" : "connected aui-helper-hidden" %>'
    message="connected"
/>

<div class='<%= condition ? someClass : "lfr-panel-title" %>'>


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