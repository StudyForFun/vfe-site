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
        <div class="ui basic green button">设置</div>
        <div class="ui basic blue button">部署</div>
      </div>
    </div>
</r-template>