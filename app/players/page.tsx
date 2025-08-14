'use client';
import React, { useEffect, useState } from 'react'
import { player_api, type player } from '../../services/api.players'
import { team_api, type team } from '../../services/api.teams'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Trykker } from 'next/font/google';

export default function Players() {
  const [players, setPlayers] = useState<player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('')
  const [player, setPlayer] = useState({
    firstName: '',
    lastName: '',
    teamId: 1,
    positionId: 1
  })
  const [addPlayer, setAddPlayer] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<player | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [teams, setTeams] = useState<team[]>([])
  // Charger les joeurs et équipes au démarrage
  useEffect(() => {
    loadPlayers();
    loadTeams();
  }, []);

  // charger les joeurs
  const loadPlayers = async () => {
    try {
      setLoading(true);
      const data = await player_api.getPlayers();
      setPlayers(data)
    } catch (err) {
      setError('Erreur lors du chargement des joeurs');
      console.error(err);
    } finally {
      setLoading(false)
    }
  }

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

  const getTeam = (id:number) =>{
    const team = teams.find(t=> t.id === id);
    if(!team) return id
    return team.name
  }
  // Créer un joueur
  const handleCreatePlayer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newPlayer = await player_api.createPlayer({
        firstName: player.firstName,
        lastName: player.lastName,
        teamId: player.teamId,
        positionId: player.positionId
      });
      setAddPlayer(false);
      loadPlayers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création')
      console.error('Erreur création:', err)
    }
  }

  //Supprimer un joueur
  const handleDeletePlayer = async (id: number) => {
    try {
      //Vérifie si le player existe
      const playerToUpdate = players.find(p => p.id === id);
      if (!playerToUpdate) return;

      // supprimer les player
      player_api.deletePlayer(id)
      setPlayers(players.filter(p => p.id !== id))

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppréssion du joueur');
      console.error('Erreur de suppréssion: ', err);
    }
  }
  //Ouverture du formulaire de modification du joueur
  const handleEditClick = (player: player) => {
    setEditingPlayer(player);
    setPlayer({
      firstName: player.firstName,
      lastName: player.lastName,
      teamId: Number(player.teamId),
      positionId: Number(player.positionId),
    })
    setIsEditing(true)
  }
  // Modifier le joueur
  const handleUpdatePlayer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPlayer) return;
    try {
      const updatePlayer = await player_api.updatePlayer(editingPlayer.id, {
        firstName: player.firstName,
        lastName: player.lastName,
        teamId: player.teamId,
        positionId: player.positionId
      });
      setIsEditing(false);
      setEditingPlayer(null);
      setPlayer({ firstName: '', lastName: '', teamId: 1, positionId: 1 });
      loadPlayers()
    } catch (err) {
      setError('Erreur lors de la mise a jour du joueur');
      console.error('Erreur: ', err);
    }
  }
  const closeForms = () => {
    setAddPlayer(false);
    setIsEditing(false);
    setEditingPlayer(null);
    setPlayer({ firstName: '', lastName: '', teamId: 1, positionId: 1 });
  }
  return (
    <div>
      <div>
        <button className='btn btn-secondary flex items-center m-3' onClick={() => setAddPlayer(true)}> <span className='text-2xl font-bold'>+</span> Ajouter un joueur</button>
      </div>
      <h1 className='text-3xl font-bold text-center uppercase my-4'>Players</h1>
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
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th className="text-center">Équipe</th>
                    <th className="text-center">Position</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading ? (
                    players.map((playerItem: player) => {
                      return (
                        <tr key={playerItem.id} className="hover:bg-base-200 transition-colors">
                          <td className="text-center font-mono text-sm">{playerItem.id}</td>
                          <td className="font-semibold">{playerItem.firstName}</td>
                          <td className="font-semibold">{playerItem.lastName}</td>
                          <td className="text-center">
                            <span className="badge badge-primary">{getTeam(playerItem.teamId)}</span>
                          </td>
                          <td className="text-center">
                            <span className="badge badge-secondary">{playerItem.positionId}</span>
                          </td>
                          <td className="text-center">
                            <div className="flex gap-2 justify-center">
                              <button className="btn btn-sm btn-outline btn-info" onClick={() => handleEditClick(playerItem)}>
                                <FaEdit size={12} />
                              </button>
                              <button className="btn btn-sm btn-outline btn-error" onClick={() => handleDeletePlayer(playerItem.id)}>
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <div className="loading loading-dots loading-lg mx-auto"></div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/*Formulaire de création de joueur */}
      </div>

      {/* Formulaire de création de joueur */}
      {addPlayer && (
        <div className='w-screen h-screen bg-gray-500/50 absolute top-0 flex items-center justify-center' onClick={closeForms}>
          <form className='bg-white p-4 rounded-lg' onClick={(e) => e.stopPropagation()} onSubmit={handleCreatePlayer}>
            <h1 className='text-3xl font-bold text-center my-3'>Ajouter un joueur</h1>
            <div className='flex flex-col items-center gap-y-4 my-3'>
              <input
                type="text"
                placeholder="Prénom"
                className="input"
                value={player.firstName}
                onChange={(e) => setPlayer({ ...player, firstName: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Nom"
                className="input"
                value={player.lastName}
                onChange={(e) => setPlayer({ ...player, lastName: e.target.value })}
                required
              />
              <select 
                className="select select-bordered w-full"
                value={player.teamId}
                onChange={(e) => setPlayer({ ...player, teamId: Number(e.target.value) })}
                required
              >
                <option value="">Sélectionner une équipe</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              <select 
                className="select select-bordered w-full"
                value={player.positionId}
                onChange={(e) => setPlayer({ ...player, positionId: Number(e.target.value) })}
                required
              >
                <option value="">Sélectionner une position</option>
                <option value={1}>Attaquant</option>
                <option value={2}>Milieu</option>
                <option value={3}>Défenseur</option>
                <option value={4}>Gardien</option>
              </select>
            </div>
            <div className='flex justify-center gap-x-4 mt-6'>
              <button type="submit" className='btn btn-primary'>Ajouter</button>
              <button type="button" className='btn btn-secondary' onClick={closeForms}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      {isEditing && editingPlayer && (
        <div className='w-screen h-screen bg-gray-500/50 absolute top-0 flex items-center justify-center' onClick={closeForms}>
          <form className='bg-white p-4 rounded-lg' onClick={(e) => e.stopPropagation()} onSubmit={handleUpdatePlayer}>
            <h1 className='text-3xl font-bold text-center my-3'>Modifier le joueur</h1>
            <div className='flex flex-col items-center gap-y-4 my-3'>
              <input
                type="text"
                placeholder="Nom"
                className="input"
                value={player.firstName}
                onChange={(e) => setPlayer({ ...player, firstName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Prenom"
                className="input"
                value={player.lastName}
                onChange={(e) => setPlayer({ ...player, lastName: e.target.value })}
              />
              <select 
                className="select select-bordered w-full"
                value={player.teamId}
                onChange={(e) => setPlayer({ ...player, teamId: Number(e.target.value) })}
                required
              >
                <option value="">Sélectionner une équipe</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              <select 
                className="select select-bordered w-full"
                value={player.positionId}
                onChange={(e) => setPlayer({ ...player, positionId: Number(e.target.value) })}
                required
              >
                <option value="">Sélectionner une position</option>
                <option value={1}>Attaquant</option>
                <option value={2}>Milieu</option>
                <option value={3}>Défenseur</option>
                <option value={4}>Gardien</option>
              </select>
            </div>
            <div className='flex justify-center gap-x-4 mt-6'>
              <button className='btn btn-secondary'>Valider</button>
              <button className='btn btn-secondary' onClick={closeForms}>Annuler</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
