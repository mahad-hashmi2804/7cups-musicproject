document.querySelectorAll(".filter_btn").forEach(button => {
    button.addEventListener("click", () => {
        history.pushState(null, null, "/song_requests/?" + button.dataset.p + "=" + button.dataset.v);
        getRequests();
    });
});

document.querySelector("#refresh_btn").addEventListener("click", () => {
    getRequests();
});

document.querySelector(".check-div").classList.add(screen.width < 540 ? "check-div" : "d-flex");

const PROFANITIES = [
    "anus", "arse", "arsehole", "ass", "ass-hat", "ass-jabber", "ass-pirate", "assbag", "assbandit", "assbanger", "assbite ", "assclown", "asscock ", "asscracker", "asses ", "assface", "assfuck", "assfucker", "assgoblin", "asshat", "asshead ", "asshole", "asshopper", "assjacker", "asslick ", "asslicker", "assmonkey ", "assmunch ", "assmuncher", "assnigger", "asspirate", "assshit", "assshole", "asssucker", "asswad", "asswipe", "axwound", "bampot", "bastard", "beaner", "beartrap", "bitch", "bitchass", "bitches", "bitchtits", "bitchy", "blow job", "blowjob", "bollocks", "bollox", "boner", "brotherfucker", "bullshit", "bumblefuck", "butt plug", "butt-pirate", "buttfucka", "buttfucker", "camel toe", "carpetmuncher", "chesticle", "chinc", "chink", "choad", "chode", "circlejerk", "clit", "clitface", "clitfuck", "clitweasel", "clusterfuck", "cock", "cockass", "cockbite", "cockblocker", "cockburger", "cockface", "cockfucker", "cockhead", "cockjockey", "cockknoker", "cockmaster", "cockmongler", "cockmongruel", "cockmonkey", "cockmuncher", "cocknose", "cocknugget", "cockshit", "cocksmith", "cocksmoke", "cocksmoker", "cocksniffer", "cocksucker", "cockwaffle", "coochie", "coochy", "coon", "cooter", "cracker", "cum", "cumbubble", "cumdumpster", "cumguzzler", "cumjockey", "cumslut", "cumtart", "cunnie", "cunnilingus", "cunt", "cuntass", "cuntbubble", "cuntface", "cunthole", "cuntlicker", "cuntrag", "cuntslut", "dago", "damn", "deggo", "dick", "dick-sneeze", "dickbag", "dickbeaters", "dickface", "dickfuck", "dickfucker", "dickhead", "dickhole", "dickjuice", "dickmilk", "dickmonger", "dicks", "dickslap", "dicksucker", "dicksucking", "dicktickler", "dickwad", "dickweasel", "dickweed", "dickwod", "dike", "dildo", "dipshit", "docking", "doochbag", "dookie", "douche", "douche-fag", "douchebag", "douchewaffle", "dumass", "dumb ass", "dumbass", "dumbfuck", "dumbshit", "dumshit", "dyke", "fag", "fagbag", "fagfucker", "faggit", "faggot", "faggotcock", "fagnut", "fagtard", "fatass", "fellatio", "feltch", "flamer", "fuck", "fuckass", "fuckbag", "fuckboy", "fuckbrain", "fuckbutt", "fuckbutter", "fucked", "fucker", "fuckersucker", "fuckface", "fuckhead", "fuckhole", "fuckin", "fucking", "fucknose", "fucknut", "fucknutt", "fuckoff", "fucks", "fuckstick", "fucktard", "fucktart", "fuckup", "fuckwad", "fuckwit", "fuckwitt", "fudgepacker", "gayass", "gaybob", "gaydo", "gayfuck", "gayfuckist", "gaylord", "gaytard", "gaywad", "goddamn", "goddamnit", "gooch", "gook", "goopchute", "gringo", "guido", "handjob", "hard on", "heeb", "hell", "ho", "hoe", "homo", "homodumbshit", "honkey", "humping", "jackass", "jagoff", "jap", "jerk off", "jerkass", "jigaboo", "jizz", "jungle bunny", "junglebunny", "kike", "kooch", "kootch", "kraut", "kunt", "kyke", "lameass", "lardass", "lesbo", "lezzie", "masturbate", "mcfagget", "mick", "minge", "mothafucka", "mothafuckin'", "motherfucker", "motherfucking", "muff", "muffdiver", "munging", "nazi", "negro", "nigaboo", "nigga", "nigger", "niggerish", "niggers", "niglet", "nignog", "nut sack", "nutsack", "paki", "panooch", "pecker", "peckerhead", "penis", "penisbanger", "penisfucker", "penispuffer", "piss", "pissed", "pissed off", "pissflaps", "polesmoker", "pollock", "poon", "poonani", "poonany", "poontang", "porch monkey", "porchmonkey", "prick", "punanny", "punta", "pussies", "pussy", "pussylicking", "puto", "queef", "queerbait", "queerhole", "renob", "rimjob", "ruski", "sand nigger", "sandnigger", "schlong", "scrote", "shit", "shitass", "shitbag", "shitbagger", "shitbrains", "shitbreath", "shitcanned", "shitcunt", "shitdick", "shitface", "shitfaced", "shithead", "shithole", "shithouse", "shitspitter", "shitstain", "shitter", "shittiest", "shitting", "shitty", "shiz", "shiznit", "skank", "skeet", "skullfuck", "slut", "slutbag", "smeg", "snatch", "spic", "spick", "splooge", "spook", "suckass", "tard", "testicle", "thundercunt", "tit", "titfuck", "tits", "tittyfuck", "twat", "twatlips", "twats", "twatwaffle", "twit", "uglyfuck", "unclefucker", "va-j-j", "vag", "vagina", "vajayjay", "vjayjay", "wank", "wankjob", "wetback", "whore", "whorebag", "whoreface", "wop"
]

function getLyrics(id, title) {
    let lyrics = [];
    let lyrics_div = document.querySelector("#lyrics");
    let title_div = document.querySelector("#lyrics_title");
    let spinner = document.querySelector("#lyrics_spinner");

    spinner.style.display = "block";
    lyrics_div.style.display = "none";
    lyrics_div.innerHTML = "";
    fetch('https://spotify-lyric-api.herokuapp.com/?trackid=' + id)

        .then(response => {
            console.log(response.status);

            if (response.status === 200) {
                response.json().then(result => {
                    result.lines.forEach(line => {
                        // Split the line into words
                        let words = line.words.split(" ");

                        words.forEach(word => {
                            // Check if the word is a profanity
                            if (PROFANITIES.includes(word.toLowerCase())) {
                                // Make te word red
                                line.words = line.words.replace(word, "<span style='color: red'>" + word + "</span>");
                            }
                        })

                        lyrics.push(line.words);
                    })
                    title_div.innerHTML = title + " - Lyrics";
                    lyrics_div.innerHTML = lyrics.join("<br>");
                });
            } else {
                title_div.innerHTML = "Lyrics";
                title_div.innerHTML = "Lyrics not available for this song";
            }
            spinner.style.display = "none";
            lyrics_div.style.display = "block";
        });

}

function getRequests() {
    // Get the current get parameters
    let params = window.location.search;
    let play = "&played=";

    if (params === "") {
        play = "?played=";
    }

    if (document.querySelector("#played").checked) {
        params += play + "True";
    } else {
        params += play + "False";
    }

    if (new URLSearchParams(params).get("played") === "true") {
        document.querySelector("#played").checked = true;
    }

    let spinner = document.querySelector("#list_spinner");
    let request_list = document.querySelector("#request_list");

    spinner.style.display = "block";
    request_list.style.display = "none";

    console.log(params);

    // Get the requests from the API
    fetch('/song_requests_api/' + params, {
        method: 'GET',
    }).then(response => response.json()).then(response => {
        if (response.status === 200) {
            addRequests(response.song_requests);
        } else {
            alert("Something went wrong! Please refresh the page and try again.");
            window.location.reload();
        }
    });
}

const ICONS = {
    "approved": "<i class='bi bi-check-lg status-icon' style='background-color: green;' title='approved'></i>",
    "rejected": "<i class='bi bi-x-lg status-icon' style='background-color: red' title='rejected'></i>",
    "pending": "<i class='bi bi-clock status-icon' style='background-color: gray' title='pending'></i>",
    "challenged": "<i class='bi bi-exclamation-lg status-icon' style='background-color: orange;' title='challenged'></i>",
}

// Add requests to the page
function addRequests(requests) {
    let request_list = document.querySelector("#request_list");
    let spinner = document.querySelector("#list_spinner");

    // Clear the results list
    request_list.innerHTML = "";

    const mobile = screen.width < 540;

    // Add each request to the results list
    requests.forEach(request => {
        let li = document.createElement("li");
        li.classList.add("list-group-item");
        li.id = "li-" + request.id;

        // Data Row
        let row1 = document.createElement("div");
        row1.classList.add("row");
        row1.classList.add("mb-2");
        row1.classList.add("metadata-row");

        let img_col = document.createElement("div");
        img_col.classList.add("col");

        let img = document.createElement("img");
        img.src = request.song__image300;
        img.classList.add("song-img");
        img_col.appendChild(img);

        let title_col = document.createElement("div");
        if (screen.width > 540) {
            title_col.classList.add("col-md-9");
        } else {
            title_col.classList.add("col");
        }
        title_col.classList.add("ms-2");

        let title = document.createElement("span");
        title.innerHTML = request.song__title;
        title.classList.add("fw-bold");
        title.classList.add("title");
        title.classList.add("row");
        title_col.appendChild(title);

        let artist = document.createElement("span");
        artist.innerHTML = request.song__artists;
        artist.classList.add("text-muted");
        artist.classList.add("title");
        artist.classList.add("row");
        title_col.appendChild(artist);

        let from = document.createElement("span");
        from.innerHTML = "From: " + request.from_user;
        from.classList.add("text-muted");
        from.classList.add("title");
        from.classList.add("row");
        title_col.appendChild(from);

        let status = document.createElement("span");
        status.innerHTML = "Status: " + ICONS[request.song__status] + " " + request.song__status;
        status.classList.add("text-muted");
        // status.classList.add("title");
        status.classList.add("row");

        status.style.display = "inline-block";
        status.style.whiteSpace = "nowrap";
        title_col.appendChild(status);

        let played = document.createElement("span");
        played.innerHTML = "Has ";
        played.innerHTML += request.played ? "" : "not ";
        played.innerHTML += "been played";
        played.classList.add("text-muted");
        // played.classList.add("title");
        played.classList.add("row");
        title_col.appendChild(played);

        row1.appendChild(img_col);
        row1.appendChild(title_col);

        // Button Row
        let row2 = document.createElement("div");
        row2.classList.add("col");
        row2.classList.add("justify-content-center");
        row2.classList.add("align-items-center");
        row2.classList.add("text-center");
        row2.classList.add("gap-2");
        row2.classList.add("m-2");

        let approve_btn = document.createElement("button");
        approve_btn.classList.add("btn");
        approve_btn.classList.add("btn-success");
        // approve_btn.classList.add("col");
        approve_btn.innerHTML = "<i class='bi bi-check-lg'></i> Approve";
        approve_btn.onclick = () => {
            review_song("approve", request.song__song_id)
        };

        let deny_btn = document.createElement("button");
        deny_btn.classList.add("btn");
        deny_btn.classList.add("btn-danger");
        // deny_btn.classList.add("col");
        deny_btn.innerHTML = "<i class='bi bi-x-lg'></i> Deny";
        deny_btn.onclick = () => {
            review_song("reject", request.song__song_id)
        };

        let play_btn = document.createElement("button");
        play_btn.classList.add("btn");
        play_btn.classList.add("btn-primary");
        // play_btn.classList.add("col");
        play_btn.innerHTML = "<i class='bi bi-play-fill'></i>  Play Song";
        play_btn.onclick = () => {
            // force_btn.style.display = "inline-block";
            playSong(request.id, false)
        };

        let force_btn = document.createElement("button");
        force_btn.classList.add("btn");
        force_btn.classList.add("btn-secondary");
        force_btn.innerHTML = "Playback not starting? Click here";
        force_btn.onclick = () => {
            playSong(request.id, true)
        };
        force_btn.style.display = "none";

        let lyrics_btn = document.createElement("button");
        lyrics_btn.classList.add("btn");
        lyrics_btn.classList.add("btn-secondary");
        lyrics_btn.innerHTML = "<i class=\"bi bi-body-text\"></i> View Song Lyrics";
        lyrics_btn.onclick = () => {
            getLyrics(request.song__song_id, request.song__title);
        };
        lyrics_btn.dataset.bsToggle = "modal";
        lyrics_btn.dataset.bsTarget = "#lyrics_modal";

        let spotify_btn = document.createElement("a");
        spotify_btn.classList.add("btn");
        spotify_btn.classList.add("btn-success");
        spotify_btn.href = request.song__song_url;
        spotify_btn.innerHTML = "<i class='bi bi-box-arrow-up-right'></i> Open on Spotify";
        spotify_btn.target = "_blank";

        row2.appendChild(play_btn);
        row2.appendChild(force_btn);
        row2.appendChild(approve_btn);
        row2.appendChild(deny_btn);
        row2.appendChild(lyrics_btn);

        if (document.querySelector("#spotify").checked) {
            row2.appendChild(spotify_btn);
        }

        if (document.querySelector("#user_type").value !== "Song Approver" && request.played == false) {
            let played_btn = document.createElement("button");
            played_btn.classList.add("btn");
            played_btn.classList.add("btn-info");
            played_btn.style.color = "white";
            played_btn.innerHTML = "Mark as Played";
            played_btn.onclick = () => {
                review_song("played", request.id);
            }
            row2.appendChild(played_btn);
        }

        let player_row = document.createElement("div");
        player_row.classList.add("row");
        player_row.classList.add("player-row");
        player_row.classList.add("justify-content-center");
        player_row.classList.add("align-items-center");
        player_row.classList.add("text-center");
        player_row.classList.add("m-2");

        let player = document.createElement("video");
        player.classList.add("col-md-12");
        player.controls = true;
        player.style.display = "none";

        let source = document.createElement("source");
        source.type = "audio/mpeg";
        source.dataset.id = request.song__song_id;

        let spinner = document.createElement("div");
        spinner.classList.add("spinner-border");
        spinner.classList.add("text-primary");

        player_row.appendChild(spinner);

        player.appendChild(source);
        player_row.appendChild(player);

        player_row.style.display = "none";

        li.appendChild(row1);
        li.appendChild(row2);
        li.appendChild(player_row);

        request_list.append(li);
    });

    spinner.style.display = "none";
    request_list.style.display = "block";
}

function getSong(id, force) {
    return $.ajax({
        url: '/audio/?song_id=' + id + '&force=' + force,
        type: 'GET',
        dataType: 'json'
    });
}

function playSong(id, force) {
    let li = document.querySelector("#li-" + id);

    let player = li.querySelector("video");
    let source = li.querySelector("source");
    let spinner = li.querySelector(".spinner-border");
    let player_row = li.querySelector(".player-row");

    player_row.style.display = "block";

    player.style.display = "none";
    spinner.style.display = "block"

    getSong(source.dataset.id, force).then(song => {
        let force_btn = li.querySelector(".btn-secondary");

        console.log(song.audio);

        if (song.audio === "") {
            alert("This song is not available! Please use lyrics for review.");
            player_row.style.display = "none";
            return;
        }

        document.querySelectorAll(".player-row").forEach(player => {
            player.style.display = "none";
            player.querySelector("source").src = "";
            let video = player.querySelector("video");
            video.pause();
            video.load();
        });

        source.src = song.audio;
        player.load();

        player_row.style.display = "block";
        spinner.style.display = "none"
        player.style.display = "block";
        player.play();
        let playing = false;

        player.onplaying = () => {
            force_btn.style.display = "none";
            playing = true;
        };

        let interval = setInterval(() => {
            // console.log(playing);
            // console.log(force_btn);
            if (playing === false) {
                force_btn.style.display = "inline-block";
                clearInterval(interval);
            }
        }, 10000);
    });
}

function review_song(status, id) {
    // Get CSRF token
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    let r = new Request('/song_review/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            csrfmiddlewaretoken: csrftoken,
            status: status,
            song_id: id
        }),

    })

    fetch(r).then(response => response.json()).then(response => {
        if (response.status === 201) {
            alert("Song " + response.action + " successfully")
        } else {
            alert("Something went wrong! Please refresh the page and try again.");
        }
        getRequests();
    });
}

getRequests();
