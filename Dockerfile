# Multi-stage build for .NET 9 Razor Components app
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore first for better layer caching
COPY ["SeaGypsies.csproj", "./"]
RUN dotnet restore "SeaGypsies.csproj"

# Copy everything else and publish
COPY . .
RUN dotnet publish "SeaGypsies.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Recommended environment variables for containerized ASP.NET Core
ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_RUNNING_IN_CONTAINER=true

# Expose the HTTP port (Railway provides a PORT env var at runtime)
EXPOSE 80

# Use a shell entrypoint so the PORT env var from Railway is honored.
# If PORT is not provided, default to 80.
ENTRYPOINT ["sh", "-c", "dotnet SeaGypsies.dll --urls http://*:${PORT:-80}"]
