let { downloadContentFromMessage } = await import('@realvare/based')

export async function before(m) {
  let chat = global.db.data.chats[m.chat]
  if (!chat?.antiviewonce || chat.isBanned) return

  // intercetta TUTTI i tipi view once
  let vo =
    m.message?.viewOnceMessageV2 ||
    m.message?.viewOnceMessageV3 ||
    m.message?.viewOnceMessage

  if (!vo) return

  let msg = vo.message
  let type = Object.keys(msg)[0]
  let mediaMsg = msg[type]
  if (!mediaMsg) return

  let stream = await downloadContentFromMessage(
    mediaMsg,
    type.includes('image') ? 'image' : 'video'
  )

  let buffer = Buffer.from([])
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk])
  }

  let caption = mediaMsg.caption || 'Non si nasconde nulla 😈'

  if (type.includes('video')) {
    await this.sendFile(m.chat, buffer, 'viewonce.mp4', caption, m)
  } else if (type.includes('image')) {
    await this.sendFile(m.chat, buffer, 'viewonce.jpg', caption, m)
  }
}
