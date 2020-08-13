const hash = window.location.hash
    .substring(1)
    .split("&")
    .reduce(function(initial, item) {
        if (item) {
            let uris = item.split("=")
            initial[uris[0]] = decodeURIComponent(uris[1])
        }
    
        return initial
    }, {})

window.location.hash = ""

export default hash