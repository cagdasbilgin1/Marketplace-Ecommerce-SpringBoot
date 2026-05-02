import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
            },
            "/realms": {
                target: "http://localhost:9090",
                changeOrigin: true,
            },
            "/_dev/gateway": {
                target: "http://localhost:8080",
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/_dev\/gateway/, ""); },
            },
            "/_dev/user-profile": {
                target: "http://localhost:8081",
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/_dev\/user-profile/, ""); },
            },
            "/_dev/catalog": {
                target: "http://localhost:8082",
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/_dev\/catalog/, ""); },
            },
            "/_dev/inventory": {
                target: "http://localhost:8083",
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/_dev\/inventory/, ""); },
            },
            "/_dev/cart": {
                target: "http://localhost:8084",
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/_dev\/cart/, ""); },
            },
            "/_dev/order": {
                target: "http://localhost:8085",
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/_dev\/order/, ""); },
            },
            "/_dev/payment": {
                target: "http://localhost:8086",
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/_dev\/payment/, ""); },
            },
            "/_dev/notification": {
                target: "http://localhost:8087",
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/_dev\/notification/, ""); },
            },
            "/_dev/keycloak": {
                target: "http://localhost:9090",
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/_dev\/keycloak/, ""); },
            },
        },
    },
});
