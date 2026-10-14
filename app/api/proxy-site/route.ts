import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path') || '/';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const targetUrl = `https://techgylink.com${cleanPath}`;

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      return new NextResponse(`Failed to fetch ${targetUrl}: HTTP ${res.status}`, { status: res.status });
    }

    let html = await res.text();

    // 1. Inject base href so all relative resources resolve to https://techgylink.com/
    const baseTag = '<base href="https://techgylink.com/">';
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>${baseTag}`);
    } else if (html.includes('<html')) {
      html = html.replace(/<html[^>]*>/, `$&<head>${baseTag}</head>`);
    } else {
      html = `${baseTag}${html}`;
    }

    // 2. Safely remove client-side hydration scripts that error when run outside origin
    // This preserves all 115KB of pre-rendered HTML, headings, navigation, cards, and text
    html = html.replace(/<script\b[\s\S]*?<\/script>/gi, (match) => {
      if (
        match.includes('_next/static/chunks') ||
        match.includes('self.__next_f') ||
        match.includes('__next')
      ) {
        return '';
      }
      return match;
    });

    // 3. Ensure primary stylesheet is explicitly linked with absolute URL
    html = html.replace(
      /href=["']\/_next\/static\/css\//gi,
      'href="https://techgylink.com/_next/static/css/'
    );

    // 4. Convert relative assets (brand, source, images) to absolute URLs
    html = html.replace(
      /src=["']\/(brand|source|_next|favicon)/gi,
      'src="https://techgylink.com/$1'
    );
    html = html.replace(
      /srcset=["']\/(brand|source|_next)/gi,
      'srcset="https://techgylink.com/$1'
    );

    // 5. Inject clean rendering styles and telemetry bridge script
    const injectedBridge = `
<style id="techgy-proxy-clean-styles">
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-height: 100vh !important;
    background-color: #ffffff !important;
    color: #000000 !important;
    overflow-x: hidden !important;
    -webkit-font-smoothing: antialiased !important;
  }
  img, svg {
    max-width: 100%;
  }
</style>
<script id="techgy-telemetry-injected">
(function() {
  // Capture clicks and send to parent CRM heatmap
  document.addEventListener('click', function(e) {
    try {
      var target = e.target;
      var anchor = target.closest ? target.closest('a') : null;
      var button = target.closest ? target.closest('button') : null;

      var rect = document.documentElement.getBoundingClientRect();
      var x = Math.round(((e.clientX - rect.left) / (rect.width || window.innerWidth)) * 1000) / 10;
      var y = Math.round(((e.clientY - rect.top) / (document.documentElement.scrollHeight || 1000)) * 1000) / 10;

      var elementLabel = (anchor ? (anchor.innerText || anchor.getAttribute('aria-label') || 'Link') : (button ? (button.innerText || 'Button') : (target.innerText || target.tagName))).trim().slice(0, 60);
      var selector = target.tagName ? target.tagName.toLowerCase() : 'div';
      if (target.className && typeof target.className === 'string') {
        selector += '.' + target.className.trim().split(/\\s+/).slice(0, 2).join('.');
      }

      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'TECHGY_SITE_CLICK',
          x: Math.max(1, Math.min(99, x)),
          y: Math.max(1, Math.min(99, y)),
          element: elementLabel || 'Website Content',
          selector: selector || 'div',
          path: window.location.pathname
        }, '*');
      }

      if (anchor) {
        var href = anchor.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          e.preventDefault();
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({
              type: 'TECHGY_SITE_NAVIGATE',
              href: href
            }, '*');
          }
        }
      }
    } catch (err) {
      // Ignore click telemetry error
    }
  }, true);
})();
</script>`;

    if (html.includes('</head>')) {
      html = html.replace('</head>', `${injectedBridge}</head>`);
    } else if (html.includes('</body>')) {
      html = html.replace('</body>', `${injectedBridge}</body>`);
    } else {
      html += injectedBridge;
    }

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
        'X-TechGy-Real-Site': 'https://techgylink.com',
        'X-TechGy-Fetched-Bytes': String(html.length)
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown proxy error';
    return new NextResponse(`Error proxying techgylink.com: ${message}`, { status: 500 });
  }
}
