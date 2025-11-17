import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [url, setUrl] = useState('https://youtube.com/shorts/XMWLfDv0dXs?si=9juKdwSXAdGXF4-5')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [videoInfo, setVideoInfo] = useState<any>(null)

  const handleDownload = async () => {
    setLoading(true)
    setError('')
    setVideoInfo(null)

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process video')
      }

      setVideoInfo(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>YouTube Video Downloader</title>
        <meta name="description" content="Download YouTube videos easily" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>YouTube Video Downloader</h1>
          <p className={styles.subtitle}>Download YouTube videos and shorts</p>

          <div className={styles.inputGroup}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className={styles.input}
            />
            <button
              onClick={handleDownload}
              disabled={loading || !url}
              className={styles.button}
            >
              {loading ? 'Processing...' : 'Get Download Links'}
            </button>
          </div>

          {error && (
            <div className={styles.error}>
              <p>⚠️ {error}</p>
            </div>
          )}

          {videoInfo && (
            <div className={styles.result}>
              <div className={styles.videoInfo}>
                <h2>{videoInfo.title}</h2>
                <p className={styles.author}>By {videoInfo.author}</p>
                <p className={styles.duration}>Duration: {videoInfo.duration}</p>
              </div>

              <div className={styles.formats}>
                <h3>Available Formats:</h3>
                {videoInfo.formats.map((format: any, index: number) => (
                  <div key={index} className={styles.formatItem}>
                    <div className={styles.formatInfo}>
                      <span className={styles.quality}>{format.quality}</span>
                      <span className={styles.formatType}>{format.container}</span>
                      {format.hasAudio && <span className={styles.badge}>Audio</span>}
                      {format.hasVideo && <span className={styles.badge}>Video</span>}
                    </div>
                    <a
                      href={format.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadLink}
                      download
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>

              <div className={styles.notice}>
                <p>💡 Tip: Right-click the download link and select "Save As" to download to your device. From there, you can upload to Google Drive.</p>
              </div>
            </div>
          )}

          <div className={styles.footer}>
            <p>Note: This tool provides direct download links. You can save files locally and upload to Google Drive manually.</p>
          </div>
        </div>
      </main>
    </>
  )
}
