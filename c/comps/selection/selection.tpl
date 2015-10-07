<select name="{name}" class="ui fluid search dropdown">
  <option 
    r-repeat="{agents}" 
    value="{$value.host + ':' + $value.port}"
  >{$value.host + ':' + $value.port}</option>
</select>