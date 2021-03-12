import { OUTER_BORDER_RADIUS } from '../constants';
import useStoredSettings, { SettingRenderTransparentCorners } from '../hooks/use-stored-settings';

/** Returns the corner radius of the final render image if the user has enabled the 'render_transparent' setting.
 * @param scale - Scales the radius so the rendered corners looks similar to those viewed on screen.
 */
export default function useRenderBorderRadius(): number {
    const useOuterCorner = useStoredSettings(s => s[SettingRenderTransparentCorners])
    return useOuterCorner ? OUTER_BORDER_RADIUS : 0
}
