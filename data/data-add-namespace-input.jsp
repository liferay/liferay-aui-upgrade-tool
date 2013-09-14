testStart

<form>
<inputid="name1" name="name1">
<input id="test2" name="name2">
</form>


<form>
<input name="<%= namespace %>name3">
<input name="name4" id="test123">
<input name="<portlet:namespace /> name3">
</form>

testEnd

<input name="<portlet:namespace /> name4">