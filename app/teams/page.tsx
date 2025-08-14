'use client'
import React, { useEffect, useState } from 'react'
import { team_api, type team } from '../../services/api.teams'
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function Teams() {
  const [teams, setTeams] = useState<team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  //Charger les équipes dès le démarrage
  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await team_api.getTeams();
      setTeams(data)
    } catch (err) {
      setError('Erreur lors du chargement des équipes');
      console.error('Erreur: ', err);
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (team: team) => {
    // TODO: Implémenter l'édition avec un modal ou une page dédiée
    console.log('Éditer équipe:', team);
    // Ici vous pourriez ouvrir un modal ou naviguer vers une page d'édition
  }

  const handleDeleteTeam = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
      try {
        await team_api.deleteTeam(id);
        // Recharger la liste après suppression
        await loadTeams();
      } catch (err) {
        setError('Erreur lors de la suppression de l\'équipe');
        console.error('Erreur:', err);
      }
    }
  }

  return (
    <div>
      <div>
        <button className='btn btn-secondary flex items-center m-3'> 
          <span className='text-2xl font-bold'>+</span> Ajouter une équipe
        </button>
      </div>
      <h1 className='text-3xl font-bold text-center uppercase my-4'>Équipes</h1>
      <div className="overflow-x-auto">
        {error && <p className="text-red-500">{error}</p>}

        <div className='flex justify-center w-full'>
          <div className="card w-4/5 bg-base-100 shadow-xl">
            <div className="card-body">
              <table className="table table-zebra w-full">
                {/* head */}
                <thead>
                  <tr className="bg-primary text-primary-content">
                    <th className="text-center">#ID</th>
                    <th className=''>Nom</th>
                    <th className=''>Pays</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading ? (
                    teams.map((teamItem: team) => {
                      return (
                        <tr key={teamItem.id} className="hover:bg-base-200 transition-colors">
                          <td className="text-center font-mono text-sm">{teamItem.id}</td>
                          <td className="font-semibold">{teamItem.name}</td>
                          <td className="font-semibold">
                            {teamItem.country}
                          </td>
                          <td className="text-center">
                            <div className="flex gap-2 justify-center">
                              <button className="btn btn-sm btn-outline btn-info" onClick={() => handleEditClick(teamItem)}>
                                <FaEdit size={12} />
                              </button>
                              <button className="btn btn-sm btn-outline btn-error" onClick={() => handleDeleteTeam(teamItem.id)}>
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-12">
                        <div className="loading loading-dots loading-lg mx-auto"></div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
