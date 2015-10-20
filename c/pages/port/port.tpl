<r-template class="p-port page">
    <div class="container">
      <div class="flb-box"
          style="margin: 20px;" 
      >
          <div class="flb-box">
            <img src="/asserts/images/video.png" class="logo">
            <div class="slogan">Used ports of ChiTu server.</div>
          </div>
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
                <th>端口</th>
                <th>名称</th>
                <th>赤兔地址</th>
                <th>描述/服务器</th>
                <th colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <tr r-if="{editing}">
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
                <td class="collapsing">
                  <button class="ui button green tiny icon circular" r-show="{!pending}" r-on="{click: onSubmit}"><i class="icon send"></i></button>
                  <button class="ui button green tiny icon circular" r-show="{pending}"><i class="icon spinner loading"></i></button>
                </td>
                <td class="collapsing">
                  <button class="ui button tiny icon circular" r-show="{!pending}" r-on="{click: onCancel}"><i class="icon remove"></i></button>
                </td>
            </tr>
            <tr r-repeat="{ports}">
                <td class="collapsing">
                  <span style="color:green;font-weight:900;" r-show="{status != 'edit'}">
                    <i class="icon circle thin green"></i> {port}
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
                    <a href="{link}" target="_blank" r-show="{status != 'edit'}">
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
                    {desc}
                  </span>
                  <div class="ui form" r-show="{status == 'edit'}">
                      <div class="field small">
                        <input type="text" r-model="{'ports.' + $index + '.desc'}" placeholder="desc"/>
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