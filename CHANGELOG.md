# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v[NEXT]

### Changed
- discord.js update to v14 to adapt Discord API v10. 

### Fixed
- change parameter names to align with the module update and adapt new way of loading slash commands.


## v[0.2.1] - 2025-12-3

### Added
- Added a `CHANGELOG.md` for this project.


## v[0.2.0] - 2025-06-23

### Fixed
- Changed the previous YouTube Extractor of one of the default official Extractor from `@discord-player/extractor` is no longer supporting/deperacated. 
    so it is swtiched to community YouTube Extractor `discord-player-youtubei`.
    - In `youtube_play_single.js` & `youtube_playlist.js`. 
        `const { YouTubeExtractor } = require('@discord-player/extractor');` changed to `const { YoutubeiExtractor } = require("discord-player-youtubei");` and
        `await player.extractors.register(YouTubeExtractor. {});` changed to `await player.extractors.register(YoutubeiExtractor. {});`
    - Reference:
        - Official Extractor/Extractor Setup: https://discord-player.js.org/docs/creating-a-music-bot/02_extractors_integration
        - Community YouTube Extractor: https://github.com/retrouser955/discord-player-youtubei
- Fixed the problem that the name of the newly added song appear to be .undefined. in the notification in `youtube_play_single.js`.


## v[0.1.1] - 2024-08-12

### Changed
- Edited `./.gitignore` to exclude more files from versioning 
    1. `package-lock.json` 
    2. `package.json`

### Fixed
- Change the `TEST_GUILD_ID` to `MY_GUILD_ID` to apply change of the slash commands to the right Discord server.
    - via: https://github.com/Wataru010/My-First-Discord-Music-Bot/commit/d40efa9b5031eb24e345d697cbdf31002babd74c

### Removed
- `package-lock.json` & `package.json` (because of added by accident).


## v[0.1.0] - 2024-06-21

### Added
`./`
- `./.gitignore`
    - keep certain files from versioning.
- `./run.bat
    - Executable for this program on Window OS.

`./src/`
- `./src/index.js` 
    - ① Initialize. login. and set up Event Listener for the bot. ② Read and load the slash commands from subfolders. ③ Set up uncaught exception handler to prevent bot from crashing and keep running.
- `./src/deploy-commands.js`
    - Separate file that can be run to load slash commands. (For testing purpose and can be removed.)

`./src/commands/functions/`
- `./src/commands/functions/back.js`
    - A slash command that move back to the last track played.
- `./src/commands/functions/exit.js`
    - A slash command that shut down the bot.
- `./src/commands/functions/loop.js`
    - A slash command that loop a track or the entire queue and stop looping.
- `./src/commands/functions/shuffle.js`
    - A slash command that shuffle the tracks in the current queue.
- `./src/commands/functions/skip.js`
    - A slash command that skip the current track and play the next track in the queue if available.
- `./src/commands/functions/stop.js`
    - A slash command that stop and delete the current queue.

`./src/commands/play_song/`
- `./src/commands/play_song/spotify_play_single.js`
    - A slash command that can search with the given query and play the first track (or add it to the queue) from result list from Spotify.
- `./src/commands/play_song/spotify_playlist.js`
    - A slash command that can find the playlist from the given URL and play the entire playlist (or add them to the queue) from Spotify.
- `./src/commands/play_song/youtube_play_single.js`
    - A slash command that can search with the given query and play the first track (or add it to the queue) from result list from YouTube.
- `./src/commands/play_song/youtube_playlist.js`
    - A slash command thatcan find the playlist from the given URL and play the entire playlist (or add them to the queue) from YouTube.

`./src/commands/search_song/`
- `./src/commands/search_song/search.js`
    - A slash command that search a given query and display it on the console(command line). (For testing purpose and might be a functionality in the future).

`package-lock.json` & `package.json`
- Accidently added in the initial commit.