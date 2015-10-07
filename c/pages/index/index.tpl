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
                            <div r-component="c-appcard" style="width: 220px;" class="app"
                                r-data="{
                                    id: _id;
                                    name: name;
                                    desc: desc;
                                    time: _created_time;
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
</r-template>