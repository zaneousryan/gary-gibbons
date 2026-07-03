// Gary Gibbons: The Empty Capsule — Tauri 2 shell.
// The game is the web build; the shell provides the window, the fs plugin
// for saves, and (Phase 7+, spec §13) the PlatformService bridge for
// steamworks.js. No game logic lives here — the content folder is the game.

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("error while running Gary Gibbons");
}
