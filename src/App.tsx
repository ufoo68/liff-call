import React, { useEffect, useState, useRef } from 'react'
import Peer from 'skyway-js'
import liff from '@line/liff'

const peer = new Peer({ key: process.env.REACT_APP_SKYWAY_KEY ?? '' })

const App = () => {
  const [myId, setMyId] = useState<string>('')
  const [callId, setCallId] = useState<string>('')
  const localVideo = useRef<HTMLVideoElement>(null)
  const remoteVideo = useRef<HTMLVideoElement>(null)

  useEffect(() => {

    liff.init({ liffId: process.env.REACT_APP_LIFF_ID ?? '' }).then(() => {
      if (!liff.isLoggedIn()) {
        liff.login({})
      }
    })

    peer.on('open', () => {
      setMyId(peer.id)
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(localStream => {
        if (localStream) {
          localVideo!.current!.srcObject = localStream
        }
      })
    })

    peer.on('call', mediaConnection => {
      mediaConnection.answer(localVideo!.current!.srcObject as MediaStream)

      mediaConnection.on('stream', async stream => {
        remoteVideo!.current!.srcObject = stream
      })
    })
  }, [])

  const makeCall = () => {
    const mediaConnection = peer.call(callId, localVideo!.current!.srcObject as MediaStream)
    mediaConnection.on('stream', async stream => {
      remoteVideo!.current!.srcObject = stream
      await remoteVideo!.current!.play().catch(console.error)
    })
  }
  return (
    <div>
      <div>
        <video width={400} autoPlay muted playsInline ref={localVideo} />
        <video width={400} autoPlay muted playsInline ref={remoteVideo} />
      </div>
      <div>{myId}</div>
      <div>
        <input value={callId} onChange={e => setCallId(e.target.value)}></input>
        <button onClick={makeCall}>発信</button>
      </div>
      <div></div>
    </div>
  )
}

export default App
