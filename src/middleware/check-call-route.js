import { partnerService } from '~/services/partnerService'

export default function ({ route, redirect }) {
  if (process.client) {
    if (route.name === 'call') {
      const callEnded = localStorage.getItem('callEnded')
      
      if (callEnded === 'true') {
        return redirect('/')  // Redirect to home or registration page
      }
    }
  }
}