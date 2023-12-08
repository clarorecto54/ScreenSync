import { write, parse, SessionDescription, MediaAttributes } from "sdp-transform"
export function transformSDP(sdp: string) {
    const modifiedSDP: SessionDescription = parse(sdp)
    const quality: number = 1000000 * 2000
    const fps: number = 60
    //* INITAITE NEW CODECS
    var payloads: number[] = []
    var rtp: MediaAttributes["rtp"] = []
    var fmtp: MediaAttributes["fmtp"] = []
    var rtcpfbPayloads: number[] = []
    //* SDP BANDWIDTH
    modifiedSDP.bandwidth = [ //? Set the connection bandwidth
        { type: "AS", limit: quality },
        { type: "CT", limit: quality },
        { type: "RR", limit: quality },
        { type: "RS", limit: quality },
        { type: "TIAS", limit: quality }
    ]
    //* CODEC LIST
    const videoCodecs: { codec: string, config: string }[] = [
        { codec: "VP8", config: "" },
        {
            codec: "H264", config: [
                "profile-level-id=640034",
                "level-asymmetry-allowed=1",
                "packetization-mode=1",
                "max-br=30000000",
                "max-mbps=30000",
                `max-fr=${fps}`,
            ].join(";")
        },
    ]
    //* TEMPLATES
    const GoogleFlags = [
        "x-google-start-bitrate=20000",
        "x-google-max-bitrate=30000",
        "x-google-max-quantization=30",
        "x-google-min-quantization=20",
        "x-google-buffer-initial-delay=5000",
    ]
    function addCODEC(payload: number, codec: string, config: string, rate?: number, encoding?: number) {
        //* CODEC
        payloads.push(payload) //? Add VP8 Payload Code
        rtp.push({ payload: payload, codec, rate: rate ?? 90000, encoding: encoding ?? undefined }) //? Codec name
        fmtp.push({ payload: payload, config }) //? Codec config
        rtcpfbPayloads.push(payload) //? Add the codec payload for acknowledgement config
        //* RTX
        if (config) {
            payloads.push(payload + 1) //? Add RTX to the payload
            rtp.push({ payload: payload + 1, codec: "rtx", rate: rate ?? 90000 }) //? Codec name
            fmtp.push({ payload: payload + 1, config: `apt=${payload}` }) //? Retransmit to the payload of previous codec
        }
    }
    function addRTPRTX(payload: number, codec: string, rate?: number, config?: string) {
        //* RTP
        payloads.push(payload) //? Adds RTP payload into the list of payloads
        rtp.push({ payload: payload, codec: codec, rate: rate ?? 90000 }) //? Adds in RTP
        //* RTX
        payloads.push(payload + 1) //? Adds payload of RTP Retransmission into the payload list
        rtp.push({ payload: payload + 1, codec: "rtx", rate: rate ?? 90000 }) //? Adds the Retransmission to the RTP
        fmtp.push({ payload: payload + 1, config: config ?? `apt=${payload}` }) //? Retransmission of RTP
    }
    function addRTPOnly(payload: number, codec: string, rate?: number) {
        //* RTP ONLY
        payloads.push(payload) //? Adds payload of RTP into the payload list
        rtp.push({ payload: payload, codec, rate: rate ?? 90000 }) //? Adds to the RTP
    }
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
        modifiedSDP.media[mediaIndex].ptime = 20 //? Minimum Packeting time
        modifiedSDP.media[mediaIndex].maxptime = 30 //? Max Packeting time
        modifiedSDP.media[mediaIndex].xGoogleFlag = GoogleFlags.join(";")
        //* VIDEO & AUDIO MODIFICATIONS
        switch (media.type) {
            case "video":
                //* INITAITE NEW CODECS
                payloads = []
                rtp = []
                fmtp = []
                rtcpfbPayloads = []
                //* CLEAR DEFAULTS
                modifiedSDP.media[mediaIndex].payloads = "" //? Clear out payloads
                modifiedSDP.media[mediaIndex].rtp = [] //? Cle96ar out default codecs
                modifiedSDP.media[mediaIndex].fmtp = [] //? Clear out deafult configs
                modifiedSDP.media[mediaIndex].rtcpFb = [] //? Clear out acknowledgement
                //* INSTALLING NEW CODECS
                var startingPayload = 98
                videoCodecs.forEach(({ codec, config }) => {
                    addCODEC(startingPayload, codec, config)
                    config ? startingPayload += 2 : startingPayload += 1
                })
                //* RED [PACKET REDUNDANCY] (125)
                addRTPRTX(125, "red")
                //* PACKET ERROR CORRECTION (127)
                addRTPOnly(127, "ulpfec")
                //* APPLYING NEW CODECS
                modifiedSDP.media[mediaIndex].payloads = payloads.join(" ")
                modifiedSDP.media[mediaIndex].rtp = rtp
                modifiedSDP.media[mediaIndex].fmtp = fmtp
                modifiedSDP.media[mediaIndex].rtcpFb = generateRTCPFB(rtcpfbPayloads)
                break
            case "audio":
                //* INITAITE NEW CODECS
                payloads = []
                rtp = []
                fmtp = []
                rtcpfbPayloads = []
                //* CLEAR DEFAULTS
                modifiedSDP.media[mediaIndex].payloads = "" //? Clear out payloads
                modifiedSDP.media[mediaIndex].rtp = [] //? Clear out default codecs
                modifiedSDP.media[mediaIndex].fmtp = [] //? Clear out deafult configs
                modifiedSDP.media[mediaIndex].rtcpFb = [] //? Clear out acknowledgement
                //* RED [PACKET REDUNDANCY] (96)
                payloads.push(96)
                rtp.push({ payload: 96, codec: "red", rate: 48000, encoding: 2 })
                fmtp.push({ payload: 96, config: "97" })
                //* OPUS (97)
                payloads.push(97)
                rtp.push({ payload: 97, codec: "opus", rate: 48000, encoding: 2 })
                fmtp.push({
                    payload: 97, config: [
                        "stereo=1",
                        "sprop-stereo=1",
                        "useinbandfec=1",
                        "usedtx=1",
                        "cbr=0",
                        "stereo=1",
                        "minptime=10",
                        "ptime=15",
                        "maxptime=20",
                        "maxaveragebitrate=128000",
                        "maxplaybackrate=128000",
                        "sprop-maxcapturerate=128000"
                    ].join(";")
                })
                rtcpfbPayloads.push(97)
                //* APPLYING NEW CODECS
                modifiedSDP.media[mediaIndex].payloads = payloads.join(" ")
                modifiedSDP.media[mediaIndex].rtp = rtp
                modifiedSDP.media[mediaIndex].fmtp = fmtp
                modifiedSDP.media[mediaIndex].rtcpFb = generateRTCPFB(rtcpfbPayloads)
                break
            default:
                // //* INITAITE NEW CODECS
                // payloads = []
                // rtp = []
                // fmtp = []
                // rtcpfbPayloads = []
                // //* CLEAR DEFAULTS
                // modifiedSDP.media[mediaIndex].payloads = "" //? Clear out payloads
                // modifiedSDP.media[mediaIndex].rtp = [] //? Clear out default codecs
                // modifiedSDP.media[mediaIndex].fmtp = [] //? Clear out deafult configs
                // modifiedSDP.media[mediaIndex].rtcpFb = [] //? Clear out acknowledgement
                break
        }
    })
    // console.clear()
    // console.log("Original SDP: ", sdp) //? Show Original SDP
    // console.log(write(modifiedSDP).replaceAll("262144", "2000000000")) //? Show Modified SDP
    // return sdp //? Return Original SDP
    return write(modifiedSDP).replaceAll("262144", "2000000000") //? Return the modified SDP with the new max packet size
}
function generateRTCPFB(payloads: number[]) {
    const rtcpFb: MediaAttributes["rtcpFb"] = []
    const mainType = ["nack", "rtpfb"]
    const nack = ["pli", "fir"]
    const rtpfb = ["transport-wide-cc", "ccm-fir", "ccm-nack", "ccm-tmmbr"]
    for (const payload of payloads) { //? Push payload
        for (const main of mainType) {
            rtcpFb.push({ //? Push the main type
                payload: payload,
                type: main
            })
            switch (main) { //? Push the sub types
                case "nack":
                    for (const sub of nack) {
                        rtcpFb.push({
                            payload: payload,
                            type: main,
                            subtype: sub
                        })
                    }
                    break
                case "rtpfb":
                    for (const sub of rtpfb) {
                        rtcpFb.push({
                            payload: payload,
                            type: main,
                            subtype: sub
                        })
                    }
                    break
                default:
                    break
            }
        }
    }
    return rtcpFb
}