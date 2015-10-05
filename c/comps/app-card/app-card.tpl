<r-template class="ui card">
    <div class="content">
      <!-- <img class="right floated mini ui image" src="/images/avatar/large/elliot.jpg"> -->
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
        <a class="ui basic green button" href="{'/p/setting/' + id}">设置</a>
        <a class="ui basic blue button" href="{'/p/deploy/' + id}">部署</a>
      </div>
    </div>
</r-template>