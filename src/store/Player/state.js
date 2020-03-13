export default {
    playState: false,
    trackQueue: JSON.parse(localStorage.getItem("_player_track_queue")) || [],
    playerSetting: JSON.parse(localStorage.getItem("_player_setting")) || {mode: 4, volume: 0.8, autoPlay: false, id: null, lock: true}
}