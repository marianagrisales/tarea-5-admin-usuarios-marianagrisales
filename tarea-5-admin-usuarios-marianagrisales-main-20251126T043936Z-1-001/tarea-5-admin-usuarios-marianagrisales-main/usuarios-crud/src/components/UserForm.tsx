import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { createUser, updateUser } from '../features/users/usersSlice';
import type { User } from '../types';

type FormState = Omit<User, 'id'>;

const emptyForm: FormState = { name: '', username: '', email: '', phone: '', website: '' };

const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const users = useSelector((s: RootState) => s.users.list);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      const uid = Number(id);
      const user = users.find(u => u.id === uid);
      if (user) {
        setForm({ name: user.name, username: user.username, email: user.email, phone: user.phone || '', website: user.website || '' });
      }
    } else {
      setForm(emptyForm);
    }
  }, [id, isEdit, users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.email.trim()) { setError('Nombre y correo son obligatorios.'); return; }

    setSubmitting(true);
    try {
      if (isEdit) {
        const uid = Number(id);
        await dispatch(updateUser({ id: uid, changes: form })).unwrap();
      } else {
        await dispatch(createUser(form as Omit<User, 'id'>)).unwrap();
      }
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Error en la operación');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">{isEdit ? 'Editar Usuario' : 'Crear Usuario'}</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <div className="text-red-600">{error}</div>}

        <div>
          <label className="block text-sm">Nombre</label>
          <input name="name" value={form.name} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm">Username</label>
          <input name="username" value={form.username} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm">Teléfono</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm">Website</label>
          <input name="website" value={form.website} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded">
            {submitting ? 'Procesando...' : isEdit ? 'Actualizar' : 'Crear'}
          </button>
          <button type="button" onClick={() => navigate('/')} className="px-4 py-2 border rounded">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;