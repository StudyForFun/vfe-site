'use strict';

module.exports = {
	type: function (obj) {
        return /\[object (\w+)\]/.exec(Object.prototype.toString.call(obj))[1].toLowerCase()
    },
    /**
     *  获取 query 参数
     **/
    queryParse: function(search, spliter) {
        if (!search) return {};

        spliter = spliter || '&';

        var query = search.replace(/^\?/, ''),
            queries = {},
            splits = query ? query.split(spliter) : null;

        if (splits && splits.length > 0) {
            splits.forEach(function(item) {
                item = item.split('=');
                var key = item.splice(0, 1),
                    value = item.join('=');
                queries[key] = value;
            });
        }
        return queries;
    },
    queryStringify: function (params, spliter) {
        if (!params) return ''
        return Object.keys(params).map(function (k) {
            return k + '=' + encodeURIComponent(params[k])
        }).join(spliter || '&')
    }
}