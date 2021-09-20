import React, { useEffect, useRef, useState } from 'react'
import Peer from 'skyway-js'
import { ParsedQuery } from 'query-string'
import { Button } from '@material-ui/core'
import { Call } from '@material-ui/icons'
import { useStyles } from './style'

const peer = new Peer({ key: process.env.REACT_APP_SKYWAY_KEY ?? '' })

interface Props {
  qs: ParsedQuery<string>
}

export const Callee = (props: Props) => {
  const [called, setCalled] = useState<boolean>(false)
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
  }, [])

  const answerCall = () => {
    const callId = props.qs.id as string
    const mediaConnection = peer.call(callId, localVideo!.current!.srcObject as MediaStream)
    mediaConnection.on('stream', async stream => {
      remoteVideo!.current!.srcObject = stream
      await remoteVideo!.current!.play().catch(console.error)
      setCalled(true)
    })
  }
  return (
    <div className={classes.root}>
      <div className={classes.camera}>
        <video className={classes.localVideo} autoPlay muted playsInline ref={localVideo} />
        <video className={classes.remoteVideo} autoPlay playsInline ref={remoteVideo} />
      </div>
      <Button variant="contained" color="default" startIcon={<Call />} onClick={answerCall} disabled={called}>
        callに出る
      </Button>
    </div>
  )
}
