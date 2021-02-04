import React, { useEffect, useState } from 'react'
import $ from 'jquery'
import { authEndpoint, clientId, redirectUri, scopes } from "./config"
import hash from "./hash"
import Marquee from './components/Marquee'

function App() {

    const [token, setToken] = useState(null)
    const [item, setItem]   = useState({
        album: {
            images: [{
                url: ""
            }]
        },
        name: "",
        artists: [{
            name: ""
        }],
        duration_ms: 0
    })
    
    const [isPlaying, setIsPlaying] = useState("Paused")
    const [progressMs, setProgressMs] = useState(0)
    const [noData, setNoData] = useState(false)

    const getCurrentSong = (token) => {
        $.ajax({
            url: "https://api.spotify.com/v1/me/player",
            type: "GET",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", `Bearer ${token}`)
            },
            success: (data) => {
                if (!data) {
                    setNoData(true)
                    return
                }

                setItem(data.item)
                setIsPlaying(data.is_playing)
                setProgressMs(data.progress_ms)
                setNoData(false)
            }
        })
    }

    useEffect(() => {
        loopCurrentSong()
        
        const interval = setInterval(() => {
            loopCurrentSong()
        }, 2000)

        return () => clearInterval(interval)

    }, [])

    const loopCurrentSong = () => {
        const getToken = hash.access_token

        if (getToken) {
            setToken(getToken)
            getCurrentSong(getToken)
        }
    }

    return (
        <div className="App">
            {!token && (
                <a
                    className="btn btn-login"
                    href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
                >
                    Login to Spotify
                </a>
            )}
            {token && !noData && (
                <Marquee
                    text={`Playing now:` + item.artists[0].name + " - " + item.name}
                />
            )}
            {noData && (
                <p> You need to be playing a song on Spotify</p>
            )}
        </div>
    );
}

export default App