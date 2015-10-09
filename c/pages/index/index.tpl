<r-template class="p-index page">
    <div class="container">
        <div class="flb-box"
            style="margin: 20px;" 
        >
            <button class="ui icon button blue basic circular" style="margin-right: 20px;"
                r-on="{click: onShowCreate}"
            >
              <i class="add icon"></i>
            </button>
            <button class="ui icon button blue basic circular" style="margin-right: 20px;"
                r-on="{click: onShowAddAgent}"
            >
              <i class="sitemap icon"></i>
            </button>
            <button class="ui icon button blue basic circular" style="margin-right: 20px;"
                r-on="{click: onShowAddPath}"
            >
              <i class="pagelines icon"></i>
            </button>
            <button class="ui icon button blue basic circular" style="margin-right: 20px;"
                r-on="{click: onShowPathes}"
            >
              <i class="browser icon"></i>
            </button>
            <div class="flb-p1"></div>
            <div r-component="c-search" 
                r-data="{
                    placeholder: '搜索APP'
                }"
            ></div>
        </div>
        <div class="apps">
            <r-repeat items="{grid(apps, 4)}">
                <div class="row">
                    <r-repeat items="{$value}">
                        <div class="card-con" r-style="{width: 100/4 + '%'}">
                            <div class="app"
                                style="width: 220px;" 
                                r-component="c-appcard" 
                                r-data="{
                                    id: _id;
                                    name: name;
                                    desc: desc;
                                    time: _created_time;
                                }"
                                r-methods="{
                                  onDelete: onDeleteApp.bind(null, _id, name)
                                }"
                            ></div>
                        </div>
                    </r-repeat>
                </div>
            </r-repeat>
        </div>
    </div>
    <div class="ui small modal createapp">
      <div class="header">新建项目</div>
      <div class="content">
            <div class="ui form">
              <div class="field">
                <label>名称</label>
                <input type="text" name="first-name" placeholder="数字，字母，下划线"
                    r-model="create_name"
                />
              </div>
              <div class="field">
                <label>简介</label>
                <input type="text" name="last-name" placeholder="请简单描述下该项目"
                    r-model="create_desc"
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
    <div class="ui small modal addagent">
      <div class="header">新增服务器</div>
      <div class="content">
            <div class="ui form">
              <label>服务地址与端口</label>
              <div class="two fields">
                <div class="field">
                  <input type="text" name="first-name" placeholder="Host"
                      r-model="agent_host"
                  />
                </div>
                <div class="field">
                  <input type="text" name="last-name" placeholder="Port"
                      r-model="agent_port"
                  />
                </div>
              </div>
              <div class="p-index-table-con-agents">
                <table class="ui celled striped table">
                  <thead>
                    <th colspan="3">地址列表</th>
                  </thead>
                  <tbody>
                    <tr r-repeat="{agents}">
                      <td>
                        {host}
                      </td>
                      <td class="collapsing">
                        <span style="color:green">{port}</span>
                      </td>
                      <td class="right aligned collapsing">
                        <a href="javascript:;" 
                          data-id="{_id}"
                          r-on="{click: onDeleteAgent}"
                        >
                          <i class="ui icon trash outline"></i>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="flb-box">
                <button 
                    type="submit"
                    class="ui large button flb-p1" 
                    style="margin-right: 20px;display:block" 
                    r-on="{click: onHideAddAgent}"
                >取消</button>
                <button 
                    type="submit"
                    class="ui large primary button flb-p1" 
                    style="margin:0;display:block" 
                    r-on="{click: onAddAgent}"
                >确定</button>
              </div>  
            </div>
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
        <div class="p-index-table-con">
          <table class="ui celled striped table">
            <thead>
              <tr>
                <th colspan="4"></th>
              </tr>
            </thead>
            <tbody>
              <tr r-repeat="{pathes}">
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</r-template>