'use client'
import React, { useState } from 'react'
import { auth_api, type user, type AuthResponse } from '@/services/api.auth';
import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('')

        //Vérification du mot de passe
        if(password !== confirmPassword){
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        //Connexion a l'api
        try {
            const response = await auth_api.register({
                firstName,
                lastName,
                email,
                password
            });

            // stocker le token
            localStorage.setItem('token', response.access_token)
            router.push(`/auth/login`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='flex w-full justify-center '>

            <div className='flex flex-col justify-center'>
                <h1 className='text-3xl font-bold uppercase m-4 text-center'>register</h1>
                <form onSubmit={handleSubmit} className='flex flex-col gap-y-4 w-100'>
                    <div className='input w-full'>
                        <FaUser />
                        <input type="text" placeholder='Nom' value={firstName} onChange={(e)=>setFirstName(e.target.value)} required/>
                    </div>
                    <div className='input w-full'>
                        <FaUser />
                        <input type="text" placeholder='Prénom' value={lastName} onChange={(e)=>setLastName(e.target.value)} required/>
                    </div>
                    <div className='input w-full'>
                        <FaMessage />
                        <input type="email" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                    </div>
                    <div className='input w-full relative'>
                        <FaLock />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder='Mot de passe' 
                            value={password} 
                            onChange={(e)=>setPassword(e.target.value)} 
                            required
                        />
                        <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className='input w-full relative'>
                        <FaLock />
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder='Confirmation du mot de passe' 
                            value={confirmPassword} 
                            onChange={(e)=>setConfirmPassword(e.target.value)} 
                            required
                        />
                        <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <button type="submit" className='btn btn-secondary' disabled={loading}>
                        {loading ? 'Inscription...' : 'S\'inscrire'}
                    </button>
                </form>
            </div>
        </div>
    )
}
