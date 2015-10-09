<select name="{name}" class="ui fluid search dropdown">
  <option 
    r-repeat="{agents}" 
    value="{setValue($value)}"
  >{setText($value)}</option>
</select>