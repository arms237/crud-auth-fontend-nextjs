
export interface user{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
export interface AuthResponse {
    user : user;
    access_token: string;
}
export const auth_api = {
    async register(userData: Omit<user, 'id'>): Promise<AuthResponse> {
        const response = await fetch(`api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const text = await response.text(); 
            throw new Error(`Erreur lors de l'inscription : ${text}`);
        }

        return response.json();
    }
}