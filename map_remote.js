/**
 * BOC 域名映射脚本 (Map Remote)
 * 将目标站点的请求重写至指定域名，实现类似 Charles Map Remote 功能
 * 
 * 参数通过 Loon [Argument] 传入，通过 $argument.xxx 获取
 */

var args = $argument;
console.log('[BOC MapRemote] $argument: ' + JSON.stringify(args));

var targetDomain = (args.target_domain || '').trim();

// 未填写目标域名时直接放行
if (!targetDomain) {
    console.log('[BOC MapRemote] 未配置目标域名，跳过');
    $done({});
}

var url = $request.url;
var method = $request.method;

console.log('[BOC MapRemote] 原始请求: ' + method + ' ' + url);

// 解析原始 URL，替换域名
var newUrl;
try {
    var originalUrl = new URL(url);
    var targetHost = targetDomain;
    var targetPort = '';
    var targetProtocol = originalUrl.protocol;

    // 检查目标域名是否包含协议
    if (targetHost.indexOf('://') !== -1) {
        var tempIdx = targetHost.indexOf('://');
        targetProtocol = targetHost.substring(0, tempIdx + 1);
        targetHost = targetHost.substring(tempIdx + 3);
    }
    // 检查是否包含端口
    if (targetHost.indexOf(':') !== -1) {
        var hostParts = targetHost.split(':');
        targetHost = hostParts[0];
        targetPort = ':' + hostParts[1];
    }

    newUrl = targetProtocol + '//' + targetHost + targetPort + originalUrl.pathname + originalUrl.search;
} catch (e) {
    console.log('[BOC MapRemote] URL 解析失败: ' + e);
    $done({});
}

console.log('[BOC MapRemote] 映射至: ' + method + ' ' + newUrl);

$done({ url: newUrl });
