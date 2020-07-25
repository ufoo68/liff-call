import React, { useEffect, useRef } from 'react'
import Peer from 'skyway-js'
import { ParsedQuery } from 'query-string'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
  },
  camera: {
    position: 'relative',
  },
  localVideo: {
    width: 100,
    position: 'absolute',
  },
  remoteVideo: {
    width: 600,
  }
})

const peer = new Peer({ key: process.env.REACT_APP_SKYWAY_KEY ?? '' })

interface Props {
  qs: ParsedQuery<string>
}

export const Callee = (props: Props) => {
  const localVideo = useRef<HTMLVideoElement>(null)
  const remoteVideo = useRef<HTMLVideoElement>(null)
  const classes = useStyles()

  useEffect(() => {
    peer.on('open', () => {
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

  const answerCall = () => {
    const callId = props.qs.id as string
    const mediaConnection = peer.call(callId, localVideo!.current!.srcObject as MediaStream)
    mediaConnection.on('stream', async stream => {
      remoteVideo!.current!.srcObject = stream
      await remoteVideo!.current!.play().catch(console.error)
    })
  }
  return (
    <div className={classes.root}>
      <div className={classes.camera}>
        <video className={classes.localVideo} autoPlay muted playsInline ref={localVideo} />
        <video className={classes.remoteVideo} autoPlay muted playsInline ref={remoteVideo} />
      </div>
      <div>
        <button onClick={answerCall} disabled={!remoteVideo}>Callに出る</button>
      </div>
    </div>
  )
}
