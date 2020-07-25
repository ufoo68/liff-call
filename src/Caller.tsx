import React, { useEffect, useState, useRef } from 'react'
import Peer from 'skyway-js'
import liff from '@line/liff'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import { Call } from '@material-ui/icons'

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
  },
  camera: {
    position: 'relative',
  },
  localVideo: {
    width: '10vw',
    margin: 5,
    position: 'absolute',
  },
  remoteVideo: {
    width: '70vw',
    border: 'solid',
  }
})

const peer = new Peer({ key: process.env.REACT_APP_SKYWAY_KEY ?? '' })

export const Caller = () => {
  const [myId, setMyId] = useState<string>('')
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [called, setCalled] = useState<boolean>(false)
  const localVideo = useRef<HTMLVideoElement>(null)
  const remoteVideo = useRef<HTMLVideoElement>(null)
  const classes = useStyles()

  useEffect(() => {
    liff.init({ liffId: process.env.REACT_APP_LIFF_ID ?? '' }).then(() => setLoggedIn(liff.isLoggedIn))

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
        setCalled(true)
      })
    })
  }, [])

  const makeCall = async () => {
    await liff.init({ liffId: process.env.REACT_APP_LIFF_ID ?? '' })
    await liff.shareTargetPicker([{
      type: 'text',
      text: `https://liff-call.vercel.app/callee?id=${myId}`,
    }])
  }

  const login = async () => {
    await liff.init({ liffId: process.env.REACT_APP_LIFF_ID ?? '' })
    liff.login()
  }
  return (
    <div className={classes.root}>
      <div className={classes.camera}>
        <video className={classes.localVideo} autoPlay muted playsInline ref={localVideo} />
        <video className={classes.remoteVideo} autoPlay playsInline ref={remoteVideo} />
      </div>
      {loggedIn ?
        <Button variant="contained" color="default" startIcon={<Call />} onClick={makeCall} disabled={called}>
          callする
          </Button> :
        <Button variant="contained" color="primary" onClick={login}>
          loginしてください
          </Button>
      }
    </div>
  )
}
