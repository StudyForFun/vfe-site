<r-template class="p-remote page">
<div class="container">
	<div class="operations">
		<button class="ui icon button blue basic circular" style="margin-right: 10px;"
	      r-on="{click: onBack}"
	  >
	    <i class="chevron left icon"></i>
	  </button>
	</div>
	<div class="table-con">
    	<table class="ui celled striped table">
		  <thead>
		    <tr>
			    <th colspan="3">
				    <div class="ui breadcrumb">
					  <a class="section" href="javascript:;" r-on="{click: onRoot}">
					  	<i class="icon windows"></i> {remote_host}{remote_path}
					  </a>
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
		  	<tr r-if="{!files.length}">
	  			<td>
	  				<p>
	  					<i class="icon smile large"></i> 
	  					This director is empty~
	  				</p>
	  			</td>
		  	</tr>
		    <tr r-repeat="{files}">
<!-- 		      <td class="collapsing filecheckbox">
		      	<div class="ui checkbox fitted" r-on="{click: onSelect}" data-index="{$index}">
						  <input type="checkbox" r-model="{'files.' + $index + '.selected'}">
						  <label></label>
						</div>
		      </td> -->
		      <td>
		      	<a href="javascript:;" 
		      		data-file="{file}"
		      		data-type="{type}"
		      		r-on="{
		        		click: onEnter
		        	}"
		      	>
			        <i class="icon" 
			        	r-class="{
			        		folder: type == 'dir';
			        		file: type !== 'dir'; 
			        		outline: type !== 'dir'; 
			        	}"
			        ></i> {file}
		      	</a>
		      </td>
		      <td class="right aligned collapsing">{- fsize(size)}</td>
		      <td class="right aligned collapsing">{fdate(update_time, 'YY/XMM/XDD hh:mm:ss')}</td>
<!-- 		      <td class="right aligned collapsing">
		      	<a href="javascript:;" 
		      		data-file="{file}"
		      		data-type="{type}"
		      		r-on="{click: onDeleteFile}"
		      	>
		      		<i class="ui icon trash outline"></i>
		      	</a>
		      </td> -->
		    </tr>
		  </tbody>
		</table>
	</div>
</div>
</r-template>