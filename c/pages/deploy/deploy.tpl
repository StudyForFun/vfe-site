<r-template class="p-deploy page">
    <div class="container">
    	<div class="operations flb-box">
        <button class="ui icon button blue basic circular" style="margin-right: 10px;"
            r-on="{click: onHome}"
        >
          <i class="home icon"></i>
        </button>

     		<button class="ui icon button circular green" r-on="{click: onSelectAll}"
          r-class="{
            basic: !hasSelected;
          }"
        ><i class="check icon"></i></button>
        <button class="ui icon circular button" r-on="{click: onSync}" title="同步文件"><i class="repeat icon"></i></button>
     		<button class="ui icon button circular" r-on="{click: onDeleteFiles}"><i class="trash icon"></i></button>
        <button class="ui icon circular button" r-on="{click: onShowCopy}" title="复制"><i class="copy icon"></i></button>

        <button class="ui button icon green labeled" r-on="{click: onShowUpload}" title="上传文件"><i class="upload icon"></i> 上传</button>
        <button class="ui button icon" 
          r-class="{
            disabled: !hasSelected;
            orange: hasSelected;
          }"
          r-on="{click: onFastDeploy}" 
        ><i class="connectdevelop icon" r-class="{loading: hasSelected}"></i> 一键部署</button>
        <button class="ui button labeled icon" 
          r-class="{
            disabled: !hasSelected;
            teal: hasSelected;
          }"
          r-on="{click: onShowDeploy}" 
        ><i class="steam icon"></i> 选择部署</button>


        <div class="ui buttons blue">
          <button class="ui button icon" r-on="{click: onShowCreate}" title="创建目录"><i class="folder open icon"></i></button>
          <button class="ui button icon" r-on="{click: onShowAddPath}" title="添加发布路径"><i class="send icon"></i></button>
          <button class="ui button icon" r-on="{click: onShowPathes}" title="管理发布路径"><i class="setting icon"></i></button>
        </div>
        <div class="app-name flb-p1">
          {app_name}
        </div>
    	</div>
		  <div class="table-con">
	    	<table class="ui celled striped table blue">
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
  			      		data-type="dir"
  			      		r-on="{
  			        		click: onEnter
  			        	}"
                  r-show="{type == 'dir'}"
  			      	>
  				        <i class="icon folder"></i> {file}
  			      	</a>
                <a href="javascript:;" 
                  data-file="{file}"
                  data-type="file"
                  r-on="{
                    click: onOpenFile
                  }"
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
     <div class="ui small modal copy">
      <div class="header">拷贝到</div>
      <div class="content">
          <div r-component="c-copyfile"
            r-ref="copyfile"
            r-data="{
              app_id: app_id;
            }"
            r-methods="{
            }"
          ></div>
          <div class="flb-box">
            <button 
                type="submit"
                class="ui large button flb-p1" 
                style="margin-right: 20px;display:block" 
                r-on="{click: onHideCopy}"
            >关闭</button>
            <button 
                type="submit"
                class="ui large primary button flb-p1"
                style="margin:0;display:block" 
                r-on="{click: onCopy}"
                r-class="{
                  primary: !copyStatus;
                  loading: copying;
                  error: copyStatus == 'error';
                  green: copyStatus == 'done';
                }" 
            >{'粘贴到当前目录'+(copyStatus ? (copyStatus == 'error' ? '失败':'成功') : '')}</button>
          </div>  
      </div>
    </div>
    <div class="ui large modal pathesman">
      <div class="header">路径管理</div>
      <div class="content">
            <div class="p-deploy-table-con">
              <table class="ui celled striped table yellow">
                <thead>
                  <tr>
                    <th>服务器</th>
                    <th>发布路径</th>
                    <th>描述</th>
                    <th>自动部署匹配</th>
                    <th colspan="3">操作</th>
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
                    <td class="collapsing">
                      <div class="ui form">
                        <div class="field"
                          r-class="{
                            disabled: $value.status == 'pending';
                            error: $value.status == 'error';
                          }"
                        >
                          <textarea rows="2" 
                            style="font-size: 12px;line-height:12px;margin-top: 0px; margin-bottom: 0px; height: 60px;width:200px;"
                            placeholder="[(dir|file): ] <RegExp>"
                            data-id="{_id}"
                            r-model="{'releasePathes[' + $index + '].rules'}"
                            r-on="{
                              input: onValidateRules
                            }"
                          ></textarea>
                        </div>
                      </div>
                    </td>
                     <td class="right aligned collapsing">
                      <a href="javascript:;" 
                        data-id="{_id}"
                        r-on="{click: onSaveRule}"
                      >
                        <i class="ui icon outline"
                            r-class="{
                              save: !$value.status;
                              loading: $value.status == 'pending';
                              spinner: $value.status == 'pending';
                              remove: $value.status == 'error';
                              disabled: $value.status == 'error';
                            }"
                        ></i>
                      </a>
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
                        target="_blank" 
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
            <table class="ui celled striped table brown">
              <tbody>
                <tr r-repeat="{selectedFiles}">
                  <td class="center aligned collapsing">
                    {$index + 1}
                  </td>
                  <td>
                    <i class="icon" 
                      r-class="{
                        folder: type == 'dir';
                        file: type !== 'dir'; 
                        outline: type !== 'dir'; 
                      }"
                    ></i> {file}
                  </td>
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
                r-class="{
                  primary: !deployStatus;
                  loading: deploying;
                  error: deployStatus == 'error';
                  green: deployStatus == 'done';
                }" 
            >{'发布'+(deployStatus ? (deployStatus == 'error' ? '失败':'成功') : '')}</button>
          </div>  
      </div>
    </div>
    <div class="ui modal fastdeploy">
      <div class="header">一键部署</div>
      <div class="content">
          <div class="p-deploy-table-con-fastdeploy">
            <table class="ui celled striped table orange">
              <tbody>
                <tr r-repeat="{fastDeploySelectedFiles}">
                  <td class="center aligned collapsing">
                    {$index + 1}
                  </td>
                  <td>
                    <i class="icon" 
                      r-class="{
                        folder: type == 'dir';
                        file: type !== 'dir'; 
                        outline: type !== 'dir'; 
                      }"
                    ></i> {file}
                  </td>
                  <td class="aligned collapsing">
                    <i class="icon"
                      r-class="{
                        minus: deploy_status == 'unmatch';
                        grey: deploy_status == 'unmatch';

                        spinner: deploy_status == 'pending';
                        loading: deploy_status == 'pending';
                        
                        remove: deploy_status == 'error';
                        red: deploy_status == 'error';

                        checkmark: deploy_status == 'done';
                        green: deploy_status == 'done';
                      }"
                    ></i>
                  </td>
                  <td class="collapsing">
                    <div>
                      <r-repeat items="{matches}">
                        <p>
                          <i class="icon red remove" r-show="{status == 'error'}"></i>
                          <span style="color: #2185d0">{rules} </span> 
                          <span style="color: #21ba45">{host}{path}</span>
                          <a href="{'/p/remote?app_id=' + app_id + '&host=' + encodeURIComponent(host) + '&path=' + encodeURIComponent(path)}"
                            target="_blank" 
                          >


                            <i class="icon blue unhide"></i>
                          </a>
                        </p>
                      </r-repeat>
                    </div>
                  </td>
                  <!-- <td class="right aligned collapsing">{fdate(update_time, 'YY/XMM/XDD hh:mm:ss')}</td> -->
                </tr>
              </tbody>
            </table>
          </div>
      </div>
    </div>
</r-template>