<r-template class="p-index page">
    <div class="container">
    	<table class="ui celled striped table">
		  <thead>
		    <tr>
			    <th colspan="3">
			    <div class="ui breadcrumb">
				  <a class="section" href="javascript:;" r-on="{click: onRoot}">~</a>
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
		    <tr r-repeat="{files}">
		      <td class="collapsing">
		      	<div class="ui checked checkbox fitted">
				  <input type="checkbox" checked="">
				  <label></label>
				</div>
		      </td>
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
		      <td class="right aligned collapsing">{fdate(update_time, 'YY-XMM-XDD hh:mm:ss')}</td>
		    </tr>
		  </tbody>
		</table>
    </div>
</r-template>