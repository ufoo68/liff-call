import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles({
  root: {
    textAlign: 'center',
  },
  camera: {
    position: 'relative',
  },
  localVideo: {
    position: 'absolute',
    width: '15vw',
    left: 0,
    bottom: 0,
    
  },
  remoteVideo: {
    width: '83vw',
    border: 'solid',
  }
})