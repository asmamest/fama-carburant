'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AdminRegisterForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const result = await authClient.signUp.email({ name, email, password })
    if (result.error) setError('Inscription impossible. Vérifiez que votre adresse est autorisée et que le mot de passe contient au moins 8 caractères.')
    else { router.push('/admin'); router.refresh() }
    setLoading(false)
  }

  return <form onSubmit={submit} className="flex max-w-md flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm">
    <div><h1 className="text-2xl font-semibold">Créer un compte admin</h1><p className="mt-1 text-sm text-muted-foreground">Utilisez une adresse présente dans la liste des administrateurs autorisés.</p></div>
    <input required placeholder="Nom" value={name} onChange={(event) => setName(event.target.value)} className="rounded-lg border bg-background px-3 py-2" />
    <input required type="email" placeholder="Email professionnel" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-lg border bg-background px-3 py-2" />
    <input required minLength={8} type="password" placeholder="Mot de passe (8 caractères minimum)" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-lg border bg-background px-3 py-2" />
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <button disabled={loading} className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60">{loading ? 'Création…' : 'Créer le compte'}</button>
    <p className="text-center text-sm text-muted-foreground"><Link className="font-semibold text-primary underline-offset-4 hover:underline" href="/admin/login">Retour à la connexion</Link></p>
  </form>
}
