/* src/hooks/useProjectWidgets.js
   desc: Hook V1 - widgets (installed/enabled/dimmed) for Sidebar + ShopDrawer
*/

import { useEffect, useMemo, useState } from 'react';
import { ShopAPI } from '@/api/shop';

export function useProjectWidgets(projectId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const widgets = useMemo(() => data?.widgets || [], [data]);

  const refresh = async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await ShopAPI.getProjectWidgets(projectId);
      setData(res);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return { loading, error, data, widgets, refresh };
}

export default useProjectWidgets;