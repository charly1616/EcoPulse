import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query';


export const useCreateFacility = () => {
  const queryClient = useQueryClient()
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  
  return useMutation({
    mutationFn: async (newFacility) => {
      try {
        console.log("Nueva fac")
        const Fac2Add = {...newFacility, CompanyID: authUser.CompanyID}
        const res = await fetch('/api/facility/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newFacility)
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Error al crear facility')
        return data
      } catch (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: (newFacility) => {
      // Actualización optimista para añadir el nuevo facility
      queryClient.setQueryData(['authUser'], (oldData = []) => [
        ...oldData,
        newFacility
      ])
    }
  })
}

export const useUpdateFacility = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updatedData }) => {
      try {
        const res = await fetch(`/api/facility/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedData)
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Error al actualizar facility')
        return data
      } catch (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: (updatedFacility, variables) => {
      // Actualización optimista del facility modificado
      queryClient.setQueryData(['authUser'], (oldData = []) =>
        oldData.map(facility =>
          facility._id === variables.id ? { ...facility, ...updatedFacility } : facility
        )
      )
    }
  })
}

export const useDeleteFacility = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      try {
        const res = await fetch(`/api/facility/delete/${id}`, {
          method: 'DELETE'
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Error al eliminar facility')
        return { id }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: (_, id) => {
      // Actualización optimista para eliminar el facility
      queryClient.setQueryData(['authUser'], (oldData = []) =>
        oldData.filter(facility => facility._id !== id)
      )
    }
  })
}

// Hook combinado para todas las operaciones de facilities
export const useFacilityActions = () => {
  const create = useCreateFacility()
  const update = useUpdateFacility()
  const remove = useDeleteFacility()
  
  return {
    createFacility: create.mutate,
    isCreating: create.isPending,
    updateFacility: update.mutate,
    isUpdating: update.isPending,
    deleteFacility: remove.mutate,
    isDeleting: remove.isPending
  }
}