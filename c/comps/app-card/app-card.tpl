<r-template class="ui card app-card green">
    <div class="content">
      <a href="javascript:;" class="remove-icon" r-on="{click: onDelete}">
        <i class="icon remove"></i>
      </a>
      <div style="text-align:right">
        {name}
      </div>
      <div class="meta">
        {fdate(time, 'YY-XMM-XDD hh:mm')}
      </div>
      <div class="description">
        {desc}
      </div>
    </div>
    <div class="extra content">
      <div class="ui two buttons">
        <!-- <a class="ui basic green button" href="javascript:;" r-on="{click: onDelete}">删除</a> -->
        <a class="ui basic blue button" href="{'/p/deploy/' + id}">部署</a>
      </div>
    </div>
</r-template>