<r-template class="p-index page">
    <div class="container">
        <div class="flb-box"
            style="margin: 20px;" 
        >
            <button class="ui icon button blue basic">
              <i class="add icon"></i>
            </button>
            <div r-component="c-search" 
                r-data="{
                    placeholder: '搜索APP'
                }"
                class="flb-p1"
            ></div>
        </div>
        <div class="apps">
            <r-repeat items="{grid(apps, 4)}">
                <div class="row">
                    <r-repeat items="{$value}">
                        <div class="card-con" r-style="{width: 100/4 + '%'}">
                            <div r-component="c-appcard" style="width: 200px;" class="app"
                                r-data="{
                                    name: name;
                                    desc: desc
                                }"
                            ></div>
                        </div>
                    </r-repeat>
                </div>
            </r-repeat>
        </div>
    </div>
</r-template>