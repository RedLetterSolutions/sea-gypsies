using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.ResponseCompression;
using System.IO.Compression;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// Bind to provider-specific PORT (e.g., Railway) if present
var portEnv = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(portEnv))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{portEnv}");
}

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

// Response compression for static assets and SignalR fallback
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
    // Allow common static and font types; wasm not used in server mode but harmless if present
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[]
    {
        "application/wasm",
        "application/octet-stream",
        "image/svg+xml",
        "image/avif",
        "image/webp",
        "font/woff2",
        "font/woff",
        "application/json"
    });
});
builder.Services.Configure<BrotliCompressionProviderOptions>(opts =>
{
    opts.Level = CompressionLevel.Fastest; // prefer lower CPU on server
});
builder.Services.Configure<GzipCompressionProviderOptions>(opts =>
{
    opts.Level = CompressionLevel.Fastest;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// When running behind a proxy (like Railway), honor forwarded headers so
// redirects and generated links use the original scheme and remote IP.
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseHttpsRedirection();

// Compression should happen before serving static files
app.UseResponseCompression();

// Set strong caching for static assets; keep HTML and boot files short-lived
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        var path = ctx.File.PhysicalPath ?? string.Empty;
        var headers = ctx.Context.Response.Headers;
        var ext = System.IO.Path.GetExtension(path).ToLowerInvariant();

        // Long-cache immutable assets (rev the filename to bust cache when changed)
        string[] longCacheExts = new[] { ".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg", ".ico", ".woff2", ".woff", ".ttf", ".eot", ".mp3", ".mp4" };
        if (longCacheExts.Contains(ext))
        {
            headers["Cache-Control"] = "public, max-age=31536000, immutable"; // 1 year
            // Allow cross-origin usage of fonts and static assets when served via CDN subdomain
            if (ext is ".woff2" or ".woff" or ".ttf" or ".eot")
            {
                headers["Access-Control-Allow-Origin"] = "*";
            }
            return;
        }

        // Default for everything else
        headers["Cache-Control"] = "public, max-age=600"; // 10 minutes
    }
});
app.UseAntiforgery();

app.MapRazorComponents<SeaGypsies.App>()
    .AddInteractiveServerRenderMode();

app.Run();
