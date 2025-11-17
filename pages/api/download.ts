import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  // Extract video ID from various YouTube URL formats
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)

  if (!videoIdMatch) {
    return res.status(400).json({ error: 'Invalid YouTube URL' })
  }

  const videoId = videoIdMatch[1]

  try {
    // Use YouTube's oEmbed API to get video information
    const oembedResponse = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    )

    if (!oembedResponse.ok) {
      throw new Error('Failed to fetch video information')
    }

    const videoData = await oembedResponse.json()

    // Provide information and alternative download methods
    const response = {
      title: videoData.title,
      author: videoData.author_name,
      duration: 'N/A',
      thumbnail: videoData.thumbnail_url,
      videoId: videoId,
      formats: [
        {
          quality: 'Best Quality',
          container: 'MP4',
          hasVideo: true,
          hasAudio: true,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          note: 'Use browser extensions or third-party tools'
        }
      ],
      instructions: [
        'Due to YouTube\'s terms of service, direct downloading through web APIs is restricted.',
        'You can use these alternatives:',
        '1. Browser extensions like "Video Downloader Professional"',
        '2. Desktop applications like 4K Video Downloader',
        '3. Online services (search "YouTube downloader")',
        '4. After downloading, upload the file to your Google Drive manually'
      ]
    }

    return res.status(200).json(response)
  } catch (error: any) {
    console.error('Error:', error)
    return res.status(500).json({
      error: 'Failed to process video. Please try again or use alternative download methods.',
      videoId: videoId,
      instructions: [
        'You can still download this video using:',
        '1. Browser extensions',
        '2. Desktop applications',
        '3. Online YouTube downloader services',
        `Video URL: https://www.youtube.com/watch?v=${videoId}`
      ]
    })
  }
}
