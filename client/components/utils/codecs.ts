export const myCodecs: RTCRtpCodecParameters[] = [
    { //* OPUS
        clockRate: 48000, mimeType: "audio/opus", payloadType: 97, sdpFmtpLine: [
            "stereo=1",
            "sprop-stereo=1",
            "useinbandfec=1",
            "usedtx=1",
            "cbr=0",
            "stereo=1",
            "minptime=10",
            "ptime=15",
            "maxptime=20",
            "maxaveragebitrate=192000",
            "maxplaybackrate=192000",
            "sprop-maxcapturerate=192000"
        ].join(";")
    },
    { //* H264
        payloadType: 101, clockRate: 90000, mimeType: "video/H264", sdpFmtpLine: [
            "profile-level-id=640034",
            "level-asymmetry-allowed=1",
            "packetization-mode=1",
            "max-mbps=30000",
            "max-fr=60",
        ].join(";")
    }
]