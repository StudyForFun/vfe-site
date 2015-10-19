<table class="ui celled striped table blue table-file">
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
    <tr>
      <td>
        <ul class="ul-file">
          <li r-repeat="{files}">
            <a href="javascript:;" 
              data-file="{file}"
              data-type="dir"
              r-on="{
                click: onEnter
              }"
              r-show="{type == 'dir'}"
            >
              <img src="/asserts/images/file.png">
              <div class="cont">{file}</div>
            </a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>
