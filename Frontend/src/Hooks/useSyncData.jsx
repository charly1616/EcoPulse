// hooks/useSyncedData.js
import { useQuery, useQueryClient} from '@tanstack/react-query'

export function useSyncedData() {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    if (!authUser) return false

    const resourceName = "faci/getAll/" + authUser.CompanyID
  
  // Obtener datos del servidor
  const { data: serverData, isLoading, error } = useQuery({
    queryKey: ['AllData'],
    queryFn: () => fetch(`/api/${resourceName}`).then(res => res.json()),
  })
  
  
  
  
  return {
    data: serverData,
    isLoading,
    error,
  }
}