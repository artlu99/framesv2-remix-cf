import { createThemeAction } from 'remix-themes'
import { themeSessionResolver } from '~/services/sessions.server'

export const action = createThemeAction(themeSessionResolver)