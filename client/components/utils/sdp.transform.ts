import { write, parse, SessionDescription } from "sdp-transform"
export function transformSDP(sdp: string) {
    const modifiedSDP: SessionDescription = parse(sdp)
    const quality: number = 1000000 * 2000
    const fps: number = 60
    //* SDP BANDWIDTH
    modifiedSDP.bandwidth = [ //? Set the connection bandwidth
        { type: "AS", limit: quality },
        { type: "CT", limit: quality },
        { type: "RR", limit: quality },
        { type: "RS", limit: quality },
        { type: "TIAS", limit: quality }
    ]
    //* TEMPLATES
    const GoogleFlags = [
        "x-google-start-bitrate=20000",
        "x-google-max-bitrate=30000",
        "x-google-max-quantization=30",
        "x-google-min-quantization=20",
        "x-google-buffer-initial-delay=5000",
    ]
    modifiedSDP.media.forEach((media, mediaIndex) => {
        //* MEDIA MODIFICATIONS
        modifiedSDP.media[mediaIndex].bandwidth = [ //? Set the media bandwidth
            { type: "AS", limit: quality },
            { type: "CT", limit: quality },
            { type: "RR", limit: quality },
            { type: "RS", limit: quality },
            { type: "TIAS", limit: quality }
        ]
        modifiedSDP.media[mediaIndex].framerate = fps //? Set the framerate
        modifiedSDP.media[mediaIndex].xGoogleFlag = GoogleFlags.join(";")
        modifiedSDP.media[mediaIndex].ptime = 20 //? Minimum Packeting time
        modifiedSDP.media[mediaIndex].maxptime = 30 //? Max Packeting time
    })
    // console.clear()
    // console.log("Original SDP: ", sdp) //? Show Original SDP
    // console.log(write(modifiedSDP).replaceAll("262144", "2000000000")) //? Show Modified SDP
    // return sdp //? Return Original SDP
    return write(modifiedSDP).replaceAll("262144", "2000000000") //? Return the modified SDP with the new max packet size
}