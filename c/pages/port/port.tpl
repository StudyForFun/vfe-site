<r-template class="p-port page">
    <div class="container">
      <div class="flb-box"
          style="margin: 20px;" 
      >
          <a href="/" class="flb-box">
            <img src="/asserts/images/video.png" class="logo">
            <div class="slogan">Used ports of ChiTu server.</div>
          </a>
          <div class="flb-p1"></div>
          <button class="ui icon button blue basic circular" style="margin-right: 20px;"
              r-on="{click: onAdd}"
          >
            <i class="add icon"></i>
          </button>
      </div>
      <div class="ports">
        <table class="ui celled striped table blue" >
          <thead>
            <tr>
                <th></th>
                <th>端口</th>
                <th>名称</th>
                <th>赤兔地址</th>
                <th>描述</th>
                <th>负责人</th>
                <th colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <tr r-if="{editing}">
                <td></td>
                <td class="">
                  <div class="ui form">
                    <div class="field small">
                      <input type="text" r-model="port" placeholder="port" style="min-width: 80px;" />
                    </div>
                  </div>
                </td>
                <td class="">
                  <div class="ui form">
                    <div class="field">
                      <input type="text" class="name-inp" r-model="name" placeholder="name" style="min-width: 120px;" />
                    </div>
                  </div>
                </td>
                <td>
                  <div class="ui form">
                    <div class="field tiny">
                      <input type="text" r-model="link" placeholder="链接..." />
                    </div>
                  </div>
                </td>
                <td class="">
                  <div class="ui form">
                    <div class="field tiny">
                      <textarea cols="30" rows="10" placeholder="描述..."
                          r-model="desc"
                          style="font-size: 12px;line-height:12px;margin-top: 0px; margin-bottom: 0px; height: 37px;width:200px;"
                      ></textarea>
                    </div>
                  </div>
                </td>
                <td class="collapsing" style="min-width: 120px;">
                  <div class="ui form">
                    <div class="field small">
                      <input type="text" r-model="users" placeholder="逗号分隔" style="min-width: 180px;" />
                    </div>
                  </div>
                </td>
                <td class="collapsing">
                  <button class="ui button green tiny icon circular" r-show="{!pending}" r-on="{click: onSubmit}"><i class="icon send"></i></button>
                  <button class="ui button green tiny icon circular" r-show="{pending}"><i class="icon spinner loading"></i></button>
                </td>
                <td class="collapsing">
                  <button class="ui button tiny icon circular" r-show="{!pending}" r-on="{click: onCancel}"><i class="icon remove"></i></button>
                </td>
            </tr>
            <tr r-repeat="{ports}">
                <td class="collapsing">{$index + 1}</td>
                <td class="collapsing">
                  <span style="color:green;font-weight:900;" r-show="{status != 'edit'}">
                    {port}
                  </span>
                  <div class="ui form" r-show="{status == 'edit'}">
                    <div class="field small">
                      <input type="text" r-model="{'ports.' + $index + '.port'}" placeholder="port" style="min-width: 80px;" />
                    </div>
                  </div>
                </td>
                <td class="aligned collapsing">
                  <span r-show="{status != 'edit'}">{name}</span>
                  <div class="ui form" r-show="{status == 'edit'}">
                    <div class="field small">
                      <input type="text" r-model="{'ports.' + $index + '.name'}" placeholder="name" style="min-width: 120px;" />
                    </div>
                  </div>
                </td>
                <td class="aligned">
                    <a href="{/^https?\:\/\//.test(link) ? link : 'javascript:;'}" target="_blank" r-show="{status != 'edit'}">
                        <i class="icon linkify"></i> {link}
                    </a>
                    <div class="ui form" r-show="{status == 'edit'}">
                      <div class="field small">
                        <input type="text" r-model="{'ports.' + $index + '.link'}" placeholder="link"/>
                      </div>
                    </div>
                </td>
                <td>
                  <span r-show="{status != 'edit'}">
                    {- formatChangeLine(desc)}
                  </span>
                  <div class="ui form" r-show="{status == 'edit'}">
                      <div class="field small">
                        <textarea cols="30" rows="10" placeholder="描述..."
                            r-model="{'ports.' + $index + '.desc'}"
                            style="font-size: 12px;line-height:12px;margin-top: 0px; margin-bottom: 0px; height: 37px;min-width:200px;"
                        ></textarea>
                      </div>
                    </div>
                </td>
                <!-- 负责人 -->
                <td class="collapsing" style="min-width: 120px;">
                  <span r-show="{status != 'edit'}">{- formatUsers(users)}</span>
                  <div class="ui form" r-show="{status == 'edit'}">
                    <div class="field small">
                      <input type="text" r-model="{'ports.' + $index + '.users'}" placeholder="逗号分隔" style="min-width: 180px;" />
                    </div>
                  </div>
                </td>
                <td class="collapsing">
                  <a href="javascript:;">
                    <i class="icon blue" data-id="{_id}" 
                      r-on="{click: onEdit.bind(null, _id)}"
                      r-class="{
                        edit: status != 'edit';
                        send: status == 'edit';
                      }"
                    ></i>
                  </a>
                </td>
                <td class="collapsing">
                  <a href="javascript:;" r-on="{click: onDelete.bind(null, $value)}">
                    <i class="icon trash blue" data-id="{_id}"></i>
                  </a>
                </td>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
</r-template>