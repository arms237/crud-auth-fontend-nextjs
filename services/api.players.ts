const API_BASE_URL = ""

export interface player{
    id: number;
    firstName: string;
    lastName: string;
    teamId: number;
    positionId: number
}

export const player_api = {
    //Récupérer tous les joueurs
    async getPlayers(): Promise<player[]>{
        const response = await fetch (`/api/player/all`);
        if(!response.ok) throw new Error ('Erreur lors de la récupération des joueurs');
        console.log('status : ', response.status);
        return response.json();
    },

    // Créer un joueur
    async createPlayer(playerData: Omit<player, 'id'>): Promise<player>{
        const response = await fetch(`api/player/create`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerData)
        })
        if(!response.ok) throw new Error('Erreur lors de la création du joueur');
        return response.json();
    },

    //Récupérer un joueur par son ID
    async getPlayerById(id:number):Promise<player>{
        const response = await fetch(`api/player/all/team/${id}`);
        if(!response.ok) throw new Error('Erreur lors de la récupération du joeur');
        return response.json();
    },

    // Modifier un joueur
    async updatePlayer(id:number, playerData: Partial<player>): Promise<player>{
        const response = await fetch(`api/player/${id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(playerData)
        });
        if(!response.ok) throw new Error('Erreur lors de la modification du joueur ');
        return response.json();
    },

    //Supprimer un joeur
    async deletePlayer(id:number): Promise<void>{
        const reponse = await fetch(`/api/player/${id}`,{
            method:'DELETE',
        });
        if(!reponse.ok) throw new Error('Erreur lors de la suppréssion du joueur ');
    }
};