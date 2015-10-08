<r-template class="p-deploy page">
    <div class="container">
    	<div class="operations">
    		<button class="ui icon button blue basic circular" style="margin-right: 10px;"
                r-on="{click: onHome}"
            >
              <i class="home icon"></i>
            </button>
	    	<div class="ui blue buttons">
			  <button class="ui button" r-on="{click: onShowCreate}"><i class="plus icon"></i> 创建目录</button>
			  <button class="ui button" r-on="{click: onShowUpload}"><i class="upload icon"></i> 上传</button>
			</div>
			<div class="ui buttons">
	     		<button class="ui button blue"><i class="connectdevelop icon"></i> 部署</button>
			</div>
	     	<div class="ui buttons">
	     		<button class="ui button"><i class="check circle outline icon"></i> 全选</button>
			    <button class="ui button"><i class="cut icon"></i> 移动</button>
	     		<button class="ui button"><i class="trash icon"></i> 删除</button>
	     	</div>
	     	<div class="ui buttons">
	     		<button class="ui button"><i class="pagelines icon"></i> 创建映射</button>
	     	</div>
		  	<button class="ui icon circular basic button"><i class="repeat icon"></i></button>
    	</div>
		<div class="table-con">
	    	<table class="ui celled striped table">
			  <thead>
			    <tr>
				    <th colspan="5">
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
			  	<tr r-if="{!files.length}">
		  			<td>
		  				<p>
		  					<i class="icon smile large"></i> 
		  					This director is empty~
		  				</p>
		  			</td>
			  	</tr>
			    <tr r-repeat="{files}">
			      <td class="collapsing">
			      	<div class="ui checkbox fitted">
					  <input type="checkbox">
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
			      <td class="right aligned collapsing">{- fsize(size)}</td>
			      <td class="right aligned collapsing">{fdate(update_time, 'YY/XMM/XDD hh:mm:ss')}</td>
			      <td class="right aligned collapsing">
			      	<a href="javascript:;" 
			      		data-file="{file}"
			      		data-type="{type}"
			      		r-on="{click: onDeleteFile}"
			      	>
			      		<i class="ui icon trash outline"></i>
			      	</a>
			      </td>
			    </tr>
			  </tbody>
			</table>
		</div>
    </div>
    <div class="ui small modal createdir">
      <div class="header">创建目录</div>
      <div class="content">
            <div class="ui form">
              <div class="field">
                <label>名称</label>
                <input type="text" name="first-name" placeholder="文件名不要包含'\', '/', '..'"
                    r-model="dir_name"
                />
              </div>
              <div class="flb-box">
                <button 
                    type="submit"
                    class="ui large button flb-p1" 
                    style="margin-right: 20px;display:block" 
                    r-on="{click: onHideCreate}"
                >取消</button>
                <button 
                    type="submit"
                    class="ui large primary button flb-p1" 
                    style="margin:0;display:block" 
                    r-on="{click: onCreate}"
                >创建</button>
              </div>  
            </div>
      </div>
    </div>
    <div class="ui modal upload">
      <i class="icon close"></i>
      <div class="header">点击或拖拽上传</div>
      <div class="content">
		<div r-component="c-upload"
			r-ref="upload"
			r-data="{
				pathes: pathes;
				app_id: app_id;
			}"
			r-methods="{
				onSuccess: onUploadDone
			}"
		></div>
      </div>
    </div>
</r-template>