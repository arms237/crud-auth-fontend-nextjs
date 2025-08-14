
export interface team{
    id:number;
    name: string;
    country:string;
}

export const team_api = {
    // Récupérer toutes les équipes
    async getTeams(): Promise<team[]>{
        const response = await fetch(`/api/team/all`);
        if(!response.ok) throw new Error('Erreur lors de la récupération des équipes');
        return response.json();
    },
    
    // Récupérer une équipe par ID
    async getTeamById(id: number): Promise<team>{
        const response = await fetch(`/api/team/${id}`);
        if(!response.ok) throw new Error('Erreur lors de la récupération de l\'équipe');
        return response.json();
    },
    
    // Créer une équipe
    async createTeam(teamData: Omit<team, 'id'>): Promise<team>{
        const response = await fetch(`/api/team/create`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teamData)
        });
        if(!response.ok) throw new Error('Erreur lors de la création de l\'équipe');
        return response.json();
    },

    // Mettre à jour une équipe
    async updateTeam(id: number, teamData: Partial<Omit<team, 'id'>>): Promise<team>{
        const response = await fetch(`/api/team/${id}`,{
            method:'PUT',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teamData)
        });
        if(!response.ok) throw new Error('Erreur lors de la mise à jour de l\'équipe');
        return response.json();
    },

    // Supprimer une équipe
    async deleteTeam(id: number): Promise<void>{
        const response = await fetch(`/api/team/${id}`,{
            method:'DELETE',
        });
        if(!response.ok) throw new Error('Erreur lors de la suppression de l\'équipe');
    },

   
}