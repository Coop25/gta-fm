(() => {
  "use strict";

  // Streams and live status are served by gtaradio.net's Icecast server (CORS: *).
  const STREAM_BASE = "https://audio.gtaradio.net";
  const STATUS_URL = `${STREAM_BASE}/status-json.xsl`;
  const STATUS_INTERVAL = 15000;
  const APP_NAME = "GTA FM";

  // Station cover art, hotlinked from gtaradio.net: [128px, 512px].
  // These are hashed build filenames, so they can change when gtaradio.net redeploys;
  // any image that fails to load falls back to a generated badge.
  const COVER_BASE = "https://gtaradio.net/build/games/assets/";
  const COVERS = {
    "3": {
      "chat": ["chat-DGgwgkBJ.jpg", "chat-BVFmCdaz.jpg"],
      "class": ["class--Ke5RdTM.jpg", "class-ssYopyHH.jpg"],
      "flash": ["flash-OWFdFNyX.jpg", "flash-B51Z3RvW.jpg"],
      "game": ["game-sX4mcyOJ.jpg", "game-BvLvwQ4X.jpg"],
      "head": ["head-0A5e3RHP.jpg", "head-Qs377s61.jpg"],
      "kjah": ["kjah-CcP6jqgq.jpg", "kjah-DVxVmyjq.jpg"],
      "lips": ["lips-DBLW9WoL.jpg", "lips-CmkL4mIG.jpg"],
      "msx": ["msx-D-Kqcljf.jpg", "msx-DlBUpAQm.jpg"],
      "rise": ["rise-DVtAa1qu.jpg", "rise-BYt7hNtW.jpg"],
    },
    "4": {
      "afro_beat": ["afro_beat-C9DJ4XaY.jpg", "afro_beat-apozptCI.jpg"],
      "babylon": ["babylon-Ck1fC_s-.jpg", "babylon-Cpccqtfw.jpg"],
      "beat_95": ["beat_95-iUBmpD-2.jpg", "beat_95-CT6c4MLU.jpg"],
      "bobby_konders": ["bobby_konders-C6rcCA9E.jpg", "bobby_konders-BEvh3NjO.jpg"],
      "classical_ambient": ["classical_ambient-WE4bJ7Nr.jpg", "classical_ambient-DUB6GDtJ.jpg"],
      "dance_mix": ["dance_mix-BYZsxUAz.jpg", "dance_mix-5zyuWf5Y.jpg"],
      "dance_rock": ["dance_rock-CdEKo9lI.jpg", "dance_rock-CSuZLsWy.jpg"],
      "fusion_fm": ["fusion_fm-DAo7sOG4.jpg", "fusion_fm-Cw8hM8Lk.jpg"],
      "hardcore": ["hardcore-BkMvSME9.jpg", "hardcore-DxeZ5rlu.jpg"],
      "jazz_nation": ["jazz_nation-C8AQUPQ0.jpg", "jazz_nation-R3I6AlDg.jpg"],
      "k109_the_studio": ["k109_the_studio-CjnYcCYS.jpg", "k109_the_studio-D5xfMAGF.jpg"],
      "lazlow": ["lazlow-w8X8nhQT.jpg", "lazlow-BHSjMktx.jpg"],
      "liberty_rock": ["liberty_rock-reNky4IV.jpg", "liberty_rock-Bj_fYplL.jpg"],
      "meditation": ["meditation-CApELRkV.jpg", "meditation-BHQlIJe9.jpg"],
      "ny_classics": ["ny_classics-Cie-GfWH.jpg", "ny_classics-CHWm2S5D.jpg"],
      "plr": ["plr-Crex2BeR.jpg", "plr-DzvuINhL.jpg"],
      "ramjamfm": ["ramjamfm-Dai4bMSI.jpg", "ramjamfm-Bc9CEpMu.jpg"],
      "san_juan_sounds": ["san_juan_sounds-EygozVrM.jpg", "san_juan_sounds-VxCP1n6y.jpg"],
      "the_vibe": ["the_vibe-BptqKwmY.jpg", "the_vibe-CiWcjeyt.jpg"],
      "vcfm": ["vcfm-CcZSydVf.jpg", "vcfm-BCfK_D_i.jpg"],
      "vladivostok": ["vladivostok-B07SoT4T.jpg", "vladivostok-9b8SmjcG.jpg"],
      "wktt": ["wktt-PC9WdIGI.jpg", "wktt-BKVJuaRH.jpg"],
    },
    "lcs": {
      "double": ["double-CQGTuZUA.jpg", "double-B_ITq_8k.jpg"],
      "flash": ["flash-h5hwfwg2.jpg", "flash-JFoJoPge.jpg"],
      "head": ["head-BgnL23Av.jpg", "head-A_gxjy66.jpg"],
      "kjah": ["kjah-CqYa39E5.jpg", "kjah-B526OyZt.jpg"],
      "lcfr": ["lcfr-268ZcqOJ.jpg", "lcfr-DInTRXPx.jpg"],
      "lcj": ["lcj-COm7Wust.jpg", "lcj-DWwSPC4G.jpg"],
      "lips": ["lips-CaI6jkn3.jpg", "lips-BmbmQxWT.jpg"],
      "msx": ["msx-Ba8hmH8Q.jpg", "msx-Bs0U0Ksc.jpg"],
      "mundo": ["mundo-C4DKZdy6.jpg", "mundo-pUfxAWn1.jpg"],
      "rise": ["rise-C5q2o_4K.jpg", "rise-BEuVtufu.jpg"],
    },
    "sa": {
      "bounce-fm": ["bounce-fm-BMqZRyED.jpg", "bounce-fm-CR95OBHy.jpg"],
      "csr": ["csr-Cnh0-bqt.jpg", "csr-h6Usit-z.jpg"],
      "k-dst": ["k-dst-C5C1gghf.jpg", "k-dst-BxhcimEv.jpg"],
      "k-jah": ["k-jah-D7mZqS3Q.jpg", "k-jah-Dx82hgte.jpg"],
      "k-rose": ["k-rose-RYwQK6in.jpg", "k-rose-DdEi8jmD.jpg"],
      "master-sounds": ["master-sounds-B-vH-K5N.jpg", "master-sounds-D1FtFcau.jpg"],
      "playback-fm": ["playback-fm-BI7klCqQ.jpg", "playback-fm-Ca4xHEBh.jpg"],
      "radio-los-santos": ["radio-los-santos-yFQxtydi.jpg", "radio-los-santos-05tIhEv1.jpg"],
      "radio-x": ["radio-x-BGsQ4L6u.jpg", "radio-x-7f_KKZvH.jpg"],
      "sfur": ["sfur-D3K6pz24.jpg", "sfur-BbWKGwBD.jpg"],
      "wctr": ["wctr-DbkjUFpd.jpg", "wctr-edYuMODO.jpg"],
    },
    "vc": {
      "emotion": ["emotion-BLaUqOa4.jpg", "emotion-D5RsFJue.jpg"],
      "espant": ["espant-DwGtT_T0.jpg", "espant-BM-gWjhv.jpg"],
      "fever": ["fever-CEPawSQm.jpg", "fever-Ck2RjLbH.jpg"],
      "flash": ["flash-D_6Pfip_.jpg", "flash-C_za5CIM.jpg"],
      "kchat": ["kchat-CbWaQlla.jpg", "kchat-BxdXqzJj.jpg"],
      "vcpr": ["vcpr-hCSaD7vl.jpg", "vcpr-B66LOfq2.jpg"],
      "vrock": ["vrock-CSJmoglX.jpg", "vrock-bIziu61f.jpg"],
      "wave": ["wave-CL5Jqcyh.jpg", "wave-1lkzFhxw.jpg"],
      "wild": ["wild-bCEoB9hn.jpg", "wild-DqueXxAL.jpg"],
    },
    "vcs": {
      "emotion": ["emotion-usofefOh.jpg", "emotion-ktoqYEgm.jpg"],
      "espant": ["espant-DojHfhI3.jpg", "espant-jTdEOgxa.jpg"],
      "flash": ["flash-CEeLioap.jpg", "flash-BP8MXZIO.jpg"],
      "fresh": ["fresh-DekUGtfr.jpg", "fresh-D_gtHW9w.jpg"],
      "paradise": ["paradise-BtdjD15R.jpg", "paradise-D7x-ztWf.jpg"],
      "vcfl": ["vcfl-D6941YLc.jpg", "vcfl-DZLXoLWY.jpg"],
      "vcpr": ["vcpr-Czi0VKV1.jpg", "vcpr-D43tV064.jpg"],
      "vrock": ["vrock-BbAJBTZ8.jpg", "vrock-wZv-sRjm.jpg"],
      "wave": ["wave-DPew2VcL.jpg", "wave-DTG9BAoC.jpg"],
    },
  };

  // [id, name, badge]; ids match the stream mount points: /<game>/<station>
  const GAMES = [
    {
      id: "3", name: "GTA III", year: 2001, city: "Liberty City",
      spot: "#f2c230", bg: "#121212",
      blurb: "Liberty City in 2001. Chatterbox, Flashback and the rest of the original nine.",
      stations: [
        ["head", "Head Radio", "HEAD"], ["class", "Double Clef FM", "DC"], ["kjah", "K-JAH", "KJAH"],
        ["rise", "Rise FM", "RISE"], ["lips", "Lips 106", "106"], ["game", "Game FM", "GAME"],
        ["msx", "MSX FM", "MSX"], ["flash", "Flashback 95.6", "95.6"], ["chat", "Chatterbox FM", "CHAT"],
      ],
    },
    {
      id: "vc", name: "Vice City", year: 2002, city: "Vice City",
      spot: "#ff4fb0", bg: "#140a24",
      blurb: "Vice City in 1986, when Flash FM and V-Rock ran the dial.",
      stations: [
        ["flash", "Flash FM", "FLSH"], ["vrock", "V-Rock", "VR"], ["wave", "Wave 103", "103"],
        ["emotion", "Emotion 98.3", "98.3"], ["fever", "Fever 105", "105"], ["wild", "Wildstyle", "WILD"],
        ["espant", "Espantoso", "ESP"], ["kchat", "K-Chat", "KCH"], ["vcpr", "VCPR", "VCPR"],
      ],
    },
    {
      id: "sa", name: "San Andreas", year: 2004, city: "Los Santos",
      spot: "#62c24d", bg: "#0f0d0a",
      blurb: "Los Santos, San Fierro and Las Venturas, early nineties.",
      stations: [
        ["radio-los-santos", "Radio Los Santos", "RLS"], ["playback-fm", "Playback FM", "PB"],
        ["k-dst", "K-DST", "DST"], ["bounce-fm", "Bounce FM", "BNC"], ["k-rose", "K-Rose", "ROSE"],
        ["csr", "CSR 103.9", "CSR"], ["radio-x", "Radio X", "X"], ["sfur", "SF-UR", "SFUR"],
        ["k-jah", "K-JAH West", "KJAH"], ["master-sounds", "Master Sounds 98.3", "MS"], ["wctr", "WCTR", "WCTR"],
      ],
    },
    {
      id: "lcs", name: "Liberty City Stories", year: 2005, city: "Liberty City",
      spot: "#e3372d", bg: "#110f0f",
      blurb: "Liberty City three years before GTA III, with a few stations that did not make it.",
      stations: [
        ["head", "Head Radio", "HEAD"], ["double", "Double Cleff FM", "DC"], ["kjah", "K-Jah", "KJAH"],
        ["rise", "Rise FM", "RISE"], ["lips", "Lips 106", "106"], ["mundo", "Radio Del Mundo", "RDM"],
        ["msx", "MSX 98", "MSX"], ["flash", "Flashback FM", "FB"], ["lcj", "The Liberty Jam", "LCJ"],
        ["lcfr", "Liberty City Free Radio", "LCFR"],
      ],
    },
    {
      id: "vcs", name: "Vice City Stories", year: 2006, city: "Vice City",
      spot: "#ff8a3d", bg: "#0b1922",
      blurb: "Vice City in 1984, two years before Tommy Vercetti shows up.",
      stations: [
        ["flash", "Flash FM", "FLSH"], ["vrock", "V-Rock", "VR"], ["paradise", "Paradise FM", "PAR"],
        ["wave", "Wave 103", "103"], ["emotion", "Emotion 98.3", "98.3"], ["fresh", "Fever 105", "105"],
        ["espant", "Espantoso", "ESP"], ["vcfl", "VCFL", "VCFL"], ["vcpr", "VCPR", "VCPR"],
      ],
    },
    {
      id: "4", name: "GTA IV", year: 2008, city: "Liberty City",
      spot: "#9cc9ec", bg: "#15181c",
      blurb: "Liberty City in 2008. Every station, including the tracks added in the DLC.",
      stations: [
        ["the_vibe", "The Vibe 98.8", "98.8"], ["liberty_rock", "Liberty Rock Radio 97.8", "LRR"],
        ["jazz_nation", "Jazz Nation Radio 108.5", "JAZZ"], ["bobby_konders", "Massive B Soundsystem 96.9", "MB"],
        ["k109_the_studio", "K109 The Studio", "K109"], ["vcfm", "Vice City FM", "VCFM"],
        ["hardcore", "Liberty City Hardcore", "LCHC"], ["classical_ambient", "The Journey", "JRNY"],
        ["fusion_fm", "Fusion FM", "FUS"], ["beat_95", "The Beat 102.7", "BEAT"],
        ["ramjamfm", "Ram Jam FM", "RJ"], ["dance_rock", "Radio Broker", "BRKR"],
        ["vladivostok", "Vladivostok FM", "VLAD"], ["plr", "Public Liberty Radio", "PLR"],
        ["san_juan_sounds", "San Juan Sounds", "SJS"], ["dance_mix", "Electro-Choc", "EC"],
        ["ny_classics", "The Classics 104.1", "104"], ["lazlow", "Integrity 2.0", "INT"],
        ["wktt", "WKTT Talk Radio", "WKTT"], ["afro_beat", "International Funk 99", "IF99"],
        ["babylon", "Tuff Gong Radio", "TUFF"], ["meditation", "Self-Actualization FM", "SAFM"],
      ],
    },
  ].map((g) => ({
    ...g,
    stations: g.stations.map(([id, name, badge]) => {
      const c = (COVERS[g.id] || {})[id];
      return {
        id, name, badge,
        cover: c ? { small: COVER_BASE + c[0], large: COVER_BASE + c[1] } : null,
      };
    }),
  }));

  const brokenCovers = new Set();
  // Cover <img> that removes itself on failure, revealing the badge text underneath.
  function coverImg(station, size, cls) {
    if (!station.cover || brokenCovers.has(station.cover[size])) return "";
    return `<img class="${cls}" src="${station.cover[size]}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.dispatchEvent(new CustomEvent('coverfail',{bubbles:true}))">`;
  }
  document.addEventListener("coverfail", (e) => {
    brokenCovers.add(e.target.getAttribute("src"));
    const host = e.target.parentElement;
    e.target.remove();
    if (host) host.classList.remove("has-cover");
  });

  const $ = (sel) => document.querySelector(sel);
  const els = {
    games: $("#games"), grid: $("#grid"),
    gameTitle: $("#gameTitle"), gameMeta: $("#gameMeta"), blurb: $("#gameBlurb"),
    deck: $("#deck"), deckGame: $("#deckGame"), deckStatus: $("#deckStatus"),
    deckStation: $("#deckStation"), deckTrack: $("#deckTrack"), deckArt: $("#deckArt"),
    play: $("#playBtn"), drawerBtn: $("#drawerBtn"), barText: $("#barText"),
    volume: $("#volume"), volumeWrap: $("#volumeWrap"),
    total: $("#totalListeners"), viz: $("#viz"), dateLine: $("#dateLine"),
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);

  const state = {
    game: GAMES[0],
    current: null,      // { game, station }
    wantPlay: false,
    loading: false,
    status: new Map(),  // "game/station" -> { title, listeners }
    retries: 0,
    retryTimer: null,
    reconnecting: false,
    stallTimer: null,
  };

  // ---------- storage (best-effort) ----------
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  // ---------- audio ----------
  const audio = new Audio();
  audio.preload = "none";
  if (!isIOS) audio.crossOrigin = "anonymous"; // needed for the visualizer; skipped on iOS (no Web Audio graph there)

  let ctx = null, analyser = null, noiseGain = null, noiseSrc = null;

  function ensureAudioGraph() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    noiseGain = ctx.createGain();
    noiseGain.gain.value = 0;
    noiseGain.connect(ctx.destination);
    if (!isIOS) {
      try {
        const src = ctx.createMediaElementSource(audio);
        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        src.connect(analyser);
        analyser.connect(ctx.destination);
      } catch (e) {
        console.warn("Visualizer unavailable:", e);
      }
    }
  }

  // Short burst of filtered static while a station tunes in, like turning the dial.
  function startStatic() {
    if (!ctx) return;
    stopStatic(true);
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = buf;
    noiseSrc.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 2200;
    band.Q.value = 0.6;
    noiseSrc.connect(band).connect(noiseGain);
    const t = ctx.currentTime;
    noiseGain.gain.cancelScheduledValues(t);
    noiseGain.gain.setValueAtTime(0, t);
    noiseGain.gain.linearRampToValueAtTime(0.12 * audio.volume, t + 0.05);
    noiseSrc.start();
    // Never let static run forever if the stream is slow.
    noiseSrc.stop(t + 6);
  }

  function stopStatic(immediate) {
    if (!ctx || !noiseSrc) return;
    const t = ctx.currentTime;
    noiseGain.gain.cancelScheduledValues(t);
    noiseGain.gain.setValueAtTime(noiseGain.gain.value, t);
    noiseGain.gain.linearRampToValueAtTime(0, t + (immediate ? 0.01 : 0.25));
    const src = noiseSrc;
    noiseSrc = null;
    try { src.stop(t + (immediate ? 0.02 : 0.3)); } catch {}
  }

  function streamUrl(game, station) {
    // Cache-buster so a reconnect always starts at the live edge.
    return `${STREAM_BASE}/${game.id}/${station.id}?t=${Date.now()}`;
  }

  function tune(game, station) {
    ensureAudioGraph();
    clearTimeout(state.retryTimer);
    state.retries = 0;
    state.reconnecting = false;
    state.hasPlayed = true;
    state.current = { game, station };
    state.wantPlay = true;
    store.set("rw:last", `${game.id}/${station.id}`);
    history.replaceState(null, "", `#${game.id}/${station.id}`);
    if (state.game !== game) selectGame(game, { keepScroll: true });
    startStatic();
    connect();
    render();
  }

  function connect() {
    const { game, station } = state.current;
    setLoading(true);
    audio.src = streamUrl(game, station);
    const p = audio.play();
    if (p && p.catch) p.catch((e) => {
      if (e.name === "NotAllowedError") { state.wantPlay = false; setLoading(false); stopStatic(); render(); }
    });
  }

  function stop() {
    state.wantPlay = false;
    state.reconnecting = false;
    clearTimeout(state.retryTimer);
    clearTimeout(state.stallTimer);
    stopStatic();
    audio.pause();
    // Drop the connection instead of buffering a live stream in the background.
    audio.removeAttribute("src");
    audio.load();
    setLoading(false);
    render();
  }

  function togglePlay() {
    if (!state.current) {
      const s = state.game.stations[0];
      return tune(state.game, s);
    }
    if (state.wantPlay) stop();
    else tune(state.current.game, state.current.station);
  }

  function step(dir) {
    const game = state.current ? state.current.game : state.game;
    const list = game.stations;
    const idx = state.current ? list.indexOf(state.current.station) : -1;
    const next = list[(idx + dir + list.length) % list.length];
    tune(game, next);
  }

  function scheduleReconnect() {
    if (!state.wantPlay || !state.current) return;
    clearTimeout(state.retryTimer);
    const delay = Math.min(15000, 1500 * 2 ** state.retries);
    state.retries++;
    state.reconnecting = true;
    setLoading(true);
    render();
    state.retryTimer = setTimeout(connect, delay);
  }

  audio.addEventListener("playing", () => {
    state.retries = 0;
    state.reconnecting = false;
    clearTimeout(state.stallTimer);
    setLoading(false);
    stopStatic();
    render();
  });
  audio.addEventListener("waiting", () => {
    if (!state.wantPlay) return;
    setLoading(true);
    clearTimeout(state.stallTimer);
    state.stallTimer = setTimeout(scheduleReconnect, 10000);
  });
  audio.addEventListener("error", () => { if (state.wantPlay && audio.getAttribute("src")) scheduleReconnect(); });
  audio.addEventListener("ended", scheduleReconnect);
  audio.addEventListener("pause", () => {
    // Paused from outside (headphones unplugged, OS media controls, etc.)
    if (state.wantPlay && !audio.ended && audio.getAttribute("src") && !state.loading) stop();
  });

  // ---------- volume ----------
  const savedVol = parseFloat(store.get("rw:vol"));
  audio.volume = Number.isFinite(savedVol) ? savedVol : 0.8;
  els.volume.value = audio.volume;
  els.volume.addEventListener("input", () => setVolume(parseFloat(els.volume.value)));
  if (isIOS) els.volumeWrap.hidden = true; // iOS ignores element volume
  function setVolume(v) {
    v = Math.max(0, Math.min(1, v));
    audio.volume = v;
    els.volume.value = v;
    store.set("rw:vol", String(v));
  }

  // ---------- rendering ----------
  function setLoading(on) {
    state.loading = on;
    els.play.classList.toggle("is-loading", on);
  }

  // The page takes the look of the game being viewed (see .theme-* in styles.css).
  function applyTheme(game) {
    const root = document.documentElement;
    root.className = root.className.replace(/\btheme-\S+/g, "").trim();
    root.classList.add(`theme-${game.id}`);
    document.querySelector('meta[name="theme-color"]').setAttribute("content", game.bg);
  }

  function renderGames() {
    els.games.innerHTML = "";
    GAMES.forEach((g, i) => {
      const li = document.createElement("li");
      const b = document.createElement("button");
      // Each tab carries its own game's theme, so it previews that game's look.
      b.className = `game-tab theme-${g.id}`;
      b.role = "tab";
      b.id = `tab-${g.id}`;
      b.dataset.game = g.id;
      b.title = `${g.name} (press ${i + 1})`;
      b.innerHTML = `
        <span class="game-tab__name">${esc(g.name)}</span>
        <span class="game-tab__year">${String(i + 1).padStart(2, "0")} · ${g.year}<span class="live"> · on air</span></span>`;
      b.addEventListener("click", () => selectGame(g));
      li.appendChild(b);
      els.games.appendChild(li);
    });
  }

  function selectGame(game, opts = {}) {
    state.game = game;
    store.set("rw:game", game.id);
    applyTheme(game);
    els.games.querySelectorAll(".game-tab").forEach((t) => {
      const sel = t.dataset.game === game.id;
      t.setAttribute("aria-selected", sel);
      t.tabIndex = sel ? 0 : -1;
      if (sel && !opts.keepScroll) t.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    });
    const no = String(GAMES.indexOf(game) + 1).padStart(2, "0");
    els.gameMeta.textContent = `Game ${no} / ${game.year} / ${game.stations.length} stations`;
    els.gameTitle.textContent = game.name;
    els.blurb.textContent = game.blurb;
    renderGrid();
  }

  function renderGrid() {
    const game = state.game;
    els.grid.innerHTML = "";
    game.stations.forEach((s, i) => {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.className = "station";
      b.dataset.key = `${game.id}/${s.id}`;
      b.innerHTML = `
        <span class="station__num">${String(i + 1).padStart(2, "0")}</span>
        <span class="badge${s.cover ? " has-cover" : ""}">${esc(s.badge)}${coverImg(s, "small", "badge__img")}</span>
        <span class="station__info">
          <span class="station__name">${esc(s.name)}</span>
          <span class="station__now"></span>
        </span>
        <span class="station__listeners"></span>`;
      b.addEventListener("click", () => {
        const isCurrent = state.current && state.current.station === s && state.current.game === game;
        if (isCurrent) togglePlay(); else tune(game, s);
      });
      li.appendChild(b);
      els.grid.appendChild(li);
    });
    render();
  }

  function render() {
    const cur = state.current;
    const playing = state.wantPlay;

    // The player bar keeps the colour of the game that's actually playing.
    if (cur) els.deck.style.setProperty("--bar-spot", cur.game.spot);

    // grid
    els.grid.querySelectorAll(".station").forEach((b) => {
      const key = b.dataset.key;
      const active = cur && key === `${cur.game.id}/${cur.station.id}`;
      b.classList.toggle("is-active", !!active);
      b.classList.toggle("is-playing", !!(active && playing));
      b.setAttribute("aria-pressed", !!active);
      const info = state.status.get(key);
      // GTA IV mounts publish no title at all, so show a dash rather than a blank.
      b.querySelector(".station__now").textContent = info ? prettyTitle(info.title) || "—" : "";
      const l = b.querySelector(".station__listeners");
      l.textContent = info ? String(info.listeners) : "";
      l.title = info ? `${info.listeners} ${info.listeners === 1 ? "person" : "people"} tuned in` : "";
    });

    // game tabs: show which one is live
    els.games.querySelectorAll(".game-tab").forEach((t) => {
      t.classList.toggle("is-live", !!(cur && playing && t.dataset.game === cur.game.id));
    });

    // deck
    els.play.classList.toggle("is-playing", playing);
    els.play.setAttribute("aria-label", playing ? "Pause" : "Play");
    if (cur) {
      const info = state.status.get(`${cur.game.id}/${cur.station.id}`);
      const track = info ? prettyTitle(info.title) : "";
      els.deckGame.textContent = cur.game.name === cur.game.city ? cur.game.name : `${cur.game.name} · ${cur.game.city}`;
      els.deckStation.textContent = cur.station.name;
      const artKey = `${cur.game.id}/${cur.station.id}`;
      if (els.deckArt.dataset.key !== artKey) {
        els.deckArt.dataset.key = artKey;
        els.deckArt.className = `player__art${cur.station.cover ? " has-cover" : ""}`;
        els.deckArt.innerHTML = `<span>${esc(cur.station.badge)}</span>${coverImg(cur.station, "small", "player__art-img")}`;
      }
      els.deckTrack.textContent = track || (info ? "This station doesn't publish song titles" : "Waiting for the song title");
      els.deckStatus.textContent = !playing ? (state.hasPlayed ? "Paused" : "Press play") : state.reconnecting ? "Reconnecting…" : state.loading ? "Tuning…" : "On air";
      els.deckStatus.classList.toggle("is-live", playing && !state.loading);
      document.title = playing ? `▶ ${cur.station.name} · ${APP_NAME}` : APP_NAME;
      updateMediaSession(cur, track);
    }
  }

  function updateMediaSession(cur, track) {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track || cur.station.name,
      artist: track ? cur.station.name : cur.game.name,
      album: `${cur.game.name} Radio`,
      artwork: cur.station.cover && !brokenCovers.has(cur.station.cover.large)
        ? [
            { src: cur.station.cover.small, sizes: "128x128", type: "image/jpeg" },
            { src: cur.station.cover.large, sizes: "512x512", type: "image/jpeg" },
          ]
        : [{ src: artworkFor(cur), sizes: "512x512", type: "image/svg+xml" }],
    });
    navigator.mediaSession.playbackState = state.wantPlay ? "playing" : "paused";
  }

  const artCache = new Map();
  function artworkFor({ game, station }) {
    const key = `${game.id}/${station.id}`;
    if (!artCache.has(key)) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="${game.spot}"/><text x="256" y="300" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="${station.badge.length > 3 ? 130 : 170}" fill="#f1ebdd" text-anchor="middle">${esc(station.badge)}</text></svg>`;
      artCache.set(key, `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
    }
    return artCache.get(key);
  }

  if ("mediaSession" in navigator) {
    const set = (a, fn) => { try { navigator.mediaSession.setActionHandler(a, fn); } catch {} };
    set("play", () => { if (!state.wantPlay) togglePlay(); });
    set("pause", () => { if (state.wantPlay) stop(); });
    set("stop", () => stop());
    set("nexttrack", () => step(1));
    set("previoustrack", () => step(-1));
  }

  // ---------- live status ----------
  async function pollStatus() {
    try {
      const res = await fetch(STATUS_URL, { cache: "no-store" });
      const json = await res.json();
      let sources = json.icestats && json.icestats.source;
      if (!sources) return;
      if (!Array.isArray(sources)) sources = [sources];
      let total = 0;
      for (const s of sources) {
        const m = (s.listenurl || "").match(/\/([^/]+)\/([^/?]+)$/);
        if (!m) continue;
        const listeners = Number(s.listeners) || 0;
        total += listeners;
        state.status.set(`${m[1]}/${m[2]}`, { title: decode(s.title || ""), listeners });
      }
      els.total.hidden = false;
      els.total.querySelector("span").textContent = `${total.toLocaleString()} tuned in right now`;
      render();
    } catch (e) {
      // Status is a nice-to-have; playback works without it.
    }
  }

  // ---------- visualizer ----------
  const cv = els.viz;
  const g2 = cv.getContext("2d");
  let freq = null;
  let phase = 0;
  function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(cv.clientWidth * dpr);
    cv.height = Math.round(cv.clientHeight * dpr);
  }
  new ResizeObserver(sizeCanvas).observe(cv);

  function draw() {
    requestAnimationFrame(draw);
    if (!drawerOpen) return; // nothing to draw while the drawer is shut
    const W = cv.width, H = cv.height;
    if (!W || !H) return;
    g2.clearRect(0, 0, W, H);
    // Flat level meter in the game's colour, like a hardware VU strip.
    g2.fillStyle = getComputedStyle(els.deck).getPropertyValue("--bar-spot").trim();
    const dpr = W / cv.clientWidth || 1;
    const bars = Math.max(24, Math.min(96, Math.floor(W / (16 * dpr))));
    const gap = W / bars;
    const bw = Math.max(1, Math.floor(gap * 0.6));

    let live = false;
    if (analyser && state.wantPlay && !audio.paused) {
      if (!freq) freq = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(freq);
      live = freq.some((v) => v > 0);
    }
    phase += 0.03;
    for (let i = 0; i < bars; i++) {
      let v;
      if (live) {
        // Log-ish mapping so the low end doesn't dominate.
        // Streams are 32 kHz mono, so the top ~third of the bins is nearly empty.
        const idx = Math.floor(Math.pow(i / bars, 1.4) * (freq.length * 0.62));
        v = freq[idx] / 255;
      } else if (state.wantPlay) {
        // No analyser (iOS) or still loading: gentle synthetic motion.
        v = 0.25 + 0.2 * Math.sin(phase * 3 + i * 0.5) * Math.sin(phase + i * 0.13);
      } else {
        v = 0;
      }
      // Quantise into stacked segments rather than smooth bars.
      const seg = Math.max(3, Math.round(H / 10));
      const lit = Math.max(1, Math.round((v * H) / seg));
      const x = Math.round(i * gap);
      for (let k = 0; k < lit; k++) g2.fillRect(x, H - (k + 1) * seg + 1, bw, seg - 2);
    }
  }

  // ---------- drawer ----------
  let drawerOpen = false;
  function setDrawer(open) {
    drawerOpen = open;
    els.deck.dataset.open = String(open);
    els.drawerBtn.setAttribute("aria-expanded", String(open));
    els.barText.setAttribute("aria-expanded", String(open));
    els.drawerBtn.title = `${open ? "Hide" : "Show"} visualizer (V)`;
    store.set("rw:drawer", open ? "1" : "0");
  }
  els.drawerBtn.addEventListener("click", () => setDrawer(!drawerOpen));
  els.barText.addEventListener("click", () => setDrawer(!drawerOpen));
  setDrawer(store.get("rw:drawer") === "1");

  // ---------- keyboard ----------
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, select") && e.key !== " ") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case "v": case "V": setDrawer(!drawerOpen); break;
      case "Escape": if (drawerOpen) setDrawer(false); break;
      case " ": e.preventDefault(); togglePlay(); break;
      case "ArrowRight": e.preventDefault(); step(1); break;
      case "ArrowLeft": e.preventDefault(); step(-1); break;
      case "ArrowUp": e.preventDefault(); setVolume(audio.volume + 0.05); break;
      case "ArrowDown": e.preventDefault(); setVolume(audio.volume - 0.05); break;
      default:
        if (/^[1-6]$/.test(e.key)) selectGame(GAMES[Number(e.key) - 1]);
    }
  });

  els.play.addEventListener("click", togglePlay);

  // ---------- helpers ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  const decoder = document.createElement("textarea");
  function decode(s) { decoder.innerHTML = s; return decoder.value; }
  function prettyTitle(t) {
    const map = { DJ: "DJ on the mic", Advertisement: "Commercial break", ID: "Station ID", News: "News update" };
    t = (t || "").trim();
    return map[t] || t;
  }

  function findByKey(key) {
    const [gid, sid] = (key || "").split("/");
    const game = GAMES.find((g) => g.id === gid);
    const station = game && game.stations.find((s) => s.id === sid);
    return { game, station };
  }

  // ---------- boot ----------
  els.dateLine.textContent = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) + " · 70 stations · 6 games";
  renderGames();
  const fromHash = findByKey(location.hash.slice(1));
  const fromStore = findByKey(store.get("rw:last"));
  const initial = fromHash.game ? fromHash : fromStore;
  const startGame = initial.game || GAMES.find((g) => g.id === store.get("rw:game")) || GAMES[2];
  selectGame(startGame);
  if (initial.station) {
    // Pre-select, but let the user press play (browsers block autoplay).
    state.current = { game: initial.game, station: initial.station };
    render();
  }
  window.addEventListener("hashchange", () => {
    const { game, station } = findByKey(location.hash.slice(1));
    if (station && !(state.current && state.current.station === station && state.current.game === game)) tune(game, station);
  });

  pollStatus();
  setInterval(() => { if (!document.hidden) pollStatus(); }, STATUS_INTERVAL);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) pollStatus(); });
  requestAnimationFrame(draw);
})();
