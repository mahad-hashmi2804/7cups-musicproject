// Song Search Handler

const search_input = document.querySelector("#search_input");
const search_btn = document.querySelector("#search_btn");
const song_selection = document.querySelector("#song_selection");
const song_id = document.querySelector("#song_id");
const from_name_input = document.querySelector("#from_name_input");
const to_name_input = document.querySelector("#to_name_input");
const submit_btn = document.querySelector("#submit_btn");


function search() {
    // Send request to server
    fetch(`/search?q=${search_input.value}`, {
        method: "GET",
    }).then(response => response.json())
        .then(result => {
            // console.log(result);

            // Clear previous search results
            document.querySelector("#results_list").innerHTML = "";

            if (document.querySelector(".accordion-button").getAttribute("aria-expanded") === "false") {
                document.querySelector(".accordion-button").click()
            }

            // Display search results
            if (result.results.length === 0) {
                let li = document.createElement("li");
                li.innerHTML = "No results found";
                li.classList.add("list-group-item");
                li.classList.add("list-group-item-action");
                li.classList.add("py-2")
                li.style.width = "100%";
                li.style.border = "1px solid #dee2e6";
                document.querySelector("#results_list").append(li);
            }

            $.each(result.results, (key, song) => {
                // console.log(song);

                let li = document.createElement("li");

                let img = document.createElement("img");
                img.src = song.album['images'][2]['url'];
                img.width = 64;
                img.height = 64;
                img.style.margin = "2px";
                img.style.marginLeft = "0";
                li.appendChild(img);

                let div = document.createElement("div");
                div.style.display = "inline-block";
                div.classList.add("align-middle");

                let title = document.createElement("span");
                title.innerHTML = song.name;
                title.classList.add("title");
                title.style.display = "inline-block";
                div.appendChild(title);

                let artist = document.createElement("span");
                artist.classList.add("text-muted");
                artist.classList.add("title");
                artist.style.display = "block";

                function parse_names(song) {
                    let names = `${song.artists[0].name}`;
                    if (song.artists.length > 1) {
                        names += " ft. ";
                        for (let i = 1; i < song.artists.length; i++) {
                            names += song.artists[i].name;
                            if (i < song.artists.length - 1) {
                                names += ", ";
                            }
                        }
                    }
                    return names;
                }

                artist.innerHTML = parse_names(song);

                div.appendChild(artist);

                li.appendChild(div);

                let duration = document.createElement("span");
                duration.classList.add("text-muted");
                duration.style.display = "inline-block";
                duration.style.float = "right";
                duration.innerHTML = `${Math.floor(song.duration_ms / 60000)}:${Math.floor((song.duration_ms % 60000) / 1000).toString().padStart(2, '0')}`;
                li.appendChild(duration);

                li.classList.add("list-group-item");
                li.classList.add("list-group-item-action");
                li.style.width = "100%";
                li.style.borderBottom = "solid #dee2e6";
                li.classList.add("py-2");

                li.onclick = () => {
                    let select = document.querySelector("#song_selection");
                    let song_id = document.querySelector("#song_id");

                    let image = document.createElement("img");
                    image.src = song.album.images[1].url;
                    image.width = 100;
                    image.height = 100;
                    // image.style.margin = "2px";

                    select.innerHTML = "";

                    let title = document.createElement("h6");
                    title.innerHTML = song.name;
                    title.classList.add("card-title");
                    title.classList.add("title");

                    let artist = document.createElement("p");
                    artist.classList.add("title");
                    artist.innerHTML = parse_names(song);

                    let album = document.createElement("p");
                    album.innerHTML = song.album.name;

                    let titlediv = document.createElement("div");
                    titlediv.style.display = "inline-block";
                    titlediv.classList.add("align-middle");
                    titlediv.classList.add("p-1");

                    let div = document.createElement("div");
                    div.style.display = "inline-block";
                    div.classList.add("align-middle");

                    let duration = document.createElement("span");
                    duration.classList.add("text-muted");
                    duration.style.display = "inline-block";
                    duration.style.float = "right";
                    duration.classList.add("my-3");

                    duration.innerHTML = `${Math.floor(song.duration_ms / 60000)}:${Math.floor((song.duration_ms % 60000) / 1000).toString().padStart(2, '0')}`;
                    titlediv.appendChild(title);
                    titlediv.appendChild(artist);
                    div.appendChild(titlediv);
                    div.appendChild(duration);

                    let spotify_link = document.createElement("a");
                    spotify_link.href = song.external_urls.spotify;
                    spotify_link.innerHTML = "Open on Spotify ";
                    spotify_link.innerHTML += "<i class=\"bi bi-box-arrow-up-right\"></i>";
                    spotify_link.target = "_blank";
                    spotify_link.classList.add("btn");
                    spotify_link.classList.add("btn-primary");

                    song_id.value = song.id;

                    // console.log(song_id.value);

                    select.appendChild(image);
                    select.appendChild(div);
                    select.appendChild(album);
                    select.appendChild(spotify_link);

                    // Close accordion
                    if (document.querySelector(".accordion-button").getAttribute("aria-expanded") === "true") {
                        document.querySelector(".accordion-button").click()
                    }
                }

                document.querySelector("#results_list").append(li);
            });
        });
}

function submit() {
    if (from_name_input.value.length < 1) {
        return;
    }
    if (song_id.value.length < 1) {
        return;
    }

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const request = new Request(
        '/song_request/',
        {
            method: 'POST', headers: {
                'X-CSRFToken': csrftoken, from_name: from_name_input.value,
                remember: document.querySelector("#remember_me").checked,
                to_name: to_name_input.value,
                song_id: song_id.value
            }, body: JSON.stringify({
                from_name: from_name_input.value,
                remember: document.querySelector("#remember_me").checked,
                to_name: to_name_input.value,
                song_id: song_id.value
            })
        }
    )

    let card = document.querySelector(".card-body");
    card.classList.add("disabled-div");
    document.querySelector("#submit_btn").disabled = true;

    let spinner = document.querySelector(".spinner-border");
    spinner.style.display = "block";

    fetch(request).then(response => response.json())
        .then(result => {
            console.log(result.success);
            if (result.success === true) {
                spinner.style.display = "none";
                card.classList.remove("disabled-div");
                submit_btn.disabled = false;

                // document.querySelector("#submit_btn").disabled = false;
                let song = document.querySelector("#song_selection");
                song.innerHTML = "";
                document.querySelector("#song_id").value = "";
                search_input.value = "";

                alert("Song submitted!");
                // window.location.reload();
            } else {
                spinner.style.display = "none";
                alert("Something went wrong! Please refresh the page and try again.");
                window.location.reload();
            }
        });
}

search_btn.addEventListener("click", search);
search_input.addEventListener("keyup", () => {
    if (event.keyCode === 13) {
        event.preventDefault();
        search_btn.click();
    }
    document.querySelector("#search_btn").disabled = search_input.value.length < 3;
    search_input.addEventListener("change", search);

    submit_btn.addEventListener("click", submit);
});