import googleTTS from 'google-tts-api'

/**
 * Service tạo audio từ text
 */
export class AudioService {
    async generateTTS(text) {
        const ttsOptions = { lang: 'ja', slow: false, host: 'https://translate.google.com' }

        if (text.length <= 200) {
            const base64 = await googleTTS.getAudioBase64(text, ttsOptions)
            return { mime: 'audio/mpeg', audioBase64: base64 }
        }

        const parts = await googleTTS.getAllAudioBase64(text, ttsOptions)
        const bufs = []
        for (const p of parts) {
            if (typeof p === 'string') {
                bufs.push(Buffer.from(p, 'base64'))
            } else if (p && typeof p === 'object') {
                const b64 = p.base64 || p.audioBase64 || p.data || p.content
                if (typeof b64 === 'string') bufs.push(Buffer.from(b64, 'base64'))
            }
        }

        if (bufs.length === 0) {
            throw new Error('TTS returned no audio parts')
        }

        const combined = Buffer.concat(bufs)
        return { mime: 'audio/mpeg', audioBase64: combined.toString('base64') }
    }
}
