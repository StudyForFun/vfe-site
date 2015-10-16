<table class="ui celled striped table blue">
  <thead>
      <tr>
        <th colspan="1">
          <div class="ui breadcrumb">
          <a class="section" href="javascript:;" r-on="{click: onRoot}"><i class="icon windows"></i></a>
          <div class="divider"> / </div>
          <r-repeat items="{pathes}">
            <span>
            <r-if is="{$index !== pathes.length -1}">
              <a class="section" 
                href="javascript:;" 
                r-on="{click: onPath}"
                data-index="{$index}" 
                data-file="{$value}"
              >{$value}</a>
              <div class="divider"> / </div>
            </r-if>
            <r-if is="{$index === pathes.length -1}">
            <div class="active section">{$value}</div>
            </r-if>
            </span>
          </r-repeat>
        </div>
        </th>
      </tr>
    </thead>
  <tbody>
  	<tr r-show="{!files.length}">
			<td>
				<p>
					<i class="icon smile large"></i> 
					该目录下没有文件夹了~
				</p>
			</td>
  	</tr>
    <tr r-repeat="{files}">
      <td>
      	<a href="javascript:;" 
      		data-file="{file}"
      		data-type="dir"
      		r-on="{
        		click: onEnter
        	}"
          r-show="{type == 'dir'}"
      	>
	        <i class="icon folder"></i> {file}
      	</a>
        <!-- <a href="javascript:;" 
          data-file="{file}"
          data-type="file"
          r-show="{type == 'file'}"
        >
          <i class="icon file outline"
            r-class="{
              file: !pending;
              outline: !pending;
              spinner: pending;
              loading: pending;
            }"
          ></i> {file}
        </a> -->
      </td>
    </tr>
  </tbody>
</table>