testStart

<form>
<input id="name1" name="name1">
<input id="test2" name="name2">
</form>


<form>
<input name="<%= namespace %>name3">
<input name="name4" id="test123">
<input name="<portlet:namespace /> name3">
</form>

testEnd

<input name="<portlet:namespace /> name4">


<form>
<input name="<%= namespace %>name5">
<textarea name="name6" id="test123">
<button name="name7">

<select name="coches" id="selectCoches">
<option value="volvo">Volvo</option>
<option value="saab">Saab</option>
<option value="mercedes">Mercedes</option>
<option value="audi">Audi</option>
</select>
</form>
