import { Notyf } from 'notyf'

const notyf = new Notyf({
  duration: 3500,
  position: { x: 'right', y: 'top' }
})

export function useToast() {
  return {
    success: (msg) => notyf.success(msg),
    error: (msg) => notyf.error(typeof msg === 'string' ? msg : JSON.stringify(msg))
  }
}

export default useToast
