(function(){
  const ABSOLUTE_RE = /^(?:[a-z]+:)?\/\//i; // http(s):// or protocol-relative
  const CDN_HOST = (typeof window !== 'undefined' && (window.__CDN_HOST || '')).toString().trim().replace(/\/$/, '');

  function isAbsolute(url){
    return ABSOLUTE_RE.test(url);
  }

  function cleanJoin(host, path){
    if (!host) return path;
    const a = host.replace(/\/$/, '');
    const b = (path || '').toString().replace(/^\//, '');
    return a + '/' + b;
  }

  function shouldBypass(url){
    // Keep framework/runtime and data URLs on origin
    if (!url) return true;
    if (url.startsWith('data:')) return true;
    if (url.startsWith('_framework') || url.startsWith('/_framework')) return true;
    return false;
  }

  function cdnUrl(url){
    try {
      if (!url) return url;
      if (!CDN_HOST) return url; // no CDN configured
      if (isAbsolute(url)) return url; // respect absolute URLs
      if (shouldBypass(url)) return url;
      return cleanJoin(CDN_HOST, url);
    } catch {
      return url;
    }
  }

  // Expose API
  window.cdnUrl = cdnUrl;
  window.setCdnHost = function(host){
    try { window.__CDN_HOST = host || ''; } catch {}
  };
})();
