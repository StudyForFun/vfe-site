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
	     		<button class="ui button blue" 
            r-class="{disabled: !hasSelected}"
            r-on="{click: onShowDeploy}" 
          ><i class="connectdevelop icon"></i> 部署</button>
			</div>
	     	<div class="ui buttons">
	     		<button class="ui button" r-on="{click: onSelectAll}"><i class="check circle outline icon"></i> 全选</button>
			    <!-- <button class="ui button"><i class="cut icon"></i> 移动</button> -->
	     		<button class="ui button" r-on="{click: onDeleteFiles}"><i class="trash icon"></i> 删除</button>
	     	</div>
	     	<div class="ui buttons">
	     		<button class="ui button" r-on="{click: onShowAddPath}"><i class="pagelines icon"></i> 创建映射</button>
	     		<button class="ui button" r-on="{click: onShowPathes}"><i class="browser icon"></i> 管理映射</button>
	     	</div>
		  	<button class="ui icon circular basic button" r-on="{click: onSync}"><i class="repeat icon"></i></button>
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
			      <td class="collapsing filecheckbox">
			      	<div class="ui checkbox fitted" r-on="{click: onSelect}" data-index="{$index}">
					  <input type="checkbox" r-model="{'files.' + $index + '.selected'}">
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
    <div class="ui small modal addpath">
      <div class="header">发布路径</div>
      <div class="content">
            <div class="ui form">
              <div class="field">
                <label>服务器</label>
                <div r-component="c-selection"
                    r-ref="agentSelection"
                    r-data="{
                        name: '选择服务器';
                        agents: agents;
                    }"
                ></div>
              </div>
              <div class="field">
                <label>路径</label>
                <input type="text" name="last-name" placeholder="绝对路径"
                    r-model="path"
                />
              </div>
              <div class="field">
                <label>描述</label>
                <input type="text" name="last-name" placeholder="描述下该发布路径"
                    r-model="path_desc"
                />
              </div>
              <div class="flb-box">
                <button 
                    type="submit"
                    class="ui large button flb-p1" 
                    style="margin-right: 20px;display:block" 
                    r-on="{click: onHideAddPath}"
                >取消</button>
                <button 
                    type="submit"
                    class="ui large primary button flb-p1" 
                    style="margin:0;display:block" 
                    r-on="{click: onAddPath}"
                >添加</button>
              </div>  
            </div>
      </div>
    </div>
    <div class="ui small modal pathesman">
      <div class="header">路径管理</div>
      <div class="content">
            <div class="p-deploy-table-con">
              <table class="ui celled striped table">
                <thead>
                  <tr>
                    <th>服务器</th>
                    <th>发布路径</th>
                    <th>描述</th>
                    <th colspan="2"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr r-repeat="{releasePathes}">
                    <td class="collapsing">
                      {host}
                    </td>
                    <td>
                      <span style="color:green">{path}</span>
                    </td>
                    <td>
                      <span style="color:green">{desc}</span>
                    </td>
                    <td class="right aligned collapsing">
                      <a href="javascript:;" 
                        data-id="{_id}"
                        r-on="{click: onDeletePath}"
                      >
                        <i class="ui icon trash outline"></i>
                      </a>
                    </td>
                    <td class="aligned collapsing">
                      <a href="{'/p/remote?app_id=' + app_id + '&host=' + encodeURIComponent(host) + '&path=' + encodeURIComponent(path)}" 
                        data-id="{_id}"
                      >
                        <i class="ui icon unhide"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
      </div>
    </div>
    <div class="ui small modal deploy">
      <div class="header">部署</div>
      <div class="content">
          <div class="field" style="margin-bottom: 20px;">
                <label>选择发布路径</label>
                <div r-component="c-selection"
                    r-ref="deploySelection"
                    r-data="{
                        name: '选择发布路径';
                        agents: releasePathes;
                        setText: setSelectionText;
                        setValue: setSelectionValue;
                    }"
                ></div>
          </div>
          <label>发布文件</label>
          <div class="p-deploy-table-con-deploy">
            <table class="ui celled striped table">
              <!-- <thead>
                <th colspan="3">发布文件</th>
              </thead> -->
              <tbody>
                <tr r-repeat="{selectedFiles}">
                  <td>
                    <i class="icon" 
                      r-class="{
                        folder: type == 'dir';
                        file: type !== 'dir'; 
                        outline: type !== 'dir'; 
                      }"
                    ></i> {file}
                  </td>
                  <td class="right aligned collapsing">{- fsize(size)}</td>
                  <td class="right aligned collapsing">{fdate(update_time, 'YY/XMM/XDD hh:mm:ss')}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flb-box">
              <button 
                  type="submit"
                  class="ui large button flb-p1" 
                  style="margin-right: 20px;display:block" 
                  r-on="{click: onHideDeploy}"
              >关闭</button>
              <button 
                  type="submit"
                  class="ui large primary button flb-p1"
                  style="margin:0;display:block" 
                  r-on="{click: onDeploy}"
                  r-class="{loading: deploying}" 
              >发布</button>
            </div>  
      </div>
    </div>
</r-template>