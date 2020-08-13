import React, { Component } from "react";
import $ from 'jquery'; 
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import Marquee from './components/Marquee';

class App extends Component {
    constructor() {
        super();
        this.state = {
            token: null,
            item: {
                album: {
                    images: [{ url: "" }]
                },
                name: "",
                artists: [{ name: "" }],
                duration_ms: 0
            },
            is_playing: "Paused",
            progress_ms: 0,
            no_data: false
        }

        this.getCurSong = this.getCurSong.bind(this)
        this.loopSong = this.loopSong.bind(this)
    }

    render() {
        return (
            <div className="App">
                {!this.state.token && (
                    <a
                    className="btn"
                    href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
                    >
                        Login to Spotify
                    </a>
                )}
                {this.state.token && !this.state.no_data && (
                    <Marquee
                        text={`Playing now:` + this.state.item.artists[0].name + " - " + this.state.item.name}
                    />
                )}
                {this.state.no_data && (
                    <p> You need to be playing a song on Spotify</p>
                )}
            </div>
        );
    }

    getCurSong(token) {
        $.ajax({
            url: "https://api.spotify.com/v1/me/player",
            type: "GET",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", `Bearer ${token}`)
            },
            success: (data) => {
                if (!data) {
                    this.setState({no_data: true})
                    return
                }

                this.setState({
                    item: data.item,
                    is_playing: data.is_playing,
                    progress_ms: data.progress_ms,
                    no_data: false
                })
            }
        })
    }

    componentDidMount() {
        let getToken = hash.access_token;

        if (getToken) {
            this.setState({token: getToken})
            this.getCurSong(getToken)
        }

        this.interval = setInterval(() => this.loopSong(), 3000)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    loopSong() {
        if (this.state.token) this.getCurSong(this.state.token)
    }
}

export default App;