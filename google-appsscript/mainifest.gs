function manifest() {
    return {
        "name": "Carver Web App",
        "short_name": "CarverApp",
        "description": "Carver Steam Web App",
        "start_url": "https://sites.google.com/apsk12.org/carver-steam",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#820f15",
        "icons": [
            {
                "src": "https://www.example.com/icons/icon-192x192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "https://www.example.com/icons/icon-512x512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
          ],
        "orientation": "portrait-primary",
        "permissions": [
            "geolocation",
            "notifications",
            "camera",
            "microphone",
            "background-sync"
          ]
    }
}
